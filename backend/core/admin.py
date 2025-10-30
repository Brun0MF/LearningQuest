from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.shortcuts import redirect
from django.contrib import messages
from .models import Perguntas, Topicos, Niveis, Utilizador
import requests
from django.urls import reverse
from django.http import JsonResponse

class MeuAdminSite(admin.AdminSite):
    site_header = "Painel de Administração - Learning Quest"
    site_title = "Admin LQ"
    index_title = "Bem-vindo ao painel"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('validacoes/', self.admin_view(self.validacoes_view), name='validacoes'),
        ]
        return custom_urls + urls

    def validacoes_view(self, request):
        utilizadores_nao_validados = Utilizador.objects.filter(pontuacaogeral_utilizador=0)

        contexto = dict(
            self.each_context(request),
            titulo="Validações Pendentes",
            utilizadores_nao_validados=utilizadores_nao_validados
        )
        return TemplateResponse(request, "admin/validacoes.html", contexto)

meu_admin_site = MeuAdminSite(name='meuadmin')

@admin.register(Perguntas, site=meu_admin_site)
class PerguntasAdmin(admin.ModelAdmin):
    list_display = ('id_pergunta', 'materia', 'linguagem', 'aprovado')
    list_filter = ('aprovado', 'id_nivel', 'id_topico')
    search_fields = ('materia', 'linguagem', 'cid')

    # URL do serviço de geração (ajuste se necessário)
    ai_service_url = 'http://127.0.0.1:5000/'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('gerar/', self.admin_site.admin_view(self.gerar_view), name='perguntas-gerar'),
            path('acao/', self.admin_site.admin_view(self.acao_view), name='perguntas-acao'),
            path('levels/', self.admin_site.admin_view(self.levels_view), name='perguntas-levels'),
        ]
        return custom_urls + urls

    def levels_view(self, request):
        """Retorna JSON com os níveis para um dado tópico (query param: topic_id)."""
        topic_id = request.GET.get('topic_id')
        try:
            tid = int(topic_id)
        except (TypeError, ValueError):
            return JsonResponse({'error': 'topic_id é obrigatório e deve ser inteiro.'}, status=400)

        niveis = Niveis.objects.filter(id_topico_id=tid).values('id_nivel', 'titulo_nivel')
        return JsonResponse(list(niveis), safe=False)

    def gerar_view(self, request):
        # GET: mostra formulário para escolher tópico/nivel/linguagem
        # POST: gera a pergunta, salva com aprovado=False e mostra o conteúdo retornado
        context = dict(self.admin_site.each_context(request))
        context['topicos'] = Topicos.objects.all()
        context['niveis'] = Niveis.objects.all()

        if request.method == 'POST':
            topico_id = request.POST.get('topico')
            nivel_id = request.POST.get('nivel')
            linguagem = request.POST.get('linguagem')

            if not (topico_id and nivel_id and linguagem):
                messages.error(request, 'Os campos topico, nivel e linguagem são obrigatórios.')
                return redirect('/admin/core/perguntas/gerar/')

            try:
                topico = Topicos.objects.get(id_topico=int(topico_id))
                nivel = Niveis.objects.get(id_nivel=int(nivel_id))
            except (Topicos.DoesNotExist, Niveis.DoesNotExist, ValueError) as e:
                messages.error(request, f'Erro: {e}')
                return redirect('/admin/core/perguntas/gerar/')

            # Chama serviço externo para gerar pergunta
            try:
                params = {'topic': topico.titulo_topico, 'content': nivel.titulo_nivel, 'lang': linguagem}
                resp = requests.get(f"{self.ai_service_url}generate_question", params=params, timeout=300)
                resp.raise_for_status()
                ai_json = resp.json()
            except requests.exceptions.RequestException as e:
                messages.error(request, f'Erro ao contactar serviço AI: {e}')
                return redirect('/admin/core/perguntas/gerar/')

            cid = ai_json.get('cid')
            if not cid:
                messages.error(request, 'Resposta inválida do serviço AI (cid ausente).')
                return redirect('/admin/core/perguntas/gerar/')

            # Salva a pergunta (aprovado=False)
            pergunta = Perguntas.objects.create(
                id_topico=topico.id_topico,
                id_nivel=nivel.id_nivel,
                materia=topico.titulo_topico,
                linguagem=linguagem,
                cid=cid,
                aprovado=False,
            )

            # Busca o conteúdo da pergunta para mostrar ao admin
            try:
                resp2 = requests.get(f"{self.ai_service_url}get_question", params={'cid': cid}, timeout=300)
                resp2.raise_for_status()
                question_content = resp2.json()
            except requests.exceptions.RequestException:
                question_content = {'error': 'Não foi possível obter o conteúdo da pergunta.'}

            context['pergunta'] = pergunta
            context['question_content'] = question_content
            # build changelist url using admin site namespace
            try:
                context['changelist_url'] = reverse(f"{self.admin_site.name}:core_perguntas_changelist")
            except Exception:
                # fallback to default admin namespace
                try:
                    context['changelist_url'] = reverse('admin:core_perguntas_changelist')
                except Exception:
                    context['changelist_url'] = '/admin/core/perguntas/'

            # provide levels URL for the template (try admin namespace then fallback)
            try:
                context['levels_url'] = reverse(f"{self.admin_site.name}:perguntas-levels")
            except Exception:
                try:
                    context['levels_url'] = reverse('admin:perguntas-levels')
                except Exception:
                    context['levels_url'] = '/admin/core/perguntas/levels/'
            
            try:
                context['acao_url'] = reverse(f"{self.admin_site.name}:perguntas-acao")
            except Exception:
                context['acao_url'] = '/admin/core/perguntas/acao/'

            return TemplateResponse(request, 'admin/generate_question.html', context)

        try:
            context['changelist_url'] = reverse(f"{self.admin_site.name}:core_perguntas_changelist")
        except Exception:
            try:
                context['changelist_url'] = reverse('admin:core_perguntas_changelist')
            except Exception:
                context['changelist_url'] = '/admin/core/perguntas/'

        # also provide levels_url for GET view
        try:
            context['levels_url'] = reverse(f"{self.admin_site.name}:perguntas-levels")
        except Exception:
            try:
                context['levels_url'] = reverse('admin:perguntas-levels')
            except Exception:
                context['levels_url'] = '/admin/core/perguntas/levels/'

        return TemplateResponse(request, 'admin/generate_question.html', context)

    def acao_view(self, request):
        # Endpoint para aprovar/rejeitar via POST
        if request.method != 'POST':
            return redirect('..')

        acao = request.POST.get('acao')  # 'aprovar' ou 'rejeitar'
        pergunta_id = request.POST.get('pergunta_id')

        if not pergunta_id:
            messages.error(request, 'ID da pergunta não fornecido.')
            return redirect('/admin/core/perguntas/gerar/')

        try:
            pergunta = Perguntas.objects.get(id_pergunta=int(pergunta_id))
        except (Perguntas.DoesNotExist, ValueError):
            messages.error(request, 'Pergunta não encontrada.')
            return redirect('/admin/core/perguntas/gerar/')

        if acao == 'aprovar':
            pergunta.aprovado = True
            pergunta.save()
            messages.success(request, 'Pergunta aprovada e adicionada à base.')
        else:
            pergunta.aprovado = False
            pergunta.save()
            messages.info(request, 'Pergunta rejeitada (marcada como não aprovada).')
        # After handling the action, redirect back to the changelist (or gerar page as fallback).
        try:
            changelist = reverse(f"{self.admin_site.name}:core_perguntas_changelist")
        except Exception:
            try:
                changelist = reverse('admin:core_perguntas_changelist')
            except Exception:
                changelist = '/admin/core/perguntas/'

        return redirect(changelist)
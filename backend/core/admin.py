from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.shortcuts import redirect
from django.contrib import messages
from .models import Perguntas, Topicos, Niveis
import requests

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

    def add_view(self, request, form_url='', extra_context=None):
        """
        Sobrescreve a view de 'add' para gerar automaticamente a pergunta.
        """
        in_topico = request.GET.get('topico')
        in_nivel = request.GET.get('nivel')
        in_linguagem = request.GET.get('linguagem')

        if in_topico and in_nivel and in_linguagem:
            try:
                topico = Topicos.objects.get(id_topico=in_topico)
                nivel = Niveis.objects.get(id_nivel=in_nivel)
                urlp = f"{url}generate_question?topic={topico.titulo_topico}&content={nivel.titulo_nivel}&lang={in_linguagem}"
                
                response = requests.get(urlp, timeout=300)
                response.raise_for_status()
                ai_json = response.json()

                Perguntas.objects.create(
                    id_topico=topico,
                    id_nivel=nivel,
                    materia=in_topico,
                    linguagem=in_linguagem,
                    cid=ai_json.get("cid"),
                    aprovado=False
                )

                messages.success(request, "Pergunta gerada com sucesso!")
                return redirect('admin:meuadmin_perguntas_changelist')

            except Exception as e:
                messages.error(request, f"Erro ao gerar pergunta: {e}")
                return redirect('admin:meuadmin_perguntas_changelist')

        return super().add_view(request, form_url, extra_context)
from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from .models import Utilizador, Categorias, Topicos, Niveis, Perguntas, Pontuacao

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


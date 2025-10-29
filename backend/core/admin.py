from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse

# Admin site personalizado
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
        # Aqui podes colocar queries ou lógica de validação
        from .models import Utilizador, Categorias, Topicos, Percursos

        # Exemplo: utilizadores com pontuação zero
        utilizadores_nao_validados = Utilizador.objects.filter(pontuacaogeral_utilizador=0)

        contexto = dict(
            self.each_context(request),
            titulo="Validações Pendentes",
            utilizadores_nao_validados=utilizadores_nao_validados
        )
        return TemplateResponse(request, "admin/validacoes.html", contexto)


# Instância do admin personalizado
meu_admin_site = MeuAdminSite(name='meuadmin')

# Registar modelos normais (exceto Pontuacao)
from .models import Utilizador, Categorias, Topicos, Percursos

meu_admin_site.register(Utilizador)
meu_admin_site.register(Categorias)
meu_admin_site.register(Topicos)
meu_admin_site.register(Niveis)
meu_admin_site.register(Perguntas)

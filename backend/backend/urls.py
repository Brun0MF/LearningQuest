# backend/urls.py (urls do projeto)
from django.contrib import admin
from django.urls import path, include
from core.admin import meu_admin_site
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter
from core.views import UtilizadorViewSet, CategoriasViewSet, TopicosViewSet, PontuacaoViewSet, PercursosViewSet

router = DefaultRouter()
router.register(r'utilizadores', UtilizadorViewSet, basename='utilizador')
router.register(r'categorias', CategoriasViewSet, basename='categorias')
router.register(r'topicos', TopicosViewSet, basename='topicos')
router.register(r'pontuacoes', PontuacaoViewSet, basename='pontuacao')
router.register(r'percursos', PercursosViewSet, basename='percursos')

urlpatterns = [
    path('', lambda request: redirect('api/', permanent=False)),
    path('admin/', meu_admin_site.urls),
    path('api/', include(router.urls)),
]

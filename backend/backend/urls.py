# backend/urls.py (urls do projeto)
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UtilizadorViewSet, CategoriasViewSet, TopicosViewSet,
    PontuacaoViewSet, NiveisViewSet, PerguntasViewSet
)

router = DefaultRouter()
router.register(r'utilizadores', UtilizadorViewSet, basename='utilizador')
router.register(r'categorias', CategoriasViewSet, basename='categorias')
router.register(r'topicos', TopicosViewSet, basename='topicos')
router.register(r'pontuacoes', PontuacaoViewSet, basename='pontuacao')
router.register(r'niveis', NiveisViewSet, basename='niveis')
router.register(r'perguntas', PerguntasViewSet, basename='perguntas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

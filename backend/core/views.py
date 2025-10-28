# core/views.py
from rest_framework import viewsets
from .models import Utilizador, Categorias, Topicos, Pontuacao, Percursos
from .serializers import (
    UtilizadorSerializer, CategoriasSerializer, TopicosSerializer,
    PontuacaoSerializer, PercursosSerializer
)

class UtilizadorViewSet(viewsets.ModelViewSet):
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

class CategoriasViewSet(viewsets.ModelViewSet):
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer

class TopicosViewSet(viewsets.ModelViewSet):
    queryset = Topicos.objects.all()
    serializer_class = TopicosSerializer

class PontuacaoViewSet(viewsets.ModelViewSet):
    queryset = Pontuacao.objects.all()
    serializer_class = PontuacaoSerializer

class PercursosViewSet(viewsets.ModelViewSet):
    queryset = Percursos.objects.all()
    serializer_class = PercursosSerializer

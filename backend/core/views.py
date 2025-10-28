# core/views.py
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Utilizador, Categorias, Topicos, Pontuacao, Percursos
from .serializers import (
    UtilizadorSerializer, CategoriasSerializer, TopicosSerializer,
    PontuacaoSerializer, PercursosSerializer
)

# --- VIEWSETS NORMAIS ---
class UtilizadorViewSet(viewsets.ModelViewSet):
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

class CategoriasViewSet(viewsets.ModelViewSet):
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer

    @action(detail=True, methods=["get"], url_path="topicos")
    def topicos(self, request, pk=None) :
        qs = (Topicos.objects.filter(id_categoria_id=pk))
        ser = TopicosSerializer(qs, many=True)
        return Response(ser.data, status=status.HTTP_200_OK)

class TopicosViewSet(viewsets.ModelViewSet):
    queryset = Topicos.objects.all()
    serializer_class = TopicosSerializer

class PontuacaoViewSet(viewsets.ModelViewSet):
    queryset = Pontuacao.objects.all()
    serializer_class = PontuacaoSerializer

class PercursosViewSet(viewsets.ModelViewSet):
    queryset = Percursos.objects.all()
    serializer_class = PercursosSerializer

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

    # LOGIN
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email_utilizador')
        password = request.data.get('password_utilizador')

        try:
            user = Utilizador.objects.get(email_utilizador=email)
        except Utilizador.DoesNotExist:
            return Response({'error': 'Email não encontrado'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(password, user.password_utilizador):
            return Response({'error': 'Password incorreta'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Login bem-sucedido',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id_utilizador': user.id_utilizador,
                'nome_utilizador': user.nome_utilizador,
                'email_utilizador': user.email_utilizador
            }
        }, status=status.HTTP_200_OK)
    
    # CRIAR CONTA
    @action(detail=False, methods=['post'], url_path='register')
    def post(self, request):
        nome = request.data.get('nome_utilizador')
        email = request.data.get('email_utilizador')
        password = request.data.get('password_utilizador')

        if Utilizador.objects.filter(email_utilizador=email).exists():
           return Response({'error': 'Email já registado'}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)

        user = Utilizador.objects.create(
            nome_utilizador=nome,
            email_utilizador=email,
            password_utilizador=hashed_password,
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Conta criada com sucesso',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id_utilizador': user.id_utilizador,
                'nome_utilizador': user.nome_utilizador,
                'email_utilizador': user.email_utilizador
            }
        }, status=status.HTTP_201_CREATED)


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

# core/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Utilizador, Categorias, Topicos, Pontuacao, Percursos
from .serializers import (
    UtilizadorSerializer, CategoriasSerializer, TopicosSerializer,
    PontuacaoSerializer, PercursosSerializer
)

# --- VIEWSETS NORMAIS ---
class UtilizadorViewSet(viewsets.ModelViewSet):
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

    @action(detail=True, methods=["get"], url_path="pontuacao")
    def pontuacaogeral_utilizador(self, request, pk=None) :
        qs = (Utilizador.objects
            .annotate(total_pontos=Coalesce(Sum('pontuacoes__Pontos'), 0, output_field=IntegerField()))
            .order_by('-total_pontos', 'Nome_Utilizador')
        )
        ser = self.get_serializer(qs, many=True)
        return Response(ser.data, status=status.HTTP_200_OK)

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


# --- Criar Conta ---
class CriarConta(APIView):
     def post(self, request):
        nome = request.data.get('nome_utilizador')
        email = request.data.get('email_utilizador')
        password = request.data.get('password_utilizador')

        if Utilizador.objects.filter(email_utilizador=email).exists():
            return Response({'error': 'Email já foi registado'}, status=400)

        hashed_password = make_password(password)

        Utilizador.objects.create(
            nome_utilizador=nome,
            email_utilizador=email,
            password_utilizador=hashed_password,
        )

        return Response({'message': 'Conta criada com sucesso!'}, status=201)
     
# ---  Login ---
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email_utilizador')
        password = request.data.get('password_utilizador')

        try:
            user = Utilizador.objects.get(email_utilizador=email)
        except Utilizador.DoesNotExist:
            return Response({'error': 'Email não encontrado'}, status=400)

        if not check_password(password, user.password_utilizador):
            return Response({'error': 'Password incorreta'}, status=400)

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
        }, status=200)
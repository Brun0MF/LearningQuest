# core/views.py
import random
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken

from django.db.models import Sum, IntegerField
from django.db.models.functions import Coalesce

from .models import Utilizador, Categorias, Topicos, Pontuacao, Percursos
from .serializers import (
    UtilizadorSerializer, CategoriasSerializer, TopicosSerializer,
    PontuacaoSerializer, PercursosSerializer
)

# --- VIEWSETS NORMAIS ---
class UtilizadorViewSet(viewsets.ModelViewSet):
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

    # RANKING GERAL
    @action(detail=False, methods=["get"], url_path="pontuacao")
    def pontuacaogeral_utilizador(self, request):
        qs = (
            Utilizador.objects
            .order_by('-pontuacaogeral_utilizador', 'nome_utilizador')
        )
        ser = self.get_serializer(qs, many=True)
        return Response(ser.data, status=status.HTTP_200_OK)

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
    def register(self, request):
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
            pontuacaogeral_utilizador=0,
            path_imagem="/gua1.png"
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Conta criada com sucesso!',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id_utilizador': user.id_utilizador,
                'nome_utilizador': user.nome_utilizador,
                'email_utilizador': user.email_utilizador
            }
        }, status=status.HTTP_201_CREATED)
    
   # Enviar email
    @action(detail=False, methods=['post'], url_path='codigo_email')
    def enviar_codigo_verificacao(self, request):
        email_usuario = request.data.get('email')

        if not email_usuario:
            return Response({"error": "Email é obrigatório"}, status=400)
        
        try:
            user = Utilizador.objects.get(email_utilizador=email_usuario)
        except Utilizador.DoesNotExist:
            return Response({"error": "Utilizador não encontrado!"}, status=404)

        codigo = random.randint(10000, 99999)

        html_content = render_to_string('codigo_verificacao.html', {'codigo': codigo})

        email = EmailMessage(
            subject="Código de Verificação",
            body=html_content,
            from_email=None,  
            to=[email_usuario]
        )
        email.content_subtype = 'html'  
        email.send()

        return Response({"message": "Código enviado com sucesso!", "codigo": codigo})
    
    # mudar password
    @action(detail=False, methods=['post'], url_path='mudar_password')
    def mudarPassword(self, request):
        email = request.data.get('email_utilizador')
        password = request.data.get('password_utilizador')

        if not password or not email:
            return Response({'error': 'Sem email ao password para ser alterada'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Utilizador.objects.get(email_utilizador=email)
        except Utilizador.DoesNotExist:
            return Response({"error": "Utilizador não encontrado! Por favor tente mais tarde."}, status=404)
        
        hashed_password = make_password(password)
        user.password_utilizador = hashed_password
        user.save()

        return Response({'message': 'Senha alterada com sucesso!'}, status=200)

    # EDITAR PERFIL
    @action(detail=True, methods=['patch', 'put'], url_path='editar')
    def editar(self, request, pk=None):
        user = self.get_object()

        allowed = {'nome_utilizador', 'email_utilizador', 'path_imagem'}
        data = {k: v for k, v in request.data.items() if k in allowed and v not in ("", None)}

        serializer = self.get_serializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
        
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

    # RANKING TOPICO
    @action(detail=True, methods=["get"], url_path="ranking")
    def getRanking_topico(self, request, pk=None) :
        qs = (Pontuacao.objects.filter(id_topico_id=pk).select_related('id_utilizador').order_by('-pontos', 'id_utilizador__nome_utilizador'))
        data = [{
            'id_utilizador':p.id_utilizador.id_utilizador,
            'nome_utilizador':p.id_utilizador.nome_utilizador,
            'pontos':p.pontos,
        } for p in qs]
        return Response(data, status=status.HTTP_200_OK)

class PontuacaoViewSet(viewsets.ModelViewSet):
    queryset = Pontuacao.objects.all()
    serializer_class = PontuacaoSerializer

    # PONTUACAO POR UTILIZADOR NO TOPICO
    @action(detail=False, methods=["get"], url_path="by-user-topic")
    def by_user_topic(self, request):
        uid = request.query_params.get("id_utilizador")
        tid = request.query_params.get("id_topico")

        if not uid or not tid:
            return Response(
                {"error": "Parâmetros obrigatórios: id_utilizador e id_topico"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uid = int(uid)
            tid = int(tid)
        except ValueError:
            return Response(
                {"error": "id_utilizador e id_topico devem ser números inteiros"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total = (
            Pontuacao.objects
            .filter(id_utilizador_id=uid, id_topico_id=tid)
            .aggregate(total=Coalesce(Sum("pontos"), 0, output_field=IntegerField()))
            ["total"]
        )

        return Response(
            {
                "id_utilizador": uid,
                "id_topico": tid,
                "pontos": total,
            },
            status=status.HTTP_200_OK,
        )

class PercursosViewSet(viewsets.ModelViewSet):
    queryset = Percursos.objects.all()
    serializer_class = PercursosSerializer

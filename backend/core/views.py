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

import requests

from django.db.models import Sum, IntegerField
from django.db.models.functions import Coalesce

from .models import Utilizador, Categorias, Topicos, Pontuacao, Niveis, Perguntas
from .serializers import (
    UtilizadorSerializer, CategoriasSerializer, TopicosSerializer,
    PontuacaoSerializer, NiveisSerializer, PerguntasSerializer
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
            path_imagem="gua1.png"
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
        
    # EDITAR PONTUACAO (total)
    @action(detail=True, methods=['patch', 'put'], url_path='editar-pontuacao')
    def editar_pontuacao(self, request, pk=None):
        user = self.get_object()

        # campo correto no modelo Utilizador:
        allowed = {'pontuacaogeral_utilizador'}
        data = {k: v for k, v in request.data.items() if k in allowed and v not in ("", None)}

        if not data:
            return Response({'erro': 'Nenhum valor de pontuação fornecido.'},
                            status=status.HTTP_400_BAD_REQUEST)

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
    
    # Atualizar ou criar pontuação
    @action(detail=False, methods=["post"], url_path="update-user-topic")
    def update_user_topic(self, request):
        uid = request.data.get("id_utilizador")
        tid = request.data.get("id_topico")
        pontos = request.data.get("pontos")

        if not uid or not tid or pontos is None:
            return Response(
                {"error": "Parâmetros obrigatórios: id_utilizador, id_topico e pontos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uid = int(uid)
            tid = int(tid)
            pontos = int(pontos)
        except ValueError:
            return Response(
                {"error": "id_utilizador, id_topico e pontos devem ser números inteiros"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pontuacao_obj, created = Pontuacao.objects.get_or_create(
            id_utilizador_id=uid, id_topico_id=tid,
            defaults={"pontos": pontos}
        )

        if not created:
            pontuacao_obj.pontos = pontos
            pontuacao_obj.save()

        total = (
            Pontuacao.objects
            .filter(id_utilizador_id=uid, id_topico_id=tid)
            .aggregate(total=Coalesce(Sum("pontos"), 0))
            ["total"]
        )

        return Response(
            {
                "id_utilizador": uid,
                "id_topico": tid,
                "pontos_adicionados": pontos,
                "pontos_totais": total,
                "mensagem": "Pontuação atualizada com sucesso"
                if not created
                else "Pontuação criada com sucesso",
            },
            status=status.HTTP_200_OK,
        )

class NiveisViewSet(viewsets.ModelViewSet):
    queryset = Niveis.objects.all()
    serializer_class = NiveisSerializer

    #GEET NIVEL ATUAL
    @action(detail=False, methods=["get"], url_path="by-topico-e-pontos")
    def by_topico_e_pontos(self, request):
        tid = request.query_params.get("id_topico")
        pontos_max = request.query_params.get("pontos_max")

        if not tid or pontos_max is None:
            return Response(
                {"error": "Parâmetros obrigatórios: id_topico e pontos_max"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            tid = int(tid)
            pontos_max = int(pontos_max)
        except ValueError:
            return Response(
                {"error": "id_topico e pontos_max devem ser inteiros"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        nivel = Niveis.objects.filter(
            id_topico_id=tid,
            pontos_max=pontos_max
        ).first()

        if not nivel:
            return Response(
                {"error": "Nenhum nível encontrado para este tópico e pontuação"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = self.get_serializer(nivel).data
        return Response(data, status=status.HTTP_200_OK)
    
class PerguntasViewSet(viewsets.ModelViewSet):
    queryset = Perguntas.objects.all()
    serializer_class = PerguntasSerializer

    url = "http://127.0.0.1:5000/"


    @action(detail=True, methods=["get"], url_path="generate_question")
    def generate_question(self, request, pk=None):
        try:
            in_topico = request.query_params.get('topico')
            in_nivel = request.query_params.get('nivel')
            in_linguagem = request.query_params.get('linguagem')
            
            if((in_topico is None) or (in_nivel is None) or (in_linguagem is None)):
                return Response({"STATUS":"HTTP_400_BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)


            try:
                topico = Topicos.objects.get(id_topico=in_topico)
                topico_titulo = topico.titulo_topico
                nivel = Niveis.objects.get(id_nivel=in_nivel)
                nivel_titulo = nivel.titulo_nivel
            except Topicos.DoesNotExist:
                return Response(
                    {"error": f"Tópico com ID {in_topico} não existe."},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Niveis.DoesNotExist:
                return Response(
                    {"error": f"Nivel com ID {in_nivel} não existe."},
                    status=status.HTTP_404_NOT_FOUND
                )

            urlp = f"{url}generate_question?topic={topico_titulo}&content={nivel_titulo}&lang={in_linguagem}"
            response = requests.get(urlp, timeout=300)
            response.raise_for_status()
            ai_json = response.json()
            data = {"id_topic":in_topico,"materia":in_materia,"linguagem":in_linguagem,"cid":ai_json.get("cid"),"aprovado":False}
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return Response({"STATUS":"HTTP_200_OK","CID":""}, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:    
            return Response({"STATUS":"HTTP_500_INTERNAL_SERVER_ERROR"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    @action(detail=True, methods=["get"], url_path="get_question")
    def get_question(self, request, pk=None):
        in_pergunta = request.query_params.get('pergunta')
        if(in_pergunta is None):
            return Response({"STATUS":"HTTP_400_BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pergunta = Perguntas.objects.get(id_pergunta=in_pergunta)
            pergunta_cid = pergunta.cid
            urlp = f"{url}get_question?cid={pergunta_cid}"
            response = requests.get(urlp, timeout=300)
            response.raise_for_status()
            ai_json = response.json()
        except Perguntas.DoesNotExist:
                return Response(
                    {"error": f"Pergunta com ID {in_pergunta} não existe."},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(ai_json, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get"], url_path="get_level_questions")
    def get_level_questions(self, request, pk=None):
        
        in_topico = request.query_params.get('topico')
        in_nivel = request.query_params.get('nivel')
        if(in_topico is None):
            return Response({"STATUS":"HTTP_400_BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)
        if(in_nivel is None):
            return Response({"STATUS":"HTTP_400_BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            pergunta = Perguntas.objects.filter(id_topico=in_topico,id_nivel=in_nivel)
            output = "["
            for p in pergunta:
                pergunta_cid = p.cid
                urlp = f"{url}get_question?cid={pergunta_cid}"
                response = requests.get(urlp, timeout=300)
                response.raise_for_status()
                ai_json = response.json()                
                output += f"{ai_json}, "
            output += "]"
        except Perguntas.DoesNotExist:
                return Response(
                    {"error": f"Não existem perguntas com esse Topico e Nivel"},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(output, status=status.HTTP_200_OK)


    @action(detail=True, methods=["post"], url_path="ipfs_connect")
    def ipfs_connect(self, request, pk=None):
        in_endereco = request.query_params.get('endereco')
        if(in_endereco is None):
            return Response({"STATUS":"HTTP_400_BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)
        urlp = f"{url}connect?address={in_endereco}"
        response = requests.post(urlp, timeout=300)
        response.raise_for_status()
        ai_json = response.json()
        return Response(ai_json, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get"], url_path="ipfs_address")
    def ipfs_address(self, request, pk=None):
        urlp = f"{url}address"
        response = requests.get(urlp, timeout=300)
        response.raise_for_status()
        ai_json = response.json()
        return Response(ai_json, status=status.HTTP_200_OK)

from rest_framework import serializers
from .models import Utilizador, Categorias, Topicos, Pontuacao, Percursos

class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = "__all__"
        extra_kwargs = {
            'password_utilizador': {'write_only': True}
        }

class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = "__all__"

class TopicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topicos
        fields = "__all__"

class PontuacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pontuacao
        fields = "__all__"

class PercursosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Percursos
        fields = "__all__"

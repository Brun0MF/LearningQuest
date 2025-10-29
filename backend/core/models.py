# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    titulo_categoria = models.CharField(max_length=200)

    class Meta:
       
        db_table = 'categorias'


class Percursos(models.Model):
    id_percurso = models.AutoField(primary_key=True)
    titulo_percurso = models.CharField(max_length=100)
    pontos_max = models.IntegerField()
    id_topico = models.ForeignKey('Topicos', models.DO_NOTHING, db_column='id_topico')
    perguntas_cid = models.CharField(max_length=1024)

    class Meta:
       
        db_table = 'percursos'


class Pontuacao(models.Model):
    pk = models.CompositePrimaryKey('id_utilizador', 'id_topico')
    id_utilizador = models.ForeignKey('Utilizador', models.DO_NOTHING, db_column='id_utilizador')
    id_topico = models.ForeignKey('Topicos', models.DO_NOTHING, db_column='id_topico')
    pontos = models.IntegerField(blank=True, null=True)

    class Meta:
       
        db_table = 'pontuacao'


class Topicos(models.Model):
    id_topico = models.AutoField(primary_key=True)
    titulo_topico = models.CharField(max_length=200)
    descricao_topico = models.CharField(max_length=500)
    id_categoria = models.ForeignKey(Categorias, models.DO_NOTHING, db_column='id_categoria')

    class Meta:
       
        db_table = 'topicos'


class Utilizador(models.Model):
    id_utilizador = models.AutoField(primary_key=True)
    nome_utilizador = models.CharField(max_length=100)
    email_utilizador = models.CharField(unique=True, max_length=100)
    password_utilizador = models.CharField(max_length=100)
    pontuacaogeral_utilizador = models.IntegerField()
    path_imagem = models.CharField(max_length=20)

    class Meta:
       
        db_table = 'utilizador'

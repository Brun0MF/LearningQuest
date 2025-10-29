from django.db import models

class Perguntas(models.Model):
    id_pergunta = models.AutoField(primary_key=True)
    id_nivel = models.IntegerField()
    id_topico = models.IntegerField()
    materia = models.CharField(max_length=250)
    linguagem = models.CharField(max_length=100)
    cid = models.CharField(max_length=250)
    aprovado = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'pergunta'



class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    titulo_categoria = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'categorias'


class Niveis(models.Model):
    id_nivel = models.AutoField(primary_key=True)
    titulo_nivel = models.CharField(max_length=100)
    pontos_max = models.IntegerField()
    id_topico = models.ForeignKey('Topicos', models.DO_NOTHING, db_column='id_topico')

    class Meta:
        managed = False
        db_table = 'niveis'


class Pontuacao(models.Model):
    pk = models.CompositePrimaryKey('id_utilizador', 'id_topico')
    id_utilizador = models.ForeignKey('Utilizador', models.DO_NOTHING, db_column='id_utilizador')
    id_topico = models.ForeignKey('Topicos', models.DO_NOTHING, db_column='id_topico')
    pontos = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pontuacao'


class Topicos(models.Model):
    id_topico = models.AutoField(primary_key=True)
    titulo_topico = models.CharField(max_length=200)
    descricao_topico = models.CharField(max_length=500)
    id_categoria = models.ForeignKey(Categorias, models.DO_NOTHING, db_column='id_categoria')

    class Meta:
        managed = False
        db_table = 'topicos'


class Utilizador(models.Model):
    id_utilizador = models.AutoField(primary_key=True)
    nome_utilizador = models.CharField(max_length=100)
    email_utilizador = models.CharField(unique=True, max_length=100)
    password_utilizador = models.CharField(max_length=100)
    pontuacaogeral_utilizador = models.IntegerField()
    path_imagem = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'utilizador'

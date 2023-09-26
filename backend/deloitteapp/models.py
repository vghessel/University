from django.db import models

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=50)
    birthdate = models.DateField(null=True)
    user_type = models.CharField(max_length=100)
    password = models.CharField(max_length=50) 


class UserType(models.Model):
    type_id = models.AutoField(primary_key=True)
    description = models.EmailField(max_length=50)


class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    workload = models.CharField(max_length=20)
    user_id = models.ForeignKey(Users)


class UserAndSubject(models.Model):
    relation_id = models.AutoField(primary_key=True)
    subject_id = models.ForeignKey(Subject)
    user_id = models.ForeignKey(Users)
    grade = models.DecimalField(max_digits=8, decimal_places=2, null=True)
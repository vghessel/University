from django.db import models

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField(max_length=50)
    user_birthdate = models.DateField(null=True)
    # user_type ou type_id?
    user_type = models.CharField(max_length=100)
    user_password = models.CharField(max_length=50) 

    def __str__(self):
        return f'ID: {self.user_id} | Name: {self.user_name}'


class UserType(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_description = models.EmailField(max_length=50)

    def __str__(self):
        return self.type_description


class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=100)
    subject_workload = models.CharField(max_length=20)
    user_id = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.subject_name
    

class UserAndSubject(models.Model):
    relation_id = models.AutoField(primary_key=True)
    subject_id = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    user_id = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    relation_grade = models.DecimalField(max_digits=8, decimal_places=2, null=True)
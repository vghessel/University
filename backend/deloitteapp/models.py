from django.db import models


class UserType(models.Model):
    type_id = models.AutoField(primary_key=True, editable=False)
    type_description = models.EmailField(max_length=50)

    def __str__(self):
        return self.type_description
    

class Users(models.Model):
    user_id = models.AutoField(primary_key=True, editable=False)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField(max_length=50)
    user_birthdate = models.DateField(null=True)
    type_id = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True, editable=False)
    user_password = models.CharField(max_length=50) 

    def __str__(self):
        return f'ID: {self.user_id} | Name: {self.user_name}'


class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True, editable=False)
    subject_name = models.CharField(max_length=100)
    subject_workload = models.CharField(max_length=20)
    user_id = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, editable=False)

    def __str__(self):
        return self.subject_name
    

class UserAndSubject(models.Model):
    user_subject_id = models.AutoField(primary_key=True, editable=False)
    subject_id = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, editable=False)
    user_id = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, editable=False)
    user_subject_grade = models.DecimalField(max_digits=8, decimal_places=2, null=True)
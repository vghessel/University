from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Student(models.Model):
    student_name = models.CharField(max_length=255, default='')
    student_email = models.EmailField(unique=True)
    student_password = models.CharField(max_length=255, default='')
    student_birth_date = models.DateField(blank=True, null=True, default='')

    def __str__(self):
        return f'Name: {self.student_name} | Email: {self.student_email}'

@receiver(post_save, sender=Student)
def create_user_for_student(sender, instance, created, **kwargs):
    if created:
        User.objects.create_user(username=instance.student_email, password=instance.student_password)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #birth_date = models.DateField(blank=True, null=True)

class Subject(models.Model):
    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    workload = models.IntegerField()

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


## Student Model ##
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


## Teacher Model ##
class Teacher(models.Model):
    teacher_name = models.CharField(max_length=255, default='')
    teacher_email = models.EmailField(unique=True, default='')
    teacher_password = models.CharField(max_length=255, default='')
    teacher_birth_date = models.DateField(blank=True, null=True, default='')

    def __str__(self):
        return f'Name: {self.teacher_name} | Email: {self.teacher_email}'

@receiver(post_save, sender=Student)
def create_user_for_student(sender, instance, created, **kwargs):
    if created:
        User.objects.create_user(username=instance.teacher_name, password=instance.teacher_email)


## Subject Model ##
class Subject(models.Model):
    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    workload = models.IntegerField()


## Grade Model ##
class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
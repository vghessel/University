from django.contrib.auth.models import User, Group
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
        user = User.objects.create_user(
            username=instance.student_email, 
            email=instance.student_email,
            password=instance.student_password,
            first_name=instance.student_name
        )
        # Add user to group
        group = Group.objects.get(name='student')
        user.groups.add(group)


## Teacher Model ##
class Teacher(models.Model):
    teacher_name = models.CharField(max_length=255, default='')
    teacher_email = models.EmailField(unique=True, default='')
    teacher_password = models.CharField(max_length=255, default='')
    teacher_birth_date = models.DateField(blank=True, null=True, default='')

    def __str__(self):
        return f'Name: {self.teacher_name} | Email: {self.teacher_email}'

@receiver(post_save, sender=Teacher)
def create_user_for_teacher(sender, instance, created, **kwargs):
    if created:
        user = User.objects.create_user(
            username=instance.teacher_email, 
            email=instance.teacher_email,
            password=instance.teacher_password,
            first_name=instance.teacher_name
        )
        # Add user to group
        group = Group.objects.get(name='teacher')
        user.groups.add(group)

## Subject Model ##
class Subject(models.Model):
    subject_name = models.CharField(max_length=255)
    teacher_name = models.OneToOneField(Teacher, on_delete=models.CASCADE, default='')
    subject_workload = models.IntegerField()

    def __str__(self):
        return f'Subject: {self.subject_name} | Teacher: {self.teacher_name}'
    

## Grade Model ##
class Grade(models.Model):
    student_name = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject_name = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'Name: {self.student_name} | Subject: {self.subject_name} | Grade: {self.grade}'
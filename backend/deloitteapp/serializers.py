from rest_framework import serializers
from .models import Student, Teacher, Subject, Grade
from django.contrib.auth.models import Group


## Serializer - ALL
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'


## Serializer - Customize
# Serialize students' grades from a single teacher's subjects
class StudentTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'student_name', 'student_email')

class GradeTeacherSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = Grade
        fields = ('student', 'grade')

class SubjectDetailSerializer(serializers.ModelSerializer):
    students = GradeSerializer(source='grade_set', many=True)

    class Meta:
        model = Subject
        fields = ('id', 'subject_name', 'students')

class TeacherDetailSerializer(serializers.ModelSerializer):
    subject = SubjectDetailSerializer()

    class Meta:
        model = Teacher
        fields = ('id', 'teacher_name', 'teacher_email', 'subject')


# Serialize the subjects and grades of a single student
class GradeDetailSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject_name.subject_name')
    subject_workload = serializers.IntegerField(source='subject_name.subject_workload')
    teacher_name = serializers.CharField(source='subject_name.teacher_name.teacher_name')

    class Meta:
        model = Grade
        fields = ['id', 'subject_name', 'subject_workload', 'teacher_name', 'grade']  

class StudentDetailSerializer(serializers.ModelSerializer):
    grades = GradeDetailSerializer(source='grade_set', many=True)

    class Meta:
        model = Student
        fields = ['id', 'student_name', 'student_email', 'grades']




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
        fields = ['id', 'student_name']

class GradeTeacherSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    def get_student_name(self, obj):
        return obj.student_name.student_name

    class Meta:
        model = Grade
        fields = ['id', 'student_name', 'grade']

class SubjectDetailSerializer(serializers.ModelSerializer):
    students = GradeTeacherSerializer(many=True, source='grade_set')

    class Meta:
        model = Subject
        fields = ['id', 'subject_name', 'students']

class TeacherDetailSerializer(serializers.ModelSerializer):
    subject = SubjectDetailSerializer()

    class Meta:
        model = Teacher
        fields = ['id', 'teacher_name', 'teacher_email', 'subject']


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




from django.contrib import admin
from django.urls import path, include
from .views import StudentSubjectsGradesAPIView, CustomLoginView, SubjectStudentsAPIView
from . import views

urlpatterns = [

    # JSON Web Token
    path('login/', CustomLoginView.as_view(), name='custom-login'),

    # Student
    path('student/', views.StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('student/<int:pk>/', views.StudentRetrieveUpdateDestroyAPIView.as_view(), name='student-retrieve-update-destroy'),

    # Teacher
    path('teacher/', views.TeacherListCreateAPIView.as_view(), name='teacher-list-create'),
    path('teacher/<int:pk>/', views.TeacherRetrieveUpdateDestroyAPIView.as_view(), name='teacher-retrieve-update-destroy'),

    # Subject
    path('subject/', views.SubjectListCreateAPIView.as_view(), name='subject-list-create'),
    path('subject/<int:pk>/', views.SubjectRetrieveUpdateDestroyAPIView.as_view(), name='subject-retrieve-update-destroy'),

    # Grade
    path('grade/', views.GradeListCreateAPIView.as_view(), name='grade-list-create'),
    path('grade/<int:pk>/', views.GradeRetrieveUpdateDestroyAPIView.as_view(), name='grade-retrieve-update-destroy'),

    # Get a student's subjects and grades
    path('student/<int:pk>/subjects/', StudentSubjectsGradesAPIView.as_view(), name='student-subjects-grades'),

    # Get a teacher's subjects and students
    path('teacher/<int:pk>/subjects/', views.TeacherDetailView.as_view(), name='teacher-detail'),

    # Get subject and students and their grades
    path('subject/<int:pk>/students/', SubjectStudentsAPIView.as_view(), name='subject-students'),

]
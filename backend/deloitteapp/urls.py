from django.contrib import admin
from django.urls import path, include
from .views import StudentSubjectsGradesAPIView
from . import views

urlpatterns = [

    ## Student
    path('student/', views.StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('student/<int:pk>/', views.StudentRetrieveUpdateDestroyAPIView.as_view(), name='student-retrieve-update-destroy'),

    ## Teacher
    path('teacher/', views.TeacherListCreateAPIView.as_view(), name='teacher-list-create'),
    path('teacher/<int:pk>/', views.TeacherRetrieveUpdateDestroyAPIView.as_view(), name='teacher-retrieve-update-destroy'),

    ## Subject
    path('subject/', views.SubjectListCreateAPIView.as_view(), name='subject-list-create'),
    path('subject/<int:pk>/', views.SubjectRetrieveUpdateDestroyAPIView.as_view(), name='subject-retrieve-update-destroy'),

    ## Grade
    path('grade/', views.GradeListCreateAPIView.as_view(), name='grade-list-create'),
    path('grade/<int:pk>/', views.GradeRetrieveUpdateDestroyAPIView.as_view(), name='grade-retrieve-update-destroy'),

    ## Get a student's subjects and grades
    path('student/<int:pk>/subjects-grades/', StudentSubjectsGradesAPIView.as_view(), name='student-subjects-grades'),

    ## Get a teacher's subjects and students
    path('teacher/<int:pk>/detail/', views.TeacherDetailView.as_view(), name='teacher-detail'),

]
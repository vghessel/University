from django.contrib import admin
from django.urls import path, include

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

]
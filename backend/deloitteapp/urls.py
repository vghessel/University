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
    #path('subject/', views.get_all_subjects, name='get_all_subjects'),
    #path('subject/', views.create_subject, name='create_subject'),

]
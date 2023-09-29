from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [

    ## Student
    path('student/', views.students, name='get_all_students'),
    path('student/', views.students, name='create_student'),
    path('student/<int:id>', views.students, name='get_student_by_id'),  
    path('student/<int:id>', views.students, name='update_student'),
    path('student/<int:id>', views.students, name='delete_student'),
#
    ## Teacher
    #path('teacher/', views.get_all_teachers, name='get_all_teachers'),
    #path('teacher/', views.create_teacher, name='create_teacher'),
    #path('teacher/<int:id>', views.get_teacher_by_id, name='get_teacher_by_id'),  
    #path('teacher/<int:id>', views.update_teacher, name='update_teacher'),
    #path('teacher/<int:id>', views.delete_teacher, name='delete_teacher'),
#
    ## Subject
    #path('subject/', views.get_all_subjects, name='get_all_subjects'),
    #path('subject/', views.create_subject, name='create_subject'),
    #path('subject/<int:id>', views.get_subject_by_id, name='get_subject_by_id'),  
    #path('subject/<int:id>', views.update_subject, name='update_subject'),
    #path('subject/<int:id>', views.delete_subject, name='delete_subject'),
]
from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.get_users, name='get_users'),
    path('user/<int:id>', views.get_by_id, name='get_by_id'),
    path('new_user/', views.create_user, name='create_user'),
    path('update_user/<int:id>', views.update_user, name='update_user'),
    path('delete_user/<int:id>', views.delete_user, name='delete_user'),
]
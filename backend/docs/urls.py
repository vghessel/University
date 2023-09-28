from django.urls import path
from . import views

urlpatterns = [
    # Swagger
    path('openapi.yaml', views.serve_swagger_yaml, name='serve_swagger_yaml'),
]
from django.urls import path
from . import views

urlpatterns = [
    # Swagger
    path('swagger.yaml', views.serve_swagger_yaml, name='serve_swagger_yaml'),
]
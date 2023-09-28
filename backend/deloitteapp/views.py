from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.http import FileResponse
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet

from .models import Users, UserType, Subject, UserAndSubject
from .serializers import UsersSerializer

import os
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):

    if request.method == 'GET':
        users = Users.objects.all()
        serializer = UsersSerializer(users, many=True)
        return Response(serializer.data)
    
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_by_id(request, id):
    
    try:
        user = Users.objects.get(pk=id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UsersSerializer(user)
        return Response(serializer.data)
    

@api_view(['POST'])
def create_user(request):

    if request.method == 'POST':
        new_user = request.data
        serializer = UsersSerializer(data=new_user)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_user(request, id):
    user = Users.objects.get(pk=id)
    serializer = UsersSerializer(user, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_user(request, id):
    try:
        user_to_delete = Users.objects.get(pk=id)
        user_to_delete.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
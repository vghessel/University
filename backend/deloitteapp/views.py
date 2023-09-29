from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.http import FileResponse
from django.conf import settings
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Student, Teacher, Subject, Grade
from .serializers import StudentSerializer, TeacherSerializer, SubjectSerializer, GradeSerializer, UserSerializer

import os
import json


## Student CRUD ##

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_all_students(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_student_by_id(request, id):
    
    try:
        student = Student.objects.get(id=id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    

@api_view(['POST'])
def create_student(request):

    if request.method == 'POST':
        new_student = request.data
        serializer = StudentSerializer(data=new_student)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_student(request, id):
    student = Student.objects.get(id=id)
    serializer = StudentSerializer(student, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_student(request, id):
    try:
        student = Student.objects.get(id=id)
        student.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    


## Teacher CRUD ##
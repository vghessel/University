from rest_framework import status
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Student, Teacher, Subject, Grade, Group, User
from .serializers import (
    StudentSerializer, 
    TeacherSerializer, 
    SubjectSerializer, 
    GradeSerializer,
    StudentDetailSerializer, 
    TeacherDetailSerializer,
    SubjectStudentsSerializer)


## JSON Web Token View ##
class CustomLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Get group data
            groups = Group.objects.filter(user=user).values_list('id', 'name')

            response_data = {
                'access_token': access_token,
                'user_id': user.id,
                'username': user.username,
                'groups': [{'id': group[0], 'name': group[1]} for group in groups],
            }

            # Check if the user is a student
            if user.groups.filter(name='student').exists():
                try:
                    student = Student.objects.get(student_email=user.email)
                    student_serializer = StudentSerializer(student)
                    response_data['student'] = student_serializer.data
                except Student.DoesNotExist:
                    pass
            # Check if the user is a teacher
            if user.groups.filter(name='teacher').exists():
                try:
                    teacher = Teacher.objects.get(teacher_email=user.email)
                    teacher_serializer = TeacherSerializer(teacher)
                    response_data['teacher'] = teacher_serializer.data
                except Teacher.DoesNotExist:
                    pass
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




## Student CRUD View ##
class StudentListCreateAPIView(generics.ListCreateAPIView):
    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update User Model
        user = User.objects.get(username=instance.student_email)
        user.first_name = instance.student_name
        user.set_password(instance.student_password)  # Use set_password para definir a senha corretamente
        user.save()
        return Response(serializer.data)

## Teacher CRUD View ##
class TeacherListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update User Model
        user = User.objects.get(username=instance.teacher_email)
        user.first_name = instance.teacher_name
        user.set_password(instance.teacher_password)
        user.save()
        return Response(serializer.data)
    

## Subject CRUD View ##
class SubjectListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = SubjectSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

## Grade CRUD View ##
class GradeListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

class GradeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = GradeSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

## Get a student's subjects and grades ##
class StudentSubjectsGradesAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response(StudentDetailSerializer(instance).data)
    

## Get a teacher's subjects and students ##
class TeacherDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherDetailSerializer


## Get subject and students and their grades ##
class SubjectStudentsAPIView(generics.RetrieveAPIView):
    queryset = Subject.objects.all()
    serializer_class = GradeSerializer

    def retrieve(self, request, *args, **kwargs):
        subject = self.get_object()
        grades = Grade.objects.filter(subject_name=subject)
        serializer = self.get_serializer(grades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
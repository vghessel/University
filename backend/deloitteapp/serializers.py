from rest_framework import serializers
from .models import Users, UserType, Subject, UserAndSubject

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


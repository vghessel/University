from django.contrib import admin
from .models import Users, UserType, Subject, UserAndSubject

admin.site.register(Users)
admin.site.register(UserType)
admin.site.register(Subject)
admin.site.register(UserAndSubject)

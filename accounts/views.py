from django.shortcuts import render
from rest_framework import generics, permissions

from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role')

        user = User.objects.create_user(username=username,password = password, email = email)

        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True

        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'username': user.username,'email': user.email, 'role':role}
        })
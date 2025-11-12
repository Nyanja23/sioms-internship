from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import CustomerSerializer
from .models import Customer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Customer.objects.all()
        return Customer.objects.filter(email = self.request.user.email)

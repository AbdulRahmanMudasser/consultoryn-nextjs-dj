from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView,
    PasswordResetRequestView, PasswordResetView
)

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/forgot-password', PasswordResetRequestView.as_view(), name='forgot-password'),
    path('auth/reset-password', PasswordResetView.as_view(), name='reset-password'),
]

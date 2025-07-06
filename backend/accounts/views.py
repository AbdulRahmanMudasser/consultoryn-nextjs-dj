import logging
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User, PasswordResetToken
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetSerializer
)

logger = logging.getLogger('accounts')

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"User registered: {user.email}")
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        logger.error(f"Registration failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                if not user.is_active:
                    logger.warning(f"Login attempt on inactive account: {user.email}")
                    return Response({'error': 'Account is disabled'}, status=status.HTTP_403_FORBIDDEN)
                login(request, user)
                user.last_login = timezone.now()
                user.save()
                token, created = Token.objects.get_or_create(user=user)
                logger.info(f"User logged in: {user.email}")
                return Response({
                    'user': UserSerializer(user).data,
                    'token': token.key,
                    'message': 'Login successful'
                })
            logger.warning(f"Invalid login attempt for email: {serializer.validated_data['email']}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        logger.error(f"Login failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logger.info(f"User logged out: {request.user.email}")
        request.user.auth_token.delete()  # Delete token on logout
        logout(request)
        return Response({'message': 'Logout successful'})

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if not user.is_active:
                    logger.warning(f"Password reset attempt on inactive account: {user.email}")
                    return Response({'error': 'Account is disabled'}, status=status.HTTP_400_BAD_REQUEST)
                
                token = PasswordResetToken.objects.create(user=user)
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{token.token}"
                
                send_mail(
                    subject='Password Reset Request',
                    message=f'Click to reset your password: {reset_url}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email]
                )
                logger.info(f"Password reset email sent to: {user.email}")
                return Response({'message': 'Password reset email sent'})
            except User.DoesNotExist:
                logger.warning(f"Password reset attempt for non-existent email: {serializer.validated_data['email']}")
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        logger.error(f"Password reset request failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token = PasswordResetToken.objects.get(token=serializer.validated_data['token'])
                if not token.is_valid():
                    logger.warning(f"Invalid or expired password reset token: {token.token}")
                    return Response({'error': 'Token expired or invalid'}, status=status.HTTP_400_BAD_REQUEST)
                
                user = token.user
                user.set_password(serializer.validated_data['password'])
                user.save()
                token.delete()
                logger.info(f"Password reset successful for: {user.email}")
                return Response({'message': 'Password reset successful'})
            except PasswordResetToken.DoesNotExist:
                logger.warning(f"Password reset attempt with invalid token: {serializer.validated_data['token']}")
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        logger.error(f"Password reset failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
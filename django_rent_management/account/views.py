from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (CustomUserCreateSerializer, CustomerUserSerializer)
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

# Utils
from django.utils.translation import gettext_lazy as _

class CreateUserView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        
        serializer = CustomUserCreateSerializer(data=request.data)

        try:
            if serializer.is_valid():
                user = serializer.save()
                return Response(
                    {
                        'data': serializer.data,
                        'message': _('Votre compte a été créé avec succès')
                    }, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {
                        'errors': serializer.errors,   # ← détails des erreurs
                        'message': _('Erreur lors de la création de compte')
                    }, status=status.HTTP_400_BAD_REQUEST
                )
        except serializers.ValidationError as e:
            return Response(
                {
                    'error':e.detail,
                    'message': _('Une erreur inattendue est survenue. Notre équipe se charge d\'y remédier')
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')

        # Vérification des champs obligatoires
        if not password:
            return Response(
                {'error': 'Veuillez fournir un mot de passe.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not email and not username:
            return Response(
                {'error': 'Veuillez fournir un email ou un nom d\'utilisateur.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authentification par email
        if email:
            try:
                user = CustomUser.objects.get(email=email)
                username = user.username  # On récupère le username pour l'authentification
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': 'Email ou mot de passe incorrect.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        else:
            # Authentification par username
            username = username

        # CORRECTION: authenticate() ne prend pas 'email' comme paramètre
        user = authenticate(request, username=username, password=password)

        if user is not None:
            if not user.is_active:
                return Response(
                    {'error': 'Votre compte est désactivé.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Création de la reponse
            response = Response({
               'user': {
                   'user':user.id,
                    'username': user.username,
                    'email':user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'message':'Connexion Réussie.'
            }, status=status.HTTP_200_OK
            )

            # Définir les cookies HttpOnly
            # Access Token cookie (15 minutes ou 1 jour selon votre configuration)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                max_age=24 * 60 * 60,  # 1 jour (votre settings)
            )

            # Refresh Token cookie (7 jours)
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                max_age=7 * 24 * 60 * 60,  # 7 jours
            )

            return response
        
        else:
            return Response(
                {'error': 'Email/Nom d\'utilisateur ou mot de passe incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class UserLogoutView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # 1. Récupérer le refresh token depuis le cookie
            refresh_token = request.COOKIES.get("refresh_token")

            if refresh_token:
                # 2. Blacklister le token pour invalider la session côté serveur
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response(
                {'message': 'Déconnexion réussie'},
                status=status.HTTP_200_OK
            )

            # 3. Supprimer les cookies côté client
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            
            # Optionnel : si vous utilisez les domaines en prod
            # response.delete_cookie('access_token', domain='votre-domaine.com')

            return response
        
        except Exception as e:
            return Response(
                {'error': 'Une erreur est survenue lors de la déconnexion'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = CustomerUserSerializer(request.user)

        return Response(
            {'user': serializer.data},
            status=status.HTTP_200_OK
        )
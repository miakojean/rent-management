from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CustomUserCreateSerializer

# Utils
from django.utils.translation import gettext_lazy as _

class CreateUserView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        
        serializer = CustomUserCreateSerializer(data=request.data)

        try:
            if serializer.is_valid():
                user = serializer.save()
                return Response(
                    {
                        'data' : serializer.data,
                        'message' : _('Votre compte a été créé avec succès')
                    }, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'message': _('Erreur lors de la création de compte')},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except serializers.ValidationError as e:
            return Response(
                {
                    'error':e.detail,
                    'message': _('Une erreur inattendue est survenue. Notre équipe se charge d\'y remédier')
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Property
from .serializers import PropertySerializer

class PropertyView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        properties = Property.objects.filter(user=request.user)

        if not properties.exists():
            return Response(
                {
                    'message': 'Aucune propriété trouvée',
                    'status': 'error',
                },
            status=status.HTTP_404_NOT_FOUND
        )

        serializer = PropertySerializer(properties, many=True)
        return Response(
            {
                'message': 'Propriétés récupérées avec succès',
                'status': 'success',
                'properties': serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    def post(self, request):
    
        serializer = PropertySerializer(
            data=request.data,
            context={'request': request}
        )

        try:
            if serializer.is_valid():
                serializer.save(user=request.user) 

                return Response(
                    {
                        'message': 'Nouvelle propriété ajoutée',
                        'statut': 'succès',
                        'propriété': serializer.data  # ✅ .data sur le serializer
                    },
                    status=status.HTTP_201_CREATED  # 201 plus sémantique que 200 pour une création
                )

            return Response(
                {
                    'success': False,
                    'message': 'Erreur de validation',
                    'errors': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': 'Erreur lors de la création de la propriété',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



            

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Property
from .serializers import PropertySerializer
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count

class PropertyView(APIView):

    permission_classes = [IsAuthenticated]

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        properties = Property.objects.filter(user=request.user)
        
        # On calcule le compte une seule fois ici[cite: 3]
        total_count = properties.count()

        if not properties.exists():
            return Response(
                {
                    'message': 'Aucune propriété trouvée',
                    'status': 'error',
                    'total_count': 0 # On renvoie quand même le champ[cite: 3]
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PropertySerializer(properties, many=True)
        
        # On construit la réponse avec le champ à part[cite: 3]
        return Response(
            {
                'message': 'Propriétés récupérées avec succès',
                'status': 'success',
                'total_count': total_count,  # Champ unique en haut de la réponse[cite: 3]
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

class SpecificPropertyView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request, property_id):
        try:
            spec_property = Property.objects.get(user=request.user, id=property_id)
        except ObjectDoesNotExist:
            return Response(
                {'message': 'Propriété non trouvée', 'status': 'error'},
                status=status.HTTP_404_NOT_FOUND
            )

        total_properties = Property.objects.filter(user=request.user).count()
        serializer = PropertySerializer(
            spec_property,
            context={'property_count': total_properties, 'request': request}
        )
        return Response(
            {
                'message': 'Propriété récupérée avec succès',
                'status': 'success',
                'property': serializer.data,   # ici, serializer.data contiendra le champ "property_count"
            },
            status=status.HTTP_200_OK
        )
    
    def put(self, request, property_id):

        try:
            spec_property = Property.objects.get(id=property_id, user=request.user)
        except ObjectDoesNotExist:
            return Response(
                {'message': 'Propriété non trouvée ou vous n\'avez pas le droit sur cette propriété'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = PropertySerializer(spec_property, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message':'Propriété mise à jour avec succès',
                    'statut':'succèes',
                    'property':serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, property_id):

        try:
            spec_property = Property.objects.get(user=request.user, id=property_id)
            spec_property.delete()
            return Response(
                {
                    "message": "Propriété supprimé avec succès",
                    "status": "succes"
                }, status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return Response(
                {
                    "error":"Propriété non trouvé ou inexistante",
                    "status":"error"
                }, status=status.HTTP_400_BAD_REQUEST
            ) # A attaquer demain au taffes
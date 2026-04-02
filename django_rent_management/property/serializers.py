from rest_framework import serializers
from account.models import CustomUser
from .models import Property

class PropertySerializer(serializers.ModelSerializer):

    # Relations
    user = serializers.PrimaryKeyRelatedField(
        queryset = CustomUser.objects.all(),
        required = False,
        allow_null = True
    )

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'user',
            'description',
            # Localisation
            'country',
            'city',
            'address',
            # Détails financiers et technique
            'price_per_month',
            'security_deposit',
            'bedrooms',
            'bathrooms',
            'surface_area',
            # Timestamp
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

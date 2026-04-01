from rest_framework import serializers
from .models import Property

class CreatePropertySerializer(serializers.ModelSerializer):

    class Meta:
        model = Property
        fields = [
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

from rest_framework import serializers
from account.models import CustomUser
from .models import Property
from django.db.models import Count

class PropertySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True
    )
    created_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'user', 'description',
            'country', 'city', 'address',
            'price_per_month', 'security_deposit', 'status',
            'bedrooms', 'bathrooms', 'surface_area',
            'created_at', 'updated_at', 'is_archived'
        ]
        read_only_fields = ['id']

    # Dans ton fichier serializers.py
    def get_property_count(self, obj):
        # Si le compte est dans le contexte, on l'utilise[cite: 2]
        count_from_context = self.context.get('property_count')
        if count_from_context is not None:
            return count_from_context
        
        # Sinon, on le calcule dynamiquement pour l'utilisateur de la propriété
        if obj.user:
            return Property.objects.filter(user=obj.user).count()
        return 0
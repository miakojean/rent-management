from rest_framework import serializers
from account.models import CustomUser
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True
    )
    
    # Redéfinir les champs datetime avec le format souhaité
    created_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'user', 'description',
            'country', 'city', 'address',
            'price_per_month', 'security_deposit',
            'bedrooms', 'bathrooms', 'surface_area',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id']  # 'created_at'/'updated_at' déjà définis read_only
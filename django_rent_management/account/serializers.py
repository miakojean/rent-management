from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import CustomUser

class CustomUserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'username': {'validators': []},
            'email': {'validators': []}
        }

    def validate(self, data):
        if CustomUser.objects.filter(username=data.get('username', '')).exists():
            raise serializers.ValidationError(
                {'username': _("Ce nom d'utilisateur est déjà pris")}
            )
        if CustomUser.objects.filter(email=data.get('email', '')).exists():
            raise serializers.ValidationError(
                {'email': _("Cet email est déjà utilisé")}
            )
        return data

    # Cette fonction va hasher le mot de passe
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class CustomerUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_of_birth',
            'title_category',
            'phone_number'
        ]
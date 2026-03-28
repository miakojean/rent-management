from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from ..serializers import CustomUserCreateSerializer

CustomUser = get_user_model()


class CustomUserCreateSerializerTest(TestCase):

    def setUp(self):
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPass123!',
            'phone_number': '+2250102030405',
            'title_category': 'ESE',
        }

    # --- Validation réussie ---

    def test_serializer_valid_with_correct_data(self):
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_creates_user(self):
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsNotNone(user.pk)
        self.assertEqual(user.username, 'testuser')

    def test_created_user_is_instance_of_custom_user(self):
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsInstance(user, CustomUser)

    # --- Unicité du username ---

    def test_duplicate_username_raises_validation_error(self):
        CustomUser.objects.create_user(
            username='testuser',
            email='other@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_duplicate_username_error_message(self):
        CustomUser.objects.create_user(
            username='testuser',
            email='other@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        serializer.is_valid()
        self.assertIn("Ce nom d'utilisateur est déjà pris", str(serializer.errors))

    # --- Unicité de l'email ---

    def test_duplicate_email_raises_validation_error(self):
        CustomUser.objects.create_user(
            username='anotheruser',
            email='test@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_duplicate_email_error_message(self):
        CustomUser.objects.create_user(
            username='anotheruser',
            email='test@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        serializer.is_valid()
        self.assertIn("Cet email est déjà utilisé", str(serializer.errors))

    # --- Champs manquants ---

    def test_missing_username_is_invalid(self):
        data = {**self.valid_data}
        data.pop('username')
        serializer = CustomUserCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_missing_email_is_invalid(self):
        data = {**self.valid_data}
        data.pop('email')
        serializer = CustomUserCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    # --- Champ title_category ---

    def test_valid_title_category_proprietaire(self):
        data = {**self.valid_data, 'title_category': 'PT'}
        serializer = CustomUserCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_valid_title_category_autre(self):
        data = {**self.valid_data, 'title_category': 'AT'}
        serializer = CustomUserCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_title_category_is_rejected(self):
        data = {**self.valid_data, 'title_category': 'XX'}
        serializer = CustomUserCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title_category', serializer.errors)

    # --- Données de sortie ---

    def test_serializer_data_contains_expected_fields(self):
        serializer = CustomUserCreateSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        self.assertIn('username', serializer.data)
        self.assertIn('email', serializer.data)
        self.assertIn('phone_number', serializer.data)
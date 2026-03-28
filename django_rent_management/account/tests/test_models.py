import uuid
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class CustomUserModelTest(TestCase):

    def setUp(self):
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPass123!',
            'phone_number': '+2250102030405',
        }

    # --- Création de base ---

    def test_create_user_with_valid_data(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertIsNotNone(user.pk)
        self.assertEqual(user.username, 'testuser')

    def test_user_id_is_uuid(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertIsInstance(user.id, uuid.UUID)

    def test_user_id_is_unique(self):
        user1 = CustomUser.objects.create_user(**self.valid_data)
        data2 = {**self.valid_data, 'username': 'testuser2', 'email': 'test2@example.com'}
        user2 = CustomUser.objects.create_user(**data2)
        self.assertNotEqual(user1.id, user2.id)

    def test_str_representation(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertEqual(str(user), f'profile of {user.username}')

    # --- Champ phone_number ---

    def test_phone_number_is_required(self):
        user = CustomUser(username='noPhone', email='nophone@example.com')
        user.set_password('pass')
        # phone_number a blank=False, la validation de formulaire le rejettera
        # mais au niveau modèle Django ne lève pas d'erreur sans full_clean
        user.phone_number = ''
        with self.assertRaises(ValidationError):
            user.full_clean()

    def test_phone_number_stored_correctly(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertEqual(user.phone_number, '+2250102030405')

    # --- Champ date_of_birth ---

    def test_date_of_birth_is_optional(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertIsNone(user.date_of_birth)

    def test_date_of_birth_can_be_set(self):
        from datetime import date
        data = {**self.valid_data, 'date_of_birth': date(1990, 5, 20)}
        user = CustomUser.objects.create_user(**data)
        self.assertEqual(user.date_of_birth, date(1990, 5, 20))

    # --- Champ title_category ---

    def test_default_title_category_is_entreprise(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertEqual(user.title_category, CustomUser.TTITLE_CATEGORY.ENTREPRISE)

    def test_title_category_proprietaire(self):
        data = {**self.valid_data, 'title_category': CustomUser.TTITLE_CATEGORY.PROPRIETAIRE}
        user = CustomUser.objects.create_user(**data)
        self.assertEqual(user.title_category, 'PT')

    def test_title_category_autre(self):
        data = {**self.valid_data, 'title_category': CustomUser.TTITLE_CATEGORY.AUTRE}
        user = CustomUser.objects.create_user(**data)
        self.assertEqual(user.title_category, 'AT')

    def test_invalid_title_category_raises_error(self):
        user = CustomUser(
            **{**self.valid_data, 'title_category': 'XX'}
        )
        with self.assertRaises(ValidationError):
            user.full_clean()

    # --- Héritage AbstractUser ---

    def test_user_is_active_by_default(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertTrue(user.is_active)

    def test_user_is_not_staff_by_default(self):
        user = CustomUser.objects.create_user(**self.valid_data)
        self.assertFalse(user.is_staff)

    def test_superuser_creation(self):
        user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='AdminPass123!',
            phone_number='+2250100000000'
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
import json
from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from ..views import CreateUserView

CustomUser = get_user_model()


# ===========================================================================
# Tests des URLs
# ===========================================================================

class UrlsTest(TestCase):

    def test_registry_url_resolves(self):
        url = reverse('registry')
        self.assertIsNotNone(url)  # plus simple que tester le chemin exact

    def test_registry_url_maps_to_create_user_view(self):
        url = reverse('registry')
        resolved = resolve(url)
        self.assertEqual(resolved.func.view_class, CreateUserView)

    def test_token_url_resolves(self):
        url = reverse('Token_obtain_pair')
        self.assertIsNotNone(url)

    def test_token_refresh_url_resolves(self):
        url = reverse('Refresh_token')
        self.assertIsNotNone(url)

    def test_token_verify_url_resolves(self):
        url = reverse('Token_verify')
        self.assertIsNotNone(url)


# ===========================================================================
# Tests de la vue CreateUserView
# ===========================================================================

class CreateUserViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('registry')
        self.valid_payload = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'phone_number': '+2250102030405',
            'title_category': 'ESE',
        }

    # --- Méthode POST : succès ---

    def test_post_with_valid_data_returns_201(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_creates_user_in_database(self):
        self.client.post(self.url, self.valid_payload, format='json')
        self.assertTrue(CustomUser.objects.filter(username='newuser').exists())

    def test_post_response_contains_data_key(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertIn('data', response.data)

    def test_post_response_contains_success_message(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertIn('message', response.data)
        self.assertIn('succès', response.data['message'])

    # --- Méthode POST : données invalides ---

    def test_post_with_duplicate_username_returns_400(self):
        CustomUser.objects.create_user(
            username='newuser',
            email='other@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_with_duplicate_email_returns_400(self):
        CustomUser.objects.create_user(
            username='otheruser',
            email='newuser@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_with_missing_username_returns_400(self):
        payload = {**self.valid_payload}
        payload.pop('username')
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_with_missing_email_returns_400(self):
        payload = {**self.valid_payload}
        payload.pop('email')
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_with_empty_payload_returns_400(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_error_response_contains_message(self):
        response = self.client.post(self.url, {}, format='json')
        self.assertIn('message', response.data)

    # --- Méthodes non autorisées ---

    def test_get_method_not_allowed(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put_method_not_allowed(self):
        response = self.client.put(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_method_not_allowed(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # --- Permissions ---

    def test_endpoint_accessible_without_authentication(self):
        """AllowAny : aucun token ne doit être requis."""
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- JWT endpoints smoke tests ---

    def test_token_obtain_with_valid_credentials(self):
        CustomUser.objects.create_user(
            username='jwtuser',
            email='jwt@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        response = self.client.post(
            reverse('Token_obtain_pair'),
            {'username': 'jwtuser', 'password': 'Pass123!'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_obtain_with_invalid_credentials_returns_401(self):
        response = self.client.post(
            reverse('Token_obtain_pair'),
            {'username': 'ghost', 'password': 'wrong'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_with_valid_token(self):
        user = CustomUser.objects.create_user(
            username='jwtuser2',
            email='jwt2@example.com',
            password='Pass123!',
            phone_number='+22500000000'
        )
        obtain_response = self.client.post(
            reverse('Token_obtain_pair'),
            {'username': 'jwtuser2', 'password': 'Pass123!'},
            format='json'
        )
        refresh_token = obtain_response.data['refresh']
        response = self.client.post(
            reverse('Refresh_token'),
            {'refresh': refresh_token},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
from django.urls import path
from .views import (
    CreateUserView,
    LoginView,
    UserLogoutView,
    UserProfileView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenVerifyView,
    TokenRefreshView
)
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [

    # Registration
    path('registry/', CreateUserView.as_view(), name='registry'),
    # Login
    path('login/', LoginView.as_view(), name='login'),
    # Logout
    path('logout/', UserLogoutView.as_view(), name='logout'),
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    # Jwt Authentification
    path('token', TokenObtainPairView.as_view(), name='Token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='Refresh_token'),
    path('token/verify', TokenVerifyView.as_view(), name='Token_verify')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
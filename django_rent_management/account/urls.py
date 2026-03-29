from django.urls import path
from .views import (
    CreateUserView,
    LoginView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenVerifyView,
    TokenRefreshView
)

urlpatterns = [

    # Registration
    path('registry/', CreateUserView.as_view(), name='registry'),
    # Login
    path('login/', LoginView.as_view(), name='login'),
    # Jwt Authentification
    path('token', TokenObtainPairView.as_view(), name='Token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='Refresh_token'),
    path('token/verify', TokenVerifyView.as_view(), name='Token_verify')
]
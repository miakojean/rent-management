from django.urls import path
from .views import PropertyView, SpecificPropertyView

urlpatterns = [
    path('', PropertyView.as_view(), name='property'),
    path('<str:property_id>/', SpecificPropertyView.as_view(), name='specific-property'),
]
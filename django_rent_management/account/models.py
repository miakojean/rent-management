from django.db import models
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid
# Create your models here.

class CustomUser(AbstractUser):

    class TTITLE_CATEGORY(models.TextChoices):
        PROPRIETAIRE = 'PT', _('Propriétaire')
        ENTREPRISE = 'ESE', _('Entreprise')
        AUTRE = 'AT', _('Autre')

    id = models.UUIDField(
        default=uuid.uuid4, unique=True,
        primary_key=True, editable=False
    )
    email = models.EmailField(unique=True, blank=True)

    phone_number = models.CharField(max_length=20, blank=False)
    date_of_birth = models.DateField(blank=True, null=True)
    title_category = models.CharField(
        max_length=3,
        choices=TTITLE_CATEGORY,
        default=TTITLE_CATEGORY.ENTREPRISE,
        verbose_name=('categorie')
    )

    def __str__(self):
        return f'profile of {self.username}'
from django.db import models
from django.conf import settings # Meilleure pratique que l'import direct du modèle
import uuid

class Property(models.Model):
    # Types de propriétés
    PROPERTY_TYPE_CHOICES = [
        ('APARTMENT', 'Appartement'),
        ('HOUSE', 'Maison'),
        ('STUDIO', 'Studio'),
        ('OFFICE', 'Bureau'),
        ('COMMERCIAL', 'Local Commercial'),
        ('BUILDING', 'Immeuble'),
    ]

    # Statuts de disponibilité
    STATUS_CHOICES = [
        ('AVAILABLE', 'Disponible'),
        ('RENTED', 'Loué'),
        ('MAINTENANCE', 'En travaux / Maintenance'),
    ]

    id = models.UUIDField(
        default=uuid.uuid4, unique=True,
        primary_key=True, editable=False
    )

    title = models.CharField(max_length=200)
    # Utiliser settings.AUTH_USER_MODEL est plus robuste pour la réutilisation
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='properties',
        verbose_name="Propriétaire / Gestionnaire"
    )
    
    description = models.TextField(blank=True, null=True)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, default='APARTMENT')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')

    # Localisation
    country = models.CharField(max_length=100, default="Côte d'Ivoire")
    city = models.CharField(max_length=100, default='Abidjan')
    address = models.CharField(max_length=255, default='Rue de l\'aménagement') 
    
    # Détails financiers et techniques
    price_per_month = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Loyer mensuel", default=0.00)
    security_deposit = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Caution", default=0.00)
    
    bedrooms = models.PositiveIntegerField(default=1, verbose_name="Nombre de chambres")
    pieces = models.PositiveIntegerField(default=1, verbose_name='Nombre de pièces') # Pour les immeubles ce sera le nombre d'appartemment par exemple
    bathrooms = models.PositiveIntegerField(default=1, verbose_name="Salles de bain")
    surface_area = models.DecimalField(max_digits=8, decimal_places=2, help_text="Surface en m²", blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Propriété"
        verbose_name_plural = "Propriétés"
        constraints = [
            models.UniqueConstraint(
                fields=['title', 'address'], name="unique_title_address"
            )
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.city}"
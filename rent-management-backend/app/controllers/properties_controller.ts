import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import { createPropertyValidator } from '#validators/property' // chemin correct
import { DateTime } from 'luxon'

export default class PropertiesController {
  async store({ request, response, auth }: HttpContext) {
    try {
      // Validation des données
      const data = await request.validateUsing(createPropertyValidator)

      // Vérification de l'authentification
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté pour créer une propriété'
        })
      }

      // Préparation des données
      const propertyData = {
        ...data,
        userId: user.id,
        availableFrom: data.availableFrom 
          ? DateTime.fromJSDate(data.availableFrom) 
          : null
      }

      // Création de la propriété
      const property = await Property.create(propertyData)

      // Réponse structurée
      return response.created({
        status: 'success',
        message: 'Propriété créée avec succès',
        data: {
          property: property.serialize()
        }
      })

    } catch (error) {
      // Gestion des erreurs de validation
      if (error.messages) {
        return response.badRequest({
          status: 'error',
          message: 'Données invalides',
          errors: error.messages
        })
      }

      // Erreur serveur
      return response.internalServerError({
        status: 'error',
        message: 'Une erreur est survenue lors de la création',
        error: error.message
      })
    }
  }
}
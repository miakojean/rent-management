import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import { createPropertyValidator, updatePropertyValidator } from '#validators/property'

export default class PropertiesController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté',
        })
      }

      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const properties = await Property.query()
        .where('userId', user.id)
        .preload('owner')
        .paginate(page, limit)

      return response.ok({
        status: 'success',
        data: properties.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération des propriétés',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté',
        })
      }

      const property = await Property.query()
        .where('id', params.id)
        .where('userId', user.id)
        .preload('owner')
        .preload('locationUnities')
        .first()

      if (!property) {
        return response.notFound({
          status: 'error',
          message: 'Propriété non trouvée',
        })
      }

      return response.ok({
        status: 'success',
        data: property.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération de la propriété',
        error: (error as Error).message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {

      // Vérification de l'authentification
      const user = auth.user
      if (!user) {
        console.log('utilisateur non authentifié')
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté pour créer une propriété',
        })
      }
      
      // Validation des données
      const data = await request.validateUsing(createPropertyValidator)
      //debugging with data
      if (!data){
        console.log('Un soucis est intervenu lors de la validation', data)
      }

      const property = await Property.create({
        ...data,
        userId: user.id,
      })

      return response.created({
        status: 'success',
        message: 'Propriété créée avec succès',
        data: { property: property.serialize() },
      })
    } catch (error) {
      if ((error as { messages?: unknown }).messages) {
        return response.badRequest({
          status: 'error',
          message: 'Données invalides',
          errors: (error as { messages: unknown }).messages,
        })
      }
      return response.internalServerError({
        status: 'error',
        message: 'Une erreur est survenue lors de la création',
        error: (error as Error).message,
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté',
        })
      }

      const property = await Property.query()
        .where('id', params.id)
        .where('userId', user.id)
        .first()

      if (!property) {
        return response.notFound({
          status: 'error',
          message: 'Propriété non trouvée',
        })
      }

      const data = await request.validateUsing(updatePropertyValidator)
      property.merge(data)
      await property.save()

      return response.ok({
        status: 'success',
        message: 'Propriété mise à jour avec succès',
        data: { property: property.serialize() },
      })
    } catch (error) {
      if ((error as { messages?: unknown }).messages) {
        return response.badRequest({
          status: 'error',
          message: 'Données invalides',
          errors: (error as { messages: unknown }).messages,
        })
      }
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la mise à jour',
        error: (error as Error).message,
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'Vous devez être connecté',
        })
      }

      const property = await Property.query()
        .where('id', params.id)
        .where('userId', user.id)
        .first()

      if (!property) {
        return response.notFound({
          status: 'error',
          message: 'Propriété non trouvée',
        })
      }

      await property.delete()
      return response.ok({
        status: 'success',
        message: 'Propriété supprimée avec succès',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la suppression',
        error: (error as Error).message,
      })
    }
  }
}
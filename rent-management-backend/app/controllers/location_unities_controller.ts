import type { HttpContext } from '@adonisjs/core/http'
import LocationUnity from '#models/location_unity'
import { createLocationUnityValidator, updateLocationUnityValidator } from '#validators/location_unity'

export default class LocationUnitiesController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const locationUnities = await LocationUnity.query()
        .preload('property')
        .preload('occupant')
        .paginate(page, limit)

      return response.ok({
        status: 'success',
        data: locationUnities.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération des unités de location',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const locationUnity = await LocationUnity.query()
        .where('id', params.id)
        .preload('property')
        .preload('occupant')
        .preload('bails')
        .first()

      if (!locationUnity) {
        return response.notFound({
          status: 'error',
          message: 'Unité de location non trouvée',
        })
      }

      return response.ok({
        status: 'success',
        data: locationUnity.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération de l\'unité de location',
        error: (error as Error).message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createLocationUnityValidator)
      const locationUnity = await LocationUnity.create(data)

      return response.created({
        status: 'success',
        message: 'Unité de location créée avec succès',
        data: { locationUnity: locationUnity.serialize() },
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

  async update({ params, request, response }: HttpContext) {
    try {
      const locationUnity = await LocationUnity.find(params.id)
      if (!locationUnity) {
        return response.notFound({
          status: 'error',
          message: 'Unité de location non trouvée',
        })
      }

      const data = await request.validateUsing(updateLocationUnityValidator)
      locationUnity.merge(data)
      await locationUnity.save()

      return response.ok({
        status: 'success',
        message: 'Unité de location mise à jour avec succès',
        data: { locationUnity: locationUnity.serialize() },
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

  async destroy({ params, response }: HttpContext) {
    try {
      const locationUnity = await LocationUnity.find(params.id)
      if (!locationUnity) {
        return response.notFound({
          status: 'error',
          message: 'Unité de location non trouvée',
        })
      }

      await locationUnity.delete()
      return response.ok({
        status: 'success',
        message: 'Unité de location supprimée avec succès',
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

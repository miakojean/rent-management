import type { HttpContext } from '@adonisjs/core/http'
import Occupant from '#models/occupant'
import { createOccupantValidator, updateOccupantValidator } from '#validators/occupant'

export default class OccupantsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const occupants = await Occupant.query().paginate(page, limit)

      return response.ok({
        status: 'success',
        data: occupants.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération des occupants',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const occupant = await Occupant.query()
        .where('id', params.id)
        .preload('locationUnities')
        .preload('bails')
        .first()

      if (!occupant) {
        return response.notFound({
          status: 'error',
          message: 'Occupant non trouvé',
        })
      }

      return response.ok({
        status: 'success',
        data: occupant.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération de l\'occupant',
        error: (error as Error).message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createOccupantValidator)
      const occupant = await Occupant.create(data)

      return response.created({
        status: 'success',
        message: 'Occupant créé avec succès',
        data: { occupant: occupant.serialize() },
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
      const occupant = await Occupant.find(params.id)
      if (!occupant) {
        return response.notFound({
          status: 'error',
          message: 'Occupant non trouvé',
        })
      }

      const data = await request.validateUsing(updateOccupantValidator)
      occupant.merge(data)
      await occupant.save()

      return response.ok({
        status: 'success',
        message: 'Occupant mis à jour avec succès',
        data: { occupant: occupant.serialize() },
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
      const occupant = await Occupant.find(params.id)
      if (!occupant) {
        return response.notFound({
          status: 'error',
          message: 'Occupant non trouvé',
        })
      }

      await occupant.delete()
      return response.ok({
        status: 'success',
        message: 'Occupant supprimé avec succès',
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

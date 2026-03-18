import type { HttpContext } from '@adonisjs/core/http'
import Bail from '#models/bail'
import LocationUnity from '#models/location_unity'
import { createBailValidator, updateBailValidator } from '#validators/bail'

export default class BailsController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const bails = await Bail.query()
        .whereHas('locationUnity', (q) =>
          q.whereHas('property', (p) => p.where('user_id', user.id))
        )
        .preload('locationUnity')
        .preload('occupant')
        .paginate(page, limit)

      return response.ok({
        status: 'success',
        data: bails.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération des baux',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const bail = await Bail.query()
        .where('id', params.id)
        .whereHas('locationUnity', (q) =>
          q.whereHas('property', (p) => p.where('user_id', user.id))
        )
        .preload('locationUnity')
        .preload('occupant')
        .preload('rentPayments')
        .first()

      if (!bail) {
        return response.notFound({
          status: 'error',
          message: 'Bail non trouvé',
        })
      }

      return response.ok({
        status: 'success',
        data: bail.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération du bail',
        error: (error as Error).message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const data = await request.validateUsing(createBailValidator)

      const locationUnity = await LocationUnity.query()
        .where('id', data.locationUnityId)
        .whereHas('property', (q) => q.where('user_id', user.id))
        .first()

      if (!locationUnity) {
        return response.forbidden({
          status: 'error',
          message: 'Unité de location introuvable ou vous n\'êtes pas autorisé à y créer un bail.',
        })
      }

      const bail = await Bail.create(data)

      return response.created({
        status: 'success',
        message: 'Bail créé avec succès',
        data: { bail: bail.serialize() },
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
      const user = auth.user!

      const bail = await Bail.query()
        .where('id', params.id)
        .whereHas('locationUnity', (q) =>
          q.whereHas('property', (p) => p.where('user_id', user.id))
        )
        .first()

      if (!bail) {
        return response.notFound({
          status: 'error',
          message: 'Bail non trouvé',
        })
      }

      const data = await request.validateUsing(updateBailValidator)
      bail.merge(data)
      await bail.save()

      return response.ok({
        status: 'success',
        message: 'Bail mis à jour avec succès',
        data: { bail: bail.serialize() },
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
      const user = auth.user!

      const bail = await Bail.query()
        .where('id', params.id)
        .whereHas('locationUnity', (q) =>
          q.whereHas('property', (p) => p.where('user_id', user.id))
        )
        .first()

      if (!bail) {
        return response.notFound({
          status: 'error',
          message: 'Bail non trouvé',
        })
      }

      await bail.delete()
      return response.ok({
        status: 'success',
        message: 'Bail supprimé avec succès',
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

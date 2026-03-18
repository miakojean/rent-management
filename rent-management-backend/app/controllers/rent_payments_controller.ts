import type { HttpContext } from '@adonisjs/core/http'
import RentPayment from '#models/rent_payment'
import Bail from '#models/bail'
import { createRentPaymentValidator, updateRentPaymentValidator } from '#validators/rent_payment'

export default class RentPaymentsController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const rentPayments = await RentPayment.query()
        .whereHas('bail', (q) =>
          q.whereHas('locationUnity', (l) =>
            l.whereHas('property', (p) => p.where('user_id', user.id))
          )
        )
        .preload('bail')
        .paginate(page, limit)

      return response.ok({
        status: 'success',
        data: rentPayments.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération des paiements',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const rentPayment = await RentPayment.query()
        .where('id', params.id)
        .whereHas('bail', (q) =>
          q.whereHas('locationUnity', (l) =>
            l.whereHas('property', (p) => p.where('user_id', user.id))
          )
        )
        .preload('bail')
        .first()

      if (!rentPayment) {
        return response.notFound({
          status: 'error',
          message: 'Paiement non trouvé',
        })
      }

      return response.ok({
        status: 'success',
        data: rentPayment.serialize(),
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Erreur lors de la récupération du paiement',
        error: (error as Error).message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const data = await request.validateUsing(createRentPaymentValidator)

      const bail = await Bail.query()
        .where('id', data.bailId)
        .whereHas('locationUnity', (l) =>
          l.whereHas('property', (p) => p.where('user_id', user.id))
        )
        .first()

      if (!bail) {
        return response.forbidden({
          status: 'error',
          message: 'Bail introuvable ou vous n\'êtes pas autorisé à y enregistrer un paiement.',
        })
      }

      const rentPayment = await RentPayment.create(data)

      return response.created({
        status: 'success',
        message: 'Paiement créé avec succès',
        data: { rentPayment: rentPayment.serialize() },
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

      const rentPayment = await RentPayment.query()
        .where('id', params.id)
        .whereHas('bail', (q) =>
          q.whereHas('locationUnity', (l) =>
            l.whereHas('property', (p) => p.where('user_id', user.id))
          )
        )
        .first()

      if (!rentPayment) {
        return response.notFound({
          status: 'error',
          message: 'Paiement non trouvé',
        })
      }

      const data = await request.validateUsing(updateRentPaymentValidator)
      rentPayment.merge(data)
      await rentPayment.save()

      return response.ok({
        status: 'success',
        message: 'Paiement mis à jour avec succès',
        data: { rentPayment: rentPayment.serialize() },
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

      const rentPayment = await RentPayment.query()
        .where('id', params.id)
        .whereHas('bail', (q) =>
          q.whereHas('locationUnity', (l) =>
            l.whereHas('property', (p) => p.where('user_id', user.id))
          )
        )
        .first()

      if (!rentPayment) {
        return response.notFound({
          status: 'error',
          message: 'Paiement non trouvé',
        })
      }

      await rentPayment.delete()
      return response.ok({
        status: 'success',
        message: 'Paiement supprimé avec succès',
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

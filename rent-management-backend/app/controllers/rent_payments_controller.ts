import type { HttpContext } from '@adonisjs/core/http'
import RentPayment from '#models/rent_payment'
import { createRentPaymentValidator, updateRentPaymentValidator } from '#validators/rent_payment'

export default class RentPaymentsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const rentPayments = await RentPayment.query()
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

  async show({ params, response }: HttpContext) {
    try {
      const rentPayment = await RentPayment.query()
        .where('id', params.id)
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

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createRentPaymentValidator)
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

  async update({ params, request, response }: HttpContext) {
    try {
      const rentPayment = await RentPayment.find(params.id)
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

  async destroy({ params, response }: HttpContext) {
    try {
      const rentPayment = await RentPayment.find(params.id)
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

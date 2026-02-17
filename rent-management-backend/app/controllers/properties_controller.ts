import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import { createPropertyValidator } from '#validators/property' // chemin correct
import { DateTime } from 'luxon'

export default class PropertiesController {
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createPropertyValidator)

    const user = auth.user
    if (!user) {
      return response.unauthorized('Vous devez être connecté')
    }

    const propertyData = {
      ...data,
      userId: user.id,
      availableFrom: data.availableFrom 
        ? DateTime.fromJSDate(data.availableFrom) 
        : null
    }

    const property = await Property.create(propertyData)
    return response.created(property)
  }
}
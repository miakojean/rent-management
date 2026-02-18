// app/validators/property.ts
import vine from '@vinejs/vine'
import { PropertyTypes } from '#models/property'

/**
 * On définit souvent les statuts dans le modèle, 
 * mais voici comment les utiliser proprement ici.
 */
const PropertyStatuses = ['available', 'rented', 'sold', 'maintenance'] as const

export const createPropertyValidator = vine.compile(
  vine.object({
    title: vine.string()
      .trim()
      .minLength(3)
      // Utilisation d'une règle unique propre
      .unique(async (db, value) => {
        const property = await db
          .from('properties')
          .where('title', value)
          .first()
        return !property
      }),

    description: vine.string().trim().optional(),

    // Utilisation dynamique des types définis dans le modèle
    type: vine.enum(Object.values(PropertyTypes)), 

    surface: vine.number().positive(), // Ajout de .positive() pour éviter les surfaces négatives
    rooms: vine.number().min(0),
    bedrooms: vine.number().min(0),
    
    // nullable() permet la valeur null en DB, optional() permet l'absence du champ dans le JSON
    floor: vine.number().nullable().optional(), 

    address: vine.string().trim(),
    city: vine.string().trim(),
    zipCode: vine.string().trim(),
    
    price: vine.number().positive(),
    
    status: vine.enum(PropertyStatuses),
    
    // Ton correctif pour le format ISO est parfait ici
    availableFrom: vine.date({ formats: ['iso8601', 'YYYY-MM-DD'] }).optional(),
  })
)
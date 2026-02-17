import vine from '@vinejs/vine'
import { PropertyTypes } from '#models/property'

// Schéma de validation pour la création d'une propriété
export const createPropertyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    title: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)),
    surface: vine.number().positive(),
    rooms: vine.number().positive().min(1),
    bedrooms: vine.number().positive().min(0),
    floor: vine.number().optional().nullable(),
    address: vine.string().trim().minLength(5).maxLength(255),
    city: vine.string().trim().minLength(2).maxLength(100),
    zipCode: vine.string().trim().regex(/^[0-9]{5,10}$/),
    price: vine.number().positive(),
    status: vine.enum(['available', 'rented', 'sold', 'maintenance']),
    availableFrom: vine.date().optional().nullable(),
  })
)

// Schéma de validation pour la mise à jour (tous les champs optionnels)
export const updatePropertyValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)).optional(),
    surface: vine.number().positive().optional(),
    rooms: vine.number().positive().min(1).optional(),
    bedrooms: vine.number().positive().min(0).optional(),
    floor: vine.number().optional().nullable(),
    address: vine.string().trim().minLength(5).maxLength(255).optional(),
    city: vine.string().trim().minLength(2).maxLength(100).optional(),
    zipCode: vine.string().trim().regex(/^[0-9]{5,10}$/).optional(),
    price: vine.number().positive().optional(),
    status: vine.enum(['available', 'rented', 'sold', 'maintenance']).optional(),
    availableFrom: vine.date().optional().nullable(),
  })
)
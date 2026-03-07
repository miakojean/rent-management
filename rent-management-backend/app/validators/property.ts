// app/validators/property.ts
import vine from '@vinejs/vine'
import { PropertyTypes } from '#models/property'

export const createPropertyValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)),
    address: vine.string().trim(),
    city: vine.string().trim(),
    country: vine.string().trim(),
  })
)

export const updatePropertyValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
  })
)

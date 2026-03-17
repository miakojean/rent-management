// app/validators/property.ts
import vine from '@vinejs/vine'
import { PropertyTypes } from '#models/property'

export const createPropertyValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(3)
      .unique(async (db, value) => {
        const existing = await db.from('properties').where('title', value).first()
        return !existing
      }),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)),
    address: vine.string().trim(),
    city: vine.string().trim(),
    country: vine.string().trim(),
  })
)

export const updatePropertyValidator = vine.compile(
  vine.object({
    title: vine.string()
      .trim()
      .minLength(3)
      .unique(async (db, value) => {
        const existing = await db.from('properties').where('title', value).first()
        return !existing
      })
      .optional(),
    description: vine.string().trim().optional(),
    type: vine.enum(Object.values(PropertyTypes)).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
  })
)

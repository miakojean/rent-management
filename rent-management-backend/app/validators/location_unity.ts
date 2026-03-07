import vine from '@vinejs/vine'

export const createLocationUnityValidator = vine.compile(
  vine.object({
    propertyId: vine.number().positive(),
    occupantId: vine.number().positive().optional(),
    doorNumber: vine.string().trim(),
    pricePerMonth: vine.number().positive(),
  })
)

export const updateLocationUnityValidator = vine.compile(
  vine.object({
    propertyId: vine.number().positive().optional(),
    occupantId: vine.number().positive().nullable().optional(),
    doorNumber: vine.string().trim().optional(),
    pricePerMonth: vine.number().positive().optional(),
  })
)

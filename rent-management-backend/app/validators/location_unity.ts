import vine from '@vinejs/vine'

export const createLocationUnityValidator = vine.compile(
  vine.object({
    propertyId: vine.string().uuid(),
    occupantId: vine.string().uuid().optional(),
    doorNumber: vine.string().trim(),
    pricePerMonth: vine.number().positive(),
  })
)

export const updateLocationUnityValidator = vine.compile(
  vine.object({
    propertyId: vine.string().uuid().optional(),
    occupantId: vine.string().uuid().nullable().optional(),
    doorNumber: vine.string().trim().optional(),
    pricePerMonth: vine.number().positive().optional(),
  })
)

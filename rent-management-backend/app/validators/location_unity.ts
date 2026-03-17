import vine from '@vinejs/vine'

export const createLocationUnityValidator = vine.compile(
  vine.object({
    doorNumber: vine.string().trim(),
    pricePerMonth: vine.number().positive(),
  })
)

export const updateLocationUnityValidator = vine.compile(
  vine.object({
    doorNumber: vine.string().trim().optional(),
    pricePerMonth: vine.number().positive().optional(),
  })
)

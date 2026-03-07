import vine from '@vinejs/vine'

export const createBailValidator = vine.compile(
  vine.object({
    locationUnityId: vine.number().positive(),
    occupantId: vine.number().positive(),
    startDate: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }),
    pricePerMonth: vine.number().positive(),
    description: vine.number(),
    securityDeposit: vine.number().min(0),
  })
)

export const updateBailValidator = vine.compile(
  vine.object({
    locationUnityId: vine.number().positive().optional(),
    occupantId: vine.number().positive().optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }).optional(),
    pricePerMonth: vine.number().positive().optional(),
    description: vine.number().optional(),
    securityDeposit: vine.number().min(0).optional(),
  })
)

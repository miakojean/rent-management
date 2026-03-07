import vine from '@vinejs/vine'

export const createRentPaymentValidator = vine.compile(
  vine.object({
    bailId: vine.string().uuid(),
    paymentDate: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }),
    amountReceived: vine.number().positive(),
    description: vine.string().trim().optional(),
  })
)

export const updateRentPaymentValidator = vine.compile(
  vine.object({
    bailId: vine.string().uuid().optional(),
    paymentDate: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }).optional(),
    amountReceived: vine.number().positive().optional(),
    description: vine.string().trim().optional(),
  })
)

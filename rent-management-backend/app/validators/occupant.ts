import vine from '@vinejs/vine'

export const createOccupantValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    email: vine.string().trim().email().optional(),
    phoneNumber: vine.string().trim().optional(),
    nationality: vine.string().trim().optional(),
    imgDocument: vine.string().trim().optional(),
  })
)

export const updateOccupantValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).optional(),
    lastName: vine.string().trim().minLength(2).optional(),
    email: vine.string().trim().email().optional(),
    phoneNumber: vine.string().trim().optional(),
    nationality: vine.string().trim().optional(),
    imgDocument: vine.string().trim().optional(),
  })
)

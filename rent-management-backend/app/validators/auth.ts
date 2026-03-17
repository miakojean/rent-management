// validators/auth.ts
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { UserTypes } from '#models/user' // Import des types pour l'enum

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(30)
      .alphaNumeric()
      .unique(async (db, value) => {
        const existing = await db.from('users').where('username', value).first()
        return !existing
      }),

    // Utilisation des valeurs de l'objet UserTypes du modèle
    type: vine
      .enum(Object.values(UserTypes))
      .optional(),

    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique({ table: 'users', column: 'email' }),

    password: vine
      .string()
      .trim()
      .minLength(8)
      .confirmed({ confirmationField: 'passwordConfirmation' }),

    // Renommé en phoneNumber pour correspondre au modèle
    phoneNumber: vine.string().trim().regex(/^\+?\d[\d\s()-]{8,18}$/).optional(),
    address: vine.string().trim().maxLength(255).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const messagesProvider = new SimpleMessagesProvider({
  'required': 'Le champ {{ field }} est requis',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères',
  'email': "L'adresse email est invalide",
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
  'confirmed': 'La confirmation du mot de passe ne correspond pas',
  'email.unique': "Cette adresse email est déjà utilisée",
  'username.unique': "Ce nom d'utilisateur est déjà pris",
  'username.alphaNumeric': "Le nom d'utilisateur ne doit contenir que des lettres et chiffres",
  // Message mis à jour pour phoneNumber
  'phoneNumber.regex': 'Le format du numéro de téléphone est invalide (ex: +225 07 00 00 00 00)',
  'type.enum': 'Type utilisateur invalide',
})

registerValidator.messagesProvider = messagesProvider

export const loginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail(),
    password: vine
      .string()
  })
)
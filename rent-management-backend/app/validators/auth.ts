// validators/auth/register_validator.ts
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// 1. Ton schema (sans .messages())
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

    type: vine
      .enum(['proprietaire', 'locataire', 'gestionnaire', 'admin'] as const)
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
      .confirmed({ confirmationField: 'password_confirmation' }),

    phone: vine.string().trim().regex(/^\+?\d[\d\s()-]{8,18}$/).optional(),
    address: vine.string().trim().maxLength(255).optional(),
    isActive: vine.boolean().optional(),
  })
)

// 2. Définir les messages personnalisés
const messagesProvider = new SimpleMessagesProvider({
  // Règles génériques (appliquées à tous les champs)
  'required': 'Le champ {{ field }} est requis',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères',
  'email': "L'adresse email est invalide",
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
  'confirmed': 'La confirmation du mot de passe ne correspond pas',

  // Messages spécifiques par champ + règle
  'email.unique': "Cette adresse email est déjà utilisée",
  'username.unique': "Ce nom d'utilisateur est déjà pris",
  'username.alphaNumeric': "Le nom d'utilisateur ne doit contenir que des lettres et chiffres",
  'phone.regex': 'Le format du numéro de téléphone est invalide (ex: +225 07 00 00 00 00)',
  'type.enum': 'Type utilisateur invalide',
})

registerValidator.messagesProvider = messagesProvider
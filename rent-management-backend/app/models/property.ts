import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import LocationUnity from '#models/location_unity'
import { randomUUID } from 'node:crypto'

export const PropertyTypes = {
  HOUSE: 'villa',
  COMMUNITY_COURT: 'cour commune',
  BUILDING: 'immeuble',
  OTHER: 'autre',
} as const

// Extraction des valeurs pour le type (crée: 'villa' | 'cour commune' | 'immeuble' | 'autre')
export type PropertyType = typeof PropertyTypes[keyof typeof PropertyTypes]

export default class Property extends BaseModel {
  // --- Identifiants ---
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(property: Property) {
    property.id = randomUUID()
  }

  // --- Relations (Clés étrangères) ---
  @column()
  declare userId: string // L'ID du propriétaire (Landlord)

  // --- Informations Générales ---
  @column()
  declare title: string

  @column()
  declare description: string | null

  // --- Détails Physiques ---
  @column()
  declare type: PropertyType

  // --- Localisation ---
  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare country: string

  // @column()
  // declare zipCode: string

  // @column.dateTime()
  // declare availableFrom: DateTime | null

  // --- Timestamps ---
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Définition des Relations ---

  // Relation : Une propriété appartient à un Utilisateur (Propriétaire)
  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  // Relation : Une propriété a plusieurs unités de location
  @hasMany(() => LocationUnity)
  declare locationUnities: HasMany<typeof LocationUnity>
}
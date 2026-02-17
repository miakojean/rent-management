import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user' // Assure-toi que le chemin est correct selon ta version

export const PropertyTypes = {
  APARTMENT: 'appartement',
  HOUSE: 'villa',
  STUDIO: 'studio',
  COMMERCIAL: 'commercial',
} as const

// Extraction des valeurs pour le type (crée: 'apartment' | 'house' | ...)
export type PropertyType = typeof PropertyTypes[keyof typeof PropertyTypes]

export default class Property extends BaseModel {
  // --- Identifiants ---
  @column({ isPrimary: true })
  declare id: number

  // --- Relations (Clés étrangères) ---
  @column()
  declare userId: number // L'ID du propriétaire (Landlord)

  // --- Informations Générales ---
  @column()
  declare title: string

  @column()
  declare description: string | null

  // --- Détails Physiques ---
  @column()
  declare type: PropertyType

  @column()
  declare surface: number // En m²

  @column()
  declare rooms: number

  @column()
  declare bedrooms: number

  @column()
  declare floor: number | null // Étage (null si maison)

  // --- Localisation ---
  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare zipCode: string

  // --- Financier & Statut ---
  @column()
  declare price: number // Loyer ou Prix de vente

  @column()
  declare status: 'available' | 'rented' | 'sold' | 'maintenance'

  @column.dateTime()
  declare availableFrom: DateTime | null

  // --- Timestamps ---
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Définition des Relations ---
  
  // Relation : Une propriété appartient à un Utilisateur (Propriétaire)
  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  // Relation : Une propriété a plusieurs Photos
  //@hasMany(() => Photo)
  //declare photos: HasMany<typeof Photo>
}
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

export type PropertyType = typeof PropertyTypes[keyof typeof PropertyTypes]

export default class Property extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(property: Property) {
    if (!property.id) property.id = randomUUID()
  }

  @column()
  declare userId: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare type: PropertyType

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare country: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @hasMany(() => LocationUnity)
  declare locationUnities: HasMany<typeof LocationUnity>
}

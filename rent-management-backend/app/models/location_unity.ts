import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Property from '#models/property'
import Occupant from '#models/occupant'
import Bail from '#models/bail'
import { randomUUID } from 'node:crypto'

export default class LocationUnity extends BaseModel {
  static table = 'location_unities'

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(locationUnity: LocationUnity) {
    locationUnity.id = randomUUID()
  }

  @column()
  declare propertyId: string

  @column()
  declare occupantId: string | null

  @column()
  declare doorNumber: string

  @column()
  declare pricePerMonth: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---
  @belongsTo(() => Property)
  declare property: BelongsTo<typeof Property>

  // Une unité de location appartient à un seul occupant
  @belongsTo(() => Occupant)
  declare occupant: BelongsTo<typeof Occupant>

  @hasMany(() => Bail)
  declare bails: HasMany<typeof Bail>
}

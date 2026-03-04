import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import LocationUnity from '#models/location_unity'
import Bail from '#models/bail'

export default class Occupant extends BaseModel {
  static table = 'occupants'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string | null

  @column()
  declare phoneNumber: string | null

  @column()
  declare nationality: string | null

  @column()
  declare imgDocument: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---
  // Un occupant peut avoir plusieurs unités de location
  @hasMany(() => LocationUnity)
  declare locationUnities: HasMany<typeof LocationUnity>

  @hasMany(() => Bail)
  declare bails: HasMany<typeof Bail>
}

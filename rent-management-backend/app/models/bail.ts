import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import LocationUnity from '#models/location_unity'
import Occupant from '#models/occupant'
import RentPayment from '#models/rent_payment'

export default class Bail extends BaseModel {
  static table = 'bails'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare locationUnityId: number

  @column()
  declare occupantId: number

  @column.date()
  declare startDate: DateTime

  @column()
  declare pricePerMonth: number

  @column()
  declare description: number

  @column()
  declare securityDeposit: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---
  @belongsTo(() => LocationUnity)
  declare locationUnity: BelongsTo<typeof LocationUnity>

  @belongsTo(() => Occupant)
  declare occupant: BelongsTo<typeof Occupant>

  @hasMany(() => RentPayment)
  declare rentPayments: HasMany<typeof RentPayment>
}

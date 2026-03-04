import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bail from '#models/bail'

export default class RentPayment extends BaseModel {
  static table = 'rent_payments'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bailId: number

  @column.date()
  declare paymentDate: DateTime

  @column()
  declare amountReceived: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---
  @belongsTo(() => Bail)
  declare bail: BelongsTo<typeof Bail>
}

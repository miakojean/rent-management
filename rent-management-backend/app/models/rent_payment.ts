import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bail from '#models/bail'
import crypto from 'node:crypto'

export default class RentPayment extends BaseModel {
  static table = 'rent_payments'
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  public static async createUUID(rentPayment: RentPayment) {
    if (!rentPayment.id) {
      rentPayment.id = crypto.randomUUID()
    }
  }

  @column()
  declare bailId: string

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

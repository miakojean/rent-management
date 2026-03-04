import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rent_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('bail_id').unsigned().references('bails.id').notNullable().onDelete('CASCADE')
      table.index('bail_id')
      table.date('payment_date').notNullable()
      table.index('payment_date', 'rent_payments_payment_date_index')
      table.integer('amount_received').notNullable()
      table.string('description').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
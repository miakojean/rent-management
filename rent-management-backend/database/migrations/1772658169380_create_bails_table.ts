import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // table.increments('id')
      // Use 'uuid' instead of 'increments'
      table.uuid('id').primary().notNullable()

      table.uuid('location_unity_id').references('location_unities.id').notNullable()
      table.uuid('occupant_id').references('occupants.id').onDelete('CASCADE')
      table.date('start_date').notNullable()
      table.index(['location_unity_id', 'occupant_id'], 'bails_location_unity_occupant_index')
      table.index('start_date', 'bails_start_date_index')
      table.float('price_per_month').notNullable()
      table.string('description').notNullable()
      table.float('security_deposit').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
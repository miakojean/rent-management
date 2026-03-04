import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'location_unities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('property_id').unsigned().references('properties.id').onDelete('CASCADE')
      table.index('property_id')

      // Details of the location unity
      table.string('door_number').notNullable()
      table.integer('price_per_month').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
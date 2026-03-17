import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'location_unities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('property_id')
        .references('id')
        .inTable('properties')
        .onDelete('CASCADE')
        .notNullable()
      table.index('property_id')

      // Details of the location unity
      table.string('door_number').notNullable()
      table.float('price_per_month').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
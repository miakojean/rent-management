import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'location_unities'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('occupant_id')
        .unsigned()
        .references('occupants.id')
        .onDelete('SET NULL')
        .nullable()
      table.index('occupant_id', 'location_unities_occupant_id_index')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['occupant_id'], 'location_unities_occupant_id_index')
      table.dropForeign(['occupant_id'])
    })
  }
}
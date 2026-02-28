import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
  this.schema.createTable(this.tableName, (table) => {
    table.increments('id').notNullable()
    // Utilisez snake_case ici pour correspondre au défaut d'Adonis
    table.string('first_name').notNullable() 
    table.string('last_name').notNullable()
    table.string('email', 254).notNullable().unique()
    table.string('username').notNullable().unique()
    table.string('password').notNullable()
    table.string('phone').nullable()
    table.string('address').nullable()
    table.enum('type', ['proprietaire', 'locataire', 'gestionnaire', 'admin']).notNullable()
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at').nullable()
  })
}

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Identifiant
      table.increments('id')

      // Clé étrangère vers users
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      // Informations générales
      table.string('title').notNullable()
      table.text('description').nullable()

      // Détails physiques
      table.string('type').notNullable() // 'appartement', 'villa', etc.
      table.integer('surface').notNullable()
      table.integer('rooms').notNullable()
      table.integer('bedrooms').notNullable()
      table.integer('floor').nullable() // Étage (nullable pour les maisons)

      // Localisation
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('zip_code', 10).notNullable() // Limite à 10 caractères max

      // Financier & Statut
      table.integer('price').notNullable() // Prix en centimes ou euros
      table.enu('status', ['available', 'rented', 'sold', 'maintenance']).defaultTo('available')
      table.timestamp('available_from').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
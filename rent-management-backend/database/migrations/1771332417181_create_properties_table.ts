import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Identifiant
      table.uuid('property_id').primary()

      // Clé étrangère vers users
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.index('user_id')

      // Informations générales
      table.string('title').notNullable()
      table.text('description').nullable()

      // Détails physiques
      table.enum('type', ['villa', 'cour commune', 'immeuble', 'autre']).notNullable()


      // Localisation
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()
      // table.string('zip_code', 10).notNullable() // Limite à 10 caractères max

      // Financier & Statut
      // table.integer('price').notNullable() // Prix en centimes ou euros
      // table.enu('status', ['available', 'rented', 'sold', 'maintenance']).defaultTo('available')
      // table.timestamp('available_from').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
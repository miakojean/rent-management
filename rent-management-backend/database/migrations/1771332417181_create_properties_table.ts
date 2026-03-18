import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.index('user_id')

      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('type', ['villa', 'cour commune', 'immeuble', 'autre']).notNullable()
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

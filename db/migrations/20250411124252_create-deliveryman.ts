import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('deliveryman', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('cpf').notNullable()
    table.text('email').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('deliveryman')
}

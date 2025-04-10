import knex from 'knex'

export const conn = knex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db',
  },
})

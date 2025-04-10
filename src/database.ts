import knex, { Knex } from 'knex'
import 'dotenv/config'

if (!process.env.DATABASE_UR) {
  throw new Error('erro')
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_UR,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}
export const conn = knex(config)

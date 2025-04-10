import fastify from 'fastify'
import { conn } from './database'
const app = fastify()

app.get('/hello', async () => {
  const tables = await conn('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })

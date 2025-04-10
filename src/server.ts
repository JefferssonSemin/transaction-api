import fastify from 'fastify'
import { conn } from './database'
import crypto from 'node:crypto'

const app = fastify()

app.post('/hello', async () => {
  const transaction = await conn('deliveryman')
    .insert({
      id: crypto.randomUUID(),
      name: 'jeff',
      // cpf: '096.089.009-21',
    })
    .returning('*')

  return transaction
})

app.get('/hello', async () => {
  const transaction = await conn('deliveryman').select('*')

  return transaction
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })

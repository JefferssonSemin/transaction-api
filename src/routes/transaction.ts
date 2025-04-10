import { FastifyInstance } from 'fastify'
import { conn } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await conn('transactions').select('*')

    return transaction
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await conn('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}

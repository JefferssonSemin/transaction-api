import { FastifyInstance } from 'fastify'
import { knext } from '../database'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'

export async function deliverymanRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const deliverymans = await knext('deliveryman').select()

    return { deliverymans }
  })

  app.get('/:id', async (request) => {
    const getDeliverymanParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getDeliverymanParamsSchema.parse(request.params)

    const deliveryman = await knext('deliveryman').where('id', id).first()

    return { deliveryman }
  })

  app.post('/', async (request, reply) => {
    const createDeliverymanBodySchema = z.object({
      name: z.string(),
      cpf: z.string(),
      email: z.string(),
    })

    const { name, cpf, email } = createDeliverymanBodySchema.parse(request.body)

    await knext('deliveryman').insert({
      id: crypto.randomUUID(),
      name,
      cpf,
      email,
    })

    return reply.status(201).send()
  })
}

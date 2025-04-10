import fastify from 'fastify'
import { env } from './env/index'
import { transactionRoutes } from './routes/transaction'

const app = fastify()

app.register(transactionRoutes, {
  prefix: 'transaction',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('http server running')
  })

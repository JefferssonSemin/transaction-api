import fastify from 'fastify'
import { env } from './env/index'
import { transactionRoutes } from './routes/transaction'
import cookie from '@fastify/cookie'
import { request } from 'http'

const app = fastify()

app.register(cookie)

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

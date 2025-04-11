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
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('http server running')
  })

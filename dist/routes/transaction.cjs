'use strict'
const __create = Object.create
const __defProp = Object.defineProperty
const __getOwnPropDesc = Object.getOwnPropertyDescriptor
const __getOwnPropNames = Object.getOwnPropertyNames
const __getProtoOf = Object.getPrototypeOf
const __hasOwnProp = Object.prototype.hasOwnProperty
const __export = (target, all) => {
  for (const name in all)
    __defProp(target, name, { get: all[name], enumerable: true })
}
const __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (const key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        })
  }
  return to
}
const __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
)
const __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod)

// src/routes/transaction.ts
const transaction_exports = {}
__export(transaction_exports, {
  transactionRoutes: () => transactionRoutes,
})
module.exports = __toCommonJS(transaction_exports)

// src/database.ts
const import_knex = __toESM(require('knex'), 1)

// src/env/index.ts
const import_config = require('dotenv/config')
const import_zod = require('zod')
const envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z
    .enum(['development', 'test', 'production'])
    .default('production'),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333),
})
const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
  console.error('Invalid enviroment variables', _env.error.format())
  throw new Error('Invalid enviroment variables')
}
const env = _env.data

// src/database.ts
const config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}
const knext = (0, import_knex.default)(config)

// src/routes/transaction.ts
const import_zod2 = require('zod')
const import_node_crypto = __toESM(require('crypto'), 1)

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request, reply) {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}

// src/routes/transaction.ts
async function transactionRoutes(app) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(request.method)
  })
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const transaction = await knext('transactions')
        .where('session_id', sessionId)
        .select()
      return { transaction }
    },
  )
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const summary = await knext('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId
      const getTransactionParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid(),
      })
      const { id } = getTransactionParamsSchema.parse(request.params)
      const transaction = await knext('transactions')
        .where('id', id)
        .andWhere('session_id', sessionId)
        .first()
      return { transaction }
    },
  )
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = import_zod2.z.object({
      title: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(['credit', 'debit']),
    })
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )
    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = (0, import_node_crypto.randomUUID)()
    }
    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      // 7 days
    })
    await knext('transactions').insert({
      id: import_node_crypto.default.randomUUID(),
      title,
      session_id: sessionId,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return reply.status(201).send()
  })
}
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    transactionRoutes,
  })

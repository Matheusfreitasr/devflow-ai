import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createApp } from '../dist/app.js'
import { DemandService } from '../dist/services/demandService.js'

const validDemand = {
  title: 'Criar autenticação por e-mail',
  description: 'Permitir acesso usando e-mail e senha.',
  priority: 'Alta',
  status: 'Backlog',
}

async function withApi(run) {
  const server = createServer(createApp(new DemandService()))
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  assert.ok(address && typeof address === 'object')
  const baseUrl = `http://127.0.0.1:${address.port}`

  try {
    await run(baseUrl)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
}

async function createDemand(baseUrl, input = validDemand) {
  const response = await fetch(`${baseUrl}/api/demands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return { response, demand: await response.json() }
}

test('GET /api/demands returns the current demands', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/demands`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), [])
  })
})

test('POST creates a demand and GET /:id returns it', async () => {
  await withApi(async (baseUrl) => {
    const { response, demand } = await createDemand(baseUrl)
    assert.equal(response.status, 201)
    assert.equal(demand.title, validDemand.title)
    assert.equal(demand.priority, validDemand.priority)
    assert.equal(demand.status, validDemand.status)
    assert.ok(demand.id)
    assert.ok(demand.createdAt)

    const listResponse = await fetch(`${baseUrl}/api/demands`)
    assert.equal(listResponse.status, 200)
    assert.deepEqual(await listResponse.json(), [demand])

    const getResponse = await fetch(`${baseUrl}/api/demands/${demand.id}`)
    assert.equal(getResponse.status, 200)
    assert.deepEqual(await getResponse.json(), demand)
  })
})

test('POST rejects empty or whitespace-only title and description', async () => {
  await withApi(async (baseUrl) => {
    for (const input of [
      { ...validDemand, title: '   ' },
      { ...validDemand, description: '\n  ' },
    ]) {
      const response = await fetch(`${baseUrl}/api/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const body = await response.json()
      assert.equal(response.status, 400)
      assert.equal(body.error.code, 'VALIDATION_ERROR')
      assert.ok(Array.isArray(body.error.details))
    }
  })
})

test('GET /api/demands/:id returns 404 for an unknown demand', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/demands/missing`)
    assert.equal(response.status, 404)
    assert.equal((await response.json()).error.code, 'DEMAND_NOT_FOUND')
  })
})

test('PUT updates a demand and rejects an unknown id', async () => {
  await withApi(async (baseUrl) => {
    const { demand } = await createDemand(baseUrl)
    const update = { ...validDemand, title: 'Título atualizado', status: 'Em revisão' }
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    const updated = await response.json()
    assert.equal(response.status, 200)
    assert.equal(updated.title, update.title)
    assert.equal(updated.status, update.status)
    assert.equal(updated.createdAt, demand.createdAt)
    assert.ok(updated.updatedAt)

    const missing = await fetch(`${baseUrl}/api/demands/missing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    assert.equal(missing.status, 404)
  })
})

test('DELETE removes a demand and reports unknown ids', async () => {
  await withApi(async (baseUrl) => {
    const { demand } = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}`, { method: 'DELETE' })
    assert.equal(response.status, 204)

    const getResponse = await fetch(`${baseUrl}/api/demands/${demand.id}`)
    assert.equal(getResponse.status, 404)
  })
})

test('CORS allows the local Vite origin and errors use a consistent shape', async () => {
  await withApi(async (baseUrl) => {
    const preflight = await fetch(`${baseUrl}/api/demands`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:5173' },
    })
    assert.equal(preflight.status, 204)
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:5173')

    const missingRoute = await fetch(`${baseUrl}/api/unknown`)
    assert.equal(missingRoute.status, 404)
    assert.equal((await missingRoute.json()).error.code, 'ROUTE_NOT_FOUND')
  })
})

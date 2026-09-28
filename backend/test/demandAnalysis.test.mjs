import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createApp } from '../dist/app.js'
import { DemandService } from '../dist/services/demandService.js'
import { OpenAiDemandAnalysisService } from '../dist/services/openAiDemandAnalysisService.js'

const validDemand = {
  title: 'Criar autenticação por e-mail',
  description: 'Permitir acesso usando e-mail e senha.',
  priority: 'Alta',
  status: 'Backlog',
}
const validAnalysis = {
  summary: 'Implementar acesso por e-mail e senha.',
  requirements: ['Aceitar e-mail e senha.'],
  technicalTasks: ['Criar endpoint de autenticação.'],
  acceptanceCriteria: ['Credenciais válidas iniciam uma sessão.'],
  testCases: ['Rejeitar senha incorreta.'],
}

async function withApi(run, {
  config = { apiKey: 'test-key-not-real', model: 'test-model' },
  fetch: mockFetch,
  timeoutMs,
} = {}) {
  const demands = new DemandService()
  const analysis = new OpenAiDemandAnalysisService({
    config,
    ...(mockFetch ? { fetch: mockFetch } : {}),
    ...(timeoutMs ? { timeoutMs } : {}),
  })
  const server = createServer(createApp(demands, analysis))
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  const baseUrl = `http://127.0.0.1:${address.port}`
  try {
    await run(baseUrl, demands)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
}

function responseWithOutput(outputText, {
  status = 'completed',
  incompleteDetails = null,
  content,
} = {}) {
  return new Response(JSON.stringify({
    id: 'resp_test',
    object: 'response',
    created_at: 1,
    status,
    error: null,
    incomplete_details: incompleteDetails,
    instructions: null,
    model: 'test-model',
    output: [{
      id: 'msg_test',
      type: 'message',
      status: 'completed',
      role: 'assistant',
      content: content ?? [{ type: 'output_text', text: outputText, annotations: [] }],
    }],
    parallel_tool_calls: true,
    tool_choice: 'auto',
    tools: [],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

async function createDemand(baseUrl) {
  const response = await fetch(`${baseUrl}/api/demands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validDemand),
  })
  return response.json()
}

test('analysis returns 404 before calling AI for an unknown demand', async () => {
  let called = false
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/demands/missing/analyze`, { method: 'POST' })
    assert.equal(response.status, 404)
    assert.equal((await response.json()).error.code, 'DEMAND_NOT_FOUND')
    assert.equal(called, false)
  }, { fetch: async () => { called = true; throw new Error('should not call') } })
})

test('analysis reports missing API key without sending a request', async () => {
  await withApi(async (baseUrl) => {
    const demand = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
    assert.equal(response.status, 503)
    assert.equal((await response.json()).error.code, 'AI_NOT_CONFIGURED')
  }, { config: { model: 'test-model' } })
})

test('analysis returns the exact validated result and sends relevant demand fields', async () => {
  let requestBody
  await withApi(async (baseUrl) => {
    const demand = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), validAnalysis)
    const input = JSON.parse(requestBody.input)
    assert.deepEqual(input, { ...validDemand })
    assert.equal(requestBody.text.format.type, 'json_schema')
    assert.equal(requestBody.text.format.strict, true)
  }, { fetch: async (_url, init) => {
    requestBody = JSON.parse(init.body)
    return responseWithOutput(JSON.stringify(validAnalysis))
  } })
})

test('analysis rejects malformed provider output without exposing it', async () => {
  const raw = 'SECRET_RAW_PROVIDER_OUTPUT'
  await withApi(async (baseUrl) => {
    const demand = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
    const body = await response.json()
    assert.equal(response.status, 502)
    assert.equal(body.error.code, 'AI_INVALID_RESPONSE')
    assert.equal(JSON.stringify(body).includes(raw), false)
  }, { fetch: async () => responseWithOutput(raw) })
})

test('analysis rejects incomplete responses without exposing incomplete details', async () => {
  const privateDetails = { reason: 'private incomplete provider details' }
  await withApi(async (baseUrl) => {
    const demand = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
    const body = await response.json()
    assert.equal(response.status, 502)
    assert.equal(body.error.code, 'AI_INVALID_RESPONSE')
    assert.equal(body.error.message.includes('private incomplete provider details'), false)
    assert.equal(JSON.stringify(body).includes(JSON.stringify(privateDetails)), false)
  }, {
    fetch: async () => responseWithOutput(JSON.stringify(validAnalysis), {
      status: 'incomplete',
      incompleteDetails: privateDetails,
    }),
  })
})

test('analysis rejects refusal and other non-completed states', async (t) => {
  await t.test('completed refusal', async () => {
    const refusalText = 'private refusal content'
    await withApi(async (baseUrl) => {
      const demand = await createDemand(baseUrl)
      const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
      const body = await response.json()
      assert.equal(response.status, 502)
      assert.equal(body.error.code, 'AI_INVALID_RESPONSE')
      assert.equal(JSON.stringify(body).includes(refusalText), false)
    }, {
      fetch: async () => responseWithOutput('', {
        content: [{ type: 'refusal', refusal: refusalText }],
      }),
    })
  })

  await t.test('failed state', async () => {
    await withApi(async (baseUrl) => {
      const demand = await createDemand(baseUrl)
      const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
      assert.equal(response.status, 502)
      assert.equal((await response.json()).error.code, 'AI_INVALID_RESPONSE')
    }, {
      fetch: async () => responseWithOutput(JSON.stringify(validAnalysis), { status: 'failed' }),
    })
  })
})

test('analysis maps provider rate limits to a safe standardized error', async () => {
  await withApi(async (baseUrl) => {
    const demand = await createDemand(baseUrl)
    const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
    assert.equal(response.status, 429)
    assert.equal((await response.json()).error.code, 'AI_RATE_LIMITED')
  }, { fetch: async () => new Response(JSON.stringify({ error: { message: 'private provider detail' } }), {
    status: 429, headers: { 'Content-Type': 'application/json' },
  }) })
})

test('analysis maps network errors and timeouts without provider details', async (t) => {
  await t.test('network failure', async () => {
    await withApi(async (baseUrl) => {
      const demand = await createDemand(baseUrl)
      const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
      assert.equal(response.status, 502)
      assert.equal((await response.json()).error.code, 'AI_PROVIDER_ERROR')
    }, { fetch: async () => { throw new TypeError('private network detail') } })
  })
  await t.test('provider timeout', async () => {
    await withApi(async (baseUrl) => {
      const demand = await createDemand(baseUrl)
      const response = await fetch(`${baseUrl}/api/demands/${demand.id}/analyze`, { method: 'POST' })
      assert.equal(response.status, 504)
      assert.equal((await response.json()).error.code, 'AI_PROVIDER_TIMEOUT')
    }, {
      timeoutMs: 5,
      fetch: async (_url, init) => new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new DOMException('private timeout detail', 'AbortError')), { once: true })
      }),
    })
  })
})

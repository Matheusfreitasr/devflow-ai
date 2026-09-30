import 'dotenv/config'

import app from './app.js'

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '127.0.0.1'

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('A variável PORT deve ser um número entre 1 e 65535.')
}

console.log(
  'Gemini API configurada:',
  Boolean(process.env.GEMINI_API_KEY),
)

console.log(
  'Modelo Gemini configurado:',
  process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite',
)

const server = app.listen(port, host, () => {
  console.log(`DevFlow AI API disponível em http://${host}:${port}`)
})

function shutdown() {
  server.close((error) => {
    if (error) {
      console.error('Falha ao encerrar o servidor da API.')
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

export default server
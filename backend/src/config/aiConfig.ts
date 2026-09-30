export interface AiProviderConfig {
  apiKey?: string
  model: string
}

/**
 * Lê as configurações do provedor de IA a partir das
 * variáveis de ambiente do servidor.
 */
export function readAiProviderConfig(
  environment: NodeJS.ProcessEnv = process.env,
): AiProviderConfig {
  const apiKey = environment.GEMINI_API_KEY?.trim()
  const model =
    environment.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite'

  return {
    ...(apiKey ? { apiKey } : {}),
    model,
  }
}
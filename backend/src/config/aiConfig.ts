export interface AiProviderConfig {
  apiKey?: string
}

/** Reads the server-only key. It intentionally does not load files or call a provider. */
export function readAiProviderConfig(
  environment: NodeJS.ProcessEnv = process.env,
): AiProviderConfig {
  const apiKey = environment.OPENAI_API_KEY?.trim()
  return apiKey ? { apiKey } : {}
}

/** Reads the server-only key. It intentionally does not load files or call a provider. */
export function readAiProviderConfig(environment = process.env) {
    const apiKey = environment.OPENAI_API_KEY?.trim();
    const model = environment.OPENAI_MODEL?.trim() || 'gpt-6-astra';
    return { ...(apiKey ? { apiKey } : {}), model };
}

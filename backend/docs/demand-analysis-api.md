# Contrato planejado: análise de demanda

Esta especificação prepara a próxima etapa. A rota ainda não está registrada e
nenhum serviço de IA é chamado.

## Arquitetura

O futuro controller deverá buscar a demanda pelo `DemandService`, retornar `404`
se ela não existir e então chamar uma implementação injetada de
`DemandAnalysisService`. O controller não deverá conhecer o SDK ou o provedor.
O serviço receberá um `Demand` e devolverá `DemandAnalysisResult`, definido em
`src/types/demandAnalysis.ts`.

## Endpoint proposto

`POST /api/demands/:id/analyze`

A demanda é carregada pelo ID; o endpoint não precisa de corpo de requisição.
Em caso de sucesso, responde `200 OK` com o objeto `DemandAnalysisResult`:

```json
{
  "summary": "Resumo da demanda",
  "requirements": ["Requisito funcional"],
  "technicalTasks": ["Tarefa técnica"],
  "acceptanceCriteria": ["Critério de aceite"],
  "testCases": ["Caso de teste"]
}
```

Todos os itens das listas são strings. A análise é uma resposta da API e não
altera a demanda armazenada.

## Respostas HTTP previstas

| Status | Código | Situação |
| --- | --- | --- |
| `200` | — | Análise concluída; corpo segue `DemandAnalysisResult`. |
| `400` | `INVALID_DEMAND_ID` ou `VALIDATION_ERROR` | ID ou entrada inválidos. |
| `404` | `DEMAND_NOT_FOUND` | A demanda não existe. |
| `429` | `AI_RATE_LIMITED` | Limite de uso da análise atingido; enviar `Retry-After` quando disponível. |
| `502` | `AI_PROVIDER_ERROR` ou `AI_INVALID_RESPONSE` | Provedor falhou ou devolveu conteúdo que não atende ao contrato. |
| `503` | `AI_NOT_CONFIGURED` | A chave do provedor não foi configurada no backend. |
| `504` | `AI_PROVIDER_TIMEOUT` | O provedor não respondeu dentro do limite de tempo. |
| `500` | `INTERNAL_SERVER_ERROR` | Falha inesperada, sem detalhes internos na resposta. |

Erros mantêm o envelope comum da API: `{ "error": { "code", "message" } }`.
Falhas do provedor devem ser convertidas para códigos estáveis da API. Não
retornar ao cliente mensagens brutas do provedor, prompts, conteúdo de demanda,
stack traces ou credenciais. Logs futuros devem evitar dados sensíveis e não
deve haver repetição automática de chamadas que possa duplicar custo.

## Configuração da chave

Configurar `OPENAI_API_KEY` somente no ambiente do processo backend ou no
gerenciador de segredos do ambiente de execução. A configuração tipada fica em
`src/config/aiConfig.ts`; sem a variável, ela retorna configuração sem chave e
a futura rota deverá responder `503 AI_NOT_CONFIGURED`.

Não usar prefixo `VITE_`, não enviar a chave ao frontend e não salvar o valor em
arquivos versionados. Nenhum loader de `.env` foi adicionado; em desenvolvimento,
a variável deve ser exportada no terminal que inicia o backend.

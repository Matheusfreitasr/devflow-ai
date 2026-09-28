# DevFlow AI — Agent Instructions

## Objetivo

O DevFlow AI é uma aplicação para transformar demandas
de desenvolvimento de software em especificações técnicas
estruturadas com apoio de Inteligência Artificial.

## Regras gerais

- Utilizar TypeScript.
- Priorizar código simples, legível e modular.
- Não utilizar `any` sem justificativa.
- Não adicionar dependências sem necessidade.
- Não alterar arquivos sem entender primeiro a estrutura existente.
- Não expor chaves ou credenciais.
- Toda funcionalidade deve ser testada antes de ser considerada concluída.

## Processo de desenvolvimento

Antes de implementar uma funcionalidade:

1. Entender a demanda.
2. Analisar a estrutura atual do projeto.
3. Identificar os arquivos que precisam ser alterados.
4. Explicar brevemente a abordagem.
5. Implementar a solução.
6. Executar o lint.
7. Executar os testes existentes.
8. Revisar possíveis problemas.
9. Corrigir os problemas encontrados.
10. Resumir as alterações realizadas.

## Uso de Inteligência Artificial

O agente deve ser utilizado como apoio ao desenvolvimento,
mas suas sugestões não devem ser consideradas automaticamente corretas.

O código gerado deve passar por revisão humana.

Decisões de arquitetura, segurança, regras de negócio e
comportamento da aplicação devem ser avaliadas antes da implementação.

## Qualidade

Uma tarefa somente deve ser considerada concluída quando:

- a implementação estiver funcionando;
- o código estiver organizado;
- o lint passar;
- os testes relevantes passarem;
- não houver credenciais expostas;
- a alteração estiver de acordo com os requisitos.
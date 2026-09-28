import type { Demand } from '../types/demand'

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const initialDemands: Demand[] = [
  {
    id: 'demand-01',
    title: 'Implementar autenticação com OAuth',
    description: 'Permitir que usuários acessem a plataforma usando provedores OAuth.',
    priority: 'Alta',
    status: 'Em revisão',
    createdAt: minutesAgo(12),
  },
  {
    id: 'demand-02',
    title: 'Automatizar relatório de vendas',
    description: 'Gerar e enviar um resumo semanal de vendas para a equipe.',
    priority: 'Média',
    status: 'Concluído',
    createdAt: minutesAgo(60),
  },
  {
    id: 'demand-03',
    title: 'Revisar fluxo de onboarding',
    description: 'Simplificar as etapas de cadastro e boas-vindas no aplicativo.',
    priority: 'Baixa',
    status: 'Em desenvolvimento',
    createdAt: minutesAgo(60 * 24),
  },
  {
    id: 'demand-04',
    title: 'Integrar gateway de pagamento',
    description: 'Adicionar suporte a pagamentos com cartão na loja online.',
    priority: 'Alta',
    status: 'Backlog',
    createdAt: minutesAgo(60 * 24),
  },
  {
    id: 'demand-05',
    title: 'Adicionar notificações em tempo real',
    description: 'Notificar usuários quando houver atualizações importantes.',
    priority: 'Média',
    status: 'Concluído',
    createdAt: minutesAgo(60 * 48),
  },
]

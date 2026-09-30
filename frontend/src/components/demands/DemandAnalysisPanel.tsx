import { useRef, useState } from 'react'
import { demandAnalysisApi } from '../../services/demandAnalysis'
import type { DemandAnalysisResult } from '../../types/demandAnalysis'

interface DemandAnalysisPanelProps {
  demandId: string
  initialAnalysis?: DemandAnalysisResult
}

const resultSections: {
  key: keyof Omit<DemandAnalysisResult, 'summary'>
  title: string
}[] = [
  { key: 'requirements', title: 'Requisitos funcionais' },
  { key: 'technicalTasks', title: 'Tarefas técnicas' },
  { key: 'acceptanceCriteria', title: 'Critérios de aceite' },
  { key: 'testCases', title: 'Casos de teste' },
]

export function DemandAnalysisPanel({
  demandId,
  initialAnalysis,
}: DemandAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<DemandAnalysisResult | null>(
    initialAnalysis ?? null,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const requestInProgress = useRef(false)

  async function handleAnalyze() {
    if (requestInProgress.current) return

    requestInProgress.current = true
    setIsAnalyzing(true)
    setErrorMessage(null)

    try {
      setAnalysis(await demandAnalysisApi.analyze(demandId))
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a análise. Tente novamente.',
      )
    } finally {
      requestInProgress.current = false
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="analysis-panel" aria-labelledby="analysis-heading">
      <div className="analysis-heading">
        <div className="analysis-heading-copy">
          <span className="analysis-mark" aria-hidden="true">
            ✦
          </span>

          <div>
            <p className="eyebrow">ESPECIFICAÇÃO ASSISTIDA</p>

            <h2 id="analysis-heading">
              Análise com IA
            </h2>

            <p className="page-subtitle">
              Transforme a demanda em um plano claro para o time.
            </p>
          </div>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => void handleAnalyze()}
          disabled={isAnalyzing}
          aria-describedby={
            isAnalyzing ? 'analysis-progress' : undefined
          }
        >
          {isAnalyzing
            ? 'Analisando...'
            : analysis
              ? 'Gerar nova análise'
              : 'Analisar com IA'}
        </button>
      </div>

      {isAnalyzing && (
        <p
          className="analysis-progress"
          id="analysis-progress"
          role="status"
          aria-live="polite"
        >
          <span
            className="loading-spinner"
            aria-hidden="true"
          />

          A IA está analisando esta demanda. Isso pode levar alguns instantes.
        </p>
      )}

      {errorMessage && (
        <p className="analysis-error" role="alert">
          {errorMessage}
        </p>
      )}

      {analysis && (
        <div className="analysis-result" aria-live="polite">
          <section
            className="analysis-summary"
            aria-labelledby="analysis-summary-heading"
          >
            <p className="analysis-label">RESUMO</p>

            <h3 id="analysis-summary-heading">
              Visão geral da solução
            </h3>

            <p>{analysis.summary}</p>
          </section>

          <div className="analysis-lists">
            {resultSections.map(({ key, title }) => (
              <section
                className="analysis-list-section"
                key={key}
                aria-labelledby={`analysis-${key}`}
              >
                <h3 id={`analysis-${key}`}>
                  {title}
                </h3>

                {analysis[key].length > 0 ? (
                  <ul>
                    {analysis[key].map((item, index) => (
                      <li key={`${key}-${index}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="analysis-empty">
                    Nenhum item identificado.
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      )}

      {!isAnalyzing && !analysis && !errorMessage && (
        <div className="analysis-placeholder">
          <p>
            Receba um resumo, requisitos, tarefas técnicas e critérios
            para orientar a implementação.
          </p>
        </div>
      )}
    </section>
  )
}
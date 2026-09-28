import { useState, type FormEvent } from 'react'
import { Icon } from '../Icon'
import type {
  DemandPriority,
  DemandStatus,
  NewDemandInput,
} from '../../types/demand'

interface DemandFormProps {
  onCancel: () => void
  onCreate: (demand: NewDemandInput) => void
}

interface FormErrors {
  title?: string
  description?: string
}

export function DemandForm({ onCancel, onCreate }: DemandFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<DemandPriority>('Média')
  const [status, setStatus] = useState<DemandStatus>('Backlog')
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Informe um título para a demanda.'
    if (!description.trim()) {
      nextErrors.description = 'Informe uma descrição para a demanda.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onCreate({ title: title.trim(), description: description.trim(), priority, status })
  }

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Nova demanda</strong>
        </div>
      </header>

      <div className="page-content demand-page">
        <button className="back-link" type="button" onClick={onCancel}>
          <Icon name="arrowLeft" size={17} />
          Voltar ao dashboard
        </button>

        <section className="form-page-heading" aria-labelledby="form-title">
          <p className="eyebrow">DEMANDAS</p>
          <h1 id="form-title">Nova Demanda</h1>
          <p className="page-subtitle">
            Descreva o que precisa ser feito para organizar o trabalho do time.
          </p>
        </section>

        <form className="demand-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field field-wide">
              <label htmlFor="demand-title">Título <span>Obrigatório</span></label>
              <input
                autoFocus
                id="demand-title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
                required
                maxLength={120}
                placeholder="Ex.: Criar fluxo de recuperação de senha"
              />
              {errors.title && <p className="field-error" id="title-error">{errors.title}</p>}
            </div>

            <div className="form-field field-wide">
              <label htmlFor="demand-description">Descrição <span>Obrigatório</span></label>
              <textarea
                id="demand-description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'description-error' : undefined}
                required
                rows={5}
                placeholder="Explique o contexto, o problema e o resultado esperado."
              />
              {errors.description && (
                <p className="field-error" id="description-error">{errors.description}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="demand-priority">Prioridade</label>
              <select
                id="demand-priority"
                name="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as DemandPriority)}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="demand-status">Status</label>
              <select
                id="demand-status"
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value as DemandStatus)}
              >
                <option value="Backlog">Backlog</option>
                <option value="Em desenvolvimento">Em desenvolvimento</option>
                <option value="Em revisão">Em revisão</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onCancel}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              Criar demanda
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

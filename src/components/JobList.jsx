import React from 'react'
import { 
  Calendar, 
  Clock, 
  Server, 
  GitBranch, 
  Package, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react'

function JobList({ jobs, onDelete, onEdit }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#10b981" />
      case 'failed':
        return <XCircle size={16} color="#ef4444" />
      default:
        return <ClockIcon size={16} color="#f59e0b" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'failed':
        return 'Falhou'
      default:
        return 'Pendente'
    }
  }

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (jobs.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
      }}>
        <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>Nenhum agendamento encontrado</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Clique em "Novo Agendamento" para criar seu primeiro job
        </p>
      </div>
    )
  }

  return (
    <div>
      <h4 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '500',
        marginBottom: '16px',
        color: '#374151'
      }}>
        Jobs Agendados ({jobs.length})
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Package size={16} color="#3b82f6" />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  {job.app_name}
                </span>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  v{job.version}
                </span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  backgroundColor: statusColors[job.status].bg,
                  color: statusColors[job.status].text,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {getStatusIcon(job.status)}
                  {getStatusText(job.status)}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <Server size={14} />
                  <span>{job.target_server}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <GitBranch size={14} />
                  <span>{job.app_branch}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <Calendar size={14} />
                  <span>{formatDateTime(job.schedule_date, job.schedule_time)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                  <Clock size={14} />
                  <span>
                    Clone: {job.skip_clone ? 'Pular' : 'Executar'} | 
                    Build: {job.skip_build ? 'Pular' : 'Executar'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onEdit(job)}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px'
                }}
              >
                <Edit size={14} />
                Editar
              </button>

              <button
                onClick={() => onDelete(job.id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px'
                }}
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const statusColors = {
  pending: { bg: '#fffbeb', text: '#d97706' },
  completed: { bg: '#ecfdf5', text: '#059669' },
  failed: { bg: '#fef2f2', text: '#dc2626' }
}

export default JobList
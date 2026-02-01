import React, { useState, useEffect } from 'react'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import { Calendar, Clock, Server, GitBranch, User, Key } from 'lucide-react'

function App() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Erro ao buscar jobs:', error)
    }
  }

  const handleCreateJob = async (jobData) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        setShowForm(false)
        fetchJobs()
        alert('Job agendado com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao criar job:', error)
      alert('Erro ao agendar job')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchJobs()
          alert('Job excluído com sucesso!')
        }
      } catch (error) {
        console.error('Erro ao excluir job:', error)
        alert('Erro ao excluir job')
      }
    }
  }

  return (
    <div className="container">
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Agendador Jenkins
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          opacity: 0.9
        }}>
          Agende atualizações automáticas para suas aplicações
        </p>
      </header>

      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Agendamentos
          </h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Calendar size={16} />
            Novo Agendamento
          </button>
        </div>

        {showForm && (
          <JobForm
            onSubmit={handleCreateJob}
            onCancel={() => setShowForm(false)}
            initialData={selectedJob}
          />
        )}

        <JobList
          jobs={jobs}
          onDelete={handleDeleteJob}
          onEdit={(job) => {
            setSelectedJob(job)
            setShowForm(true)
          }}
        />
      </div>

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        color: 'white',
        opacity: 0.8
      }}>
        <p>Agendador Jenkins - Desenvolvido para automação de deployments</p>
      </footer>
    </div>
  )
}

export default App
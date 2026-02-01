import React, { useState, useEffect } from 'react'
import { X, Save, Calendar, Clock, Server, GitBranch, User, Key, Package, Cpu } from 'lucide-react'

function JobForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    app_name: '',
    version: '',
    version_type: 'manual', // latest, list, manual, head, hash
    target_server: '',
    app_branch: '',
    skip_clone: true,
    skip_build: false,
    schedule_date: '',
    schedule_time: '',
    jenkins_url: 'http://jenkins_gcp_no:5001',
    jenkins_user: '',
    jenkins_token: ''
  })

  const servers = [
    'IMP-01:34.95.251.169',
    'PROD-01:35.247.243.102',
    'PROD-02:35.199.97.30',
    'PROD-03:34.95.176.6',
    'PROD-04:34.151.235.67',
    'PROD-05:35.247.231.213',
    'PROD-06:34.151.245.19',
    'PROD-07:35.199.65.37',
    'PROD-08:35.199.103.167',
    'PROD-09:35.199.120.245',
    'PROD-10:34.95.167.115',
    'PROD-11:34.39.155.140'
  ]

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const getVersionPlaceholder = () => {
    switch (formData.version_type) {
      case 'latest': return 'Será usada a última versão aprovada'
      case 'list': return 'Selecione uma das 5 últimas versões'
      case 'manual': return 'Ex: 15.13.0.0-0'
      case 'head': return 'Será usada a última versão do branch (HEAD)'
      case 'hash': return 'Ex: a1b2c3d ou a1b2c3d4e5f6...'
      default: return 'Ex: 15.13.0.0-0'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['app_name', 'version', 'target_server', 'app_branch', 
                          'schedule_date', 'schedule_time', 'jenkins_url', 
                          'jenkins_user', 'jenkins_token']
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Por favor, preencha o campo: ${field}`)
        return
      }
    }

    onSubmit(formData)
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().substring(0, 5)
    }
  }

  const { date: currentDate, time: currentTime } = getCurrentDateTime()

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {initialData ? 'Editar' : 'Novo'} Agendamento
          </h3>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <Package size={16} style={{ marginRight: '8px' }} />
                Nome da Aplicação
              </label>
              <input
                type="text"
                name="app_name"
                value={formData.app_name}
                onChange={handleChange}
                placeholder="Ex: pathfind_teste_aplicacao"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Package size={16} style={{ marginRight: '8px' }} />
                Tipo de Versão
              </label>
              <select
                name="version_type"
                value={formData.version_type}
                onChange={handleChange}
                required
              >
                <option value="latest">latest - última versão aprovada</option>
                <option value="list">list - listar 5 últimas para escolher</option>
                <option value="manual">número da versão</option>
                <option value="head">HEAD - última versão do branch</option>
                <option value="hash">hash do commit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Package size={16} style={{ marginRight: '8px' }} />
              Versão
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder={getVersionPlaceholder()}
              required={formData.version_type === 'manual' || formData.version_type === 'hash'}
              disabled={formData.version_type === 'latest' || formData.version_type === 'head' || formData.version_type === 'list'}
            />
            {formData.version_type === 'list' && (
              <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Funcionalidade de listar versões será implementada em breve
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              <Server size={16} style={{ marginRight: '8px' }} />
              Servidor Alvo
            </label>
            <select
              name="target_server"
              value={formData.target_server}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um servidor</option>
              {servers.map(server => (
                <option key={server} value={server}>{server}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <GitBranch size={16} style={{ marginRight: '8px' }} />
              Branch
            </label>
            <input
              type="text"
              name="app_branch"
              value={formData.app_branch}
              onChange={handleChange}
              placeholder="Ex: main, develop, hot-fix-login-v.15.13.1.0-30"
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="skip_clone"
                  checked={formData.skip_clone}
                  onChange={handleChange}
                />
                Pular Clone
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="skip_build"
                  checked={formData.skip_build}
                  onChange={handleChange}
                />
                Pular Build
              </label>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Data
              </label>
              <input
                type="date"
                name="schedule_date"
                value={formData.schedule_date}
                onChange={handleChange}
                min={currentDate}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Clock size={16} style={{ marginRight: '8px' }} />
                Hora
              </label>
              <input
                type="time"
                name="schedule_time"
                value={formData.schedule_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Server size={16} style={{ marginRight: '8px' }} />
              URL do Jenkins
            </label>
            <input
              type="url"
              name="jenkins_url"
              value={formData.jenkins_url}
              onChange={handleChange}
              placeholder="http://jenkins_gcp_no:5001"
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <User size={16} style={{ marginRight: '8px' }} />
                Usuário Jenkins
              </label>
              <input
                type="text"
                name="jenkins_user"
                value={formData.jenkins_user}
                onChange={handleChange}
                placeholder="seu_usuario"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Key size={16} style={{ marginRight: '8px' }} />
                Token Jenkins
              </label>
              <input
                type="password"
                name="jenkins_token"
                value={formData.jenkins_token}
                onChange={handleChange}
                placeholder="sua_senha"
                required
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn"
              style={{ backgroundColor: '#6b7280' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} />
              {initialData ? 'Atualizar' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobForm
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Canvas from './Canvas'

function Project() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8000'

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/auth')
          return
        }
        console.log(`Fetching project with ID: ${projectId}`)

        const response = await axios.get(`${BACKEND_URI}/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Project fetched successfully:', response.data.project)
        setProject(response.data.project)
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/auth')
        } else if (error.response && error.response.status === 404) {
          setError('Project not found')
        } else {
          setError('Failed to load project')
        }
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading project...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
   <div className='h-screen w-screen relative'>
    <img src="/logo.png" alt="FloDesk Logo" className="w-10 h-10 absolute top-8 left-8 z-10" />

    <Canvas project={project} projectId={projectId} />
   </div>
  )
}

export default Project
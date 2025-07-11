import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPlus } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
 
function Dashboard() {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const navigate = useNavigate()
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8000'

  useEffect(() => {
    
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/auth'
          return
        }

        const response = await axios.get(`${BACKEND_URI}/api/users/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('User details fetched:', response.data.user)
        setUserDetails(response.data.user)
      } catch (error) {
        if (error.response && error.response.status === 403 || !response.data.user) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/auth'
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setCreateLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${BACKEND_URI}/api/projects/`, {
        projectName: projectName.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Refresh user details to get updated projects
      const userResponse = await axios.get(`${BACKEND_URI}/api/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUserDetails(userResponse.data.user)
      
      setShowCreateModal(false)
      setProjectName('')
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setCreateLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="FloDesk Logo" className="w-10 h-10 " />
            <span className="text-2xl font-bold text-indigo-600">FloDesk</span>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300 font-medium cursor-pointer flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Project</span>
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {userDetails?.username}!</h1>
          <p className="text-slate-600">Manage your projects and create new ones</p>
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Your Projects ({userDetails?.projects?.length || 0})
          </h2>
          
          {userDetails?.projects?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFolder className='h-8 w-8 ' color='var(--color-slate-600)' />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-4">Create your first project to get started</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300 font-medium cursor-pointer flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userDetails?.projects?.map((project) => (
                <div 
                  key={project._id} 
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">P</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 truncate">{project.projectName}</h3>
                  <p className="text-sm text-slate-600">Click to open project</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Project</h2>
            
            <form onSubmit={handleCreateProject}>
              <div className="mb-6">
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setProjectName('')
                  }}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !projectName.trim()}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 font-medium cursor-pointer flex items-center justify-center space-x-2 ${
                    createLoading || !projectName.trim()
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {createLoading ? (
                    <span>Creating...</span>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 
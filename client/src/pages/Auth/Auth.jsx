import React, { useState } from 'react'
import { Sparkles } from 'lucide-react';
import axios from 'axios';

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8000'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/signup'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password }

      const response = await fetch(`${BACKEND_URI}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-50'>
      <div className='bg-white p-10 rounded-2xl shadow-2xl w-96 border border-slate-200'>
        <div className='text-center mb-10'>
          <div className='w-full flex justify-center mb-4'>
            <img src="/logo.png" alt="" className='h-20 w-20' />
          </div>
          <h1 className='text-4xl font-bold text-indigo-600'>
            FloDesk
          </h1>
          <p className='text-slate-500 mt-2 font-medium'>Your workflow companion</p>
        </div>
        <div className='flex mb-8 bg-slate-100 rounded-xl p-1.5'>
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              isLogin 
                ? 'bg-indigo-500 text-white shadow-lg transform scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              !isLogin 
                ? 'bg-indigo-500 text-white shadow-lg transform scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm'>
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div className='relative'>
              <input
                type='text'
                name='username'
                placeholder='Username'
                value={formData.username}
                onChange={handleChange}
                className='w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white'
                required
              />
            </div>
          )}
          
          <div className='relative'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white'
              required
            />
          </div>
          
          <div className='relative'>
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white'
              required
            />
          </div>
          
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
              loading 
                ? 'bg-slate-400 text-white cursor-not-allowed' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className='text-center mt-8 h-6'>
          {isLogin && (
            <button className='text-indigo-600 hover:text-purple-600 text-sm font-medium transition-colors cursor-pointer'>
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
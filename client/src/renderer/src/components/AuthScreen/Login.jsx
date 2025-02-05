import React from 'react'
import axios from 'axios'
import { BACKEND_URL } from "../../utilities/routes"
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    console.log(email, password) 

    axios.post(`${BACKEND_URL}/api/user/login`, {  email, password })
      .then(res => {
        console.log("Login Successful:", res.data)
        localStorage.setItem('token', res.data.token)
        navigate("/home")
      })
      .catch(err => {
        console.error("Login Error:", err.response?.data || err.message)
      })
  }

  return (
    <form className='auth-form-container' onSubmit={handleSubmit}>
      <div className="auth-form-heading">
        Login
      </div>
      <div className='auth-form-elements-container'>
        <div className='auth-form-element'>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' placeholder='Email' required />
        </div>
        <div className='auth-form-element'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' placeholder='Password' required />
        </div>
        <div className='auth-form-element'>
        </div>
      </div>
      <div className='auth-form-button'>
        <button type='submit'>Login</button>
      </div>
    </form>
  )
}

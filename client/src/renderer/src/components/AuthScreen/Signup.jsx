import React from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../utilities/routes'

export default function Signup(props) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    const username = e.target.username.value

    console.log(email, password, username)

    axios.post(`${BACKEND_URL}/api/user/signup`, { username, email, password })
      .then(res => {
        console.log("Signup Successful:", res.data)
        props.setLogin(true)
      })
      .catch(err => {
        console.error("Signup Error:", err.response?.data || err.message)
      })
  }

  return (
    <form className='auth-form-container' onSubmit={handleSubmit}>
      <div className="auth-form-heading">
        Signup
      </div>
      <div className='auth-form-elements-container'>  
        <div className='auth-form-element'>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' name='username' placeholder='Username' required />
        </div>
        <div className='auth-form-element'>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' placeholder='Email' required />
        </div>
        <div className='auth-form-element'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' placeholder='Password' required />
        </div>
      </div>
      <div className='auth-form-button'>
        <button type='submit'>Signup</button>
      </div>
    </form>
  )
}

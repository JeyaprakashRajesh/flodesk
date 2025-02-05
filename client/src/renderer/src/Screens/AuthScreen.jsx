import React, { useState } from 'react';
import "../styles/auth.css";
import logo from "../assets/images/logo.png";
import Login from "../components/AuthScreen/Login";
import Signup from "../components/AuthScreen/Signup";

export default function AuthScreen() {
  const [login, setLogin] = useState(true);

  return (
    <div className='auth-container'>
      <div className="auth-header-container">
        <div className="auth-header-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="auth-header-title">
          <h1>FloDesk</h1>
        </div>
      </div>

      <div className="auth-selector-container">
        <div className={`auth-selector-transition ${!login ? 'signup-active' : ''}`} />
        <button onClick={() => setLogin(true)} className={login ? "active" : ""}>
          Login
        </button>
        <button onClick={() => setLogin(false)} className={!login ? "active" : ""}>
          Signup
        </button>
      </div>
      <div className="auth-form-container">
        {login ? <Login /> : <Signup setLogin={setLogin}/>}
      </div>
    </div>
  );
}

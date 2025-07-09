import React, { useEffect } from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/Auth/Auth';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <div>Dashboard</div> : <Navigate to="/auth" />} />
        <Route path="/auth" element={token ? <Navigate to="/" /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import React, { useEffect } from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/Home/Dashboard/Dashboard';
import Project from './pages/Home/Project/Project';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={token ? <Navigate to="/" /> : <Auth />} />
        <Route path='/project/:projectId' element={token ? <Project /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
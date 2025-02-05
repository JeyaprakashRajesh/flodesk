import { useEffect } from "react"
import AuthScreen from "./Screens/AuthScreen"
import { useNavigate } from "react-router-dom"

import {Routes,Route} from "react-router-dom"
import HomeScreen from "./Screens/HomeScreen"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const navigate = useNavigate()
  useEffect(() => {
    ipcHandle()
  }, [])
  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token)
    if(token){
      navigate('/home')
    } else {
      navigate('/auth')
    }

  },[])
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </div>
  )
}

export default App


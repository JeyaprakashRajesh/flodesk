import React from 'react'
import "../styles/home.css"
import logo from "../assets/images/logo.png"
import { useState , useEffect } from 'react'
import axios from "axios"
import { BACKEND_URL } from "../utilities/routes"
import home from "../assets/images/home.png"
import collab from "../assets/images/collab.png"
import projects from "../assets/images/projects.png"
import settings from "../assets/images/settings.png"
import Home from '../components/HomeScreen/Home'

export default function HomeScreen() {
    const [data , setData] = useState(null)
    const [section , setSection] = useState("home")

    useEffect(() => {4
        async function fetchData() {
            try {  
              const response = await axios.get(`${BACKEND_URL}/api/user/fetch-data`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });   
              setData(response.data);
              console.log("User data: ", response.data);
            } catch (err) {
              console.error("Error fetching user data: ", err);
              localStorage.removeItem("token")
            }
          }
          fetchData();
    }, [])
    
  return (
    <div className='home-container'>
        <div className="home-navbar">
            <div className="home-heading-container">
                <img src={logo} alt="" />
                <div>FloDesk</div>
            </div>
            <div className="home-navbar-container">
                <div className="home-navbar-element-container" style={{backgroundColor : section === "home" ? "var(--backgroundcolor)": "transparent"}} onClick={() => setSection("home")}>
                    <div className="home-navbar-element-img">
                        <img src={home} alt="" />
                    </div>
                    <div className="home-navbar-element-content">
                        home
                    </div>
                </div>
                <div className="home-navbar-element-container" style={{backgroundColor : section === "projects" ? "var(--backgroundcolor)": "transparent"}} onClick={() => setSection("projects")}>
                    <div className="home-navbar-element-img">
                        <img src={projects} alt="" />
                    </div>
                    <div className="home-navbar-element-content">
                        projects
                    </div>
                </div>
                <div className="home-navbar-element-container" style={{backgroundColor : section === "collabrations" ? "var(--backgroundcolor)": "transparent"}} onClick={() => setSection("collabrations")}>
                    <div className="home-navbar-element-img">
                        <img src={collab} alt="" />
                    </div>
                    <div className="home-navbar-element-content">
                        collabrations
                    </div>
                </div>
                <div className="home-navbar-element-container" style={{backgroundColor : section === "settings" ? "var(--backgroundcolor)": "transparent"}} onClick={() => setSection("settings")}>
                    <div className="home-navbar-element-img">
                        <img src={settings} alt="" />
                    </div>
                    <div className="home-navbar-element-content">
                        settings
                    </div>
                </div>
            </div>
            <div className="home-navbar-profile-container">
                <div className="home-navbar-profile-img">
                    <img src={logo} alt="" />
                </div>
                <div className='home-navbar-profile-content'>
                <div>Hello {data?.userdata?.username || "Guest"} </div>
                </div>
            </div>
        </div>
        <div className='home-content-contianer'>
        {section === "home" && <Home userdata={data?.userdata} />}
        </div>
    </div>
  )
}

import React, { useState } from 'react'
import logo from "../../assets/images/logo.png"
import clock from "../../assets/images/clock.png"
import { clockTools } from '../../utilities/Tools'

export default function Tools() {
  const [tool , setTool] = useState(null)
  return (
    <div style={{height: "100%" , display: "flex",flexDirection: "row"}}>
    <div className='tools-container'>
        <div className='tools-logo-container'>
            <img src={logo} alt="" />
        </div>
        <div className='tools-content-container'>
          <div className="tools-content-element-container" onMouseEnter={() => setTool("clock")} onMouseLeave={() => setTool(null)}>
            <img src={clock} alt="" />
          </div>
        </div>
    </div>
    {tool === "clock" && <div className='tools-details-container'>
        {clockTools.map((tool, index) => (
          <div key={index} className="tools-details-element-container">
            <img src={tool.img} alt="" />
            <div>{tool.name}</div>  
          </div>
        ))}
      </div>}

    </div>
    
  )
}

import React, { useState } from 'react';
import { io } from "socket.io-client";
import logo from '../../assets/images/logo.png';
import clock from '../../assets/images/clock.png';
import { clockTools } from '../../utilities/Tools';

const socket = io("http://localhost:3000");

export default function Tools({ project_id }) {
  const [tool, setTool] = useState(null);

  const handleToolClick = (toolData) => {
    console.log(project_id)
    if (!project_id) return;

    console.log("Sending tool data to backend:", toolData);

    socket.emit("createElement", {
      project_id,
      name: toolData.name,
      props: toolData.props
    });
  };

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'row' }}
      onMouseLeave={() => setTool(null)}
    >
      <div className="tools-container">
        <div className="tools-logo-container">
          <img src={logo} alt="" />
        </div>
        <div className="tools-content-container">
          <div className="tools-content-element-container" onMouseEnter={() => setTool('clock')}>
            <img src={clock} alt="" />
          </div>
        </div>
      </div>
      {tool === 'clock' && (
        <div className="tools-details-container">
          {clockTools.map((toolItem, index) => (
            <div 
              key={index} 
              className="tools-details-element-container"
              onClick={() => handleToolClick(toolItem)} 
            >
              <img src={toolItem.img} alt="" />
              <div>{toolItem.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

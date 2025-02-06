import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from "socket.io-client"; 
import '../styles/project.css';

const SOCKET_URL = "http://localhost:3000"; 

export default function ProjectScreen() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const project_id = searchParams.get('project_id');

    useEffect(() => {
        console.log("Project ID:", project_id);
        
        if (!project_id) return;

        const socket = io(SOCKET_URL);
        console.log("Socket connected:", socket.connected);

        socket.on("projectData", (response) => {
            if (response.success) {
                setData(response.project);
                console.log("Received project data:", response.project);
            } else {
                setError(response.message);
            }
            setLoading(false);
        });

        socket.emit("fetchProject", project_id);

        return () => {
            socket.disconnect();
        };
    }, [project_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {data ? (
                <div className='project-container'>
                    <div className="project-tools-container">

                    </div>
                    <div className="project-content-container">

                    </div>
                </div>
            ) : (
                <p>No project found</p>
            )}
        </div>
    );
}

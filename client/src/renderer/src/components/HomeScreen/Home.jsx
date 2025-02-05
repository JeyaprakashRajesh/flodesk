import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utilities/routes';

export default function Home({ userdata }) {
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");


    const handleAddProject = () => {
        if (newProjectName.trim() === "") return; 
        console.log("New project added:", newProjectName);
        

        setNewProjectName("");
        setIsAddingProject(false);
    };

    return (
        <div className='home-section-container'>
            <section className="home-projects-container">
                <div className="home-projects-heading-container">
                    <div>Recents</div>
                    {isAddingProject ? (
                        <div className='home-projects-add-container'>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Enter project name"
                                className="home-projects-input"
                            />
                            <span onClick={handleAddProject} className="home-projects-submit">✔</span>
                        </div>
                    ) : (
                        <div className='home-projects-heading-add' onClick={() => setIsAddingProject(true)}>
                            +
                        </div>
                    )}
                </div>

                {userdata?.project?.length > 0 ? (
                    userdata.project.map((item, index) => (
                        <div key={index}>{item.name}</div>
                    ))
                ) : (
                    <div className='home-no-projects'>Create a New Project to start working</div>
                )}
            </section>

            <section className="home-right-container"></section>
        </div>
    );
}

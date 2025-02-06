import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../utilities/routes';
import { useNavigate } from 'react-router-dom';

export default function Home({ userdata }) {
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const navigate = useNavigate();

    const handleAddProject = () => {
        if (newProjectName.trim() === "") return;
        console.log("New project added:", newProjectName);

        axios.post(`${BACKEND_URL}/api/user/create-project`, {
            name: newProjectName,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(response => {
                console.log("Project created:", response.data);
            })
            .catch(error => {
                console.error("Error creating project:", error);
            });

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
                <div className="home-projects-element-outer-container">
                    {userdata?.project?.length > 0 ? (
                        userdata.project.map((item, index) => (
                            <div key={index} className='home-project-element-container' onClick={() => navigate(`/project?project_id=${item.project_id}`)}>
                                <div className='home-project-element-img'></div>
                                <div className='home-project-element-content'>
                                    <div className='home-project-element-name'>{item.name}</div>
                                    <div className='home-project-element-project'>Project ID : {item.project_id}</div>
                                    <div className='home-project-element-member'>{item.member} of the project</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='home-no-projects'>Create a New Project to start working</div>
                    )}
                </div>
            </section>

            <section className="home-right-container"></section>
        </div>
    );
}

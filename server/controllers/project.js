const Project = require("../models/project.js");

async function FetchData(socket, project_id) {
    try {
        if (!project_id) {
            socket.emit("projectData", { success: false, message: "Project ID is required" });
            return;
        }

        const project = await Project.findOne({project_id : Number(project_id)});
        if (!project) {
            socket.emit("projectData", { success: false, message: "Project not found" });
            return;
        }

        socket.emit("projectData", { success: true, project });
    } catch (error) {
        console.error("Error fetching project:", error);
        socket.emit("projectData", { success: false, message: "Internal server error" });
    }
}

module.exports = {
    FetchData
};

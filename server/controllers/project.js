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

async function CreateElement(req, res) {
    const { name, props } = req.body; 
    const { project_id } = req.params;

    try {
        // Find project by ID
        const project = await Project.findOne({ project_id });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Ensure elements array exists
        project.elements = project.elements || [];

        // Add new element
        const newElement = { name, props };
        project.elements.push(newElement);

        // Save project
        await project.save();

        res.status(201).json({ 
            success: true, 
            message: "Element created successfully", 
            project // Send updated project back to frontend
        });
    } catch (error) {
        console.error("Error creating element:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}



module.exports = {
    FetchData,
    CreateElement
};

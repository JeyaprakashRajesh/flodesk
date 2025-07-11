const Project = require('../models/projectModel');
const User = require('../models/userModel');

const createProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    const userId = req.user.userId;
    

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create new project
    const project = new Project({
      projectName,
      userId,
      components: []
    });

    await project.save();

    // Add project to user's projects array
    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project._id,
        projectName: project.projectName,
        components: project.components,
        createdAt: project.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    console.log(`Fetching project with ID: ${projectId} for user: ${userId}`);

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user owns this project
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }
    console.log(`Project found: ${project.projectName}`);

    res.json({
      project: {
        id: project._id,
        projectName: project.projectName,
        components: project.components,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const createNewComponent = async (req, res) => {
  try {
    const { projectId, component } = req.body;
    console.log(`Adding component to project ID: ${projectId}`, component);

    if (!projectId || !component || !component.name || !component.props) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Push the new component to the components array
    project.components.push({
      name: component.name,
      props: component.props,
    });

    // Save the updated project
    await project.save();

    // Return the updated component (including its MongoDB _id)
    const newComponent = project.components[project.components.length - 1];
    res.status(201).json({ message: 'Component added.', component: newComponent });
  } catch (err) {
    console.error('Error adding component:', err);
    res.status(500).json({ message: 'Server error while adding component.' });
  }
};
module.exports = {
  createProject,
  getProject,
  createNewComponent
};

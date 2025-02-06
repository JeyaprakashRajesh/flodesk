const User = require("../models/auth.js");
const Project = require("../models/project.js");
const { getAndIncrementUserId , getAndIncrementProjectId } = require("../models/autoIncrementer.js");
const { generateToken } = require("../utilities/jwt.js");

async function Signup(req, res) {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const user_id = await getAndIncrementUserId();
        const user = new User({ user_id, username, email, password });
        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error in Signup:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function Login(req,res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken({email : email});
        return res.status(200).json({ token });
    }catch(err) {
        console.error("Error in Login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}
async function FetchData(req, res) {
    const email = req.decoded_data.email;
    console.log(email);

    if (!email) {
        return res.status(400).json({ message: "Email is not found" });
    }

    try {
        console.log("inside try");
        
        const data = await User.findOne({ email }).select("-password").lean();

        if (!data) {
            return res.status(400).json({ message: "No User Record found" });
        }

        return res.status(200).json({ userdata: data });
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function createProject(req, res) {
    const { name } = req.body;
    const email = req.decoded_data.email;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("Before project");
        const project_id = await getAndIncrementProjectId();
        
        if (!project_id) {
            return res.status(500).json({ message: "Failed to generate project ID" });
        }

        console.log(project_id, name, user.user_id, user.username);

        const project = new Project({
            project_id,
            name,
            members: [{ user_id: user.user_id, username: user.username, type: "Owner" }]
        });

        try {
            await project.save();
            console.log("After project");
        } catch (err) {
            console.error("Error while saving project:", err);
            return res.status(500).json({ message: "Failed to create project", error: err.message });
        }

        if (!Array.isArray(user.project)) { 
            user.project = [];
        }

        user.project.push({ project_id, name, member: "Owner" });

        try {
            await user.save();
            console.log("After user");
        } catch (err) {
            console.error("Error while saving user:", err);
            return res.status(500).json({ message: "Failed to update user", error: err.message });
        }

        return res.status(201).json({ message: "Project created successfully", project });

    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


module.exports = { Signup , Login , FetchData , createProject };

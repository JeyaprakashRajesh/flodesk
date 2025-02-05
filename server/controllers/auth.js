const User = require("../models/auth.js");
const { getAndIncrementUserId } = require("../models/autoIncrementer.js");
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
async function FetchData(req,res) {
    const email = req.decoded_data.email
    console.log(email)
    if(!email) {
        return res.status(400).json({message : "Email is not found"})
    }
    try {
        console.log("inside try")
        const data = await User.findOne({email : email})
        if(!data) {
            return res.status(400).json({message : "No User Record found"})
        }
        return res.status(200).json({userdata : data})
    }catch(err) {
        return res.status(500).json({message : "Internal server error"})
    }
}

module.exports = { Signup , Login , FetchData};

const User = require('../models/userModel');
const Project = require('../models/projectModel');
const {generateToken} = require('../utils/jwt');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = generateToken({ userId: user._id, username: user.username });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id, username: user.username });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching user details for userId:', userId);

    const user = await User.findById(userId)
      .populate('projects', 'projectName createdAt')
      .select('-password');

    console.log('User details fetched:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        projects: user.projects,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getUserDetails
};
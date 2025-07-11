const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Flodesk Server!');
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

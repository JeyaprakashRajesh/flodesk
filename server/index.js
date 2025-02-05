const express = require('express');
const cors = require('cors');
const {connectDB} = require('./utilities/db');
require('dotenv').config();


const app = express();
app.use(cors()); 
app.use(express.json());


connectDB()

app.use("/api/user", require("./routes/auth"));


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
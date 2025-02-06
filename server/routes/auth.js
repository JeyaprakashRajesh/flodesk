
const express = require('express');
const router = express.Router();

const {Signup,Login,FetchData,createProject} = require('../controllers/auth');
const {Middleware} = require("../utilities/middleware")

router.post('/signup', Signup)

router.post('/login', Login)

router.get('/fetch-data',Middleware,FetchData)

router.post('/create-project',Middleware,createProject)

module.exports = router;
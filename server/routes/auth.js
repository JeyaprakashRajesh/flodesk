
const express = require('express');
const router = express.Router();

const {Signup,Login,FetchData} = require('../controllers/auth');
const {Middleware} = require("../utilities/middleware")

router.post('/signup', Signup)

router.post('/login', Login)

router.get('/fetch-data',Middleware,FetchData)

module.exports = router;
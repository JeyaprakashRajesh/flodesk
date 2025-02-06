const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const {Middleware} = require('../utilities/middleware');
const {FetchData} = require('../controllers/project');

router.get('/fetch-data', Middleware , FetchData);

module.exports = router;

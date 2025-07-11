const express = require('express');
const { createProject, getProject, createNewComponent } = require('../controllers/projectController');
const { Middleware } = require('../utils/middleware');


const router = express.Router();

router.post('/', Middleware, createProject);
router.get('/:projectId', Middleware, getProject);
router.post('/add',Middleware, createNewComponent);

module.exports = router;

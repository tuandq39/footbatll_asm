const express = require('express');
const bodyParser = require('body-parser');
const adminController = require('../Controller/adminController')
const { requireAuth,checkUser } = require("../middleware/auth");
	
const adminRouter = express.Router();
	
adminRouter.use(bodyParser.json());

adminRouter.route('/')
.get(adminController.index)

module.exports = adminRouter;
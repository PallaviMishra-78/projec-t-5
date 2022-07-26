const express = require('express');
const router = express.Router();
const controller=require("../controllers/userController")
const middleware = require('../middleware/auth.js')

router.post('/register', controller.createUser)

router.post('/login', controller.login)

router.get('/user/:userId/profile' , middleware.authentication,middleware.authorization_user,controller.getUser)

router.put('/user/:userId/profile' , middleware.authentication,middleware.authorization_user,controller.update)




module.exports = router;
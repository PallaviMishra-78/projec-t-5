const express = require('express');
const router = express.Router();
const {register}=require("../controllers/userController")

router.post('/register', controller.createUser)

router.post('/login', controller.login)




module.exports = router;
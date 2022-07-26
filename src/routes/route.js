const express = require("express")
let router = express.Router()
let controller = require("../controllers/userController")
let {authentication,authorization_user} = require("../middleware/auth")


router.post('/register', controller.createUser)
router.post('/login', controller.login)
router.get('/user/:userId/profile', authentication, authorization_user, controller.getUser)
router.put("/user/:userId/profile",authentication, authorization_user, controller.update)

module.exports = router;
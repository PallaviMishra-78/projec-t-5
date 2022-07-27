const express = require("express")
let router = express.Router()
let userController = require("../controllers/userController")
let productController = require("../controllers/productController")
let {authentication,authorization_user} = require("../middleware/auth")


router.post('/register', userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', authentication, authorization_user, userController.getUser)
router.put("/user/:userId/profile",authentication, authorization_user, userController.update)

router.post('/products', productController.createProduct)

module.exports = router;
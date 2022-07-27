const express = require("express")
let router = express.Router()
let userController = require("../controllers/userController")
let {authentication,authorization_user} = require("../middleware/auth")
const productController = require("../controllers/productController")

//<<<<<<<<<<<<<<===============User API's=============>>>>>>>>>>>>>>>>>>>>//

router.post('/register', userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', authentication, authorization_user, userController.getUser)
router.put("/user/:userId/profile",authentication, authorization_user, userController.update)

//<<<<<<<<<<<<<<===============Product API's================>>>>>>>>>>>>>>>//

router.get("/products/:productId", productController.getProductsById)

module.exports = router;
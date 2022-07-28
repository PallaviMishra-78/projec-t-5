
const express = require("express")
let router = express.Router()
let userController = require("../controllers/userController")
let productController = require("../controllers/productController")
let {authentication,authorization_user} = require("../middleware/auth")

//<<<<<<<<<<<<<<===============User API's=============>>>>>>>>>>>>>>>>>>>>//

router.post('/register', userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', authentication, authorization_user, userController.getUser)
router.put("/user/:userId/profile",authentication, authorization_user, userController.update)

//<<<<<<<<<<<<<<===============Product API's================>>>>>>>>>>>>>>>//

router.post('/products', productController.createProduct)
router.get('/products', productController.getByQuery)
router.get("/products/:productId", productController.getProductsById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

module.exports = router;
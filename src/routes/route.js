const express =require("express")
let router=express.Router()
let userController = require("../controller/userController")
let productController =require("../controller/productController")
let middleware = require("../middleware/auth")
let cartController  = require("../controller/cartController")
let orderController =require("../controller/orderController")

//<<<<<<<<<<<<<<===============[User API's]=============>>>>>>>>>>>>>>>>>>>>//

//<<<<<<<<<<<<<<===============User API's=============>>>>>>>>>>>>>>>>>>>>//

router.post('/register', userController.createUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', authentication, authorization_user, userController.getUser)
router.put("/user/:userId/profile",authentication, authorization_user, userController.update)

//<<<<<<<<<<<<<<===============[Product API's]================>>>>>>>>>>>>>>>//

router.post('/products', productController.createProduct)
router.get('/products', productController.getByQuery)
router.get("/products/:productId", productController.getProductsById)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

//<<<<<<<<<<<<<<===============[Cart API's]================>>>>>>>>>>>>>>>//

router.post('/usercarts/:userId/cart',authentication, authorization_user,cartController.createCart)
router.put('/usercarts/:userId/cart', authentication, authorization_user,cartController.updateCart )
router.get('/users/:userId/cart',authentication, authorization_user, cartController.getCart)
router.delete('/users/:userId/cart',authentication, authorization_user, cartController.deleteCart)

//<<<<<<<<<<<<<<===============[Order API's]================>>>>>>>>>>>>>>>//

router.post("/users/:userId/orders" ,orderController.createOrder)
router.put("/users/:userId/orders" ,orderController.updateOrder)

module.exports = router;
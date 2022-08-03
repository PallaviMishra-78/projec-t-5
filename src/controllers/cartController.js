const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const vfy = require('../utility/validation')
const mongoose = require("mongoose")


//<<<<<<<<<<<<<==============create cart========================>>>>>>>>>>>>>>>>//

const createCart = async function (req, res) {

    try {
        const userId = req.params.userId
        let { quantity, productId, cartId } = req.body

        if (!vfy.isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "Please provide valid request body!" })

        if (!vfy.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id!" })

        if (!vfy.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide valid Product Id!" })

        if (!quantity) {
            quantity = 1
        } else {
            if (!vfy.validQuantity(quantity)) return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero!" })
        }
        //---------Find User by Id--------------//
        const findUser = await userModel.findById({ _id: userId })

        if (!findUser) {
            return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}!` })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false });

        if (!findProduct) {
            return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}!` })
        }
        //----------Find Cart By Id----------//
        if (cartId) {
            if (!vfy.isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Please provide valid cartId!" })
            }

            let checkCart = await cartModel.findOne({ _id: cartId })

            if (!checkCart) {
                return res.status(400).send({ status: false, message: "cartId doesn't exists!" })
            }
        }

        const findCartOfUser = await cartModel.findOne({ userId: userId })

        //------------Create New Cart------------//

        if (!findCartOfUser) {

            let cartData = {
                userId: userId,
                items: [
                    {
                        productId: productId,
                        quantity: quantity,
                    },
                ],
                totalPrice: findProduct.price * quantity,
                totalItems: 1
            };

            const createCart = await cartModel.create(cartData);
            return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
        }
        //--------Check Poduct Id Present In Cart-----------//

        if (findCartOfUser) {

            let price = findCartOfUser.totalPrice + quantity * findProduct.price

            let arr = findCartOfUser.items

            for (i in arr) {
                if (arr[i].productId) {
                    arr[i].quantity += quantity
                    let updatedCart = {
                        items: arr,
                        totalPrice: price,
                        totalItems: arr.length
                    }
                    //-------------Update Cart---------------------//

                    let responseData = await cartModel.findOneAndUpdate(
                        { _id: findCartOfUser._id },
                        updatedCart,
                        { new: true }
                    );
                    return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })

                }
            }
            //---------Add Item & Update Cart----------//

            arr.push({ productId: productId, quantity: quantity })

            let updatedCart = {
                items: arr,
                totalPrice: price,
                totalItems: arr.length
            }

            let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id },{$set:{updatedCart}}, { new: true })
            return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
        }

    } catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}

//<<<<<<<<<<<<<==============update cart========================>>>>>>>>>>>>>>>>//

const updateCart = async function(req,res) {
    try{
        const body = req.body
        const userId = req.params.userId;

        if(!vfy.isValidRequestBody(body)){
            return res.status(400).send({ status: false, msg: "Please provide data to update."});
        }

        if(!vfy.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        const userSearch = await userModel.findById({_id:userId})
        if(!userSearch) {
            return res.status(400).send({status: false, msg: "userId does not exist"})
        }

        const {cartId, productId, removeProduct} = body

        if(!vfy.isValid(cartId)) {
            return res.status(400).send({status: false, msg: "CartId is required"})
        }

        if(!vfy.isValidObjectId(cartId)) {
            return res.status(400).send({status: false, msg: "Invalid cartId"})
        }

        if(!vfy.isValid(productId)) {
            return res.status(400).send({status: false, msg: "productId is required"})
        }

        if(!vfy.isValidObjectId(productId)) {
            return res.status(400).send({status: false, msg: "Invalid productId"})
        }

        const cartSearch = await cartModel.findOne({_id: cartId})
        if(!cartSearch) {
            return res.status(404).send({status: false, msg: "Cart does not exist"})
        }

        const productSearch = await productModel.findOne({ _id: productId})
        if(!productSearch) {
            return res.status(404).send({status: false, msg: "product does not exist"})
        }

        if(productSearch.isDeleted == true) {
            return res.status(400).send({status: false, msg: "Product is already deleted"})
        }

        if((removeProduct != 0) && (removeProduct != 1)) {
            return res.status(400).send({status: false, msg: "Invalid remove product"})
        }

        const cart = cartSearch.items

        for(let i=0; i<cart.length; i++) {
            if(cart[i].productId == productId) {
                const priceChange = cart[i].quantity * productSearch.price

                if(removeProduct == 0) {
                    const productRemove = await cartModel.findOneAndUpdate({_id: cartId}, {$pull: {items:{productId: productId}}, totalPrice: cartSearch.totalPrice-priceChange, totalItems:cartSearch.totalItems-1}, {new:true})
                    return res.status(200).send({status: true, message: 'Success', data: productRemove})
                }

                if(removeProduct == 1) {
                    if(cart[i].quantity == 1 && removeProduct == 1) {
                     const priceUpdate = await cartModel.findOneAndUpdate({_id: cartId}, {$pull: {items: {productId: productId}}, totalPrice:cartSearch.totalPrice-priceChange, totalItems:cartSearch.totalItems-1}, {new: true})
                     return res.status(200).send({status: true, message: 'Success', data: priceUpdate})
                }

                cart[i].quantity = cart[i].quantity - 1
                const updatedCart = await cartModel.findByIdAndUpdate({_id: cartId}, {items: cart, totalPrice:cartSearch.totalPrice - productSearch.price}, {new: true})
                return res.status(200).send({status: true, message: 'Success', data: updatedCart})
                }
            }
           return res.status(400).send({ status: false, message: "Product does not found in the cart"})
        }
        
    }
    catch (error) {
         res.status(500).send({ status: false, message: error.message })
    } 
}

//<<<<<<<<<<<<<=========== get cart ==============>>>>>>>>>>>>>>>>>>>>>>>>//

const getCart = async function (req, res) {
    try {
        let userId = req.params.userId;

        //checking if the cart exist with this userId or not
        if (!vfy.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "please provide valid userId" })
        }
        let findCart = await cartModel.findOne({ userId: userId }).populate('items.productId').select({ __v: 0 });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        res.status(200).send({ status: true, message: "Cart Details", data: findCart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//<<<<<<<<<<<<<<<<<============== delete cart ===================>>>>>>>>>>>>>>>>>>>>>//

const deleteCart = async function (req, res) {
    try {

        const userId = req.params.userId

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        const isCartIdPresent = await cartModel.findOne({ userId: userId });

        if (!isCartIdPresent) {
            return res.status(404).send({ status: false, message: 'cart not found.' });
        }

        const delCart = await cartModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: 0, items: [], totalItems: 0 }
            },
            { new: true }
        );

        return res.status(200).send({ status: true, message: "Item and Products delete in cart", data: delCart });

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
module.exports = { createCart, getCart, deleteCart, updateCart }

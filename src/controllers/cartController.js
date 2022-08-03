const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const vfy = require('../utility/validation')

const updateCart = async function(req,res) {
     try{
         const body = req.body
         const userId = req.params.userId;
 
         if(Object.keys(body) == 0){
             return res.status(400).send({ status: false, msg: "Please provide data to update."});
         }
 
         if(!vfy.isValidObjectId(userId)) {
             return res.status(400).send({ status: false, msg: "Invalid parameters"});
         }
 
         const userSearch = await userModel.findById({_id:userId})
         if(!userSearch) {
             return res.status(400).send({status: false, msg: "userId does not exist"})
         }
 
         if(userId !== req.userId) {
             return res.status(401).send({status: false, msg: "Unauthorised access"})
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
          res.status(500).send({ msg: false, error: error.message })
     } 
 }
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const vfy = require('../utility/validation')


/*---------------------- create cart ----------------------*/

const createCart = async (req, res) => {
    try {
        // get body here
        const data = req.body
        const userId = req.params.userId

        // check body validation
        if (vfy.isEmptyObject(data)) return unsuccess(res, 400, 'Post Body is empty, Please add some key-value pairs')

        // destructure data here
        let { productId, quantity, cartId } = data
        // if quantity does't exist then add 1 default
        if (quantity < 1 ) return unsuccess(res, 400, ' Quantity value is >= 1 !')
        if (typeof quantity != 'number') return unsuccess(res, 400, ' Quantity must be a number!')
        quantity = quantity || 1;
        // basic validations
        // validate products 
        if (vfy.isEmptyVar(productId)) return unsuccess(res, 400, ' ProductId must be required!')
        if (!vfy.isValidObjectId(productId)) return unsuccess(res, 400, ' Invalid ProductId!')
        // validate quantity
        // if (vfy.isEmptyVar(quantity)) return unsuccess(res, 400, ' Quantity must be required!')

        // is a valid id 
        if (!vfy.isValidObjectId(userId)) return unsuccess(res, 400, ' Invalid userId !')

        // check broduct exist or not;
        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return unsuccess(res, 404, ' productId not found!')

        // check if the cart is already exist or not
        const cart = await cartModel.findOne({ userId })
        if (cart) {
            // validate cartID
            if (vfy.isEmptyVar(cartId)) return unsuccess(res, 400, ' CartId must be required!')
            if (!vfy.isValidObjectId(cartId)) return unsuccess(res, 400, ' Invalid cartId !')
            // check both cartid's from req.body and db cart are match or not?
            if (cart._id != cartId) return unsuccess(res, 400, ' CartId does\'t belong to this user!')


        if (!findProduct) {
            return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}!` })
        }
        //----------Find Cart By Id----------//
        const cartdata = await cartModel.findOne({ userId })
        if (cartdata) {
            if (vfy.isEmptyVar(cartId)) return res.status(400).send({ status: false, message: "CartId is required for existing cartId!" })
            if (!vfy.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please provide valid cartId!" })
            
            if (cartdata._id != cartId) return res.status(400).send({ status: false, message: "CartId doesn't belong to this user!" })

            let flag = 0;
            if (productId && quantity) {
                for (let i = 0; i < cartdata.items.length; i++) {
                    if (cartdata.items[i].productId == productId) {
                        cartdata.items[i].quantity += quantity
                        flag = 1;
                        break;
                    }
                }

                if (flag != 1) {
                    cartdata.items.push({ productId, quantity })
                }
            }
            
            let totalPrice = cartdata.totalPrice + (quantity * findProduct.price)
            cartdata.totalPrice=totalPrice

            let totalQuantity = cartdata.items.length
            cartdata.totalItems=totalQuantity

            await cartdata.save()
            return res.status(201).send({ status: true, message: "Success", data: cartdata })
        }              
        //------------Create New Cart------------//

        if (!cartdata) {

            let newCartData = {
                userId: userId,
                items: [
                    {
                        productId: productId,
                        quantity: quantity
                    }
                ],
                totalPrice: findProduct.price * quantity,
                totalItems: 1
            }

            const createCart = await cartModel.create(newCartData);
            return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
        }
    }    
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, Message: error.message })

    }
        }
    
//<<<<<<<<<<<<<==============update cart========================>>>>>>>>>>>>>>>>//

const updateCart = async function (req, res) {
    try {
        const body = req.body
        const userId = req.params.userId;

        if (!vfy.isValidRequestBody(body)) {
            return res.status(400).send({ status: false, msg: "Please provide data to update." });
        }

        if (!vfy.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters" });
        }

        const userSearch = await userModel.findById({ _id: userId })
        if (!userSearch) {
            return res.status(400).send({ status: false, msg: "userId does not exist" })
        }

        const { cartId, productId, removeProduct } = body

        if (!vfy.isValid(cartId)) {
            return res.status(400).send({ status: false, msg: "CartId is required" })
        }

        if (!vfy.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, msg: "Invalid cartId" })
        }

        if (!vfy.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "productId is required" })
        }

        if (!vfy.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Invalid productId" })
        }

        const cartSearch = await cartModel.findOne({ _id: cartId })
        if (!cartSearch) {
            return res.status(404).send({ status: false, msg: "Cart does not exist" })
        }

        const productSearch = await productModel.findOne({ _id: productId })
        if (!productSearch) {
            return res.status(404).send({ status: false, msg: "product does not exist" })
        }

        if (productSearch.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Product is already deleted" })
        }

        if ((removeProduct != 0) && (removeProduct != 1)) {
            return res.status(400).send({ status: false, msg: "Invalid remove product" })
        }

        const cart = cartSearch.items

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId == productId) {
                const priceChange = cart[i].quantity * productSearch.price

                if (removeProduct == 0) {
                    const productRemove = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: cartSearch.totalPrice - priceChange, totalItems: cartSearch.totalItems - 1 }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: productRemove })
                }

                if (removeProduct == 1) {
                    if (cart[i].quantity == 1 && removeProduct == 1) {
                        const priceUpdate = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, totalPrice: cartSearch.totalPrice - priceChange, totalItems: cartSearch.totalItems - 1 }, { new: true })
                        return res.status(200).send({ status: true, message: 'Success', data: priceUpdate })
                    }

                    cart[i].quantity = cart[i].quantity - 1
                    const updatedCart = await cartModel.findByIdAndUpdate({ _id: cartId }, { items: cart, totalPrice: cartSearch.totalPrice - productSearch.price }, { new: true })
                    return res.status(200).send({ status: true, message: 'Success', data: updatedCart })
                }
            }
            return res.status(400).send({ status: false, message: "Product does not found in the cart" })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
  }

//<<<<<<<<<<<<<=========== get cart ==============>>>>>>>>>>>>>>>>>>>>>>>>//

const getCart = async function (req, res) {
    try {
        // get body here
        const data = req.body
        const userId = req.params.userId

        // check body validation
        if (vfy.isEmptyObject(data)) return unsuccess(res, 400, ' Post Body is empty, Please add some key-value pairs')

        // destructure data here
        let { productId, cartId, removeProduct } = data

        // basic validations
        // validate products
        if (vfy.isEmptyVar(productId)) return unsuccess(res, 400, ' ProductId must be required!')
        if (!vfy.isValidObjectId(productId)) return unsuccess(res, 400, ' Invalid ProductId!')
        // validate quantity
        if (isNaN(removeProduct)) return unsuccess(res, 400, ' removeProduct must be required!')
        if (typeof removeProduct != 'number') return unsuccess(res, 400, ' removeProduct must be a number!')
        //  if you want, like removeProduct = 2 then remove quantity by 2 for that comment  line
        if (removeProduct < 0 || removeProduct > 1) return unsuccess(res, 400, ' removeProduct value is only 0 and 1 !')

        // is a valid id 
        if (!vfy.isValidObjectId(userId)) return unsuccess(res, 400, ' Invalid userId !')

        // check broduct exist or not;
        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return unsuccess(res, 404, ' productId not found!')
        // validate cartID
        if (vfy.isEmptyVar(cartId)) return unsuccess(res, 400, ' CartId must be required!')
        if (!vfy.isValidObjectId(cartId)) return unsuccess(res, 400, ' Invalid cartId !')
       
        // check if the cart is already exist or not
        const cart = await cartModel.findOne({ userId })
        if (!cart) return unsuccess(res, 404, ' Cart not found!')
        // check both cartid's from req.body and db cart are match or not?
        if (cart._id != cartId) return unsuccess(res, 400, ' CartId does\'t belong to this user!')
        
        // we neeed to check if the item already exist in my item's list or NOT!!

        let flag = -1;

        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].productId == productId) {

                flag = i;
                break;
            }
            else {
                return res.status(400).send({status :false , Message:"this product'id is not available ...pls try another"})
            }
        }
        if (!cart.items[flag]) { return res.status(400).send({ status: false, Message: "item is not present or already deleted" }) }

        if (flag >= 0) {
            if (cart.items[flag].quantity < removeProduct) return res.status(400).send({ status: false, Message: ` Can't remove, please provide removeProduct <= ${cart.items[flag].quantity} !` })
            //     else {
            //         return res.status(400).send({status:false , Message:"item you are trying to remove does not exist in your cart"})
            //     }
            // }
            // remove item(s) 1 or all
            if (removeProduct == 0) {
                // update price
                let total = cart.totalPrice - (product.price * cart.items[flag].quantity)
                cart.totalPrice = Math.round(total * 100) / 100
                cart.items.splice(flag, 1) //remove full item
            }
             
            else {
                // update price
                let total = cart.totalPrice - (product.price * removeProduct)
                cart.totalPrice = Math.round(total * 100) / 100
                if (cart.items[flag].quantity == removeProduct) {
                    cart.items.splice(flag, 1) //remove full item
                }
                else {
                    cart.items[flag].quantity = cart.items[flag].quantity - removeProduct //update quantity
                }
            }
        }
            // update quantity
            cart.totalItems = cart.items.length
            // update cart
            await cart.save()
            return success(res, 200, cart, `You just ${removeProduct == 0 ? 'remove an item from your cart' : 'decress quantity by ' + removeProduct} !`,)
    
        const delCart = await cartModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: 0, items: [], totalItems: 0 }
            },
            { new: true }
        );

        return res.status(204).send({ status: true, message: "Item and Products delete in cart", data: delCart });

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//----------------------------------------------------------------------[getCart]-------------------------------------------------------//

// const getCart = async function (req, res) {
//         try {
//             const userId = req.params.userId
//             // authroization is being checked through Auth(Middleware)
//             const checkCart = await cartModel.findOne({ userId: userId }) //.populate('items.productId')
//             if (!checkCart) { return res.status(404).send({ status: false, Message: 'cart not found ' }) }

//             res.status(200).send({ status: true, Message: 'sucess ', data: checkCart })
//         } catch (error) { res.status(500).send({ status: false, Message: error.message }) }
//     }


//----------------------------------------------------------------------[deleteCart]-------------------------------------------------------//
    const deleteCart = async function (req, res) {
        try {
            const userId = req.params.userId
            // authroization is being checked through Auth(Middleware)
            const checkCart = await cartModel.findOne({ userId: userId })
            if(checkCart.items.length==0) return res.status(400).send({status:false , Message: "this cart is already deleted"})
            if (!checkCart) { return res.status(400).send({ status: false, Message: 'cart not found ' }) }
            await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 })
            res.status(204).send({ status: true, Message: 'sucessfully deleted' })
        } catch (error) { res.status(500).send({ status: false, Message: error.message }) }
    }


    const success = (res, statusCode, Data, Message) => {
        return res.status(statusCode).send({ status: true, Message: Message, data: Data })
    }

    const unsuccess = (res, statusCode, Message) => {
        return res.status(statusCode).send({ status: !true, Message: Message })
    }

    module.exports = { createCart, updateCart, getCart, deleteCart }
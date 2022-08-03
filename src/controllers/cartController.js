const cartModel = require("../Model/cartModel");
const mongoose = require("mongoose");




//====================================================================[getCart]==========================================================//
const getCart = async function (req, res) {
    try {
        let userId = req.params.userId;

        //checking if the cart exist with this userId or not
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "please provide valid userId" })
        }
        let findCart = await cartModel.findOne({ userId: userId }).populate('items.productId').select({ __v: 0 });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this "${userId}" userId` });

        res.status(200).send({ status: true, message: "Cart Details", data: findCart })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
//==================================================================[deleteCart]=======================================================//
const deleteCart = async function (req, res) {
    try {

        const userId = req.params.userId

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        const isCartIdPresent = await cartModel.findOne({ userId: userId });

        if (!isCartIdPresent) {
            return res.status(404).send({ status: false, message: 'cret not found.' });
        }

        const DelCart = await cartModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: 0, items: [], totalItems: 0 }
            },
            { new: true }
        );

        return res.status(204).send({ status: true, message: "Item and Products delete in cart", data: DelCart });

    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}
module.exports = { createCart, updateCart, getCart, deleteCart };
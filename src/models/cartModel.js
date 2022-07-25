const mongoose = require("mongoose")


const cartSchema = new mongoose.Schema(
    {
        userId: {
            ObjectId: ref,
            required: true,
            unique: true,
            trim: true
        },
        items: [{
            productId: {
                ObjectId: refs,
                required: true,
                trim: true
            },
            quantity: {
                type: number,
                required: true,
            },
        }],
        totalPrice: {
            type: number,
            required: true,
            trim: true
        },
        totalItems: {
            type: number,
            required: true,
            trim: true
        },

    }, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema)


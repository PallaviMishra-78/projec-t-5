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
                ObjectId: ref,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
        totalPrice: {
            type: Number,
            required: true,
            trim: true
        },
        totalItems: {
            type: Number,
            required: true,
            trim: true
        },

    }, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema)


const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema(
    {
        userId: {
            ObjectId: refs,
            required: true,
            trim: true
        },
        items: [{
            productId: {
                ObjectId, refs,
                required: true,
                trim: true
            },
            quantity: {
                type: number,
                required: true,
                trim: true
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
        totalQuantity: {
            type: number,
            required: true,
            trim: true
        },
        cancellable: {
            type: boolean,
            default: true
        },
        status: {
            type: string,
            default: 'pending',
            enum: [pending, completed, cancled]
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: boolean,
            default: false
        },

    }, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)


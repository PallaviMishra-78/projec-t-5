const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
        unique: true,
        trim: true
    },
    items:[{
        productId: {
            type: ObjectId,
            ref: "Product",
            required: true
        },
        quantity:{
            type: Number,
            require: true,
            default: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    totalItems:{
        type: Number,
        required: true,
        trim: true
    }

}, {timeStamps : true});



module.exports = mongoose.model('Cart', cartSchema)
































// const cartSchema = new mongoose.Schema(
//     {
//         userId: {
//             ObjectId: ref,
//             required: true,
//             unique: true,
//             trim: true
//         },
//         items: [{
//             productId: {
//                 ObjectId: ref,
//                 required: true,
//                 trim: true
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//         }],
//         totalPrice: {
//             type: Number,
//             required: true,
//             trim: true
//         },
//         totalItems: {
//             type: Number,
//             required: true,
//             trim: true
//         },

//     }, { timestamps: true })

// module.exports = mongoose.model("Cart", cartSchema)

// const mongoose = require("mongoose")
// const objectId = mongoose.Schema.Types.ObjectId

// const cartSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: objectId,
//             ref: "User",
//             required: true,
//             trim: true,
//             unique: true
//         },
//         items: [{
//             productId: {
//                 type: objectId,
//                 ref: "Product",
//                 required: true,
//                 trim: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 min: 1
//             }
//         }],
//         totalPrice: {
//             type: Number,
//             required: true,
//             trim: true,
//         },
//         totalItems: {
//             type: Number,
//             required: true,
//             trim: true,
//         }
//     }, { timestamps: true }
// )

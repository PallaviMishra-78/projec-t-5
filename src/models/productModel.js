const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            unique: true
        },
        description: { 
            type: String, 
            require: true 
        },
        price: { 
            type: Number, 
            require: true 
        },       /*valid number/decimal*/
        currencyId: { 
            type: String, 
            require: true, INR 
        },
        currencyFormat: { 
            type: String, 
            require: true, // Rupee symbol 
        },
        isFreeShipping: { 
            type: Boolean, 
            default: false 
        },
        productImage: { 
            type: String, 
            require: true 
        },  // s3 link
        style: { 
            type: String 
        },
        availableSizes: { 
            type: Array, 
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] 
        },
        installments: { 
            type: Number 
        },
        deletedAt: { 
            type: Date 
        },
        isDeleted: { 
            type: Boolean, 
            default: false 
        }
        
    }, { timestamps: true })

module.exports = mongoose.model("Product", userSchema)
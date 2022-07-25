const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {

        fname: {
            type: string,
            required: true,
            trim:true
        },
        lname: {
            type: string,
            required: true,
            trim:true
        },
        email: {
            type: string,
            required: true,
            unique: true,
            trim:true
        },
        profileImage: {
            type: string,
            required: true,
            trim:true
        }, // s3 link
        phone: {
            type: string,
            required: true,
            unique: true,
            trim:true
        },
        password: {
            type: string,
            required: true,
            trim:true
        }, // encrypted password
        address: {
            shipping: {
                street: {
                    type: string,
                    required: true,
                    trim:true
                },
                city: {
                    type: string,
                    required: true,
                    trim:true
                },
                pincode: {
                    type: Number,
                    required: true,
                    trim:true
                },
            },
            billing: {
                street: {
                    type: string,
                    required: true,
                    trim:true
                },
                city: {
                    type: string,
                    required: true,
                    trim:true
                },
                pincode: {
                    type: number,
                    required: true,
                    trim:true
                },
            }
        },

    }, { timestamps: true })

module.exports = mongoose.model("User", userSchema)

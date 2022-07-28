const productModel = require("../models/productModel")
const vfy = require('../utility/validation')
const { uploadFile } = require('../aws.config.js')
const mongoose = require("mongoose")

//<<<<<<<<<<<<================= Create Products==============>>>>>>>>>>>>>>>//

const createProduct = async (req, res) => {
    try {
        const requestBody = req.body
        console.log(requestBody)
        if (vfy.isEmptyObject(requestBody)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide Product details" })
        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, isDeleted } = requestBody

        const files = req.files
        if (vfy.isEmptyFile(files)) return res.status(400).send({ status: false, Message: "Please provide product's Image" });
        if (vfy.isEmptyFile(title)) return res.status(400).send({ status: false, Message: "Please provide product's title" });
        if (!vfy.strRegex(title)) return res.status(400).send({ status: false, msg: "Please enter title in alphabets only!" })

        const duplicate=await productModel.findOne({title})
        if(duplicate) return res.status(400).send({status:false,message:`${title} product already exists`})

        if (vfy.isEmptyFile(description)) return res.status(400).send({ status: false, Message: "Please provide product's description" });
        if (vfy.isEmptyFile(price)) return res.status(400).send({ status: false, Message: "Please provide product's price" });
        if (!vfy.numberValue(price)) return res.status(400).send({ status: false, msg: "Please enter price!" });

        if (vfy.isEmptyFile(currencyId)) return res.status(400).send({ status: false, Message: "Please provide product's currencyId" });
        if (vfy.isEmptyFile(currencyFormat)) return res.status(400).send({ status: false, Message: "Please provide product's currency Format" });
        if (vfy.isEmptyFile(isFreeShipping)) return res.status(400).send({ status: false, Message: "Please provide product's shipping is free" });
        if (!vfy.booleanValue(isFreeShipping)) return res.status(400).send({ status: false, msg: "Please enter isFreeShipping!" }) 

        if (vfy.isEmptyFile(style)) return res.status(400).send({ status: false, Message: "Please provide product's style " });
        if (vfy.isEmptyFile(availableSizes)) return res.status(400).send({ status: false, Message: "Please provide product's available Sizes" });

        if (vfy.isEmptyFile(installments)) return res.status(400).send({ status: false, Message: "Please provide product's available in installments " });
        if (!vfy.numberValue(installments)) return res.status(400).send({ status: false, msg: "Please enter installments!" })
        if (isDeleted === true || isDeleted === "") return res.status(400).send({ status: false, msg: "isDeleted must be false!" })
        if (!vfy.acceptFileType(files[0], 'image/jpeg', 'image/jpg', 'image/png')) return res.status(400).send({ status: false, Message: "we accept jpg, jpeg or png as profile picture only" });
        let productImage = await uploadFile(files[0])

        const productrequestbody = { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage , style, availableSizes, installments, isDeleted }
        
        const product = await productModel.create(productrequestbody)

        return res.status(201).send({ status: true, message: "Success", data: product })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//<<<<<<<<<<<<<=============Get Products By Product Id===============>>>>>>>>>>>>>>>>>>>>>//

const getProductsById = async function(req,res){
     try{
          let productId = req.params.productId
          // if(productId){
               if (mongoose.Types.ObjectId.isValid(productId)){
                    const product = await productModel.findOne( {_id : productId, isDeleted: false})
                    if(product){                     
                         return res.status(200).send({ Status:true, Message:"Success", Data: product })
                    }else{
                         return res.status(404).send({status:false, message: "Product not found"})
                    }
               }else{
                    return res.status(400).send({ status: !true, message: "Product Id is invalid" })
               }
          // }else {
          //      return res.status(400).send({ status: !true, message: "Please enter the productId" })
          // }
     }catch(error){
          return res.status(500).send({status:false, message: error.message})
     }

}




module.exports = { createProduct, getProductsById }

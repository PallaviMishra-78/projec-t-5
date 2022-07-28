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
        if (currencyId !== "INR") return res.status(400).send({ status: false, msg: "Please enter currencyId in correct format" })
        if (vfy.isEmptyFile(currencyFormat)) return res.status(400).send({ status: false, Message: "Please provide product's currency Format" });
        if (currencyFormat !== "₹") return res.status(400).send({ status: false, msg: "Please enter currencyFormat in correct format" })
        if (vfy.isEmptyFile(isFreeShipping)) return res.status(400).send({ status: false, Message: "Please provide product's shipping is free" });
        if (!vfy.booleanValue(isFreeShipping)) return res.status(400).send({ status: false, msg: "Please enter isFreeShipping!" }) 

        if (vfy.isEmptyFile(style)) return res.status(400).send({ status: false, Message: "Please provide product's style " });
        if (vfy.isEmptyFile(availableSizes)) return res.status(400).send({ status: false, Message: "Please provide product's available Sizes" });
        let availableSize
        
        if (availableSizes) {availableSize = availableSizes.toUpperCase().split(",")
            for (let i = 0; i < availableSize.length; i++) {
              if (!(["S", "XS", "M", "X", "L", "XXL", "XL"]).includes(availableSize[i])) {
                return res.status(400).send({ status: false, message: `Sizes should be ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
              }
            }
          }
        if (vfy.isEmptyFile(installments)) return res.status(400).send({ status: false, Message: "Please provide product's available in installments " });
        if (!vfy.numberValue(installments)) return res.status(400).send({ status: false, msg: "Please enter installments!" })
        if (isDeleted === true || isDeleted === "") return res.status(400).send({ status: false, msg: "isDeleted must be false!" })
        if (!vfy.acceptFileType(files[0], 'image/jpeg', 'image/jpg', 'image/png')) return res.status(400).send({ status: false, Message: "we accept jpg, jpeg or png as profile picture only" });
        let productImage = await uploadFile(files[0])

        const productrequestbody = { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage , style, availableSizes:availableSize, installments, isDeleted }
        
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

 
 //-----------------------------------------[getByQuery]-----------------------------------
 const getByQuery = async function (req, res) {
     try {
         let query = req.query
 
 
         if (query.size) {
             let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
             if (!sizes.includes(query.size)) return res.status(400).send({ status: false, message: "Sizes should one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL' and 'XL'" })
             query.availableSizes = query.size
         }
 
         if (query.name) {
             if (!vfy.isValid(query.name)) return res.status(400).send({ status: false, message: "name should be in string & not empty" })
             query.title = query.name
         }
         let less = {}
         let greate = {}
         if (query.priceLessThan) {
             less['price'] = { $lt: parseInt(query['priceLessThan']) }
         }
         if (query.priceGreaterThan) {
             greate['price'] = { $gt: parseInt(query['priceGreaterThan']) }
         }
         let allProducts = await productModel.find({ $and: [query, { isDeleted: false }, less, greate] }).sort({ "price": query['priceSort'] })
         if (allProducts.length == 0) return res.status(404).send({ status: false, message: "no such Product" })
 
         res.status(200).send({ status: true, message: "Success", data: allProducts })
     }
     catch (error) {
         console.log(error)
         res.status(500).send({ status: false, message: error.message })
     }
  }


 //-----------------------------------------------[updateProduct]---------------------------------------------------------
 const updateProduct = async function (req, res) {
     try {
         let productId = req.params.productId
         let data = req.body
         if (!productId) return res.status(400).send({ status: false, message: "provide productId" })
         if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "invalid productId" })
         let checkId = await productModel.findById({ _id: productId })
         if (!checkId) return res.status(404).send({ status: false, message: "no such product" })
         if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "product is already deleted" })
 
         if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to update" })
 
         let { title, description, price, isFreeShipping, productImage, currencyId, currencyFormat, style, availableSizes, installments } = data
 
         if (title || typeof title == 'string') {
             //if(title ) return res.status(400).send({ status: false, message: "Title is required." });
             if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required." });
             if (!titleRegex.test(title)) return res.status(400).send({ status: false, message: " Please provide valid title including characters only." });
 
             //checking for duplicate title
             let checkTitle = await productModel.findOne({ title: data.title });
             if (checkTitle) return res.status(400).send({ status: false, message: "Title already exist" });
         }
 
         if (description || typeof description == 'string') {
 
             if (!isValid(description) && isValidString(description)) return res.status(400).send({ status: false, message: "description is required." });
         }
         if (price) {
             if (!isValidString(price) && !isValidPrice(price)) return res.status(400).send({ status: false, message: "price Should be in number only...!" });
         }
         if (currencyId) {
             if (!(/INR/.test(currencyId))) return res.status(400).send({ status: false, message: "Currency Id of product should be in uppercase 'INR' format" });
         }  //currencyFormat
         if (currencyFormat) {
             if (!(/₹/.test(currencyFormat))) return res.status(400).send({ status: false, message: "Currency format/symbol of product should be in '₹' " });
         }
 
         if (style) {
 
             if (!isValid(style) && isValidString(style)) return res.status(400).send({ status: false, message: "Style should be valid an does not contain numbers" });
             if (!titleRegex.test(style)) return res.status(400).send({ status: false, message: " Please provide valid style including characters only." });
         }
         if (installments) {
             if (!isValidString(installments)) return res.status(400).send({ status: false, message: "Installments should be in numbers" });
             if (!isValidPrice(installments)) return res.status(400).send({ status: false, message: "Installments should be valid" });
         }
         if (availableSizes) {
             let size1 = ["S", "XS", "M", "X", "L", "XXL", "XL"]
             let size2 = availableSizes.toUpperCase().split(",").map((x) => x.trim())
             for (let i = 0; i < size2.length; i++) {
                 if (!(size1.includes(size2[i]))) {
                     return res.status(400).send({ status: false, message: "Sizes should one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL' and 'XL'" })
 
                 }
                 availableSizes = size2
 
             }
         }
         if (isFreeShipping) {
             isFreeShipping = isFreeShipping.toLowerCase();
             if (isFreeShipping == 'true' || isFreeShipping == 'false') {
                 //convert from string to boolean
                 isFreeShipping = JSON.parse(isFreeShipping);
             } else {
                 return res.status(400).send({ status: false, message: "Enter a valid value for isFreeShipping" })
             }
             if ((typeof isFreeShipping != "boolean")) { return res.status(400).send({ status: false, message: "isFreeShipping must be a boolean value" }); }
         }
 
         //     let files = req.files
         //     if(productImage){
 
         //     if (files.length == 0) return res.status(400).send({ status: false, message: "Please upload product image" });
         //     if (files && files.length > 0) {
         //         //upload to s3 and get the uploaded link
         //         // res.send the link back to frontend/postman
         //         let uploadedFileURL = await uploadFile(files[0])
         //         newProductData.productImage = uploadedFileURL
         //     }
         // }
 
         let updateData = await productModel.findOneAndUpdate({
             _id: productId
         },
             data,
             { new: true })
         res.status(200).send({ status: true, message: "product updated", data: updateData })
 
     } catch (error) {
         res.status(500).send({ status: false, message: error.message })
     }
 }
 
 const deleteProduct = async function (req, res) {
     try {
         let productId = req.params.productId
         if (!productId) return res.status(400).send({ status: false, message: "provide productId" })
         if (!mongoose.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "invalid productId" })
         let checkId = await productModel.findById({ _id: productId })
         if (!checkId) return res.status(404).send({ status: false, message: "no such product" })
         if (checkId.isDeleted == true) return res.status(404).send({ status: false, message: "product is already deleted" })
 
         let deletedDoc = await productModel.findOneAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
         console.log(deletedDoc)
         res.status(200).send({ status: true, message: "product is deleted" })
     } catch (error) {
         res.status(500).send({ status: false, message: error.message })
     }
}
 
 module.exports = { createProduct, getByQuery, getProductsById, updateProduct, deleteProduct }

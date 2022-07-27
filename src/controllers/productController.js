let productModel = require('../models/productModel');
let vfy = require('../utility/validation')

//<<<<<<<<<<<<<=============Get Products By Product Id===============>>>>>>>>>>>>>>>>>>>>>//

const getProductsById = async function(req,res){
     try{
          let productId = req.params.productId
          if(productId){
               if(vfy.isValidObjectId(productId)){
                    const product = await productModel.findOne( {_id : productId, isDeleted: false}, {isDeleted: 0, _v:0} )

                    return res.status(200).send({ Status:!true, Message:"Success", Data: product })
               }else{
                    return res.status(404).send({ status: !true, message: "product not found" })
               }
          }else {
               return res.status(400).send({ status: !true, message: "please eneter the productId" })
          }
     }catch(error){
          return res.status(500).send({status:false, message: error.message})
     }

}

module.exports ={getProductsById}









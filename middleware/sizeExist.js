const ProductData = require("../models/productModel")

const checkSizeInCartExists= async(req,res,next)=>{
    try {
      console.log("This isthe bodyaaaa")
        const { cartdata } = req.body;
    
        for (const item of cartdata) {
          const { productId, selectedSize, quantity } = item;
    
          // Ensure necessary fields are present
          if (!productId || !selectedSize || !quantity) {
            return res
              .status(400)
              .json({ error: "Invalid cart item. Missing required fields." });
          }
    
          // Fetch product from the database
          const product = await ProductData.findById(productId);
        
          // Check if the size exists and has enough stock
          const sizeStock = product.sizes[selectedSize];
          
          if (sizeStock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock for ${product.productName} in size ${selectedSize}. Available: ${sizeStock}.`,
            })
          }
        }
        next()
    } catch (error) {
        console.log(error);
    } 
  }


const checkSizeInCheckoutPaymentExists= async(req,res,next)=>{
    try {
      console.log("This isthe bodyaaaa")
        const { cartdata } = req.body;
    
        for (const item of cartdata) {
          const { productId, selectedSize, quantity } = item;
    
          // Ensure necessary fields are present
          if (!productId || !selectedSize || !quantity) {
            return res
              .status(400)
              .json({ error: "Invalid cart item. Missing required fields." });
          }
    
          // Fetch product from the database
          const product = await ProductData.findById(productId);
        
          // Check if the size exists and has enough stock
          const sizeStock = product.sizes[selectedSize];
          
          if (sizeStock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock for ${product.productName} in size ${selectedSize}. Available: ${sizeStock}.`,
            })
          }else{
            return res.status(200).json({
              message: "Stocks Are available"
          })
          }
        }

    } catch (error) {
        console.log(error);
    } 
  }

  module.exports = {
    checkSizeInCartExists,
    checkSizeInCheckoutPaymentExists
  }

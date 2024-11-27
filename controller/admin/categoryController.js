const Category = require("../../models/category")
const ProductData = require("../../models/productModel")

const addCategory = async(req,res)=>{
    try{
         const{category, description } = req.body;

         const noramlizeCategory = category.toLowerCase()

         const existingCategory = await Category.findOne({category:noramlizeCategory})
         if(existingCategory){
            return res.json({message:"Category already exist"})
         }
         const new_category = await Category.create({
            description,
            category: noramlizeCategory,
          });

          if (new_category) {
            return res.status(201).json({ success: true, message: "New Category Added Successfully", data: new_category });
          } else {
            return res.status(500).json({ success: false, message: "Failed to create category" });
          }
      
    }catch(err){
         console.error(err);  // Log the error for debugging purposes
    return res.status(500).json({ success: false, message: "Server Error", error: err.message})
    }
}


const getCategory = async(req,res)=>{
    try { 
        const categories = await Category.find();
        if (categories.length > 0) {
          return res.status(200).json({ success: true, data: categories });
        } else {
          return res.status(404).json({ success: false, message: "No categories found" });
        }
    
      } catch (err) {
        console.error(err);  
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
      }
}


const listCategory = async(req,res)=>{
    try{
        const id = req.params.id
        const category = await Category.findByIdAndUpdate({_id:id},{isListed:true},{new:true})
        if(!category){
            res.status(404).json({success:false,message:"catgory not found"})
        }else{
            res.status(200).json({success:true,message:"category is listed "})
        }
    }catch(error){
        console.log("serever error",error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const unListCategory = async(req,res)=>{
    try{
        const id = req.params.id
        const category =await Category.findByIdAndUpdate({_id:id},{isListed:false},{new:true})
        console.log(category);    
        if(!category){
            return res.status(404).json({success:false, message: "Category not found" })
        }else{
            return res.status(200).json({success:true,message:"Category unlisted",  data: category })
        }
    }catch(err){
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}    

const fetchCategory = async (req,res)=>{
    try{
        const id = req.params.id
        const category  =await Category.findById({_id:id})
        if(!category){
            return res.status(404).json({success:false, message: "Category not found" })
        }else{
            return res.status(200).json({success:true,message:"Category is sent",  data: category })
        }
    }catch(err){}
   console.log(err);
   return res.status(500).json({ success: false, message: "Server Error", error: error.message });
}

const handleUpdate = async (req,res)=>{
    try{
        const id =req.params.id
        const {category,description}=req.body 
        console.log(req.body );
        
        const categoryUpdate = await Category.findByIdAndUpdate(
            { _id: id },
            { category: category, description: description }, // Updated fields combined
            { new: true } // Return the updated document
        );
        if(!categoryUpdate){
            return res.status(404).json({success:false, message: "Category not found" })
        }else{
            return res.status(200).json({success:true,message:"Category is being updated ",  data: category })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

//================================TO DISPLAY ACTIVE CATOGORIES IN FILTER==============================
const listCategoryForFiltering = async(req,res)=>{
    try {
        const category = await Category.find()
        console.log(category);
        const listedCategory = category.filter((x)=>x.isListed==true)
        if(listedCategory){
            return res.json(listedCategory)
        }else{
            return res.json("no categories listed")
        }
    } catch (error) {
        console.log(error)
    }
}
//================================TO CREATE THE CATEGORY OFFER =======================
const createCategoryOffer = async (req, res) => {
    try {
      const { offerData,categoryId} = req.body
      console.log("Offer data",offerData,categoryId);

      const category = await Category.findByIdAndUpdate(
        {_id:categoryId},
        {offerPrice:offerData,offerIsActive:true},
        {new:true}
      )
      console.log(category)

      const Products = await ProductData.find({category:categoryId})

      for(let product of Products){

        if (product.OfferIsActive && product.offerPrice > offerData) {
            console.log(`Skipping product ${product._id} with higher existing product-specific offer.`);
            continue; 
        }

        product.regularPrice = product.salePrice
        console.log(product.regularPrice);
        const discountPrice =Math.round( product.salePrice - (product.salePrice*offerData/100))
        await ProductData.findByIdAndUpdate(
            product._id,
            { salePrice: discountPrice,
              regularPrice: product.regularPrice,
            },
            { new: true }
          );
      }
      res.status(200).json({ message: "Offer created and applied to products successfully" });
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ error: "Failed to create offer" });
    }
  };

  //================================TO REMOVE THE CATEGORY OFFER =======================

  const removeCategoryOffer =async (req,res)=>{
    const {categoryId,offerPrice} = req.body
    console.log(req.body);
    
    const category = await Category.findByIdAndUpdate(
        {_id:categoryId},
        {offerPrice:0,offerIsActive:false},
        {new:true}
      )
      console.log(category)
    
    const Products = await ProductData.find({category:categoryId})
    console.log(Products)

    for(let product of Products){

        if (product.OfferIsActive && product.offerPrice > offerPrice) {
            console.log(`Skipping product ${product._id} with higher existing product-specific offer.`);
            continue; 
        }
            await ProductData.findByIdAndUpdate(
                product._id,
                { salePrice: product.regularPrice },
                { new: true }
            );
    }
    res.status(200).json({ message: "Offer created and applied to products successfully" });
  }


module.exports = {
   addCategory,
   getCategory,
   listCategory,
   unListCategory,
   fetchCategory,
   handleUpdate,
   listCategoryForFiltering,
   createCategoryOffer,
   removeCategoryOffer
}



const ProductData =  require("../../models/productModel");
const Category =  require("../../models/category");
//========================DATA GIVEN FOR CARDS=========================
const relatedProducts = async(req,res)=>{
    const {id} = req.params
    console.log(id)
    const product = await ProductData.findById(id).populate('category')
    console.log(product);
    const category = product.category._id;
    const relatedProducts = await ProductData.find({
        _id:{$ne:id},
        category:category
    }).populate('category')
    console.log(relatedProducts);
    if(relatedProducts){
        res.status(200).json({ data: relatedProducts , message: "Product not found" })
    }else{
        return res.status(404).json({ message: "Product not found" })
    }
}

//========================DATA GIVEN FOR CARDS=========================
const fetchProduct = async(req,res)=>{

    try{
        const id = req.params.id
        const product  =await ProductData.findById({_id:id}).populate('category')
        if(!product){
            return res.status(404).json({success:false, message: "Product not found" })
        }else{
            return res.status(200).json({success:true,message:"Product is sent",  data: product })
        }
    }catch(err){}
   return res.status(500).json({ success: false, message: "Server Error",});
}

//========================FILTERING THE PRODUCTS IN SHOP PAGE=========================
const getFilteredProducts = async (req, res) => {

try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 4; // Default limit is 10 orders per page
    const skip = (page - 1) * limit; 
    const { filters,searchQuery,sortOrder} = req.body; 
    console.log(searchQuery)
    console.log(sortOrder);
    

    const categoryNames = filters.Category || [];
    const fitTypes = filters.fit || [];

    const categories = await Category.find({ category: { $in: categoryNames } });
    
    const categoryIds = categories.map(cat => cat._id)

    const query = {
      isListed: true,
    };

    if (categoryIds.length > 0) {
      query.category = { $in: categoryIds };
    }

    if (fitTypes.length > 0) {
      query.sleeveType = { $in: fitTypes };
    }

    if (searchQuery) {
        query.$or = [
          { productName: { $regex: searchQuery, $options: "i" } },  // Case-insensitive search in product name
          { description: { $regex: searchQuery, $options: "i" } }    // Case-insensitive search in description
        ];
      }

      let sortCriteria = {}
      switch(sortOrder){
        case 'Price-Low-High':
          sortCriteria.salePrice = 1;
          break;
        case 'Price-High-Low':
          sortCriteria.salePrice = -1
          break;
        case 'New-Arrivals':
          sortCriteria.createdAt = -1;
          break;
        case 'Name-A-to-Z':
          sortCriteria.productName =1;
          break;
        case 'Name-Z-to-A':
          sortCriteria.productName = -1;
          break;
        default:
          sortCriteria = {}
      }

    const products = await ProductData.find(query)
    .populate('category')
    .sort(sortCriteria)
    .skip(skip)   
    .limit(limit)

    const totalusers = await ProductData.countDocuments(query)
    
    const totalPages = Math.ceil(totalusers/ limit);
    res.status(200).json({ success: true, products,currentPage: page,totalPages });
      
   
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};



module.exports = {
    relatedProducts,
    fetchProduct,
    getFilteredProducts
}
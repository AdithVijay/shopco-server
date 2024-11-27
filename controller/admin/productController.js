const ProductData = require("../../models/productModel");
const Category = require("../../models/category");
const Order = require("../../models/order");

// ===============================ADDING THE PRODUCT ==========================================
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      additionalInfo,
      regularPrice,
      salePrice,
      selectedCategory,
      sleeve,
      stock,
      images,
    } = req.body;

    console.log(stock);

    const existingProduct = await ProductData.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product name already exists. Please choose a unique name.",
      });
    }

    const count = Object.values(stock).reduce((acc, curr) => {
      return (acc += curr);
    }, 0);
    console.log(count);

    const categoryDoc = await Category.findOne({ category: selectedCategory });
    console.log(categoryDoc);
    if (!categoryDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const categoryId = categoryDoc._id;

    const Product = await ProductData.create({
      productName,
      description,
      additionalInfo,
      regularPrice,
      salePrice,
      images,
      category: categoryId,
      sleeveType: sleeve,
      sizes: stock,
      totalStock: count,
    });

    if (Product) {
      return res
        .status(201)
        .json({
          success: true,
          message: "New Product Added Successfully",
          data: Product,
        });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create Product" });
    }
  } catch (error) {
    console.log(error);
  }
};

// ==========================GETIING THE CATEGORY FOR PRODUCT PAGE===========================
const getCatgoryData = async (req, res) => {
  try {
    const response = Category.find();
    console.log(response);
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Category data not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Category is being updated ",
          data: category,
        });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================FETCHING PRODUCT DATA=======================================
const fetchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("product id", id);
    const product = await ProductData.findById({ _id: id }).populate(
      "category"
    )
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Product is sent", data: product });
    }
  } catch (err) {}
  //    return res.status(500).json({ success: false, message: "Server Error",});
};

// ==========================UPDATING PRODUCT DATA=======================================
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      productName,
      description,
      additionalInfo,
      regularPrice,
      salePrice,
      selectedCategory,
      sleeve,
      stock,
      images,
    } = req.body;

    const count = Object.values(stock).reduce((acc, curr) => {
      return (acc += curr);
    }, 0);
    console.log(count);

    const categoryDoc = await Category.findOne({ category: selectedCategory });
    if (!categoryDoc) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const categoryId = categoryDoc._id;

    const ProductUpdate = await ProductData.findByIdAndUpdate(
      { _id: id },
      {
        productName,
        description,
        additionalInfo,
        regularPrice,
        salePrice,
        images,
        category: categoryId,
        sleeveType: sleeve,
        sizes: stock,
        totalStock: count,
      }, // Updated fields combined
      { new: true } // Return the updated document
    );
    if (!ProductUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Product is being updated ",
          data: ProductUpdate,
        });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// ==========================UPDATING PRODUCT DATA=======================================
const gettingProducts = async (req, res) => {
  try {
    const response = await ProductData.find().populate("category");
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Product data not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Product is being updated ",
          data: response,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
// ==========================DISPALY DIFFERENT CATEGORY PRODUCT ===========================
const gettingCategoryForCard = async (req, res) => {
  try {
    const response = await ProductData.find().populate("category");
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Product data not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Product is being updated ",
          data: response,
        });
    }
  } catch (error) {
    console.log(error);
  }
};

// ==========================LISTING PRODUCT DATA IN PRODUCT PAGE===========================
const ListingProducts = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const Product = await ProductData.findByIdAndUpdate(
      { _id: id },
      { isListed: true },
      { new: true }
    );
    if (!Product) {
      res.status(404).json({ success: false, message: "catgory not found" });
    } else {
      res.status(200).json({ success: true, message: "category is listed " });
    }
  } catch (error) {
    console.log("serever error", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ==========================UNLISTING PRODUCT DATA IN PRODUCT PAGE===========================
const unListingProducts = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const Product = await ProductData.findByIdAndUpdate(
      { _id: id },
      { isListed: false },
      { new: true }
    );
    console.log(Product);
    if (!Product) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Category unlisted", data: Product });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// ==========================ADDING OFFER IN PRODUCT===========================
const addProductOffer = async (req, res) => {
  console.log(req.body);
  const { offerData, productId } = req.body;

  const product = await ProductData.findById(productId).populate('category');

  // Check if the category offer is higher and active
  if (product.category.offerIsActive && product.category.offerPrice > offerData) {
    console.log(`Product offer not applied as category offer is higher for product ${productId}.`);
    return res.status(400).json({ message: "Higher category offer is active. Product offer not applied." });
  }

  product.regularPrice = product.salePrice;
  const offerPrice = Math.round(
    product.salePrice - (product.salePrice * offerData) / 100
  );
   
  await ProductData.findByIdAndUpdate(
    productId,
    {
      salePrice: offerPrice,
      regularPrice: product.regularPrice,
      offerPrice: offerData,
      OfferIsActive: true,
    },
    { new: true }
  );
  return res.json({message:"Offer Added"})
};

// ==========================REMOVE OFFER IN PRODUCT===========================
const removeProductOffer = async (req, res) => {
  try {
    const { productId, offerPrice } = req.body;
    console.log(req.body);
    const product = await ProductData.findById(productId);
  
    const data = await ProductData.findByIdAndUpdate(
      productId,
      { salePrice: product.regularPrice, OfferIsActive: false, offerPrice: 0 },
      { new: true }
    );
    return res.json({message:"Offer Removed"})
  } catch (error) {
    console.log(error);
  }
};

//===========================BEST SELLING PRODUCT ===================
const getBestSellingProducts = async (req, res) => {
  try {
    const bestSellingProducts = await ProductData.find()
      .sort({ units_sold: -1 }) // Sort by units_sold in descending order
      .limit(5); // Limit to top 5 products

    if (!bestSellingProducts.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(bestSellingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best-selling products', error });
  }
};

//===========================BEST SELLING  CATEGORY===================
const getBestSellingCategories = async (req, res) => {
  try {
    const categorySales = await Order.aggregate([
      { $unwind: '$order_items' }, // Unwind order items
      {
        $lookup: {
          from: 'products', // Join with Product collection
          localField: 'order_items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' }, // Unwind product details
      {
        $lookup: {
          from: 'categories', // Join with Category collection
          localField: 'productDetails.category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' }, // Unwind category details
      {
        $group: {
          _id: '$categoryDetails._id', // Group by category ID
          name: { $first: '$categoryDetails.category' }, // Get category name
          totalQty: { $sum: '$order_items.qty' }, // Sum up the quantity sold
        },
      },
      { $sort: { totalQty: -1 } }, // Sort by total quantity sold
      { $limit: 5 }, // Limit to top 5 categories
    ]);

    if (!categorySales.length) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json(categorySales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best-selling categories', error });
  }
};

module.exports = {
  addProduct,
  getCatgoryData,
  fetchProduct,
  updateProduct,
  gettingProducts,
  ListingProducts,
  unListingProducts,
  gettingCategoryForCard,
  addProductOffer,
  removeProductOffer,
  getBestSellingProducts,
  getBestSellingCategories
};

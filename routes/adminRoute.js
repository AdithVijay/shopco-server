const express = require("express");
const adminRoute = express.Router();

const verifyAdmin = require( "../middleware/adminAuth")
const adminController = require("../controller/admin/adminController")
const categoryController = require("../controller/admin/categoryController")
const productController = require("../controller/admin/productController")
const userController = require("../controller/admin/userController")
const orderController = require("../controller/admin/orderController")
const coupounController = require("../controller/admin/coupounController")
const userBlock = require('../middleware/userBlock');

//==================ADMIN LOGIN===========================
 adminRoute.post("/login", adminController.adminLogin);

 //==================ADMIN LOGIN===========================
 adminRoute.post("/logout",adminController.adminLogOut)//GIVEN THE SAME FOR USER ALSO 

//==================CATEGORY SIDE==========================
 adminRoute.post("/addcategory",verifyAdmin,categoryController.addCategory);
 adminRoute.get("/getcategory",categoryController.getCategory);
 adminRoute.put("/listcategory/:id",verifyAdmin,categoryController.listCategory);
 adminRoute.put("/unlistcategory/:id",verifyAdmin,categoryController.unListCategory);
 adminRoute.get("/fetchcategory/:id",categoryController.fetchCategory);
 adminRoute.put("/updatecategory/:id",verifyAdmin,categoryController.handleUpdate);
 adminRoute.post("/create-category-offer",categoryController.createCategoryOffer);
 adminRoute.post("/remove-offer",categoryController.removeCategoryOffer)

//==================PRODUCT SIDE=============================
 adminRoute.post("/addproduct",verifyAdmin,productController.addProduct)
 adminRoute.get("/getcategory",productController.getCatgoryData)

//==================PRODUCT EDIT=============================
adminRoute.get("/fetchproduct/:id",productController.fetchProduct);
adminRoute.put("/updateproduct/:id",verifyAdmin,productController.updateProduct);


//==================PRODUCT LIST PAGE=========================
adminRoute.get("/getproducts",productController.gettingProducts)
adminRoute.get("/getdifferentcategory",productController.gettingCategoryForCard)
adminRoute.put("/listproduct/:id",verifyAdmin,productController.ListingProducts)
adminRoute.put("/unlistproduct/:id",verifyAdmin,productController.unListingProducts)
adminRoute.post("/add-product-offer",verifyAdmin,productController.addProductOffer)
adminRoute.post("/remove-product-offer",verifyAdmin,productController.removeProductOffer)

  //==================USERMANGMENT SIDE========================
  adminRoute.get("/fetchuserdata",userController.fetchUser)
  adminRoute.put("/listuser/:id",verifyAdmin,userController.listUser)
  adminRoute.put("/unlistuser/:id",verifyAdmin, userController.unlistUser)

  //===================UPDATE ORDER STATUS================
  adminRoute.patch("/change-status",verifyAdmin,orderController.updateOrderStatus)

  //==============LISTING CATEGORY IN THE FILTER BAR========
  adminRoute.get("/categories",categoryController.listCategoryForFiltering)

  //============LISTING ORDER IN THE ORDER LISTING PAGE========
  adminRoute.get("/retrieveorder",orderController.getOrderDetails)
  adminRoute.post("/cancelorder/:id",verifyAdmin, orderController.cancelProduct)
  adminRoute.post("/return-order",verifyAdmin,orderController.returnOrderRequest)
  adminRoute.get("/retrieve-chart-data",orderController.getOrderDetailsInChart)

  //========================COUPOUN MANAGMENT====================
  adminRoute.post("/create-coupon",coupounController.createCoupon)//TO CREATE A COUPOUN 
  adminRoute.get("/get-coupons",coupounController.getCoupons)//TO CREATE A COUPOUN 

  //========================SALES REPORT====================
  adminRoute.get("/retrieve-sale-report",orderController.getSalesDetails)//TO GET THE SALES REPORT
  adminRoute.post("/get-date-based-sales",orderController.gethDataBasedOnDate)//TO GET SALES BASED ON DATE

  //==================BEST SELLING PRODUCT CATEGORY=========

  adminRoute.get('/best-selling-product',productController.getBestSellingProducts ); // Route to get best-selling product
  adminRoute.get('/best-selling-categories',productController.getBestSellingCategories);

module.exports = adminRoute;
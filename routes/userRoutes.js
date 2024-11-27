const express = require("express");
const userRoute = express.Router();

const verifyAdmin = require( "../middleware/adminAuth")
const userController = require("../controller/user/userController")
const productController = require("../controller/user/productController")
const addressController = require("../controller/user/addressController")
const cartController = require("../controller/user/cartController")
const orderController = require("../controller/user/orderController")
const wishListController = require("../controller/user/wishListController")
const couponController = require('../controller/user/couponController')
const walletController = require("../controller/user/walletController")
const sizeExist = require("../middleware/sizeExist")
const userBlock = require('../middleware/userBlock');

//=================USERLOGIN AND SIGNUP=============
userRoute.post("/create",userController.signup );
userRoute.post("/otp",userController.sendotp);
userRoute.post("/resendotp",userController.resendOtp)
userRoute.post("/googlesignin",userController.googleSignIn);
userRoute.post("/login",userController.login);
userRoute.post("/googleLogin",userController.googleLogin)
userRoute.post("/password-forgot-otp",userController.createPasswordResetOTP)
userRoute.post("/verify-otp",userController.verifyPasswordResetOTP)
userRoute.post("/reset-password",userController.resetPassword)

//======================DATA TO BE DISPLAYED IN CARDS===========
userRoute.get("/getproduct/:id",productController.fetchProduct);
userRoute.get("/relatedproducts/:id",productController.relatedProducts);

//============================USERPROFILE========================
userRoute.get("/userdetails/:id",userController.retrieveUserData)//TO DISPLAY DETAILS IN USERPROFILE
userRoute.post("/update/:id",userController.updateUserData)//TO UPDATE THE USER DATA IN USER PROFILE

//==============================ADDRESS==========================
userRoute.post("/useraddress",verifyAdmin,addressController.createUserAddress)//CREATING NEW ADDRESS
userRoute.get("/fetchuseraddress/:id",addressController.fetchUserAddresses)//ADRESS TO DISPLAY IN ADREES PAGE
userRoute.get("/fetchadresstoedit/:id",verifyAdmin,addressController.editUserAddress)//ADRESS DATA TO EDIT 
userRoute.patch("/edituseraddress/:id",verifyAdmin,addressController.updateUserAddress)//ADDRESS UPDATING
userRoute.delete("/deleteAdress/:id",verifyAdmin,addressController.deleteUserAddress)//ADDRESS UPDATING

//==========================CART=================================
userRoute.post('/cartadd',verifyAdmin,userBlock.checkUserStatus,cartController.addItemToCart);//ADDING THE ITEMS TO CART IN DISAPLAYPRODUCT.JSX
userRoute.get("/cartdata/:id",cartController.getCartItems)//FETCHING THE DATA TO DISPLAY IN CART.JSX
userRoute.post("/incrementproduct",verifyAdmin,cartController.incrementProductCount)//INCREASING THE COUNT OF PRODUCT 
userRoute.post("/decrementproduct",verifyAdmin,cartController.decrementProductCount)//DECREASING THE COUNT OF PRODUCT 
userRoute.post("/checksizeexist",userBlock.checkUserStatus,cartController.checkSizeExist)//TO CHECK THE CART ITEM ALREADY IN CART PRODUCTDISPALY.JSX
userRoute.delete("/deleteCart",verifyAdmin,cartController.delteCartItem)//TO DELTE THE ITEM IN THE CART
userRoute.post("/check-cart-item-size",verifyAdmin,cartController.checkSizeInCartExists)//TO DELTE THE ITEM IN THE CART

//=============================CHECKOUT/ORDER==============================
//user address fetched using the route @line 21 addressController.fetchUserAddresses
userRoute.post("/checkout",verifyAdmin, userBlock.checkUserStatusIn,sizeExist.checkSizeInCartExists, orderController.submitCheckout)//WHWN USER PRESS PLACEORDER /SUBMIT DATA TO ORDER DB
userRoute.get("/retrieveorder/:id",orderController.getOrderDetails)//TO GET THE DETAILS OF ORDER IN ORDER.JSX
userRoute.get("/vieworder/:id",verifyAdmin,orderController.viewOrderDetails)//WHEN USER PRESS ORDER BUTTON IN OREDR.JSX
userRoute.post("/change-payment-status",verifyAdmin,orderController.changePaymentStatus)//WHEN USER PRESS PAY BUTTON IN VIEWORDER.JSX
userRoute.post("/return-order",verifyAdmin,orderController.returnOrderRequest)
userRoute.post("/size-check-in-payment",verifyAdmin, userBlock.checkUserStatusIn,sizeExist.checkSizeInCheckoutPaymentExists)

//=============================TO DISPLAY THE FILTERED PRODUCTS==============================
userRoute.post('/getFilteredProducts', productController.getFilteredProducts);//TO FILTER THE PRODUCTS TO DISPLAY IN SHOP

//=============================WISHLIST==============================
userRoute.post("/addtowishlist",wishListController.addToWishlist)//ADDING THE DATA TO WISHLISH DB
userRoute.get("/get-wishlist-data/:id",wishListController.gettingWishlistData)//FETCHING DATA IN WHISHLIST PAGE
userRoute.post("/delete-wishlist",wishListController.deleteWishlistItem)//DELTE THE PRODUCT IN WISHLIST

//============================APPLYING COUPOUN OFFER IN CHECKOUT========================
userRoute.post("/apply-coupoun",couponController.applyCoupounOffer)//APPLYING COPOUN OFFER ON CHEFCKOUT ITMES

//=======================================WALLET==========================================
userRoute.get("/get-wallet-data/:id",walletController.getWalletData)
userRoute.post("/add-wallet-fund",walletController.addFundInWallet)


module.exports = userRoute;
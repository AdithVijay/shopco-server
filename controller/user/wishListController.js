const Wishlist = require("../../models/wishlist");
const User = require("../../models/usersModel");
const ProductData = require("../../models/productModel");

//====================ADDING PRODUCT TO WISHLIST====================
const addToWishlist = async(req,res)=>{
    const {userId,id:productId} = req.body

    const usersWishlist = await Wishlist.findOne({user:userId})

    if(usersWishlist){
        const existingItem = usersWishlist.items.find((x)=>x.productId == productId)
        if(existingItem){
            return res.json({message:"Product already in the wishlist"})
        }else{
            const newItem = usersWishlist.items.push({productId})
            console.log(newItem);
            await usersWishlist.save()
            return res.json({message:"product added to wishlist"})
        }
    }

   
    if(!usersWishlist){
        const wishlist = await Wishlist.create({
            user: userId,
            items: [{ productId: productId }]
        });
        res.status(200).json({ message: "Product added to wishlist", wishlist });
    }
}

//====================GETTING DATA TO DISPLAY IN WISHLIST===================
const gettingWishlistData = async(req,res)=>{
    const {id} = req.params
    console.log(id)
    const wishlist = await Wishlist.findOne({user:id}).populate(["items.productId"])
    return res.json(wishlist)
}

//=====================TO DELTE THE DATA IN WISHLIST====================
const deleteWishlistItem = async(req,res)=>{ 
    const {productId,userId} = req.body;
    const wishlist = await Wishlist.findOne({ user:userId})
    console.log("======",wishlist);
    
    wishlist.items =  wishlist.items.filter((x)=>x.productId != productId)
    console.log(wishlist);
    await wishlist.save()
    return res.json(wishlist)
}

module.exports = {
    addToWishlist,
    gettingWishlistData,
    deleteWishlistItem
}
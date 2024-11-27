const Coupon = require("../../models/coupon");
const Cart = require("../../models/cart");

const applyCoupounOffer = async(req,res)=>{
    try {
        const {selectedCoupun,user,subtotal} = req.body

        const couponData = await Coupon.findOne({code:selectedCoupun})// coupoun data from db

        console.log("It copoun",couponData);
        

        if (!couponData) {
            return res.status(404).json({ message: 'Coupon not found or inactive.' });
        }

        const currentDate = new Date();
        const expirationDate = new Date(couponData.expirationDate);

        if (!couponData.isActive || currentDate > expirationDate) {
            return res.status(400).json({ message: 'Coupon has expired or is inactive.' });
        }

        if(subtotal < couponData.minPurchaseAmount){
            return res.json({message:"Coupoun cannot br applied"})//Chechking Money > MinPurchse amount
        }
        console.log(couponData);
        console.log(couponData.usageLimit);

        const totalUasge = couponData.userUsage.reduce((x,usage)=>usage + x.count,0) 

        if(totalUasge > couponData.usageLimit ){
            return res.json({ message: 'Coupon usage limit reached.' });//Chechking whether the coupoun reached its limti
        }
        console.log(user);
        
        const userUsage = couponData.userUsage.find((usage)=>usage.userId.toString() === user)
        console.log("this is the suserusaged",userUsage);
        

        if (userUsage && userUsage.count >= couponData.perPersonLimit) {
        return res.status(400).json({ message: "Coupoun Limit reached" });
        }
        
        if(userUsage){
            userUsage.count+=1
        }else{
            couponData.userUsage.push({ userId: user, count: 1 })
        }

         couponData.usageLimit -= 1 

        if(couponData.usageLimit==0){
            return res.status(400).json({ message: "Coupoun Not available" });
        }

        await couponData.save(); 

        const newSubtotal = subtotal - couponData.discountValue;

        return res.status(200).json({ newSubtotal, message: 'Coupon applied successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while applying the coupon.' });
    }    
}

module.exports = {
    applyCoupounOffer
}
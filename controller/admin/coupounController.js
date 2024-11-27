const Coupon = require("../../models/coupon");

//===================TO CREATE COUPOUN==================
const createCoupon = async (req, res) => {
  try {
    const {code,perPersonLimit,discountValue,
        minPurchaseAmount,expirationDate,usageLimit,description} = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    console.log(existingCoupon);
    
    if (existingCoupon) {
      return res.status(400).json({
        success: true,
        message: "Coupon code already exists",
      });
    }

    const newCoupon = await Coupon.create({code,perPersonLimit,
        discountValue,minPurchaseAmount,usageLimit,expirationDate,description});

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the coupon",
    });
  }
};

//===================TO GET COUPONS===================
const getCoupons = async(req,res)=>{
    const coupouns = await Coupon.find().sort({
      createdAt:-1})
    return res.json({coupouns})
}

module.exports = {
  createCoupon,
  getCoupons
};

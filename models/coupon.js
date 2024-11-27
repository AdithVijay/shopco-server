const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  description:{
    type: String,
    required: true,
    trim: true
  },
  discountValue: {
    type: Number,
    required: true,
    default: 0  
  },
  minPurchaseAmount:{
    type: Number,
    required: true,
  },
  usageLimit: {
    type: Number,
    required: true,
  },
  perPersonLimit:{
    type:Number,
    required:true
  },
  userUsage: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      count: { type: Number, default: 0 },
    },
  ],
  expirationDate: {
    type: Date,
    required: true  
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true  
  }
}, {
  timestamps: true 
});

const Coupon = mongoose.model('Coupon', couponSchema)
module.exports = Coupon


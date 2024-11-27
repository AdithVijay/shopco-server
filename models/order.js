const mongoose = require("mongoose")

const order_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order_id: {
    type: String,
  },
  order_items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0,
      },
      total_price: {
        type: Number,
        required: true,
      },
      return_request:{
        type:Boolean,
        default:false
      },
      return_active:{
        type:Boolean,
        default:false
      },
      return_message_dispaly:{
        type:Boolean,
        default:false
      },
      return_reason:{
        type:String,
      },
      dispalay_return_result:{
        type:Boolean,
        default:false
      }
    },
  ],
  order_status: {
    type: String,
    required: true,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled","Failed","Returned"]
 
  },
  total_amount: {
    type: Number,
    required: true,
    min: [0, "Total amount cannot be negative"],
  },
  shipping_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
    enum: [
      "RazorPay",
      "Wallet", 
      "Cash on delivery",
    ],
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
  },
  total_discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
    default: 0,
  },
  coupon_discount: {
    type: Number,
    default: 0,
  },
  shipping_fee: {
    type: Number,
    required: true,
    min: [0, "Shipping fee cannot be negative"],
  },
  total_price_with_discount: {
    type: Number,
    required: true,
  },
  placed_at: {
    type: Date,
    default: Date.now,
  },
  delivery_by: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }, 
});

order_schema.pre("save", function (next) {
  if (!this.delivery_by) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days after order placement
    this.delivery_by = deliveryDate;
  }
  next();
});
order_schema.pre("save", function (next) {
  if (!this.order_id) {
    const uniqueId = `STC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    this.order_id = uniqueId;
  }
  next();
});
order_schema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("order", order_schema);

module.exports =  Order;
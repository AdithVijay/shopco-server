const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      selectedSize: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'], // Only one selected size per item
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1, // Enforce minimum quantity of 1
      },
      price: {
        type: Number,
        required: true, // Price for a single item, required to calculate total price
      },
      totalItemPrice: {
        type: Number,
        required: true,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalCartPrice:{
    type:Number,
    default:0
  }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
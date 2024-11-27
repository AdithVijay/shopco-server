const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    offerPrice:{
      type:Number,
      default:0
    },
    offerIsActive:{
      type:Boolean,
      default:false
    }
  });

  const Category = mongoose.model("categorie", categorySchema);

  module.exports = Category
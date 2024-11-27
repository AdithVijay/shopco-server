const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: true,
  },
  // isPrimary: {
  //   type: Boolean,
  //   default: false,
  // },
});

const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;

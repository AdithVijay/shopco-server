const Address = require( "../../models/address")


// =====================CREATING THE NEW ADDRESSS=====================
const createUserAddress = async(req,res)=>{
    try {
        const { id: userId, newAddress } = req.body;
    if (!userId || !newAddress) {
        return res.status(400).json({ message: 'User ID and address data are required' });
      }
      const address = new Address({
        user: userId, // Associate the address with the user ID
        name: newAddress.name,
        phonenumber: newAddress.phonenumber, 
        address: newAddress.address,
        district: newAddress.district,
        state: newAddress.state,
        landmark: newAddress.landmark,
        pincode: newAddress.pincode,
      });

      await address.save();
      res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
        console.log(error);
    }
}
// =====================FETCHING THE  ADDRESSS TO DISPLAY IN FRONT PAGE=====================
const fetchUserAddresses = async(req,res)=>{
    try {
        const userId = req.params.id
            const address = await Address.find({ user: userId });
        if(!address){
            return res.status(404).json("jkbk found")
        }
        return res.status(200).json(address)   
    } catch (error) {
        console.log(error);
    }
}

// =======================================FINDING THE  ADDRESSS TO EDIT=======================
const editUserAddress = async(req,res)=>{
    try {
        const adrressId = req.params.id
        const address = await Address.find({ _id: adrressId }); 
    
        if(!address){
            return res.status(404).json("address not found")
        }
        return res.status(200).json(address)   
    } catch (error) {
        console.log(error);
    }
}

// =======================================FINDING THE  ADDRESSS TO EDIT=======================
const updateUserAddress = async(req,res)=>{
    const adrressId = req.params.id
    try {
        const {
            name,
            phonenumber,
            address,
            district,
            state,
            landmark,
            pinCode
          } = req.body.addressData; 
        
        console.log("request body",req.body);
        const addressData = await Address.findByIdAndUpdate(
            {_id:adrressId},
            {name,
            phonenumber,
            address,
            district,
            state,
            landmark,
            pincode:pinCode
            },{ new: true })
        console.log(addressData);
        return res.json({message:"update succesfull",addressData})   
    } catch (error) {
        console.log(error);
    }
}
// =======================================FINDING THE  ADDRESSS TO EDIT=======================
const deleteUserAddress = async (req,res)=>{
    const id = req.params.id
    try {
        const deletedAddress = await Address.findByIdAndDelete(id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
          }
          res.json({ message: 'Address deleted successfully', deletedAddress });
    } catch (error) {
        console.log(error);
    }
    
}

module.exports={
    fetchUserAddresses,
    createUserAddress,
    editUserAddress,
    updateUserAddress,
    deleteUserAddress
}
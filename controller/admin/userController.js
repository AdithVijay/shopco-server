const User = require( "../../models/usersModel");

// ===============================FETCHING USER DATA USM====================================

const fetchUser = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 4; // Default limit is 10 orders per page
        const skip = (page - 1) * limit; 

        const users = await User.find()
        .skip(skip)   
        .limit(limit)
        .sort({createdA:-1})

        const totalusers = await User.countDocuments();
        const totalPages = Math.ceil(totalusers / limit);

        if(!users){
            return res.status(404).json({success:false, message: "User data not found" })
        }else{
            return res.status(200).json({success:true,message:"User is being found ",  
            data: users, 
            currentPage: page,
            totalPages, })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

// ===============================LIST THE USER==========================================
const listUser = async(req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findByIdAndUpdate({_id:id},{isListed:true},{new:true})
        if(!user){
            res.status(404).json({success:false,message:"user not found"})
        }else{
            res.status(200).json({success:true,message:"user is listed "})
        }
    }catch(error){
        console.log("serever error",error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

// ===============================UNLIST THE USER==========================================
const unlistUser = async(req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findByIdAndUpdate({_id:id},{isListed:false},{new:true})
        if(!user){
            res.status(404).json({success:false,message:"user not found"})
        }else{
            res.status(200).json({success:true,message:"user is listed "})
        }
    }catch(error){
        console.log("serever error",error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

//============================GOOGLE SIGIN================================
const googleSignIn = async(req,res)=>{

    try{
      const { token } = req.body;
      console.log(token);
      
      const client = new OAuth2Client("968461199722-dm742j8g4qiv880kq96s9bcomg13vmfd.apps.googleusercontent.com");

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:"968461199722-dm742j8g4qiv880kq96s9bcomg13vmfd.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      console.log(payload);
      const { sub, email, name } = payload;

      let user = await User.findOne({ email });
      if(user){
        res.status(409).json({ message: "User already exists" });
    }
      if (!user) {
        // If the user doesn't exist, create a new user
        user = await User.create({
          googleId: sub, // Store Google user ID
          name: name,
          email: email,
        });
      }

      return res.status(200).json({
        success: true,
        message: "User signed in successfully with Google",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }catch(err){
      console.log("google signin error",err);
    }
}



module.exports={
    fetchUser,
    listUser,
    unlistUser,
    googleSignIn,
}
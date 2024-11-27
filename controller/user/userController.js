const OTP = require("../../models/otp")
const User = require("../../models/usersModel")
const otpGenerator = require("otp-generator");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const genarateAccesTocken = require('../../utils/genarateAccesTocken');
const genarateRefreshTocken = require('../../utils/genarateRefreshTocken');


//============================PASSWORD HASHING================================
const securePassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
    }
  };

//=================================SIGNUP===================================
const signup = async(req,res)=>{
    try{
        const {name,email,password,phonenumber,otp} = req.body
        const isEmailExists = await User.findOne({email})
        if(isEmailExists){
           return res.status(401).json({message: "email already exists"});
        }
                  // Find the most recent OTP for the email
          const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
          console.log("the response is",response)
          if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
              success: false,
              message: "The OTP is not valid",
            });

          } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
              success: false,
              message: "The OTP is not valid",
            });
          }
            const passwordhash =await securePassword(password)
            const user = await User.create({
                name:name,
                password:passwordhash,
                email:email,
                phoneNumber:phonenumber
            })
            genarateAccesTocken(res,user._id)
            genarateRefreshTocken(res,user._id)
            console.log(res.json);
            return res.status(200).json({ message: "User is registered", user });
    }catch(err){
        console.log("Err is msg:",err.message);

        return res.status(500).json({
          success: false,
          message : err.message
      })
    }
}

//=================================OTP SENDING================================
const sendotp = async (req, res) => {
	try {
		const { email } = req.body;
		console.log(email)
    
		const checkUserPresent = await User.findOne({ email });
		
		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			})
		}

		var otp = otpGenerator.generate(6,{
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };

		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		})
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

//=================================RESEND OTP================================
const resendOtp = async (req,res)=>{
    try {
      const {email} = req.body
      console.log(email)
      const checkuser = await User.findOne({email})

      // if(checkuser){
      //   return res.status(401).json({
      //     success: false,
      //     message: `User is Already Registered`,
      //   })
      // }
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await OTP.deleteMany({email})
      const otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload)

   

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        otp, // For testing purposes, you can remove this in production
      });
    } catch (error) {
        console.log(error);
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
      genarateAccesTocken(res,user._id)
      genarateRefreshTocken(res,user._id)

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

//=================================LOGIN================================
const login = async(req,res)=>{
    try{
      const {email,password}= req.body
      const user = await User.findOne({email})
  
      if(!user){
        res.status(401).json({message: "Invalid email or password"})
      }
  
      if (user?.isListed==false) {
        return res.status(403).json({ message: "Your account is blocked. Contact support." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if(user){
          if(isPasswordValid){
            genarateAccesTocken(res,user._id)
            genarateRefreshTocken(res,user._id)
            console.log(user);
          return res.status(200).json({
              message: "Login successful",
              id: user._id,
              name: user.name,
              email: user.email,
              isListed:user.isListed
            })
          }
      }else{
          return res.status(400).json({ message: "Invalid email or password" });
      }
  }catch(err){
      console.log(err);
  }
}

//=====================================GOOGLELOGIN================================
const googleLogin = async(req,res)=>{

    try {
      const { token } = req.body;
  
      const client = new OAuth2Client("968461199722-dm742j8g4qiv880kq96s9bcomg13vmfd.apps.googleusercontent.com");
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "968461199722-dm742j8g4qiv880kq96s9bcomg13vmfd.apps.googleusercontent.com", 
      });
  
      const { email, name } = ticket.getPayload(); 
  
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({
          name: name,
          email: email,
        });
        await user.save();
      }
      
      if (user?.isListed==false) {
        return res.status(403).json({ message: "Your account is blocked. Contact support." });
      }
      genarateAccesTocken(res,user._id)
      genarateRefreshTocken(res,user._id)
  
      res.status(200).json({
        success: true,
        message: "Google login successful",
        user: user,
    });
  
    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({
        message: 'Google sign-in failed',
        error: error.message,
      });
    }
  
  }

//=====================================CREATING OTP FOR PASSWORD RESET================================
const createPasswordResetOTP = async(req,res)=>{
  try {
		const { email } = req.body;
		console.log(email)
    
		const checkUserPresent = await User.findOne({ email });
		
		if (checkUserPresent) {
		var otp = otpGenerator.generate(6,{
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };

		const otpBody = await OTP.create(otpPayload);
    
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		})
    
  }else{
    return res.json({message: `Email doesnt exist`,})
  }
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
}

//=====================================CREATING OTP FOR PASSWORD RESET================================
const verifyPasswordResetOTP = async(req,res)=>{
  const {email,otp} = req.body
  const user = await User.find({email})
  const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  console.log("the response is",response)
  if (response.length === 0) {
    // OTP not found for the email
    return res.status(400).json({
      success: false,
      message: "The OTP is not valid",
    });

  } else if (otp !== response[0].otp) {
    // Invalid OTP
    return res.status(400).json({
      success: false,
      message: "The OTP is not valid",
    });
  }
  return res.json({message:"Otp is Verified",data:user})
}

//=====================================PASSWORD RESETING================================
const resetPassword = async(req,res)=>{
  try {
    const { id, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword =await securePassword(password)

    user.password = hashedPassword;
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "An error occurred while resetting the password. Please try again later." });
  }
}

//========================DATA DISPLAY IN USERPROFILE===================
  const retrieveUserData = async(req,res)=>{
    console.log(req.params.id);
    const id = req.params.id
    const user =await User.findById(id)
    return res.status(200).json(user)
}

//======================== UPDATE DATA IN USERPROFILE===================
 const updateUserData = async(req,res)=>{
   const id = req.params.id
    const{name,phoneNumber} = req.body
    console.log(name,phoneNumber);
    
    const updatedData = {
      name,phoneNumber:phoneNumber||''
    }
   const user = await User.findByIdAndUpdate(id,updatedData,{new:true})
   return res.json(user)
 }

module.exports={
    signup,
    sendotp,
    resendOtp,
    googleSignIn,
    login,
    googleLogin,
    retrieveUserData,
    createPasswordResetOTP,
    verifyPasswordResetOTP,
    resetPassword,
    updateUserData
}
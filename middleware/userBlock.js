const User = require("../models/usersModel");

const checkUserStatus = async (req, res, next) => {
  const { userId } = req.body
  console.log(userId);
    const user = await User.findById({_id:userId}); // Assuming you have the user ID in the JWT token
  console.log(user);
  
    
    // If user is not listed, block further access
    if (!user.isListed) {
      return res.status(403).json({ message: "Account is blocked. You cannot access this resource." });
    }
    next();
  };

  const checkUserStatusIn = async (req, res, next) => {
    const { user } = req.body

      const userData = await User.findById({_id:user}); // Assuming you have the user ID in the JWT token
    console.log(userData);
    
      
      // If user is not listed, block further access
      if (!userData.isListed) {
        return res.status(403).json({ message: "Account is blocked. You cannot access this resource." });
      }
      next();
    };

  module.exports = {checkUserStatus,checkUserStatusIn}
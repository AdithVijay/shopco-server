const jwt = require("jsonwebtoken");

function genarateRefreshTocken(res, admin) {
  const refreshToken = jwt.sign({ admin }, "1a541bcb39bf6fef8d8a339c51bca77fbe9a253981710564f955375044a1b8a12e1bce1140722ff24e2818cc195d52c734f098cab80fef9cf2b704faba77b319", {
    expiresIn: "90d", 
  });
  // print env

 
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // You may want to set this to true in production
    sameSite: "none",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });

  console.log("cookie created in rewfreessgs");
}

module.exports = genarateRefreshTocken;

const jwt = require("jsonwebtoken");

function genarateAccesTocken(res, admin) {
  const token = jwt.sign({ admin }, "9e665e03f0bf768fdf82277e91bac380274b738707701c6c2ad8b2fd4851273941171578a4512b29e649e4daabaaa801989cb30b0980f1ab3079c46b65f44537", {
    expiresIn: "1m",
  });
  // print env
  // console.log("Env->>>>",process.env.ACCESS_TOKEN_SECRET);
console.log("This is tockenm-->>.",token);
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  maxAge: 1 * 60 * 1000,
  });
  console.log("cookie created in asceesssss");
  
}



module.exports = genarateAccesTocken;

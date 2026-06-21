const JWT = require("jsonwebtoken");

const jwtSecret =  process.env.JWT_SECRET;

function createTokenForUser(user){
  const payload = {
    _id : user._id,
    email : user.email,
    profileImageURL : user.profileImgURL,
    role : user.role,
  };
  const token = JWT.sign( payload, jwtSecret, {
    expiresIn: "1h", // or "1h", "30d", etc.
    algorithm: "HS256",
  }); 
  return token;
}

function validateToken( token ){
  try {
    const payload = JWT.verify(token, jwtSecret, {
      algorithms: ["HS256"],
    });
    return payload;
  }catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token validation failed");
    }
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
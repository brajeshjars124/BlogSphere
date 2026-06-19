// require("dotenv").config();
const JWT = require("jsonwebtoken");

const jwtSecret =  process.env.JTW_SECRET;

function createTokenForUser(user){
  const payload = {
    _id : user._id,
    email : user.email,
    profileImageURL : user.profileImgURL,
    role : user.role,
  };
  const token = JWT.sign( payload, jwtSecret );
  // console.log(token);
  return token;
}

function validateToken( token ){
  const payload = JWT.verify( token, jwtSecret );
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
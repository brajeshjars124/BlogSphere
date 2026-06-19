const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
  return (req, res, next)=>{
    
    const authorizationHeaderValue = req.headers["authorization"];

    if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")){
      return next();
    }

    token = authorizationHeaderValue.split(" ")[1];
    console.log("Token from header", token);

    try{
      const userPayload = validateToken( token );
      req.user = userPayload;
    }catch(error){
      console.error("Error validating token:", error);
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
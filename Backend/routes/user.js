const {Router} = require('express');
const User = require('../models/user');
const router = Router();

router.post('/signin', async(req, res)=>{
  const {email, password} = req.body;
  try{
    const token = await User.matchPasswordAndGenerateToken( email, password );
    const user = await User.findOne({email}).select("-password -salt");

    return res.status(200).json({ success: true , user, token});

  }catch( error ){
    return res.status(401).json({ error: "Incorrect Email Or password" });
  }
});

router.post('/signup', async(req, res)=>{
  const {fullName, email, password} = req.body;
  try{
    await User.create({
    fullName,
    email,
    password,
  });
  return res.status(201).json({ message: "User created successfully" });
  }
  catch(error){
    return res.status(400).json({ error: "User already exists" });
  }
});

router.get('/signout', (req, res)=>{
  res.clearCookie("token").json({ message: "User signed out successfully" });
});

module.exports = router;
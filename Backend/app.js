require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require('./models/blog'); 
const User = require('./models/user');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');


const app = express();
const PORT = process.env.PORT;
 
mongoose
  .connect( process.env.MONGO_URL )
  .then((e) => console.log("Connected to MongoDB"));


app.use(cors({
  origin: process.env.FRONTEND_URL , // Your React Vite development server URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use('/public',express.static(path.join(__dirname, 'public')));


app.get('/', async (req, res) =>{
  const allBlogs = await Blog.find({});
  const user = await User.findById(req.user?._id);
  console.log("user", req.user);
  res.json({
    user: req.user,
    blogs: allBlogs
  });
});

app.use('/api/user',userRoute);
app.use('/api/blog',blogRoute);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`));
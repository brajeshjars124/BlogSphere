const Router = require("express");
const multer = require("multer");

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const Blog = require('../models/blog');
const Comment = require('../models/comment');
const User = require("../models/user");

const router = Router();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogify_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.get('/all', async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 }).populate('createdBy', 'fullName email');
    return res.status(200).json(allBlogs);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get('/:id', async (req, res) =>{
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy", 'fullName email');
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy").sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      blog: blog,
      comments: comments
    });
  }catch (error) {
    return res.status(404).json({error: "Blog post not found"});
  }
}); 

router.post('/comment/:blogId', async (req, res) =>{
  try{
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const blogExists = await Blog.findById(req.params.blogId);
    if (!blogExists) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    const populatedComment = await Comment.findById(newComment._id).populate("createdBy", 'fullName email');

    return res.status(201).json({
      success: true,
      message: "comment added successfully",
      comment: populatedComment
    });
  }catch(error){
    console.error("Comment creation error:", error.message);
    return res.status(500).json({error : "Failed to submit comment"});
  }
});

router.post('/add-new',  upload.single("coverImage"), async (req, res) =>{
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const {title, content} = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const blog = await Blog.create({
      title,
      content,
      coverImageURL: req.file.path, 
      createdBy: req.user._id,
    });
    return res.status(200).json({success: true, message: "succecssfully added new blog"});
});

module.exports = router;
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require('lodash');
const mongoose = require('mongoose');
const multer = require("multer")
const path = require("path");
const fs = require("fs")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Are Bhaiya Ka Kroge Jan Kar.";
const contactContent = "Haveli Aoo Kabhi";
// let posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected");
// });
const today = new Date();
const options ={
    "weekday":"long",
    "day":"numeric",
    "month":"long"
}
 const date = today.toLocaleDateString("en-US",options);

const postSchema = new mongoose.Schema({
  "title":String,
  "content":String,
  img:
  {
      data: Buffer,
      contentType: String
  },
  "created":{
    type:String,
    default:date
  }
})

const Post = mongoose.model("Post",postSchema);

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage }).single("image");
app.get('/', (req, res) => {
 Post.find((err,posts)=>{
    // const newPost=posts;
    // // console.log(newPost);
    if(err){
      console.log(err);
    }
    else{

      res.render("home", { para: homeStartingContent, posts: posts});
    }
  });
  
})
app.get("/about", (req, res) => {
  res.render("about", { para: aboutContent });
})

app.get("/contact", (req, res) => {
  res.render("contact", { para: contactContent })
})
app.get("/compose", (req, res) => {

  res.render("compose");
})
app.post("/compose", (req, res) => {
  // const post = {
  //   title: req.body.title,
  //   content: req.body.post
  // }
  // posts.push(post);
   upload(req,res,(err)=>{
     console.log(req.file.filename)
     const post=new Post({
      title:req.body.title,
      content:req.body.post,
      img:{
        data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)),
            contentType: 'image/png'
      }
      
    })
    // console.log(req.body.title,req.body.post)
    post.save();
    res.redirect("/")
   })
 
  

})
app.get("/posts/:id", (req, res) => {
  // const reqId = _.lowerCase(req.params.id);
  const reqId=req.params.id;
  // console.log(reqId);
  // posts.forEach((post) => {
  //   const storeTitle = _.lowerCase(post.title);
  //   const storecontent=post.content;

  //   if (reqId == storeTitle) {
  //     
  //   }
  // })
   Post.findById(reqId,(err,post)=>{
    //  console.log(post);
    //  console.log(post.title);
    //  console.log(post.content);
     res.render("post",{storeTitle:post.title,storecontent:post.content,image:post.img.data,contentType:post.img.contentType})
     
   })
})







app.listen(3000, function () {
  console.log("Server started on port 3000");
});

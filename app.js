//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Are Bhaiya Ka Kroge Jan Kar.";
const contactContent = "Haveli Aoo Kabhi";
let posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get('/', (req, res) => {
  res.render("home", { para: homeStartingContent, posts: posts});
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
  const post = {
    title: req.body.title,
    content: req.body.post
  }
  posts.push(post);
  res.redirect("/")

})
app.get("/posts/:id", (req, res) => {
  const reqId = _.lowerCase(req.params.id);

  posts.forEach((post) => {
    const storeTitle = _.lowerCase(post.title);
    const storecontent=post.content;

    if (reqId == storeTitle) {
      res.render("post",{storeTitle,storecontent})
    }
  })
})







app.listen(3000, function () {
  console.log("Server started on port 3000");
});

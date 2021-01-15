//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
//set view engine as ejs
app.set('view engine', 'ejs');
//use boday parser to tap into the POST form
app.use(bodyParser.urlencoded({
  extended: true
}));
//create a static folder for local files
app.use(express.static("public"));
//connect to mongoose database server
mongoose.connect("mongodb://localhost:27017/postsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
//create new schema for posts
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
//create new model for posts
const Posts = new mongoose.model("Post", postSchema);
// //save a test post to database
// const post1 = new Posts ({
//   title: "Test post",
//   content: "This is for testing purpose"
// })
// post1.save();
// // empty array of posts
// let posts = [];
// response to get request to root route  by rendering home page and passing homeStartingContent as startingContent & posts as posts.
app.get("/", function(req, res) {
  Posts.find({}, function(err, posts) {
    if (err) {
      console.log(err)
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      })
    }
  })
});
//response to get request to about route  by rendering  about page and passing aboutContent
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
//response to get request to contact route  by rendering  about page and passing contactContent
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});
//response to get request to compose route by rendering compose page
app.get("/compose", function(req, res) {
  res.render("compose");
});
//response to post request to compose route by redirecting to home after pushing post to posts
app.post("/compose", function(req, res) {
  const newPostTitle = req.body.postTitle;
  const newPostContent = req.body.postBody
  const newPost = new Posts({
    title: newPostTitle,
    content: newPostContent
  });
  newPost.save(function (err){
    if(!err){
      res.redirect("/");
    }
  });
});

//routing parameter for custom posts
app.get("/posts/:postId", function(req, res){
  const requestedId =_.capitalize(req.params.postId);
  Posts.find({}, function(err, posts) {
    if (err) {
      console.log(err)
    } else {
      posts.forEach(function(post) {
        const storedId = _.capitalize(post._id);
        if (storedId === requestedId){
          res.render("post", {
            title: post.title,
            content: post.content
          });
        }
      });
    }
  });
});
// listen to port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
//function to connectDatabase

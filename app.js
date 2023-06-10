//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let globalPosts = []
const port = 3000;
const externalPort = process.env.PORT
const app = express();
require('dotenv').config()
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+process.env.USER_ID+":"+process.env.USER_KEY+"@cluster84201.ho0wqte.mongodb.net/blogWebsiteDB")

const postSchema = {
    title:String,
    content:String
}

const Post = mongoose.model("Post", postSchema)

app.get("/" , async (req,res) => {
  globalPosts = await Post.find()
  res.render("home",{startingContent:homeStartingContent, globalPosts:globalPosts})

})

app.get("/about" ,(req,res) => {
  res.render("about", {about: aboutContent})
})

app.get("/contact", (req,res) =>{
  res.render("contact", {contact:contactContent})
})

app.get("/compose", (req,res) => {
  res.render("compose")
})

app.get("/posts/:topic", async (req,res) => {
  const  requestedTitle = _.lowerCase(req.params.topic)
  try{
    globalPosts = await Post.find()
    globalPosts.forEach( elementpost => {
      if(requestedTitle === _.lowerCase(elementpost.title)){
        console.log("Match found!")
        res.render("post", {
          title:elementpost.title,
          content:elementpost.content
        })
      }
      else{
        console.log("Match NOT found!")
      }
    })
  } catch(err){ console.log(err)}  
})
app.post("/compose", async (req,res) => {
  // console.log(req.body.button)
  const publish = {
    title:req.body.title,
    content:req.body.content
  }
  // globalPosts.push(publish)
  try{
    await Post.insertMany(publish)
  } catch(err){
    console.log(err);
  }
  res.redirect("/")

})


app.listen(externalPort || port ,()=> {
  console.log("server started on port " + process.env.PORT)
})

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path=require('path');
const mongoose=require('mongoose');
const port=3000;
const url='mongodb+srv://lokesh:loki9301@cluster0.tjrxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const _=require("lodash")



const app = express();

//posts
//const posts=[];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname+'/public')));


//connecting mongodb server

mongoose.connect(url);

//creating schema

const blogschema=mongoose.Schema({
title:{type:String,
unique:true,
},
post:String,
})

// creating mongoose model
const blog=mongoose.model("blog",blogschema);


//home page
app.get("/",async function(req,res){
  
let posts=await blog.find();
res.render('home',{
home:posts});
});

//compose page get
app.get("/compose",function(req,res){

  res.render('compose',{msg:"yes"});
});

//compose page post
app.post("/compose",function(req,res){
let post={title:req.body.title.trimEnd(),
post:req.body.post};
blog.insertMany([{
title:post["title"],
post:post["post"],
}],(err,result)=>{
  if(err) {console.log(err);res.render("compose",{msg:"title is already taken"});}
  else
  {
  console.log(post["title"]);
  res.redirect('/');
}});
//posts.push(post);

});

app.get("/post/:id",async function(req,res){

const id=req.params.id
//let post=posts.find(x => x.title===req.params.title);
console.log(" id",req.params.id);
let post=await blog.findById({_id:id},
);
console.log(post," title");
  if(post === undefined){
    res.redirect('/');
  }
  else
  {
    console.log(post.post);
    let title=post.title;
    post=post.post;
    post = post.replace(/\r?\n|\r/g, "<br />");
  res.render('post',{title:title,post:post});
}});

app.listen(port,function(){
  console.log("started at "+port);
});

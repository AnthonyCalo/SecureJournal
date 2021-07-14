//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}))
//required to use passport
app.use(passport.initialize());
app.use(passport.session());

//connectint to 2 different mongo databases. One will be used to store journal entries and the other to sign in
var conn = mongoose.createConnection('mongodb://localhost:27017/blogDB',  { useUnifiedTopology: true, useNewUrlParser: true });
var conn2 = mongoose.createConnection('mongodb://localhost:27017/blogSignDB',  { useUnifiedTopology: true, useNewUrlParser: true });
conn.set("useCreateIndex", true);

const signinSchema= new mongoose.Schema({
  username: String,
  password: String
})
const blogSchema = {
  title: String,
  post: String
};

signinSchema.plugin(passportLocalMongoose);


const blogPosts = conn.model("blogPosts", blogSchema);
const User = conn2.model("sign-in", signinSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//displays all journal entries to read journal
app.get('/entries', function(req, res){
  //console.log(posts);
  blogPosts.find({}, function(err, blogs){
    if(err){
      console.log(err);
    }else{
      //console.log(blogs);
      res.render("entriesPage", {
         posts: blogs
        });
    }
  })
  
})

app.get('/', function(req, res){
  if (req.isAuthenticated()){
    res.render("homepage");
  }else{
    res.redirect("/login")
  }
})

app.get('/contact', function(req, res){
  res.render("contact", {"contactContent": contactContent});

})
//COMMENTING THIS OUT!!
//Will allow others to access your journal just by registering a new user
//USE ONCE to set up your account

// app.route('/register')
//   .get(function(req, res){
//     res.render("register");
//   })
//   .post(function(req, res){
//     var username = req.body.username;
//     var password = req.body.password;
//     User.register({username: username}, password, function(err){ 
//       if(err){
//         console.log(err);
//         res.redirect("/register")
//       }else{
//         passport.authenticate("local")(req, res, function(){
//           res.redirect("/")
//         })
//       }
//     })
//   })

app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res){
    //IN LOGIN PAGE I HAVE USER INPUT HIDDEN. 
    //THIS ALLOWS ME TO NOT HAVE TO TYPE IN MY USERNAME SINCE I SHOULD BE THE ONLY USER ACCESSING MY JOURNAL
    //for you put value in username of login page to your username
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    //req.login comes from passport
    req.login(user, function(err){
      if(err){
        console.log(err);
      }else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/");
        })
      }
    })
  })

  app.get("/logout", function(req, res){
    //all thats needed to logout is .logout method from passport
    req.logout();
    res.redirect("/login");
})

app.get('/compose', function(req, res){
  //checks if user is logged in. This is thanks to passport and sessions
  if(req.isAuthenticated()){
    res.render("compose");
  }else{
    res.redirect("/login");
  }
})
app.post('/compose', function(req, res){
  //gets the body and title
  let composedTitle =  req.body.postTitle;
  let composedPost = req.body.postBody;
  //Mongo saves ',' as new lines so this way it will display each post as new line when you press enter
  //useful if writing multiple paragraphs that you want to seperate and space out
  let composedPost2 = composedPost.replace(/\r\n/g, ',')

  const blogpost = new blogPosts({
    title: composedTitle,
    post: composedPost
  })
  blogpost.save();

  res.redirect('/');
})

app.get("/posts/:postName", function(req,res){
  if(req.isAuthenticated()){
    const requestTitle = req.params.postName;
    const postsList = posts;
    console.log(requestTitle);


    blogPosts.findOne({title: requestTitle}, function(err, blog){
      if(!err){

        res.render("post", {postTitle: blog.title, postBody: blog.post});
      }else{
        console.log("not a post");
        res.send("Not a post");
      }
    });
  }else{
    res.redirect('/login');
  }

 
  

 

  
  
  


})











app.listen(3000, function() {
  console.log("Server started on port 3000"); 
});

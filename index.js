const express = require("express");
const cors = require("cors");
require("./database/config");
const User = require("./database/User");
const Products = require("./database/products");
const Jwt = require("jsonwebtoken");
const jwtkey = "e-comm";
const app = express();


app.use(cors());
app.use(express.json());

// post methode for signup user ------------->
app.post("/signup", async (req, res) => {
  let userData = new User(req.body);
  let newUser = await userData.save();
  if(newUser){
    // genrating jwt token ------->
    Jwt.sign({newUser}, jwtkey, {expiresIn: "2h"}, (err, token)=>{
      if(err) {
        res.send({result : "somting went wrong, Please try again"})
      }
      else {
        newUser = newUser.toObject();
        delete newUser.password;
        res.send({newUser, token});
    }
    })
  }
  
});

// post methode for login user ------>
app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password"); // for hiding password
    if (user){
      // genrating jwt token ------->
      Jwt.sign({user}, jwtkey, {expiresIn: "2h"}, (err, token)=>{
        if(err) res.send({result : "somthing went wrong, please try again"});
        else res.send({user, token});
      })
    }
    else res.send("user not found");
  } else {
    res.send("user not found");
  }
});

// get methode for getting bestseller products from database (verifying token) ------->
app.get("/bestseller", verifyToken, async (req, res) => {
  const result = await Products.find();
  res.send(result)
});

// put methode for upddate user -------------------->
app.put("/updateuser/:_id", async (req, res) => {
  const updatedUser = await User.updateOne(
    req.params,
    {
      $set: req.body
    }
  )
  res.send(updatedUser) 
});

// getmethode for searching data from database (verifying token) ----------->
app.get("/search/:key", verifyToken, async (req, res) => {
  const result = await Products.find({
    "$or" : [
      {title : {$regex: req.params.key}},
      {brand : {$regex: req.params.key}},
      {model : {$regex: req.params.key}},
      {category : {$regex: req.params.key}}
    ]
  });
  res.send(result)
});


// function of verify token --------------------------->
function verifyToken(req, res, next){
  let token = req.headers["authorization"];  
  if (token){
    Jwt.verify(token, jwtkey, (err, valid)=>{
      if(err){
        res.status(401).send({result : "please provide valid token"});
      }else{
        next();
      }
    })
  }else{
    res.status(403).send({result : "please add token with header"});
  }
}
app.listen(5000);

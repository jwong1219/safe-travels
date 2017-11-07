var db = require("../models");
var express = require("express");
var bcrypt = require("bcrypt");
const saltRounds = 10;

var router = express.Router();

//this router is on the root "/users"

router.post("/login", function(req, res) { 
  //run a query against the database for the username or password provided
  //console.log("logging the request data");
  //console.log(req.query);

  db.User.findOne({
    where : {
      userName : req.body.userName
    }
  }).then(function(dbUser) {
    //if the user doesnt exist in the db
    if (!dbUser) {
      res.json({
        validation : "user name does not exist"
      }); 
    } 
    //else check if the password matches db
    else {
      bcrypt.compare(req.body.password, dbUser.password, function(error, response) {
        console.log({dbUser});
        console.log(dbUser.dataValues.id);
        if (response) {
          res.json({
            validation : "user name and passwords match!",
            userId: dbUser.dataValues.id,
          });
        } else {
          res.json({validation : "passwords DO NOT match!"});
        }
      });
    } 
  });    
}); 

router.post("/", function(req, res) {
  console.log(req.body);
  //go through a series of account info validations and send the response back to client if any issue(s)
  var isPasswordUnique;
  var isUserNameUnique;
  var isEmailUnique;
  //var arePasswordsEqual;

  //run a query to check if the user already exists in the database
  db.User.findOne({
    where : {
      $or : {
        userName : req.body.UserName,
        // password : req.body.password,
        email : req.body.email
      } 
    }
  }).then(function(dbUser) {
    //console.log(dbUser);

    //if there is no data in the db
    if (!dbUser) {
      console.log("new user added to account!");
      // var hashPassword = passHash(req.body.password);
      // console.log("this is hash 2" + hashPassword)
      //go ahead and insert new account into database
    
       bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log("this the hash : " + hash);

        db.User.create({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email: req.body.email,
        userName: req.body.userName,
        password: hash //eq.body.password
        // passwordHash : hash,
        }).then(function(result){
        //just send the same response as in the above if in order for the client-side validation logic to work
          res.json({
            outcome : "success", 
            user : result
          });
        });
      });
    } 
    //else it means there is data, and need to respond with an object
    else if (dbUser) {
      console.log("the account info already exists in the db!")
      console.log(dbUser);
      res.json(dbUser);
    }
  }); //end of findOne method
}); //end of post /users/

router.post("/:id/hotels", function(req, res) {
  console.log(req.body);
  if(req.body.rating) {
    db.Hotel.create({
      name: req.body.name,
      rating: req.body.rating,
      city: req.body.city,
      UserId: req.params.id,
    }).then(function(result) {
      res.json(result);
    })
  }
  else {
    db.Hotel.create({
      name: req.body.name,
      city: req.body.city,
      UserId: req.params.id,
    }).then(function(result) {
      res.json(result);
    })
  }
})

//needs to be rerouted and needs to grab user account info from the db **JW
router.get("/:id/manage", function(req, res) {

  res.render("accountManagement");
});

module.exports = router;
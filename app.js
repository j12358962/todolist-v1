//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){
  var today = new Date();
  var currentDay = today.getDate();

  if ( currentDay === 6 || currentDay === 0){
    res.send("<h1>Yeah</h1>");
  } else {
    res.send("<h1>Boo</h1>");
  }
});



app.listen(8888, function(){
  console.log("Server started on port 8888");
});

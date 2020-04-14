//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');
const app = express();

console.log(date);

const items = [];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

app.get("/about", function(req, res){
  res.render('about');
});

app.get("/", function(req, res) {

  const day = date.getDay();

  res.render('list', {
    listTitle: day,
    newListItem: items
  });

});

app.post("/", function(req, res) {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work",
    newListItem: workItems
  });
});

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(process.env.PORT || 8888, function() {
  console.log("Server started on port 8888");
});

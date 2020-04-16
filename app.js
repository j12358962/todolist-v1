//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const lodash = require('lodash');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};
const Item = mongoose.model('Item', itemsSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// default items
const item1 = new Item({
  name: "Welcome to your todolist"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<--Hit this to delete an item"
});

const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




//about
app.get("/about", function(req, res) {
  res.render('about');
});


//home
app.get("/", function(req, res) {

  const day = date.getDay();
  //query items
  Item.find({}, function(err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          mongoose.connection.close();
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {
        listTitle: "Today",
        newListItems: results
      });
    }
    results.forEach(function(result) {
      console.log(result);
    });


  });
});

app.post("/", function(req, res) {
  const item = new Item({
    name: req.body.newItem
  });
  const listName = req.body.list;
  item.save();

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function(req, res) {
  const id = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(id, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: id
        }
      }
    }, function(err, results) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/" + listName);
      }
    });
  }

});

app.get("/:customListName", function(req, res) {
  const customListName = lodash.capitalize(req.params.customListName);

  let flag = false;
  List.findOne({
    name: customListName
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();

        res.redirect("/" + customListName);
      } else {

        res.render("list", {
          listTitle: result.name,
          newListItems: result.items
        });

      }
    }
  })

});

app.post("/work", function(req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(process.env.PORT || 8888, function() {
  console.log("Server started on port 8888");
});

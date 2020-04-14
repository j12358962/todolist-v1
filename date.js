//jshint esversion:6

exports.getDate = function () {
  var today = new Date();
  var day = "";

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  return today.toLocaleDateString("en-us", options);
}


exports.getDay = function() {
  let today = new Date();

  let options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-us", options);
}

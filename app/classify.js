/*==================== REQUIRE DEPENDENCIES ====================*/
var natural = require('natural');
var db = require('../db/config');

/*=============== SET UP CLASSIFY HELPER FUNCTION ===============*/
var blackBox = function(description, imgUrl, callback){
  console.log(description, imgUrl);
  var classification;
  //load classifying data from json object
  natural.BayesClassifier.load('./app/classifier.json', null, function(err, classifier) {
    //classify based on returned description
    classification = classifier.classify(description.name);
    //create database entry for item
    db.db.sync().then(function() {
      return db.Item.create({
        category: classification,
        description: description.name,
        url: imgUrl
      })
      .then(function(newItem){
        //perform callback using the newly classified category
        callback(newItem.get('category'));
      });
    });
  });
}

/*====================== EXPORT MODULE ======================*/
module.exports = blackBox;
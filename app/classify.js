var natural = require('natural');
var db = require('../db/config');

var blackBox = function(description, imgUrl, callback){
  var classification;

  natural.BayesClassifier.load('./app/classifier.json', null, function(err, classifier) {
    classification = classifier.classify(description.name);

    db.db.sync().then(function() {
      return db.Item.create({
        category: classification,
        description: description.name,
        url: imgUrl
      })
      .then(function(newItem){
        callback(newItem.get('category'));
      });
    });
  });
}

module.exports = blackBox;
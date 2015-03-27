/*==================== REQUIRE DEPENDENCIES ====================*/
var expect   = require('chai').expect,
    request  = require('request'),
    blackBox = require('../app/classify.js'),
    pg       = require('pg'),
    db       = require('../db/config.js');

/*==================== TEST SERVER CONNECTION ====================*/
describe('Persistent Sifter Server', function(){
  var requestWithSession = request.defaults({jar: true});

  it('Can receive requests and return responses from the server', function(done){
    var options = {
      'method': 'GET',
      'followAllRedirects': true,
      'uri': 'http://localhost:8080/api/test'
    };

    requestWithSession(options, function(error, res, body){
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.equal('SUCCESS!');
      done();
    });
  });
});

/*========================= TEST DATABASE =========================*/
describe('Postgres DB', function(){
  var requestWithSession = request.defaults({jar: true});
  var options = {
    'method': 'GET',
    'followAllRedirects': true,
    'uri': 'http://localhost:8080/api/stats'
  };
  //clear DB before each test
  beforeEach(function(done){
    db.db.sync().then(function(){
      db.db.query("TRUNCATE items").then(function(){ done(); });
    });
  });

  it('Returns an object storing arrays of item counts', function(done){
    requestWithSession(options, function(error, res, body){
      var obj = JSON.parse(res.body);
      expect(res.statusCode).to.equal(200);
      expect(typeof obj).to.equal('object');
      expect(Array.isArray(obj.recycle)).to.equal(true);
      expect(Array.isArray(obj.compost)).to.equal(true);
      expect(Array.isArray(obj.landfill)).to.equal(true);
      done();
    });
  });

  it('Returns counts of items added by day', function(done){
    db.db.sync().then(function(){
      db.Item.create({
        category: 'recycle',
        description: 'midnight blue wool tuxedo',
        url: 'http://www.test.com'
      }).then(function(){
        requestWithSession(options, function(error, res, body){
          var obj = JSON.parse(res.body);
          expect(res.statusCode).to.equal(200);
          expect(obj.recycle[6]).to.equal(1);
          expect(obj.totalRecycle).to.equal(1);
          done();
        });
      });
    });
  });
});

/*====================== TEST CLASSIFICATION ======================*/
describe('Item Classifier', function(){
  //initialize variables for each category
  var recycle = {
  	    description: { name: 'plastic bottle'},
        url: 'http://recycle.com' },
      compost = {
      	description: { name: 'paper plate'},
        url: 'http://compost.com'},
      landFill =  {
      	description: { name: 'metal cup'},
        url: 'http://landfill.com'};
  //clear DB before each test
  beforeEach(function(done){
    db.db.sync().then(function(){
      db.db.query("TRUNCATE items").then(function(){ done(); });
    });
  });

  it('Saves classified item to the database', function(done){
    //set callback function
    var getEntry = function(){
      db.Item.find({where: {url: 'http://www.test.com' }}).then(function(item) {
      	expect(item.dataValues.category).to.equal('recycle');
      	expect(item.dataValues.description).to.equal(string.name);
      	expect(item.dataValues.url).to.equal('http://www.test.com');
      	done();
      });
    };
    //initialize object for description
    var string = {};
    string.name = 'midnight blue wool tuxedo';
    //classify mock data and test
    blackBox(string, 'http://www.test.com', getEntry);
  });

  it('Classifies recyclable items based on description', function(done){
  	var classified;
    //set callback function
  	var setClassified = function(category){
  		classified = category;
  		expect(classified).to.equal('recycle');
  		done();
  	};
    //classify mock data and test
    blackBox(recycle.description, recycle.url, setClassified);
  });

  it('Classifies compostable items based on description', function(done){
  	var classified;
    //set callback function
  	var setClassified = function(category){
  		classified = category;
  		expect(classified).to.equal('compost');
  		done();
  	};
    //classify mock data and test
    blackBox(compost.description, compost.url, setClassified);
  });

  it('Classifies landfill items based on description', function(done){
  	var classified;
    //set callback function
  	var setClassified = function(category){
  		classified = category;
  		expect(classified).to.equal('landfill');
  		db.db.query('TRUNCATE items');
  		done();
  	};
    //classify mock data and test
    blackBox(landFill.description, landFill.url, setClassified);
  });
});
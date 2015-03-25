var expect   = require('chai').expect,
    request  = require('request'),
    blackBox = require('../app/classify.js'),
    pg       = require('pg'),
    db       = require('../db/config.js');

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

describe('Item Classifier', function(){

	var recycle  =  { description: { name: 'plastic bottle'},
                    url: 'http://recycle.com' },
		  compost  =  { description: { name: 'paper plate'},
		                url: 'http://compost.com'},
		  landFill =  { description: { name: 'metal cup'},
		                url: 'http://landfill.com'};

	beforeEach(function(done){
		db.db.query("TRUNCATE items").then(function(){ done(); });;
	});

  it('Saves classified item to the database', function(done){
  	var getEntry = function(){
  		db.Item.find({where: {url: 'http://www.test.com' }}).then(function(item) {
  			expect(item.dataValues.category).to.equal('recycle');
  			expect(item.dataValues.description).to.equal(string.name);
  			expect(item.dataValues.url).to.equal('http://www.test.com');
  			done();
			});
  	};

  	var string = {};
  	string.name = 'midnight blue wool tuxedo';
  	blackBox(string, 'http://www.test.com', getEntry);
  });

	it('Classifies recyclable items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('recycle');
			done();
		};

		blackBox(recycle.description, recycle.url, setClassified);
	});

	it('Classifies compostable items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('compost');
			done();
		};

		blackBox(compost.description, compost.url, setClassified);
	});

	it('Classifies landfill items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('landfill');
			db.db.query('TRUNCATE items');
			done();
		};

		blackBox(landFill.description, landFill.url, setClassified);
	});
});
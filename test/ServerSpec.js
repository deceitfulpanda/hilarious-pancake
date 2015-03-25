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

	it('Will classify recyclable items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('recycle');
			done();
		};

		blackBox(recycle.description, recycle.url, setClassified);
	});

	it('Will classify compostable items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('compost');
			done();
		};

		blackBox(compost.description, compost.url, setClassified);
	});

	it('Will classify landfill items based on description', function(done){
		var classified;

		var setClassified = function(category){
			classified = category;
			expect(classified).to.equal('landfill');
			done();
		};

		blackBox(landFill.description, landFill.url, setClassified);
	});
});
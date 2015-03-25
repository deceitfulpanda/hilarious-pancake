var expect  = require('chai').expect,
    request = require('request'),
    pg      = require('pg'),
    db      = require('../db/config.js');

describe("Persistent Sifter Server", function(){
	var requestWithSession = request.defaults({jar: true});
	it('Can receive requests and return responses from the server', function(done){
		var options = {
      'method': 'GET',
      'followAllRedirects': true,
      'uri': 'http://localhost:8080/api/test'
     };

    requestWithSession(options, function(error, res, body){
    	expect(res.statusCode).to.equal(200);
			done();
    });
	});
});
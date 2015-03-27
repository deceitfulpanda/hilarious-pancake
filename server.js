/*==================== REQUIRE DEPENDENCIES ====================*/
var express = require('express');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var blackBox = require('./app/classify.js');
var itemController = require('./app/controller.js');
var app = express();

/*================= INITIALIZE EXPRESS MODULES =================*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*========================= ALLOW CORS =========================*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*================= INITIALIZE HELPER FUNCTIONS =================*/
var getReq = function(token, imgurl, callback){
  unirest.get("https://camfind.p.mashape.com/image_responses/" + token)
    .header("X-Mashape-Key", process.env.CAMFIND_KEY)
    .header("Accept", "application/json")
    .end(function (result) {
      if(result.body.status === 'completed'){
        callback(result.body, imgurl)
      } else {
        getReq(token, imgurl, callback);
      }
  });
};

/*===================== SET EXPRESS ROUTES =====================*/
app.get('/api/test', function(req, res){
  res.status(200).send('SUCCESS!');
});

app.get('/api/stats', itemController.getItems);

app.get('/api/mock', itemController.mockData);

app.post('/api/imgurl', function(req, res){
  console.log('posting');
  unirest.post("https://camfind.p.mashape.com/image_requests")
    .header("X-Mashape-Key", process.env.CAMFIND_KEY)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .header("Accept", "application/json")
    .send({
      "image_request[locale]": req.body.locale,
      "image_request[remote_image_url]": req.body.imgurl
    })
    .end(function (result) {
      getReq(result.body.token, req.body.imgurl, function(resultBody, imgURL){
        blackBox(resultBody, imgURL, function(classification){
          res.status(200).send({classification: classification, description: resultBody});
        });
      });
    });
});

/*==================== SET PORT FOR EXPRESS ====================*/
var port = process.env.PORT || 8080;

/*=================== EXPRESS LISTEN ON PORT ===================*/
app.listen(port);
console.log('listening on port: ' + port );
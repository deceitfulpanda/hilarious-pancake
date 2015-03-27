/*==================== REQUIRE DEPENDENCIES ====================*/
var db = require('../db/config');

var Data = function(cat, desc, url){
	this.category = cat;
	this.description = desc;
	this.url = url;
}

var rec = {};
rec[0] = new Data('recycle', 'midnight blue wool tuxedo', 'http://pandasiftertest.com');
rec[1] = new Data('recycle', 'black wool tuxedo', 'http://pandasiftertest.com');
rec[2] = new Data('recycle', 'gray wool tuxedo', 'http://pandasiftertest.com');
rec[3] = new Data('recycle', 'blue wool tuxedo', 'http://pandasiftertest.com');
rec[4] = new Data('recycle', 'red wool tuxedo', 'http://pandasiftertest.com');
rec[5] = new Data('recycle', 'green wool tuxedo', 'http://pandasiftertest.com');
rec[6] = new Data('recycle', 'purple wool tuxedo', 'http://pandasiftertest.com');
rec[7] = new Data('recycle', 'pink wool tuxedo', 'http://pandasiftertest.com');
rec[8] = new Data('recycle', 'white wool tuxedo', 'http://pandasiftertest.com');
rec[9] = new Data('recycle', 'orange wool tuxedo', 'http://pandasiftertest.com');

var comp = {};
comp[0] = new Data('compost', 'red paper plate', 'http://pandasiftertest.com');
comp[1] = new Data('compost', 'green paper plate', 'http://pandasiftertest.com');
comp[2] = new Data('compost', 'blue paper plate', 'http://pandasiftertest.com');
comp[3] = new Data('compost', 'black paper plate', 'http://pandasiftertest.com');
comp[4] = new Data('compost', 'white paper plate', 'http://pandasiftertest.com');
comp[5] = new Data('compost', 'yellow paper plate', 'http://pandasiftertest.com');
comp[6] = new Data('compost', 'orange paper plate', 'http://pandasiftertest.com');
comp[7] = new Data('compost', 'purple paper plate', 'http://pandasiftertest.com');
comp[8] = new Data('compost', 'gray paper plate', 'http://pandasiftertest.com');
comp[9] = new Data('compost', 'sky blue paper plate', 'http://pandasiftertest.com');

var land = {};
land[0] = new Data('landfill', 'red metal cup', 'http://pandasiftertest.com');
land[1] = new Data('landfill', 'black metal cup', 'http://pandasiftertest.com');
land[2] = new Data('landfill', 'white metal cup', 'http://pandasiftertest.com');
land[3] = new Data('landfill', 'gray metal cup', 'http://pandasiftertest.com');
land[4] = new Data('landfill', 'silver metal cup', 'http://pandasiftertest.com');
land[5] = new Data('landfill', 'gold metal cup', 'http://pandasiftertest.com');
land[6] = new Data('landfill', 'blue metal cup', 'http://pandasiftertest.com');
land[7] = new Data('landfill', 'green metal cup', 'http://pandasiftertest.com');
land[8] = new Data('landfill', 'purple metal cup', 'http://pandasiftertest.com');
land[9] = new Data('landfill', 'orange metal cup', 'http://pandasiftertest.com');

module.exports = {
	getItems: function(req, res){
		var now = new Date();
		var past = new Date();
		past.setDate(now.getDate() - 7);

		db.db.sync().then(function(){
			db.Item.findAll().then(function(items){
				var result = {};
				result.recycle = [1,2,3,4,5,6,7];
				result.compost = [7,6,5,4,3,2,1];
				result.landfill = [4,0,4,0,4,0,0];
				result.totalRecycle = 1;
				result.totalCompost = 5;
				result.totalLandfill = 9;

				for (var i = 0; i < items.length; i++){
					var item = items[i].dataValues;
					if (item.date > past){
						var time = 6 - ( Math.floor( (now.getTime() - item.date.getTime())/86400000 ) );
						if (item.category === 'recycle'){
							result.recycle[time]++;
							result.totalRecycle++;
						} else if (item.category === 'compost'){
							result.compost[time]++;
							result.totalCompost++;
						} else if (item.category === 'landpost'){
							result.landfill[time]++;
							result.totalLandfill++;
						}
					}
				}
				res.status(200).send(result);
			});
		});
	},

	mockData: function(req, res){
		db.db.sync().then(function(){
			for (var i = 0; i < 10; i++){
				db.Item.create(rec[i]);
			}
			for (var i = 0; i < 10; i++){
				db.Item.create(comp[i]);
			}
			for (var i = 0; i < 10; i++){
				db.Item.create(land[i]);
			}
			res.status(200).send('hi!');
		});
	}
};
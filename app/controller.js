/*==================== REQUIRE DEPENDENCIES ====================*/
var db = require('../db/config');

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
	}

};
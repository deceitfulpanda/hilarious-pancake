///////////////
// SEQUELIZE //
///////////////

/*==================== REQUIRE DEPENDENCIES ====================*/
var Sequelize = require('sequelize');

/*==================== SET UP DB CONNECTION ====================*/
var url = process.env.DATABASE_URL || 'postgres://postgres:hello@localhost:5432/postgres';
// var match = url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
var port = process.env.DATABASE_PORT || 5432;
var host = process.env.DATABASE_HOST || 'localhost';

var sequelize = new Sequelize(url, {
  dialect: 'postgres',
  protocol: 'postgres',
  port: port,
  host: host,
  logging: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

/*================== SET UP SEQUELIZE MODELS ==================*/
var Item = sequelize.define('item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: Sequelize.STRING,
  description: Sequelize.STRING,
  url: Sequelize.STRING,
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

/*===================== EXPORT MODULES =====================*/
exports.db = sequelize;
exports.Item = Item;
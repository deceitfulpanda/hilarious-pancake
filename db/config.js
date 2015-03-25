///////////////
// SEQUELIZE //
///////////////

var Sequelize = require('sequelize');
var url = process.env.DATABASE_URL || 'postgres://postgres:hello@localhost:5432/postgres';
var match = url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
var sequelize = new Sequelize(url, {
  dialect: 'postgres',
  protocol: 'postgres',
  port: match[4],
  host: match[3],
  logging: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

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

exports.db = sequelize;
exports.Item = Item;
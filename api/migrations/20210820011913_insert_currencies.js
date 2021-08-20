const fs = require('fs');

exports.up = function (knex) {
  const sql = fs.readFileSync('./migrations/02_insert_currencies.sql').toString();

  return knex.raw(sql);
};

exports.down = function (knex) {
  return knex.raw('TRUNCATE currency;');
};

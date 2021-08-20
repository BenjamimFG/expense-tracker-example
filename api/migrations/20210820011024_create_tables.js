const fs = require('fs');

exports.up = function (knex) {
  const sql = fs.readFileSync('./migrations/01_create_tables.sql').toString();

  return knex.raw(sql);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE app_user;
    DROP TABLE currency;
    DROP TABLE wallet;
    DROP TABLE user_alert_transactions;
    DROP TABLE user_alert_funds;
    DROP TABLE category;
    DROP TABLE tag;
    DROP TABLE app_transaction;
    DROP TABLE transaction_tags;
  `);
};

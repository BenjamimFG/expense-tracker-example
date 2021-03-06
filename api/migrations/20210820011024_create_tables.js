const fs = require('fs');

exports.up = function (knex) {
  const sql = fs.readFileSync('./migrations/01_create_tables.sql').toString();

  return knex.raw(sql);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE transaction_tags;
    DROP TABLE app_transaction;
    DROP TABLE tag;
    DROP TABLE user_alert_funds;
    DROP TABLE user_alert_transactions;
    DROP TABLE wallet;
    DROP TABLE app_user;
    DROP TABLE currency;
  `);
};

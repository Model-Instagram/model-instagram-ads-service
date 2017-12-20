const knex = require('knex')({
  client: 'postgresql',
  connection: process.env.PG_CONNECTION_STRING || {
    host: 'localhost',
    port: '5432',
    database: 'instagram',
    charset: 'utf8',
  },
});
const bookshelf = require('bookshelf')(knex);
const config = require('../knexfile.js');

bookshelf.plugin('registry');

knex.migrate.latest([config]);

module.exports = {
  bookshelf,
  knex,
};

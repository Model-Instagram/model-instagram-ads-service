
exports.up = (knex, Promise) => {
  return Promise.all([

    Promise.resolve(knex.schema.dropTableIfExists('post_likes')),
    Promise.resolve(knex.schema.dropTableIfExists('ad_interactions')),

    knex.schema.createTable('post_likes', (table) => {
      table.increments('id').primary();
      table.string('user_id');
      table.string('post_id');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),

    knex.schema.createTable('ad_interactions', (table) => {
      table.increments('id').primary();
      table.string('ad_id');
      table.string('user_id');
      table.json('friend_likes');
      table.string('img_url');
      table.string('caption');
      table.string('url');
      table.integer('like_count');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('post_likes'),
    knex.schema.dropTableIfExists('ad_interactions'),
  ]);
};


exports.up = (knex, Promise) => {
  return Promise.all([

    Promise.resolve(knex.schema.dropTableIfExists('post_likes')),
    Promise.resolve(knex.schema.dropTableIfExists('ad_interactions')),
    Promise.resolve(knex.schema.dropTableIfExists('ads')),
    Promise.resolve(knex.schema.dropTableIfExists('interactions')),
    Promise.resolve(knex.schema.dropTableIfExists('friend_likes')),
    Promise.resolve(knex.schema.dropTableIfExists('feeds')),

    knex.schema.createTable('ads', (table) => {
      table.increments('id').primary();
      table.string('img_url');
      table.string('caption');
      table.string('url');
      table.integer('like_count');
      table.string('advertiser_name');
      table.timestamp('created_at');
    }),

    knex.schema.createTable('interactions', (table) => {
      table.increments('id').primary();
      table.integer('ad_id');
      table.integer('user_id');
      table.string('img_url');
      table.string('caption');
      table.string('url');
      table.integer('like_count');
      table.string('advertiser_name');
      table.string('interaction_type');
      table.jsonb('friend_likes');
      table.timestamp('created_at');
    }),

    knex.schema.createTable('friend_likes', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('ad_id');
      table.jsonb('friend_likes');
      table.timestamp('created_at');
    }),

    knex.schema.createTable('feeds', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.jsonb('ad_feed');
      table.timestamp('created_at');
    }),

  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('post_likes'),
    knex.schema.dropTableIfExists('ad_interactions'),
    knex.schema.dropTableIfExists('ads'),
    knex.schema.dropTableIfExists('interactions'),
    knex.schema.dropTableIfExists('friend_likes'),
    knex.schema.dropTableIfExists('feeds'),
  ]);
};
const { bookshelf, knex } = require('./bookshelf.js');

let rows = [];

for (let i = 0; i < 500; i++) {
  const entry = {
    user_id: Math.round(Math.random() * 1000, 0).toString(),
    post_id: Math.round(Math.random() * 1000, 0).toString(),
  };
  rows.push(entry);
}

const chunkSize = 1000;

// knex.batchInsert('post_likes', rows, chunkSize)
//   .returning('id')
//   .then(() => {
//     console.log('halfway through seeding post_likes table');
//     rows = [];
//     for (let i = 0; i < 50000; i++) {
//       const entry = {
//         user_id: Math.round(Math.random() * 1000, 0).toString(),
//         post_id: Math.round(Math.random() * 1000, 0).toString(),
//       };
//       rows.push(entry);
//     }
//     knex.batchInsert('post_likes', rows, chunkSize)
//       .then(() => {console.log('done seeding post_likes table');})
//       .catch(error => console.log(`error: ${error}`));
//   })
//   .catch(error => console.log(`error: ${error}`));

rows = [];

// for (let i = 0; i < 10000000; i++) {
//   const entry = {
//     ad_id: Math.round(Math.random() * 10000, 0).toString(),
//     user_id: Math.round(Math.random() * 10000, 0).toString(),
//     friend_likes: JSON.stringify(['123', '345', '567']),
//     img_url: 'google.com',
//     caption: 'brunch with the girls!!!',
//     url: 'hackreactor.com',
//     like_count: Math.round(Math.random() * 1000, 0),
//     // created_at: 
//   };
//   rows.push(entry);
// }

// knex.batchInsert('ad_interactions', rows, chunkSize)
//   .returning('id')
//   .then(() => console.log('done seeding ad_interactions table'))
//   .catch(error => console.log(`error: ${error}`));

module.exports = {};

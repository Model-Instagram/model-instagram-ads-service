const faker = require('faker');
const { knex } = require('./bookshelf.js');

const chunkSize = 1000;
let itemsToInsert = [];
let time;

console.log('db/index.js is running');

const totalUserCount = 500000;
const totalAdViewCount = 1000;

const seedAdsTable = (startingIndex) => {
  time = Date.now();
  for (let i = startingIndex; i < startingIndex + totalUserCount; i++) {
    // const newAd = {
    //   img_url: faker.image.imageUrl(),
    //   caption: faker.company.catchPhrase(),
    //   url: faker.internet.url(),
    //   like_count: Math.floor(Math.random() * 120, 2) + 3,
    //   advertiser_name: faker.company.companyName(),
    //   created_at: faker.date.recent(),
    // };
    const newAd = {
      img_url: 'faker.image.imageUrl(),',
      caption: 'faker.company.catchPhrase(),',
      url: 'faker.internet.url(),',
      like_count: 3,
      advertiser_name: 'faker.company.companyName(),',
      created_at: faker.date.recent(),
    };
    // const newAd = {
    //   img_url: JSON.stringify([
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //     Math.ceil(Math.random * totalUserCount, 0),
    //    // ` Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),
    //    //  Math.ceil(Math.random * totalUserCount, 0),`
    //   ]),
    // };
    itemsToInsert.push(newAd);
  }
  console.log(`Generating ${totalUserCount} rows for the ads table took ${Date.now() - time} milliseconds`);
  
  knex.batchInsert('ads', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalUserCount} rows into ads table took ${Date.now() - time} milliseconds`);
     })
    .catch(error => console.log(`error: ${error}`));
};

const seedInteractionsTable = (count) => {
  // time = Date.now();
  itemsToInsert = [];

  for (let i = 0; i < totalAdViewCount / 10; i++) {
    const newAdLike = {
      ad_id: i + 1,
      user_id: Math.ceil(Math.random * totalUserCount, 0),
      img_url: faker.image.imageUrl(),
      caption: faker.company.catchPhrase(),
      url: faker.internet.url(),
      like_count: Math.floor(Math.random() * 120, 0) + 3,
      advertiser_name: faker.company.companyName(),
      interaction_type: 'like',
      // 10% of ads liked will already have 'friend likes' on them
      friend_likes: Math.random() > 0.1 ? '[]' : JSON.stringify([Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0)]),
      created_at: faker.date.recent(),
    };
    itemsToInsert.push(newAdLike);
  }

  for (let i = 0; i < totalAdViewCount; i++) {
    const newAdView = {
      img_url: faker.image.imageUrl(),
      caption: faker.company.catchPhrase(),
      url: faker.internet.url(),
      like_count: Math.floor(Math.random() * 120, 2) + 3,
      advertiser_name: faker.company.companyName(),
      interaction_type: 'view',
      // 10% of ads viewed will have 'friend likes' on them
      friend_likes: Math.random() > 0.1 ? '[]' : JSON.stringify([Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0)]),
      created_at: faker.date.recent(),
    };
    itemsToInsert.push(newAdView);
  }

  for (let i = 0; i < totalAdViewCount * 0.007; i++) {
    const newAdClick = {
      img_url: faker.image.imageUrl(),
      caption: faker.company.catchPhrase(),
      url: faker.internet.url(),
      like_count: Math.floor(Math.random() * 120, 2) + 3,
      advertiser_name: faker.company.companyName(),
      interaction_type: 'click',
      // 60% of ad clicks will have 'friend likes' on them
      friend_likes: Math.random() > 0.16 ? '[]' : JSON.stringify([Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0)]),
      created_at: faker.date.recent(),
    };
    itemsToInsert.push(newAdClick);
  }
  if (count % 100 === 0) {
    console.log(`Generating ${count * (totalAdViewCount * 1.107)} rows for the interactions table took ${Date.now() - time} milliseconds`);
  }
  knex.batchInsert('interactions', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      if (count % 100 === 0) {
        console.log(`Seeding ${count * (totalAdViewCount * 1.107)} rows into interactions table took ${Date.now() - time} milliseconds`);
      }
     })
    .catch(error => console.log(`error: ${error}`));
};

const seedFriendLikesTable = () => {
  time = Date.now();
  itemsToInsert = [];
  
  for (let i = 0; i < totalUserCount; i++) {
    const newFriendLikesEntry = {
      user_id: i + 1,
      ad_id: Math.ceil(Math.random * totalUserCount, 0),
      friend_likes: JSON.stringify([Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0), Math.ceil(Math.random * totalUserCount, 0)]),
      created_at: faker.date.recent(),
    };
    itemsToInsert.push(newFriendLikesEntry);
  }

  knex.batchInsert('friend_likes', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalUserCount} rows into friend_likes table took ${Date.now() - time} milliseconds`);
     })
    .catch(error => console.log(`error: ${error}`));
};

const seedFeedsTable = () => {
  time = Date.now();
  itemsToInsert = [];

  for (let i = 0; i < totalUserCount; i++) {
    const newFeed = {
      user_id: i + 1,
      ad_feed: JSON.stringify([
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
        Math.ceil(Math.random * totalUserCount, 0),
       // ` Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),
       //  Math.ceil(Math.random * totalUserCount, 0),`
      ]),
      created_at: faker.date.recent(),
    };
    itemsToInsert.push(newFeed);
  }

  knex.batchInsert('feeds', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalUserCount} rows into feed table took ${Date.now() - time} milliseconds`);
     })
    .catch(error => console.log(`error: ${error}`));
};

const seedAllData = (count = 1) => {
  // seedAdsTable();
  // seedFriendLikesTable();
  // seedFeedsTable();
  time = Date.now();
  for (let i = 1; i <= count; i++) {
    seedInteractionsTable(i);
    // seedInteractionsTable();
  }
};

seedAllData(500);

module.exports = {
  seedAdsTable,
  seedInteractionsTable,
  seedFriendLikesTable,
  seedFeedsTable,
};

// knex.batchInsert('ads', itemsToInsert, chunkSize)
//   .returning('id')
//   .then(() => {
//     console.log('halfway through seeding post_likes table');
//     itemsToInsert = [];
//     for (let i = 0; i < 50000; i++) {
      // const entry = {
      //   user_id: Math.round(Math.random() * 1000, 0).toString(),
      //   post_id: Math.round(Math.random() * 1000, 0).toString(),
      // };
//       itemsToInsert.push(entry);
//     }
//     knex.batchInsert('post_likes', itemsToInsert, chunkSize)
//       .then(() => {console.log('done seeding post_likes table');})
//       .catch(error => console.log(`error: ${error}`));
//   })
//   .catch(error => console.log(`error: ${error}`));

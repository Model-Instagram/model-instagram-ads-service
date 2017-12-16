const faker = require('faker');
const moment = require('moment');
const { knex } = require('./index.js');

const chunkSize = 1000;
let itemsToInsert = [];
let time;

const totalUserCount = 50000;
const totalAdCount = 150000;
const adsPerFeed = 10;
const totalAdViewCount = 100000;

const fakeFields = {
  img_url: [],
  caption: [],
  url: [],
  advertiser_name: [],
  username: [],
};
const generateFakeFields = () => {
  for (let i = 0; i < totalUserCount; i++) {
    fakeFields.img_url.push(faker.image.imageUrl());
    fakeFields.caption.push(faker.company.catchPhrase());
    fakeFields.url.push(faker.internet.url());
    fakeFields.advertiser_name.push(faker.company.companyName());
    fakeFields.username.push(faker.internet.userName());
  }
  console.log(`Generating ${totalUserCount} fake entries for each field took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);
};

const seedAdsTable = () => {
  // time = Date.now();
  for (let i = 1; i <= totalAdCount; i++) {
    const newAd = {
      img_url: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)],
      caption: fakeFields.caption[Math.floor(Math.random() * 50000, 0)],
      url: fakeFields.url[Math.floor(Math.random() * 50000, 0)],
      like_count: Math.floor(Math.random() * 120, 2) + 3,
      advertiser_name: fakeFields.advertiser_name[Math.floor(Math.random() * 50000, 0)],
      created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
    };
    itemsToInsert.push(newAd);
  }
  console.log(`Generating ${totalAdCount} rows for the ads table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);

  knex.batchInsert('ads', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalAdCount} rows into ads table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);
    })
    .catch(error => console.log(`error: ${error}`));
};

const seedInteractionsTable = (count = 1) => {
  // time = Date.now();
  itemsToInsert = [];

  for (let i = 0; i < totalAdViewCount / 100; i++) {
    const newAdLike = {
      ad_id: Math.ceil(Math.random() * totalAdCount),
      user_id: Math.ceil(Math.random() * totalUserCount),
      img_url: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)],
      caption: fakeFields.caption[Math.floor(Math.random() * 50000, 0)],
      url: fakeFields.url[Math.floor(Math.random() * 50000, 0)],
      like_count: Math.floor(Math.random() * 1200, 2) + 3,
      advertiser_name: fakeFields.advertiser_name[Math.floor(Math.random() * 50000, 0)],
      interaction_type: 'like',
      // 10% of ads liked will already have 'friend likes' on them
      friend_likes: Math.random() > 0.1 ? '[]' : JSON.stringify([
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
        ]),
      created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
    };
    itemsToInsert.push(newAdLike);
  }

  for (let i = 0; i < totalAdViewCount; i++) {
    const newAdView = {
      ad_id: Math.ceil(Math.random() * totalAdCount),
      user_id: Math.ceil(Math.random() * totalUserCount),
      img_url: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)],
      caption: fakeFields.caption[Math.floor(Math.random() * 50000, 0)],
      url: fakeFields.url[Math.floor(Math.random() * 50000, 0)],
      like_count: Math.floor(Math.random() * 1200, 2) + 3,
      advertiser_name: fakeFields.advertiser_name[Math.floor(Math.random() * 50000, 0)],
      interaction_type: 'view',
      // 10% of ads viewed will have 'friend likes' on them
      friend_likes: Math.random() > 0.1 ? '[]' : JSON.stringify([
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
        ]),
      created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
    };
    itemsToInsert.push(newAdView);
  }

  for (let i = 0; i < totalAdViewCount * 0.007; i++) {
    const newAdClick = {
      ad_id: Math.ceil(Math.random() * totalAdCount),
      user_id: Math.ceil(Math.random() * totalUserCount),
      img_url: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)],
      caption: fakeFields.caption[Math.floor(Math.random() * 50000, 0)],
      url: fakeFields.url[Math.floor(Math.random() * 50000, 0)],
      like_count: Math.floor(Math.random() * 1200, 2) + 3,
      advertiser_name: fakeFields.advertiser_name[Math.floor(Math.random() * 50000, 0)],
      interaction_type: 'click',
      // 13.8% of ad clicks will have 'friend likes' on them
      friend_likes: Math.random() > 0.138 ? '[]' : JSON.stringify([
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
        ]),
      created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
    };
    itemsToInsert.push(newAdClick);
  }
  console.log(`Generating ${count * (totalAdViewCount * 1.107)} rows for the interactions table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);

  knex.batchInsert('interactions', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${count * (totalAdViewCount * 1.107)} rows into interactions table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);
      if (count <= 200) {
        count++;
        seedInteractionsTable(count);
      }
    })
    .catch(error => console.log(`error: ${error}`));
};

const seedFriendLikesTable = () => {
  // time = Date.now();
  itemsToInsert = [];

  for (let i = 0; i < totalUserCount; i++) {
    for (let j = 0; j < adsPerFeed; j++) {
      const newFriendLikesEntry = {
        user_id: i + 1,
        ad_id: Math.ceil(Math.random() * totalAdCount),
        friend_likes: JSON.stringify([
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
          { user_id: Math.ceil(Math.random() * totalUserCount), username: fakeFields.img_url[Math.floor(Math.random() * 50000, 0)] },
        ]),
        created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
      };
      itemsToInsert.push(newFriendLikesEntry);
    }
  }
  console.log(`Generating ${totalUserCount * adsPerFeed} rows for the friends_likes table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);

  knex.batchInsert('friend_likes', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalUserCount * adsPerFeed} rows into friend_likes table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);
     })
    .catch(error => console.log(`error: ${error}`));
};

const seedFeedsTable = () => {
  // time = Date.now();
  itemsToInsert = [];

  for (let i = 0; i < totalUserCount; i++) {
    const newFeed = {
      user_id: i + 1,
      ad_feed: JSON.stringify([
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
        Math.ceil(Math.random() * totalAdCount),
      ]),
      created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
    };
    itemsToInsert.push(newFeed);
  }
  console.log(`Generating ${totalUserCount} rows for the feed table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);

  knex.batchInsert('feeds', itemsToInsert, chunkSize)
    .returning('id')
    .then(() => {
      console.log(`Seeding ${totalUserCount} rows into feed table took ${Math.round((Date.now() - time) / 1000, 2)} seconds`);
    })
    .catch(error => console.log(`error: ${error}`));
};

const seedAllData = () => {
  time = Date.now();
  generateFakeFields();
  seedAdsTable();
  seedFriendLikesTable();
  seedFeedsTable();
  seedInteractionsTable();
};

module.exports = {
  seedAllData,
};

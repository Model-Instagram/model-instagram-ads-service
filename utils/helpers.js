const Promise = require('bluebird');
const moment = require('moment');
const { knex } = require('../database/index.js');

const getRandomDate = () => {
  return moment()
    .year(2017)
    .month(11)
    .date(Math.ceil(Math.random() * 14) + 10)
    .hour(Math.floor(Math.random() * 24))
    .toJSON();
};

const getUserFeed = (userId, startIndex) => {
  // data validation on startIndex
  let adIndex = parseInt(startIndex, 10);
  if (adIndex < 0) {
    adIndex = 0;
  } else if (adIndex > 9) {
    adIndex = 9;
  }
  // if at last ad, start over by serving up first ad next time
  const nextAdServed = (adIndex === 9 ? 0 : (adIndex + 1));

  return new Promise((resolve, reject) => {
    knex('feeds').where('user_id', userId).select('ad_feed')
      .then((results) => {
        const adId = results[0].ad_feed[adIndex];
        resolve({ userId, nextAdServed, adId });
      })
      .catch(error => reject(error));
  });
};

const getAdInfo = (adId) => {
  return new Promise((resolve, reject) => {
    knex('ads').where('id', adId).select()
      .then((results) => {
        resolve(results[0]);
      })
      .catch(error => reject(error));
  });
};

const getFriendLikes = (userId, adId) => {
  return new Promise((resolve, reject) => {
    knex('friend_likes').where({
      ad_id: adId,
      user_id: userId,
    }).select('friend_likes')
      .then((friendLikes) => {
        resolve(friendLikes);
      })
      .catch(error => reject(error));
  });
};

const getNextAd = (userId, startIndex) => {
  return new Promise((resolve, reject) => {
    getUserFeed(userId, startIndex)
      .then((userFeed) => {
        Promise.all([
          userFeed,
          getAdInfo(userFeed.adId),
          getFriendLikes(userId, userFeed.adId),
        ])
          .then((results) => {
            const ad = results[1];
            ad.friend_likes = results[2];
            const response = {
              user_id: userId,
              next_ad_served: results[0].nextAdServed,
              ad,
            };
            resolve(response);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

const faker = require('faker');

const getUserProfile = (userId) => {
  // const followers = [9628, 11727, 23302];
  const followers = [];
  for (let i = 0; i < 5; i++) {
    followers.push(Math.ceil(Math.random() * 50000));
  }
  return {
    username: faker.name.firstName(),
    followers,
  };
};

const addFriendLike = (adId, userId, username, followerId) => {
  return new Promise((resolve, reject) => {
    knex('friend_likes')
      .where({ user_id: followerId, ad_id: adId })
      .first('id', 'friend_likes')
      .then((likesArray) => {
        if (!Array.isArray(likesArray)) {
          resolve('done');
        }
        likesArray.push({
          user_id: userId,
          username,
        });
        knex('friend_likes')
          .where({ user_id: followerId, ad_id: adId })
          .set('friend_likes', JSON.stringify(likesArray))
          .returning('friend_likes')
          .then(confirmation => resolve(confirmation))
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

const updateFriendLikes = (userId, adId) => {
  return new Promise((resolve, reject) => {
    Promise.resolve(getUserProfile(userId))
      .then((userProfile) => {
        const updates = [];
        userProfile.followers.forEach((follower) => {
          updates.push(addFriendLike(adId, userId, userProfile.username, follower));
        });
        Promise.all(updates)
          // .then(confirmation => resolve(confirmation))
          .then((confirmation) => {
            resolve(confirmation);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

const incrementLikeCount = (adId) => {
  return new Promise((resolve, reject) => {
    knex('ads')
      .where('id', adId)
      .increment('like_count', 1)
      .returning('like_count')
      .then(likes => resolve(likes))
      .catch(error => reject(error));
  });
};

const recordInteraction = (userId, adId, interactionType) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      getAdInfo(adId),
      getFriendLikes(userId, adId),
    ])
      .then((results) => {
        const newInteraction = {
          ad_id: results[0].id,
          user_id: userId,
          img_url: results[0].img_url,
          caption: results[0].caption,
          url: results[0].url,
          like_count: results[0].like_count + 1,
          advertiser_name: results[0].advertiser_name,
          friend_likes: JSON.stringify(results[1]),
          interaction_type: interactionType,
          created_at: getRandomDate(),
        };
        knex('interactions').insert(newInteraction, 'id')
          .then(interactionId => resolve(interactionId))
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

/*
Example inputs into getNextAd:

  user_id: 11235
  start_index: 8

Example results received from getNextAd:

  {
    "user_id": 11235,
    "next_ad_served": 9,
    "ad": {
      "id": 71006,
      "img_url": "http://lorempixel.com/640/480",
      "caption": "Assimilated methodical installation",
      "url": "https://antonietta.net",
      "like_count": 5,
      "advertiser_name": "Daniel - Berge",
      "created_at": "2017-12-12T16:26:55.216Z",
      "friend_likes": []
    }
  }
*/

module.exports = {
  getNextAd,
  recordInteraction,
  incrementLikeCount,
  updateFriendLikes,
};

const Promise = require('bluebird');
const { knex } = require('../database/index.js');

const getUserFeed = (userId, startIndex) => {
  // data validation on startIndex
  let adIndex = startIndex;
  if (adIndex < 0) {
    adIndex = 0;
  } else if (adIndex > 9) {
    adIndex = 9;
  }
  const nextAdServed = (adIndex === 9 ? 0 : (++adIndex));
  return new Promise((resolve, reject) => {
    knex('feeds').where('user_id', userId).select('ad_feed')
      .then((results) => {
        const adId = results[0].ad_feed[adIndex];
        resolve({ userId, nextAdServed, adId });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const getAdInfo = (adId) => {
  return new Promise((resolve, reject) => {
    knex('ads').where('id', adId).select()
      .then((results) => {
        const ad = results[0];
        resolve(ad);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
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
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const getNextAd = (userId, startIndex) => {
  return new Promise((resolve, reject) => {
    getUserFeed(userId, startIndex)
      .then((userFeed) => {
        Promise.all([userFeed, getAdInfo(userFeed.adId), getFriendLikes(userId, userFeed.adId)])
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
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = {
  getNextAd,
};

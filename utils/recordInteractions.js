const Promise = require('bluebird');
const moment = require('moment');
const { knex } = require('../database/index.js');

const getUserFeed = (userId, startIndex) => {
  // data validation on startIndex
  let adIndex = parseInt(startIndex);
  if (adIndex < 0) {
    adIndex = 0;
  } else if (adIndex > 9) {
    adIndex = 9;
  }
  console.log(`startIndex is ${typeof startIndex}, adIndex is ${typeof adIndex}`);
  const nextAdServed = (adIndex === 9 ? 0 : (++adIndex));
  return new Promise((resolve, reject) => {
    knex('feeds').where('user_id', userId).select('ad_feed')
      .then((results) => {
        console.log(`getUserFeed internal: ${JSON.stringify(results)}`);
        const adId = results[0].ad_feed[adIndex];
        console.log(`ad id = ${adId} at ${adIndex}`);
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
    console.log(`getAdInfo ad id = ${JSON.stringify(adId)}, adId is ${typeof adId}`);
    knex('ads').where('id', adId).select()
      .then((results) => {
        console.log(`getAdInfo results is ${Array.isArray(results)} ${JSON.stringify(results)}`);
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
    console.log(`inside of getFriendLikes ${typeof userId} ${typeof adId}`);
    knex('friend_likes').where({
      ad_id: adId,
      user_id: userId,
    }).select('friend_likes')
      .then((friendLikes) => {
        console.log(`getFriendLikes results is ${Array.isArray(friendLikes)} ${JSON.stringify(friendLikes)}`);
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
        console.log(`user feed received! ${JSON.stringify(userFeed)}`);
        Promise.all([userFeed, getAdInfo(userFeed.adId), getFriendLikes(userId, userFeed.adId)])
          .then((results) => {
            console.log(`getNextAd Promise.all results is ${Array.isArray(results)} ${JSON.stringify(results, null, 2)}`);
            const ad = results[1];
            ad.friend_likes = results[2];
            const response = {
              user_id: userId,
              next_ad_served: results[0].nextAdServed,
              ad,
            };
            console.log(`final response is: ${JSON.stringify(response, null, 2)}`);
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

const recordInteraction = (userId, adId, interactionType) => {
  // if any of main three, store it in table
  knex('interactions').insert({});
  return new Promise((resolve, reject) => {
    getAdInfo(adId)
      .then((ad) => {
        console.log(`ad received! ${JSON.stringify(ad)}`);
        Promise.all([ad, getFriendLikes(userId, adId)])
          .then((results) => {
            console.log(`recordInteraction Promise.all results is ${Array.isArray(results)} ${JSON.stringify(results, null, 2)}`);
            const newInteraction = results[0];
            newInteraction.friend_likes = results[1];
            newInteraction.ineraction_type = interactionType;
            newInteraction.created_at = moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON();
            resolve(newInteraction);
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
  // if like, also update friend_likes table
};

module.exports = {
  recordInteraction,
};

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
  // console.log(`startIndex is ${typeof startIndex}, adIndex is ${typeof adIndex}`);
  const nextAdServed = (adIndex === 9 ? 0 : (++adIndex));
  return new Promise((resolve, reject) => {
    knex('feeds').where('user_id', userId).select('ad_feed')
      .then((results) => {
        // console.log(`getUserFeed internal: ${JSON.stringify(results)}`);
        // const adId = JSON.parse(results)[0].ad_feed[adIndex];
        const adId = results[0].ad_feed[adIndex];
        // console.log(`ad id = ${adId} at ${adIndex}`);
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
    // console.log(`getAdInfo ad id = ${JSON.stringify(adId)}, adId is ${typeof adId}`);
    knex('ads').where('id', adId).select()
      .then((results) => {
        // console.log(`getAdInfo results is ${Array.isArray(results)} ${JSON.stringify(results)}`);
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
    // console.log(`inside of getFriendLikes ${typeof userId} ${typeof adId}`);
    knex('friend_likes').where({
      ad_id: adId,
      user_id: userId,
    }).select('friend_likes')
      .then((friendLikes) => {
        // console.log(`getFriendLikes results is ${Array.isArray(friendLikes)} ${JSON.stringify(friendLikes)}`);
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
        // console.log(`user feed received! ${JSON.stringify(userFeed)}`);
        Promise.all([userFeed, getAdInfo(userFeed.adId), getFriendLikes(userId, userFeed.adId)])
          .then((results) => {
            // console.log(`getNextAd Promise.all results is ${Array.isArray(results)} ${JSON.stringify(results, null, 2)}`);
            const ad = results[1];
            ad.friend_likes = results[2];
            const response = {
              user_id: userId,
              next_ad_served: results[0].nextAdServed,
              ad,
            };
            // console.log(`final response is: ${JSON.stringify(response, null, 2)}`);
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

// {
//   user_id: 1928272,
//   next_ad_index: 3,
//   ad: {
//       ad_id: 39373,
//       advertiser_name: ‘Hack Reactor’,
//       url: “http://hackreactor.com”,
//       img_url: “https://storage.model-instagram…”,
//       caption: “It’s Fred Friday at Hack Reactor SF!”,
//       like_count: 81,
//       friend_likes: [ 
//          {user_id: 57584, username: “Tom_Door_Ants”},
//          {friend 2}, 
//             ... ,
//          {friend N}
//       ],
//   },
// }

// {
//   "user_id": "25",
//   "next_ad_served": 4,
//   "ad": {
//     "id": 6951,
//     "img_url": "http://lorempixel.com/640/480",
//     "caption": "Monitored content-based info-mediaries",
//     "url": "https://august.net",
//     "like_count": 10,
//     "advertiser_name": "Wolff - Lang",
//     "created_at": "2017-12-12T18:10:41.619Z",
//     "friend_likes": []
//   }
// }


module.exports = {
  getNextAd,
};

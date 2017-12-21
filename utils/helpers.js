const Promise = require('bluebird');
const moment = require('moment');
const { knex } = require('../database/index.js');

const getUserFeed = (userId, startIndex) => {
  console.log(`inside getUserFeed with: ${userId} ${startIndex}`);
  // data validation on startIndex
  let adIndex = parseInt(startIndex, 10);
  if (adIndex < 0) {
    adIndex = 0;
  } else if (adIndex > 9) {
    adIndex = 9;
  }
  const nextAdServed = (adIndex === 9 ? 0 : (adIndex + 1));

  return new Promise((resolve, reject) => {
    knex('feeds').where('user_id', userId).select('ad_feed')
      .then((results) => {
        console.log('finishing up with getUserFeed');
        const adId = results[0].ad_feed[adIndex];
        resolve({ userId, nextAdServed, adId });
      })
      .catch(error => reject(error));
  });
};

const getAdInfo = (adId) => {
  return new Promise((resolve, reject) => {
    console.log(`inside getAdInfo with: ${adId}`);
    knex('ads').where('id', adId).select()
      .then((results) => {
        console.log('finishing up with getAdInfo');
        resolve(results[0])
      })
      .catch(error => reject(error));
  });
};

const getFriendLikes = (userId, adId) => {
    console.log(`inside getFriendLikes with: ${userId} ${adId}`);
  return new Promise((resolve, reject) => {
    knex('friend_likes').where({
      ad_id: adId,
      user_id: userId,
    }).select('friend_likes')
      .then((friendLikes) => {
        console.log('finishing up with getFriendLikes');
        resolve(friendLikes);
      })
      .catch(error => reject(error));
  });
};

const getNextAd = (userId, startIndex) => {
  return new Promise((resolve, reject) => {
    console.log(`inside getNexAd with: ${userId} ${typeof userId}`);
    getUserFeed(userId, startIndex)
      .then((userFeed) => {
        console.log(`GNA - after getUserFeed with: ${JSON.stringify(userFeed, null, 2)} UF.adId = ${userFeed.adId}`);
        Promise.all([
          userFeed,
          getAdInfo(userFeed.adId),
          getFriendLikes(userId, userFeed.adId),
        ])
          .then((results) => {
            console.log('GNA - came out of promise.all');
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
  const followers = [9628, 11727, 23302];
  // const followers = [];
  // for (let i = 0; i < 5; i++) {
  //   followers.push(Math.ceil(Math.random() * 50000));
  // }
  return {
    username: faker.internet.avatar(),
    followers,
  };
};

const addFriendLike = (adId, userId, username, followerId) => {
  return new Promise((resolve, reject) => {
    knex('friend_likes')
      .where({ user_id: followerId, ad_id: adId })
      .first('id', 'friend_likes')
      .then((likesArray) => {
        console.log(`results from getting friend likes: ${JSON.stringify(likesArray, null, 2)}`);
        if (!Array.isArray(likesArray)) {
          resolve('done');
        }
        likesArray.push({
          user_id: userId,
          username,
        });
        knex('friend_likes')
          .where({ user_id: followerId, ad_id: adId })
          .set('friend_likes', likesArray)
          .returning('friend_likes')
          // .then(confirmation => resolve(confirmation))
          .then((confirmation) => {
            console.log(`confirmation ${confirmation}`);
            resolve(confirmation);
          })
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
          console.log(`updating friend likes array for ${follower} at ${adId} with a like by ${userId} ${userProfile.username}`);
          updates.push(addFriendLike(adId, userId, userProfile.username, follower));
        });
        Promise.all(updates)
          // .then(confirmation => resolve(confirmation))
          .then((confirmation) => {
            console.log(`confirmation ${confirmation}`);
            resolve(confirmation);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

const incrementLikeCount = (adId) => {
  console.log('incrementing like count for ad id', adId);
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
          img_url: results[0].img_url,
          caption: results[0].caption,
          url: results[0].url,
          like_count: results[0].like_count + 1,
          advertiser_name: results[0].advertiser_name,
          friend_likes: results[1],
          interaction_type: interactionType,
          created_at: moment().year(2017).month(11).date(Math.ceil(Math.random() * 14) + 10).hour(Math.floor(Math.random() * 24)).toJSON(),
        }; 
        console.log(`recordInteraction newInteraction: ${JSON.stringify(newInteraction, null, 2)}`);

        Promise.resolve(knex('interactions').insert(newInteraction, 'id'))
          .then(id => resolve(id))
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
};

// recordInteraction newInteraction: {
//   "id": 1,
//   "img_url": "http://lorempixel.com/640/480",
//   "caption": "Up-sized regional monitoring",
//   "url": "http://marvin.org",
//   "like_count": 41,
//   "advertiser_name": "Feeney, Kunde and Johnston",
//   "created_at": "2017-12-12T21:07:06.005Z",
//   "friend_likes": [],
//   "ineraction_type": "like"
// }




// const  = () => {
//   if (interactionType !== 'like') {
//               resolve(newInteraction);
//             } else {
//               Promise.all([
//                 newInteraction,
//                 incrementLikeCount(adId),
//                 updateFriendLikes(userId, adId),
//               ])
//                 .then(results => resolve(results[0]))
//                 .catch(error => reject(error));
//             }


// };

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

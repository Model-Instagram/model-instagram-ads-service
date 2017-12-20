const NR = require('newrelic');
const Promise = require('bluebird');

const express = require('express');
const {
  getNextAd,
  recordInteraction,
  incrementLikeCount,
  updateFriendLikes,
} = require('../utils/helpers.js');

// const { seedAllData } = require('../database/seed.js');
// seedAllData();

const app = express();

// serve up next ad for a user's feed
app.get('/users/:user_id/ad_feed/:next_ad_index', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const nextAdIndex = parseInt(req.params.next_ad_index, 10);
  getNextAd(userId, nextAdIndex)
    .then((result) => {
      res.send(result);
    })
    .catch(error => console.log(error));
});

app.get('/testHTTP', (req, res) => {
  res.sendStatus(200);
});

// handle ad likes
app.post('/likes/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const adId = parseInt(req.params.ad_id, 10);
  Promise.all([
    recordInteraction(userId, adId, 'like'),
    incrementLikeCount(adId),
    updateFriendLikes(userId, adId),
  ])
    .then((results) => {
      console.log('done with ad like', results);
      res.sendStatus(200);
    })
    .catch(error => console.log(error));
});

// handle ad views
app.post('/views/ads/:ad_id/users/:user_id', (req, res) => {
  const adId = parseInt(req.params.ad_id, 10);
  const userId = parseInt(req.params.user_id, 10);
  recordInteraction(userId, adId, 'view')
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => reject(error));
});

// handle ad clicks
app.post('/clicks/ads/:ad_id/users/:user_id', (req, res) => {
  const adId = parseInt(req.params.ad_id, 10);
  const userId = parseInt(req.params.user_id, 10);
  recordInteraction(userId, adId, 'click')
    .then(() => {
      res.status(200);
    })
    .catch(error => reject(error));
});

app.all('*', (req, res) => res.sendStatus(404));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Ads server is listening on port 8080!'));

module.exports = app;

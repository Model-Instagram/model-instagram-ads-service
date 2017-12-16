// const apm = require('elastic-apm-node').start({
//   // Set required app name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
//   appName: 'instagram-ads',
//   // Use if APM Server requires a token
//   secretToken: '',
//   // Set custom APM Server URL (default: http://localhost:8200)
//   serverUrl: '',
// });

const express = require('express');
const { getNextAd } = require('../utils/getNextAd.js');
const { recordInteraction } = require('../utils/recordInteractions.js');
// const { seedAllData } = require('../database/seed.js');

// seedAllData();

const app = express();

// serve up next ad for a user's feed
app.get('/users/:user_id/ad_feed/:next_ad_index', (req, res) => {
  const userId = req.params.user_id;
  const nextAdIndex = req.params.next_ad_index;
  getNextAd(userId, nextAdIndex)
    .then((result) => {
      // console.log(`Successfully served up ad #${result.ad.id} for user# ${userId}`);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// handle ad likes
app.post('/likes/ads/:ad_id/users/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const adId = parseInt(req.params.ad_id, 10);
  recordInteraction(userId, adId, 'like')
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// handle ad views
app.post('/views/ads/:ad_id/users/:user_id', (req, res) => {
  const adId = parseInt(req.params.ad_id, 10);
  const userId = parseInt(req.params.user_id, 10);
  recordInteraction(userId, adId, 'view')
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// handle ad clicks
app.post('/clicks/ads/:ad_id/users/:user_id', (req, res) => {
  const adId = parseInt(req.params.ad_id, 10);
  const userId = parseInt(req.params.user_id, 10);
  recordInteraction(userId, adId, 'click')
    .then(() => {
      res.status(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.listen(8080, () => console.log('Ads server is listening on port 8080!'));

const express = require('express');
const { getNextAd, recordInteraction } = require('../utils/helpers.js');
// const { seedAllData } = require('../database/seed.js');

// seedAllData();

const app = express();

// serve up next ad for a user's feed
app.get('/users/:user_id/ad_feed/:next_ad_index', (req, res) => {
  const userId = req.params.user_id;
  const nextAdIndex = req.params.next_ad_index;
  getNextAd(userId, nextAdIndex)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.send(500);
    });
});

// handle ad likes
app.post('/likes/ads/:ad_id/users/:user_id', (req, res) => {
  const adId = req.params.ad_id;
  const userId = req.params.user_id;
  recordInteraction(adId, userId, 'like')
    .then(() => {
      res.status(200);
    })
    .catc((error) => {
      console.log(error);
      res.send(500);
    });
});

// handle ad views
app.post('/views/ads/:ad_id/users/:user_id', (req, res) => {
  recordInteraction(req.params.ad_id, req.params.user_id, 'view')
    .then(() => {
      res.status(200);
    })
    .catch((error) => {
      console.log(error);
      res.send(500);
    });
});

// handle ad clicks
app.post('/clicks/ads/:ad_id/users/:user_id', (req, res) => {
  recordInteraction(req.params.ad_id, req.params.user_id, 'click')
    .then(() => {
      res.status(200);
    })
    .catch((error) => {
      console.log(error);
      res.send(500);
    });
});

app.listen(8080, () => console.log('Ads server is listening on port 8080!'));

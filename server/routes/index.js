const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).send('Connected to the Ads service!');
});


routes.post('/likes/ads/:ad_id/users/:user_id', (req, res) => {
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

module.exports = routes;

const axios = require('axios');
const { expect } = require('chai');
const { knex } = require('../database/index.js');

const port = process.env.PORT || 8080;
const baseUrl = `http://localhost:${port}`;

describe('Server - General', function () {
  it('should respond to GET requests to /testHTTP with a 200 status code', (done) => {
    axios.get(`${baseUrl}/testHTTP`)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });
  it('should respond to invalid routes with a 404 status code', function (done) {
    axios.get(`${baseUrl}/arblegarble`)
      .then(response => done(response))
      .catch((error) => {
        expect(error.response.status).to.equal(404);
        done();
      });
  });
});

describe('Server - User Feed Request', function () {
  it('should respond to requests with object', function (done) {
    axios.get(`${baseUrl}/users/3/ad_feed/5`)
      .then((response) => {
        expect(typeof response).to.equal('object');
        done();
      })
      .catch(error => done(error));
  });

  it('should respond with index of next ad served to this user', function (done) {
    axios.get(`${baseUrl}/users/3/ad_feed/5`)
      .then((response) => {
        expect(response.data.next_ad_served).to.equal(6);
        done();
      })
      .catch(error => done(error));
  });

  it('should respond with all info required to display the ad to user', done => {
    axios.get(`${baseUrl}/users/3/ad_feed/5`)
      .then((response) => {
        expect(typeof response.data.ad.id).to.equal('number');
        expect(typeof response.data.ad.img_url).to.equal('string');
        expect(typeof response.data.ad.caption).to.equal('string');
        expect(typeof response.data.ad.url).to.equal('string');
        expect(typeof response.data.ad.like_count).to.equal('number');
        expect(typeof response.data.ad.advertiser_name).to.equal('string');
        expect(typeof response.data.ad.created_at).to.equal('string');
        expect(Array.isArray(response.data.ad.friend_likes)).to.equal(true);
        done();
        // expect(response.data.ad.id).to.equal(71294);
        // expect(response.data.ad.img_url).to.equal('http://lorempixel.com/640/480');
        // expect(response.data.ad.caption).to.equal('Profound holistic toolset');
        // expect(response.data.ad.url).to.equal('https://sedrick.name');
        // expect(response.data.ad.like_count).to.equal(65);
        // expect(response.data.ad.advertiser_name).to.equal('Gerlach - Cremin');
        // expect(response.data.ad.created_at).to.equal('2017-10-30T06:11:11.758Z');
        // expect(response.data.ad.friend_likes).to.deep.equal([]);
        // done();
      })
      .catch(error => done(error));
  });
});

describe('Server - Record New Interaction', function () {
  it('should respond to POST requests for likes with a 200 status code', function (done) {
    axios.post(`${baseUrl}/likes/ads/6/users/2`)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });

  it('should respond to POST requests for views with a 200 status code', function (done) {
    axios.post(`${baseUrl}/views/ads/7/users/2`)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });

  it('should respond to POST requests for clicks with a 200 status code', function (done) {
    axios.post(`${baseUrl}/clicks/ads/7/users/2`)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });

  it('should properly record new views in the database', function (done) {
    axios.post(`${baseUrl}/views/ads/11/users/4`)
      .then((interactionId) => {
        knex('interactions')
          .where({
            id: interactionId.data[0],
          })
          .then((results) => {
            expect(results[0].user_id).to.equal(4);
            expect(results[0].ad_id).to.equal(11);
            expect(results[0].interaction_type).to.equal('view');
            done();
          })
          .catch(error => done(error));
      })
      .catch(error => done(error));
  });

  it('should properly record new clicks in the database', function (done) {
    axios.post(`${baseUrl}/clicks/ads/14/users/3`)
      .then((interactionId) => {
        knex('interactions')
          .where({
            id: interactionId.data[0],
          })
          .then((results) => {
            expect(results[0].user_id).to.equal(3);
            expect(results[0].ad_id).to.equal(14);
            expect(results[0].interaction_type).to.equal('click');
            done();
          })
          .catch(error => done(error));
      })
      .catch(error => done(error));
  });

  it('should properly record new likes in the database', function (done) {
    axios.post(`${baseUrl}/likes/ads/9/users/2`)
      .then((interactionId) => {
        knex('interactions')
          .where({
            id: interactionId.data[0][0],
          })
          .select()
          .then((results) => {
            expect(results[0].user_id).to.equal(2);
            expect(results[0].ad_id).to.equal(9);
            expect(results[0].interaction_type).to.equal('like');
            done();
          })
          .catch(error => done(error));
      })
      .catch(error => done(error));
  });

  it('should increase an ad\'s like count after recording a new like', function (done) {
    this.timeout(5000);
    let expectedLikeCount;
    knex('ads')
      .where('id', 10)
      .select('like_count')
      .then((results) => {
        expectedLikeCount = results[0].like_count;
        axios.post(`${baseUrl}/likes/ads/10/users/2`)
          .then(() => {
            knex('ads')
              .where('id', 10)
              .select('like_count')
              .then((actualResults) => {
                expect(expectedLikeCount + 1).to.equal(actualResults[0].like_count);
                done();
              })
              .catch(error => done(error));
          })
          .catch(error => done(error));
      })
      .catch(error => done(error));
  });

});
// {
//     "user_id": 3,
//     "next_ad_served": 6,
//     "ad": {
//         "id": 71294,
//         "img_url": "http://lorempixel.com/640/480",
//         "caption": "Profound holistic toolset",
//         "url": "https://sedrick.name",
//         "like_count": 65,
//         "advertiser_name": "Gerlach - Cremin",
//         "created_at": "2017-10-30T06:11:11.758Z",
//         "friend_likes": []
//     }
// }

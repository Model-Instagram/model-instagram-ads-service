const axios = require('axios');
const { expect } = require('chai');

const port = process.env.PORT || 8080;
const baseUrl = `http://localhost:${port}`;

describe('Server - General', function () {
  it('should respond to GET requests to /testHTTP with a 200 status code', (done) => {
    axios.get(`${baseUrl}/testHTTP`)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
      .catch((error) => {
        console.log('There was an error requesting /testHTTP from the server.');
        done(error);
      });
  });
  it('should respond to invalid routes with a 404 status code', function (done) {
    axios.get(`${baseUrl}/arblegarble`)
      .then((response) => {
        done();
      })
      .catch((error) => {
        expect(error.response.status).to.equal(404);
        done();
      });
  });
});

// describe('Server - User Feed Request', function () {
//   it('should respond to requests with object', function (done) {
//     axios.get(`${baseUrl}/users/3/ad_feed/5`)
//       .then((response) => {
//         console.log('hello from 3', response);
//         expect(response).to.deep.equal(response);
//         expect(typeof response).to.equal('object');
//         done();
//       })
//       .catch((error) => {
//         console.log('hello from 3', error);
//         console.log('Error getting ad for user feed.');
//         done(error);
//       });
//   });
  // it('should respond with index of next ad served to this user', function (done) {
  //   axios.get(`${baseUrl}/users/3/ad_feed/5`)
  //     .then((response) => {
  //       expect(typeof response.data.next_ad_served).to.equal('number');
  //       done();
  //     })
  //     .catch((error) => {
  //       console.log('Error getting ad for user feed.');
  //       done(error);
  //     });
  // });
  // it('should respond with all info required to display the ad to user', done => {
  //   axios.get(`${baseUrl}/users/3/ad_feed/5`)
  //     .then((response) => {
  //       expect(typeof response.data.ad.id).to.equal('number');
  //       expect(typeof response.data.ad.img_url).to.equal('string');
  //       expect(typeof response.data.ad.caption).to.equal('string');
  //       expect(typeof response.data.ad.url).to.equal('string');
  //       expect(typeof response.data.ad.like_count).to.equal('number');
  //       expect(typeof response.data.ad.advertiser_name).to.equal('string');
  //       expect(typeof response.data.ad.created_at).to.equal('string');
  //       expect(Array.isArray(response.data.ad.friend_likes)).to.equal(true);
  //       done();
  //       // expect(response.data.ad.id).to.equal(71294);
  //       // expect(response.data.ad.img_url).to.equal('http://lorempixel.com/640/480');
  //       // expect(response.data.ad.caption).to.equal('Profound holistic toolset');
  //       // expect(response.data.ad.url).to.equal('https://sedrick.name');
  //       // expect(response.data.ad.like_count).to.equal(65);
  //       // expect(response.data.ad.advertiser_name).to.equal('Gerlach - Cremin');
  //       // expect(response.data.ad.created_at).to.equal('2017-10-30T06:11:11.758Z');
  //       // expect(response.data.ad.friend_likes).to.deep.equal([]);
  //       // done();
  //     })
  //     .catch((error) => {
  //       console.log('Error getting ad for user feed.');
  //       done(error);
  //     });
  // });
// });

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

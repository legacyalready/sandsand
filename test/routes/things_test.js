const uuid = require('uuid');
const { app, authHeader } = require('../helper');
const config = require('../../config');
const FixtureFactory = require('../fixtures/thing');

describe('/v1/things', () => {
  let fixture;

  before('create a thing', async () => {
    fixture = await (await FixtureFactory()).instance();
  });

  describe('GET', () => {
    it('must return a 200', async () => {
      const response = await app.get('/v1/things');
      expect(response.status).to.equal(200);
    });

    it('must return an array', async () => {
      const response = await app.get('/v1/things');
      expect(Array.isArray(response.body)).to.be.true;
    });

    it('must return a thing', async () => {
      const response = await app.get('/v1/things');
      expect(response.body.length).to.be.gt(0);
    });

    it('must limit things', async () => {
      const response = await app.get('/v1/things', { per_page: 2 });
      expect(response.body.length).to.equal(2);
    });
  });

  describe('GET/:id', () => {
    it('must get the right thing', async () => {
      const response = await app.get(`/v1/things/${fixture.id}`);
      expect(response.body.id).to.equal(fixture.id);
    });

    it('must return 404 for a missing thing', async () => {
      const response = await app.get(`/v1/things/${uuid.v4()}`);
      expect(response.status).to.equal(404);
    });
  });
});

describe('/v1/things', () => {
  let fixture;

  before('create a thing', async () => {
    fixture = (await FixtureFactory()).data;
  });

  describe('POST', () => {
    it('must accept a valid body', async () => {
      const response = await app.post('/v1/things', fixture);
      expect(response.status).to.equal(200);
    });

    it('must return the persisted data', async () => {
      const response = await app.post('/v1/things', fixture);
      expect(response.body.name).to.eql(fixture.name);
      expect(response.body.email).to.eql(fixture.email);
    });

    it('must reject any quantity lower than 10', async () => {
      const subTen = (await FixtureFactory()).data;
      subTen.quantity = 5;
      console.log("[subTen]",subTen)
      const response = await app.post('/v1/things', subTen);
      expect(response.status).to.eql(400);
    });

    it('must demand an admin user for dangerous items', async () => {
      const danger = (await FixtureFactory()).data;
      danger.name = 'sharp scissors:true:silver';
      const response = await app.post('/v1/things', danger);
      expect(response.status).to.eql(403);

      const authedResponse = await app.post(
        '/v1/things',
        danger,
        {
          Authorization: authHeader(config.ADMIN_USER, config.ADMIN_PASS),
        },
      );
      expect(authedResponse.status).to.eql(200);
    });

    it.only('name must be delimited by colon ":"', async () => {
      const danger = (await FixtureFactory()).data;
      danger.name = 'sharp scissors>true>silver';
      const response = await app.post('/v1/things', danger);
      const authedResponse = await app.post(
        '/v1/things',
        danger,
        {
          Authorization: authHeader(config.ADMIN_USER, config.ADMIN_PASS),
        },
      );
      expect(authedResponse.status).to.eql(406);
    });
  });
});

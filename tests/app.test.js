const expect = require('expect');
const request = require('supertest');

const start = require('../start');
const Store = require('../models/Store');

before('keep the DB clean before test', async() => {
  await Store.remove();
});

describe('POST /object', () => {
  it('should accept a key/value JOSN data and store', async() => {
    const dataObject = { key: 'value' };
    // assert return object
    const response = await request(start)
      .post('/object')
      .send(dataObject);
    expect(response.status).toBe(200);
    expect(response.body.key).toBe('key');
    expect(response.body.value).toBe('value');

    // assert DB
    const stores = await Store.find({ key: 'key' });
    expect(stores[0].value).toBe('value');
    expect(response.body.timeStamp).toBe(stores[0].timeStamp);
  });
});

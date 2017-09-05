const expect = require('expect');
const request = require('supertest');

const index = require('../index');
const Store = require('../models/Store');

before('keep the DB clean before test', async() => {
  await Store.remove();
});

describe('POST /object', () => {
  it('should accept a key/value JOSN data and store', async() => {
    const dataObject = { key: 'value' };
    // assert return object
    const response = await request(index)
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
  it('should update value if existing key is sent', async() => {
    const newDataObject = { key: 'newValue' };
    // assert return object
    const response = await request(index)
      .post('/object')
      .send(newDataObject);
    expect(response.status).toBe(200);
    expect(response.body.key).toBe('key');
    expect(response.body.value).toBe('newValue');

    // assert DB
    const stores = await Store.find({ key: 'key', value: 'newValue' });
    expect(stores.length).toBe(1);
    expect(response.body.timeStamp).toBe(stores[0].timeStamp);
  });
});

describe('GET /object/:key', () => {
  let firstStore;
  let secondStore;
  let thirdStore;
  before('create 3 stores at the beginning', async() => {
    await Store.remove();
    firstStore = await Store.create({ key: 'key', value: 'value1' });
    secondStore = await Store.create({ key: 'key', value: 'value2' });
    thirdStore = await Store.create({ key: 'key', value: 'value3' });
  });
  it('should accept a key and return the latest value', async() => {
    const response = await request(index).get('/object/key');
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('value3');
  });
  it('should return the value at certain timestamp query', async() => {
    const response = await request(index).get(`/object/key?timestamp=${secondStore.timeStamp}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('value2');
  });
  it('should return the value within the timestamp query', async() => {
    const response = await request(index).get(`/object/key?timestamp=${thirdStore.timeStamp - 1}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('value2');
  });
});

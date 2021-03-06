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
  it('should throw error if empty JSON data', async() => {
    const response = await request(index)
      .post('/object')
      .send({});
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'Empty input.' });
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
  it('should return error when multiple queries', async() => {
    const response = await request(index).get('/object/key?timestamp=100&hello=world');
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'Bad request with too much queries.' });
  });
  it('should return error when invalid query key', async() => {
    const response = await request(index).get('/object/key?timestamps=10000');
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'Bad request with incorrect query name.' });
  });
  it('should return error when invalid query value', async() => {
    const response = await request(index).get('/object/key?timestamp=10000s');
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'Bad request with incorrect query value.' });
  });
  it('should return not found when query timestamp is zero', async() => {
    const response = await request(index).get('/object/key?timestamp=0');
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'key not found!' });
  });
  it('should return not found when query timestamp is minus', async() => {
    const response = await request(index).get('/object/key?timestamp=-1');
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text)).toEqual({ error: 'key not found!' });
  });
  it('should return not found when query timestamp is very large', async() => {
    const largeNumber = Number.MAX_VALUE * 10;
    const response = await request(index).get(`/object/key?timestamp=${largeNumber}`);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe('value3');
  });
});

const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  // {} is the object we are copying properties to
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // See if we have a value for 'key' in redis
  const cacheValue = await client.get(key);

  // If we do, return that
  if (cacheValue) {
    // convert to mongo format
    const doc = new this.model(JSON.parse(cacheValue));

    return doc;
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  // Turn result into json and store it into redis
  client.set(key, JSON.stringify(result));

  return result;
};

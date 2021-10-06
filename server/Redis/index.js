const { promisify } = require("util");
const redis = require("redis");
const env = require("../environment");
const config = require(__dirname + "/../config/config.json")[env];
const redisClient = redis.createClient({
  port: config.redisPort,
  host: config.host,
});

//get async redis
const getAsync = promisify(redisClient.get).bind(redisClient);

//set async in redis common function
const getFromRedis = async (key, callback) => {
  try {
    let data = await getAsync(key);
    return [JSON.parse(data), null];
  } catch (error) {
    return [null, error];
  }
};

//set async in redis common function
const setInRedis = async (key, data) => {
  try {
     // console.log(key, "this is socket");
    let serializedData = JSON.stringify(data);
    redisClient.set(key, serializedData, (err, value) => {
        console.log(value, "data in socket set");
      });
    return [true, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = {
  redisClient,
  getFromRedis,
  setInRedis,
};

const configureRedisClient = require('../config/redis');

function connectToRedis() {
  configureRedisClient.on('error', err => console.log('Redis Client Error', err));

  configureRedisClient.connect().then(() =>{console.log('Redis Client Connect Successfull')}).catch(err => console.log('err'));
  
}

module.exports = {connectToRedis};

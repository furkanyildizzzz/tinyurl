// memcacheClient.js
const memjs = require('memjs');
require('dotenv').config();

const memcacheClient = memjs.Client.create(process.env.MEMCACHIER_SERVERS);

console.log('Memcache client created');

module.exports = memcacheClient;

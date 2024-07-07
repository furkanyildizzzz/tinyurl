const Url = require('../models/url');

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const getCode = () => {
  let code = new Array(6)
    .fill()
    .map((_) => chars.charAt(~~(Math.random() * 62)));
  return 'http://tinyurl.com/' + code.join('');
};

const createUrl = async (originalUrl) => {
  const existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) return existingUrl;

  let shortUrl = getCode();
  while (await Url.findOne({ shortUrl })) shortUrl = getCode();

  return await Url.create({
    originalUrl,
    shortUrl,
  });
};

const getUrl = async (shortUrl) => await Url.findOne({ shortUrl });

const deleteUrl = async (originalUrl) => await Url.deleteOne({ originalUrl });

module.exports = {
  createUrl,
  getUrl,
  deleteUrl,
};

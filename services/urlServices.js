const Url = require('../models/url');
const mc = require('../lib/memcacheClient');
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const {
  generateShortURL,
  decodeShortURL,
} = require('../helper/generateShortUrl');
const getCode = () => {
  let code = new Array(6)
    .fill()
    .map((_) => chars.charAt(~~(Math.random() * 62)));
  return 'http://tinyurl.com/' + code.join('');
};

const createUrl = async (originalUrl) => {
  const existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) return existingUrl;

  let code = getCode();
  const { value } = await mc.get(code);
  while (value) code = getCode();

  await mc.set(code, originalUrl, {
    expires: 300 * 60, //60 * 60 * 24 * 30 * 12 * 5,
  }); // Cache for 5 years

  return await Url.create({
    originalUrl,
    shortUrl: code,
  });
};

const getUrl = async (shortUrl) => {
  const { value } = await mc.get(shortUrl);
  if (value) return { memcahce: value.toString('utf8') };

  const { originalUrl } = await Url.findOne({ shortUrl });

  if (originalUrl)
    await mc.set(shortUrl, originalUrl, {
      expires: 300 * 60, //60 * 60 * 24 * 30 * 12 * 5,
    });
  return { db: originalUrl };
};

const deleteUrl = async (originalUrl) => await Url.deleteOne({ originalUrl });

const getShortUrl = async (originalUrl) => generateShortURL(1000001392);
const decodeUrl = async (originalUrl) => decodeShortURL(originalUrl);

module.exports = {
  createUrl,
  getUrl,
  deleteUrl,
  getShortUrl,
  decodeUrl,
};

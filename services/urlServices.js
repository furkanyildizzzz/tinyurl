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

const createUrl = async (req, res) => {
  const { url } = req.body;

  const existingUrl = await Url.findOne({ originalUrl: url });
  if (existingUrl) return existingUrl;

  const shortUrl = 'http://tinyurl.com/' + (await generateShortURL());

  await mc.set(shortUrl, url, {
    expires: 300 * 60, //60 * 60 * 24 * 30 * 12 * 5,
  }); // Cache for 5 years

  return await Url.create({
    originalUrl: url,
    shortUrl,
    owner: req.user.id,
  });
};

const getUrl = async (req, res) => {
  const { shortUrl } = req.body;
  const { value } = await mc.get(shortUrl);
  if (value) return { memcahce: value.toString('utf8') };

  const url = await Url.findOne({ shortUrl });

  if (url) {
    await mc.set(shortUrl, url.originalUrl, {
      expires: 300 * 60, //60 * 60 * 24 * 30 * 12 * 5,
    });
  } else {
    res.status(400).json({ error: `The orignal Url cannot be found!` });
  }
  return { db: url.originalUrl };
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

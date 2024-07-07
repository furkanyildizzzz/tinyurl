const express = require('express');
const router = express.Router();
const {
  createUrl,
  getUrl,
  deleteUrl,
  getShortUrl,
  decodeUrl,
} = require('../services/urlServices');

router.post('/shorten', async (req, res, next) => {
  const { url } = req.body;
  const createdUrl = await createUrl(url);
  return res.status(200).json(createdUrl);
});

router.post('/redirect', async (req, res, next) => {
  const { url } = req.body;
  const originalUrl = await getUrl(url);
  return res.status(200).json({ originalUrl });
});

router.post('/delete', async (req, res, next) => {
  const { url } = req.body;
  await deleteUrl(url);
  return res.send('OK');
});

router.get('/get', async (req, res, next) => {
  const shortUrl = await getShortUrl();
  return res.send({ shortUrl });
});

router.post('/decode', async (req, res, next) => {
  const { url } = req.body;
  const decode = await decodeUrl(url);
  return res.send({ decode });
});

module.exports = router;

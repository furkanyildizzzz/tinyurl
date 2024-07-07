const express = require('express');
const router = express.Router();
const { createUrl, getUrl, deleteUrl } = require('../services/urlServices');

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

module.exports = router;

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
  try {
    const response = await createUrl(req, res);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/redirect', async (req, res, next) => {
  try {
    const response = await getUrl(req, res);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    const { url } = req.body;
    await deleteUrl(url);
    return res.send('OK');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

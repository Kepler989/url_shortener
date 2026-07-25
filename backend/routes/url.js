const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validUrl = require('valid-url');
const Url = require('../models/Url');
 
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL;
 
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base URL configured in server');
  }
 
  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json({ message: 'Invalid long URL provided' });
  }

  try { 
    let url = await Url.findOne({ longUrl });

    if (url) { 
      res.json(url);
    } else { 
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/${urlCode}`;

      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date()
      });

      await url.save();
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
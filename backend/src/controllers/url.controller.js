import { nanoid } from 'nanoid';
import URLModel from '../models/url.model.js';
import moment from 'moment';


const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export const createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;


    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format - URL must be a valid HTTP/HTTPS web address' });
    }

 
    let finalShortcode = shortcode;
    if (!finalShortcode) {
      finalShortcode = nanoid(6);
    } else {

      const existing = await URLModel.findOne({ shortCode: finalShortcode });
      if (existing) {
        return res.status(409).json({ error: 'Shortcode already in use' });
      }
    }

  
    const expiryDate = moment().add(validity, 'minutes').toDate();

    const newUrl = new URLModel({
      originalUrl: url,
      shortCode: finalShortcode,
      expiryDate
    });

    await newUrl.save();

   
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortLink = `${baseUrl}/${finalShortcode}`;

    res.status(201).json({
      shortLink,
      expiry: expiryDate.toISOString()
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlData = await URLModel.findOne({ shortCode: shortcode });

    if (!urlData) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (moment().isAfter(urlData.expiryDate)) {
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    const stats = {
      totalClicks: urlData.totalClicks,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiryDate: urlData.expiryDate,
      clickDetails: urlData.clicks
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectToUrl = async (req, res, next) => {
  try {
    const { shortcode } = req.params;
    const urlData = await URLModel.findOne({ shortCode: shortcode });
    
    if (!urlData) {

      return res.status(404).send('Short URL not found');
    }

    if (moment().isAfter(urlData.expiryDate)) {
      console.log('DEBUG - URL has expired:', shortcode);
      return res.status(410).send('Short URL has expired');
    }
    const clickData = {
      timestamp: new Date(),
      referrer: req.get('referer') || 'direct',
      location: req.ip
    };


    urlData.clicks.push(clickData);
    urlData.totalClicks += 1;
    await urlData.save();

    let redirectUrl = urlData.originalUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }


    res.writeHead(302, {
      'Location': redirectUrl,
      'Cache-Control': 'no-cache'
    });
    res.end();
    
  } catch (error) {
    res.status(500).send('Server error during redirect');
  }
}; 
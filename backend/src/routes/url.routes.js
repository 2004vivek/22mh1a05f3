import express from 'express';
import { createShortUrl, getUrlStats } from '../controllers/url.controller.js';
import { body } from 'express-validator';

const router = express.Router();


const validateCreateUrl = [
  body('url').isURL().withMessage('Invalid URL format'),
  body('validity').optional().isInt({ min: 1 }).withMessage('Validity must be a positive integer'),
  body('shortcode').optional().isString().matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid shortcode format')
];


router.post('/shorturls', validateCreateUrl, createShortUrl);


router.get('/shorturls/:shortcode', getUrlStats);

export default router;  
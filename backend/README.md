# URL Shortener Microservice

A robust HTTP URL Shortener Microservice that provides core URL shortening functionality along with basic analytical capabilities.

## Features

- Create shortened URLs with optional custom shortcodes
- Set validity period for shortened URLs (default: 30 minutes)
- Track usage statistics for shortened URLs
- Comprehensive logging system
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   BASE_URL=http://localhost:3000/api
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Create Short URL
- **POST** `/api/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com/very-long-url",
    "validity": 30,
    "shortcode": "custom123"
  }
  ```
- **Response:** (201 Created)
  ```json
  {
    "shortLink": "http://localhost:3000/api/custom123",
    "expiry": "2025-01-01T00:30:00Z"
  }
  ```

### Get URL Statistics
- **GET** `/api/shorturls/:shortcode`
- **Response:**
  ```json
  {
    "totalClicks": 42,
    "originalUrl": "https://example.com/very-long-url",
    "createdAt": "2025-01-01T00:00:00Z",
    "expiryDate": "2025-01-01T00:30:00Z",
    "clickDetails": [
      {
        "timestamp": "2025-01-01T00:15:00Z",
        "referrer": "https://google.com",
        "location": "US"
      }
    ]
  }
  ```

### Redirect to Original URL
- **GET** `/api/:shortcode`
- Redirects to the original URL if valid
- Returns appropriate error responses if expired or not found

## Error Responses

- **400** Bad Request: Invalid input data
- **404** Not Found: Short URL not found
- **409** Conflict: Shortcode already in use
- **410** Gone: Short URL has expired
- **500** Internal Server Error: Server error

## Logging

The application uses a custom logging middleware that logs:
- All API requests and responses
- Request details (method, URL, body, params)
- Response times
- Error details

Logs are stored in:
- `logs/access.log`: Successful requests
- `logs/error.log`: Error requests 
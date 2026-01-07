# Caching NodeJS with Redis

A Node.js Express application demonstrating API response caching using Redis. This project fetches user data from an external API and caches the responses to improve performance and reduce redundant API calls.

## Features

- Express.js REST API
- Redis caching middleware
- Configurable cache duration
- External API integration (JSONPlaceholder)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Redis** - In-memory data store for caching
- **ioredis** - Redis client for Node.js
- **node-fetch** - HTTP client for API requests

## Prerequisites

- Node.js (v14 or higher)
- Redis server running on localhost:6379

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Caching-NodeJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Redis server (using Docker):
   ```bash
   docker run -d -p 6379:6379 --name redis redis
   ```

4. Run the application:
   ```bash
   node index.js
   ```

The server will start on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user by ID (cached for 60 seconds) |

## How Caching Works

```
Request Flow:

   Client Request
        |
        v
  +-----------+
  |  Redis    |  Cache Hit?
  |  Cache    |-----> YES --> Return cached data
  +-----------+
        |
        NO
        |
        v
  +-----------+
  |  External |
  |    API    |
  +-----------+
        |
        v
  Store in Redis
  (TTL: 60 seconds)
        |
        v
  Return Response
```

1. **First Request**: Fetches data from external API, stores in Redis, returns response
2. **Subsequent Requests** (within 60s): Returns cached data directly from Redis
3. **After TTL Expires**: Cache is invalidated, next request fetches fresh data

## Project Structure

```
Caching-NodeJS/
├── index.js          # Main application file
├── package.json      # Project dependencies
└── Readme.md         # Documentation
```

## API Documentation

For detailed API documentation and examples, visit the Postman documentation:

[View API Documentation](https://documenter.getpostman.com/view/45894584/2sBXVeFCYa)

## Example Usage

### Get User by ID

**Request:**
```bash
curl http://localhost:3000/users/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874"
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

## Console Output

**Cache Miss (First Request):**
```
Fetching user 1 from external API
Fetched user 1 from external API
Cache set for /users/1 with duration 60 seconds
```

**Cache Hit (Subsequent Requests):**
```
Cache hit for /users/1
```

## Author

Goutham Balaji P S

## License

ISC

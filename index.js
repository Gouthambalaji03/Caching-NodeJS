import express from 'express';
import Redis from 'ioredis';
import fetch from 'node-fetch';



// Initialize Express app and Redis client
const app = express();
const redis = new Redis();
const PORT = 3000;
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/users';

// Middleware to check cache
const cacheMiddleware = (durationInSeconds) => {
    return async (req, res, next) => {
        const cacheKey = `__express__${req.originalUrl}`;
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                console.log(`Cache hit for ${req.originalUrl}`);
                res.set('Content-Type', 'application/json');
                return res.send(cachedData);
            }else {
                const originalSend = res.send.bind(res);
                res.send = async (body) => {
                    await redis.setex(cacheKey, durationInSeconds, body);
                    console.log(`Cache set for ${req.originalUrl} with duration ${durationInSeconds} seconds`);
                    return originalSend(body);
                };
            }
        } catch (error) {
            console.log('Redis error:',error);
            next();
        }

    }
}


// Middleware to fetch user data from external API
const fetchUserById = async (req, res) => {
  const userId = req.params.id;
  console.log(`Fetching user ${userId} from external API`);
  
  try {
    const response = await fetch(`${MOCK_API_URL}/${userId}`);
    if (!response){
        return res.status(404).json({ error: 'User not found' });
    }
    const user = await response.json();
    console.log(`Fetched user ${userId} from external API`);
    res.json(user);
    
  } catch (err) {
     console.log('Error while fetching data...',err);
    res.status(500).json({ error: 'Failed to fetch user data' });  
  }
};

// Route to get user by ID with caching
app.get("/users/:id", cacheMiddleware,fetchUserById);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`);
});
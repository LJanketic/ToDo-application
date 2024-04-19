import express from 'express';
import http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

// Middleware
const app = express();
app.use(express.json());

const port = process.env.PORT ?? '3000';

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}\n`);
});

module.exports = app;

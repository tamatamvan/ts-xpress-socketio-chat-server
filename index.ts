import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

import dotenv from 'dotenv';

dotenv.config();

type Message = { author: string; content: string };

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('It works!');
});

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('message', (message: Message) => {
    socket.broadcast.emit('message', message);
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

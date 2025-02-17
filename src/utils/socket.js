// utils/socket.js
import { io } from 'socket.io-client';

// Create a connection to the Socket.IO server
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Specify the transport method
});

export default socket;

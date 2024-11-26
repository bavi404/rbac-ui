const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 5000;
const SECRET_KEY = 'your_jwt_secret_key';

app.use(cors());
app.use(bodyParser.json());

const otpStore = {}; // Temporary OTP storage

// Mock User Data
const user = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('password123', 8),
};

// Socket.io for real-time updates
let stats = {
  userCount: 100,
  roleCount: 10,
};

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('update-stats', stats);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).send({ token });
  }

  res.status(401).send({ message: 'Invalid credentials' });
});

// OTP Generation Endpoint
app.post('/generate-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  console.log(`Generated OTP for ${email}: ${otp}`); // Simulate email sending

  res.send({ message: 'OTP sent!' });
});

// OTP Verification Endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false, message: 'Invalid OTP' });
  }
});

// Start the server
http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

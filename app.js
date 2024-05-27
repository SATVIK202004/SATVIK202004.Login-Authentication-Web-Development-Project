const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'loginDB';

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const users = db.collection('users');

    
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/forgot-password', async (req, res) => {
  try {
    const { username } = req.body;

    
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const users = db.collection('users');

    
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const resetToken = jwt.sign({ userId: user._id }, 'your-reset-token-secret', { expiresIn: '1h' });

    

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
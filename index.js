const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');
const restricted = require('./auth/required-middleware.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync('user.password', 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
server.get('/api/users', (req, res) => {
  Users.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/', restricted, (req, res) => {
  res.send('You have valid credentials!');
});
server.post('/hash', (req, res) => {
  const password = req.body.password;

  const hash = bcrypt.hashSync('password', 9);

  res.status(200).json({ password, hash });
});

const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));

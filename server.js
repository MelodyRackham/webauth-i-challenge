const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const apiRouter = require('./api/api-router');
const configureMiddleware = require('./configure-middleware.js');
const knexSessionStorage = require('connect-session-knex')(session);
const knexConnection = require('./data/db-config');
const server = express();

const sessionConfiguration = {
  name: 'snickerdoodle',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new knexSessionStorage({
    knex: knexConnection,
    clearInterval: 1000 * 60 * 10,
    createtable: true,
    sidfieldname: 'id',
    //optional:
    tablename: 'sessions',
  }),
};

configureMiddleware(server);

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));
server.use('/api', apiRouter);

server.get('/', (req, res) => {
  res.json({ api: 'running!', session: req.session });
});

module.exports = server;

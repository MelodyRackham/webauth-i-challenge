const bcrypt = require('bcryptjs'); // npm i bcryptjs

const router = require('express').Router();

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
  let userInfo = req.body;
  console.log(req);
  console.log(userInfo);
  console.log(req.body);
  // bcrypt.hash(userInfo.password, 12, (err, hashedPassword) => {
  //const hash = bcrypt.hashSync(user.password, 8);
  userInfo.password = bcrypt.hashSync(userInfo.password, 8);

  Users.add(userInfo)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;

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
      req.session.username = saved.username;
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
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
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

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({
          message: 'You can checkout any time you like, but you can never leave!!!!',
        });
      } else {
        res.status(200).json({ message: 'logged out!! ' });
      }
    });
  } else {
    res.status(200).end();
  }
});

module.exports = router;

const express = require('express');
const passport = require('passport');
const User = require('../classes/User');
const { asyncMiddleware } = require('../middleware/index');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    await new User(req.body).createUser();

    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  })
);

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const userList = await User.listUser(
      { active: true },
      { username: 1, mail: 1 }
    );
    res.json(userList);
  })
);

router.post(
  '/delete/:id',
  asyncMiddleware(async (req, res) => {
    const user = await User.deleteUser(req.params.id);
    res.json({ message: 'User successfully removed', data: user });
  })
);

router.post(
  '/update/:id',
  asyncMiddleware(async (req, res) => {
    const user = await new User(req.body).updateUser(req.params.id);
    res.json({ message: 'User successfully updated', data: user });
  })
);

module.exports = router;

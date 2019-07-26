let express = require("express"),
  router = express.Router({ mergeParams: true }),
  User = require("../classes/User"),
  { asyncMiddleware } = require("../middleware/index"),
  passport = require("passport");

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    await new User(req.body).createUser();

    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    });
  })
);

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    let userList = await User.listUser({ active: true }, { username: 1, mail: 1 });
    res.json(userList);
  })
);

router.post(
  "/delete/:id",
  asyncMiddleware(async (req, res) => {
    let user = await User.deleteUser(req.params.id);
    res.json({ message: "User successfully removed", data: user });
  })
);

router.post(
  "/update/:id",
  asyncMiddleware(async (req, res) => {
    let user = await new User(req.body).updateUser(req.params.id);
    res.json({ message: "User successfully updated", data: user });
  })
);

module.exports = router;

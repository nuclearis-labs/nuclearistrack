const jwt = require('jsonwebtoken');
const niv = require('../services/Validator.js');

module.exports.asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
      const authData = jwt.verify(req.token, process.env.JWT_SECRET);
      req.user = authData;
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  } else res.sendStatus(403);
};

module.exports.validateForm = rules => {
  return (req, res, next) => {
    const v = new niv.Validator(
      { body: req.body, params: req.params, query: req.query },
      rules
    );

    v.check().then(matched => {
      if (!matched) {
        res.status(422).send(v.errors);
      } else {
        next();
      }
    });
  };
};

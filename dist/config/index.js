"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Validator_js_1 = __importDefault(require("../config/Validator.js"));
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            const authData = jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET);
            req.user = authData;
            next();
        }
        catch (e) {
            res.sendStatus(403);
        }
    }
    else
        res.sendStatus(403);
}
exports.verifyToken = verifyToken;
function validateForm(rules) {
    return (req, res, next) => {
        const v = new Validator_js_1.default.Validator({ body: req.body, params: req.params, query: req.query }, rules);
        v.check().then(matched => {
            if (!matched) {
                res.status(422).send(v.errors);
            }
            else {
                next();
            }
        });
    };
}
exports.validateForm = validateForm;
//# sourceMappingURL=index.js.map
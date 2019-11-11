"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const { verifyToken, validateForm } = require('../config/index');
const rules = require('../config/validationRules');
const router = express_1.default.Router({ mergeParams: true });
const DocumentController = require('../controllers/DocumentController');
router.post('/verify', upload.single('file'), validateForm(rules.documentVerify), DocumentController.verify);
router.post('/upload', verifyToken, upload.single('file'), validateForm(rules.documentUpload), DocumentController.upload);
router.get('/get', DocumentController.get);
router.get('/getOne', validateForm(rules.documentGetOne), DocumentController.getOne);
module.exports = router;
//# sourceMappingURL=documents.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("../config/winston"));
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/nrspoe';
mongoose_1.default
    .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    winston_1.default.info(`Connected to database ${db}`);
})
    .catch(e => {
    winston_1.default.error(`Couldn't connect to database `, {
        name: e.name,
        message: e.message
    });
});
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useFindAndModify', false);
//# sourceMappingURL=mongoose_connect.js.map
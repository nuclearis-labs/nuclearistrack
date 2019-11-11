"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
exports.default = new web3_1.default(new web3_1.default.providers.HttpProvider('http://127.0.0.1:8545'));
//# sourceMappingURL=web3.js.map
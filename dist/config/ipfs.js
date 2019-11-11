"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_http_client_1 = __importDefault(require("ipfs-http-client"));
const node = new ipfs_http_client_1.default('localhost', '5001', {
    protocol: 'http'
});
function saveToIPFS(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [{ hash }] = yield node.add(buffer);
            return hash;
        }
        catch (err) {
            throw Error(err);
        }
    });
}
exports.saveToIPFS = saveToIPFS;
function getFromIPFS(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield node.get(hash);
        }
        catch (err) {
            throw Error(err);
        }
    });
}
exports.getFromIPFS = getFromIPFS;
//# sourceMappingURL=ipfs.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ipfs from 'ipfs-http-client';
const node = new ipfs('localhost', '5001', {
    protocol: 'http'
});
export const saveToIPFS = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [{ hash }] = yield node.add(buffer);
        return hash;
    }
    catch (err) {
        throw Error(err);
    }
});
export const getFromIPFS = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield node.get(hash);
    }
    catch (err) {
        throw Error(err);
    }
});
//# sourceMappingURL=ipfs.js.map
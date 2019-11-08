const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    address: String,
    type: Number,
    status: Boolean,
    encryptedPrivateKey: String
});
export default mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map
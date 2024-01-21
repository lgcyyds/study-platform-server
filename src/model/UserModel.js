const { db, Schema } = require('../mongodb/index')
const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        default: '用户' + Date.now()
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
        required: true,
        default: '/images/defaultImg.png'
    },
    openID: {
        type: String,
        required: true,
        unique: true
    },
});
module.exports = db.model('users', usersSchema);
const { db, Schema } = require('../mongodb/index')
const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
});
module.exports = db.model('users', usersSchema);
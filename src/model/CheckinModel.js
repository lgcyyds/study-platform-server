const { db, Schema } = require('../mongodb/index')
const checkinSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    checkinTime: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = db.model('checkin', checkinSchema)
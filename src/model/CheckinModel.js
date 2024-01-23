const { db, Schema } = require('../mongodb/index')
const checkinSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    checkinTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
})

module.exports = db.model('checkins', checkinSchema)
const { db, Schema } = require('../mongodb/index')
const readHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'user'
    },
    history: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'article'
        }
    ],
})
module.exports = db.model('readHistory', readHistorySchema)
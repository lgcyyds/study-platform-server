const { db, Schema } = require('../mongodb/index')
const collectedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'article'
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'question'
    },
})
module.exports = db.model('collects', collectedSchema)
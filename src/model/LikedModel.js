const { db, Schema } = require('../mongodb/index')
const likedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'article'
    },
})
module.exports = db.model('likeds', likedSchema)
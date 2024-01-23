const { db, Schema } = require('../mongodb/index')
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    articleId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'article',
    },
    readMark: {
        type: Boolean,
        default: false,
        required: true,
    },
    commentTime: {
        type: Date,
        default: Date.now(),
    },
})
module.exports = db.model('comments', commentSchema)
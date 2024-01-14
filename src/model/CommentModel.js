const { db, Schema } = require('../mongodb/index')
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    article: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'article',
    },
    readMark: {
        type: Boolean,
        default: false,
        required: true,
    },
})
module.exports = db.model('comment', commentSchema)
const { db, Schema } = require('../mongodb/index')
const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    cover: {
        type: String,
        require: true,
        default: '/defaultCover.png'
    },
    createdTime: {
        type: Date,
        default: () => Date.now(),
    },
    visited: {
        type: Number,
        default: 0
    },
    liked: {
        type: Number,
        default: 0
    },
    collected: {
        type: Number,
        default: 0
    }
})
module.exports = db.model('articles', articleSchema)
const { db, Schema } = require('../mongodb/index')
// options = [{
// value: 'A',label: 'A'},
// {value: 'B',label: 'B'},
// {value: 'C',label: 'C'},
// {value: 'D',label: 'D'}
// ]
const questionsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true
    },
    rightOption: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    tags: {
        type: Array,
        required: true,
    },
    collectUsers: {
        type: Array,
        default: []
    },
});
module.exports = db.model('question', questionsSchema);
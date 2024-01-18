const Router = require('koa-router')
const { addQuestion, getQuestion } = require('../controllers/questions')
const router = new Router({
    prefix: '/question'
})
router.post('/add', addQuestion)

router.get('/get', getQuestion)

module.exports = router
const Router = require('koa-router')
const { addQuestion, getQuestion, collectQuestion } = require('../controllers/questions')
const router = new Router({
    prefix: '/question'
})
router.post('/add', addQuestion)

router.get('/get', getQuestion)

router.post('/collect', collectQuestion)
module.exports = router
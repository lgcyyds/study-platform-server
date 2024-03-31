const Router = require('koa-router')
const { addQuestion, getQuestion, collectQuestion, getCollectStatus } = require('../controllers/questions')
const router = new Router({
    prefix: '/question'
})
router.post('/add', addQuestion)

router.get('/get', getQuestion)

router.post('/collect', collectQuestion)
router.get('/getCollectStatus', getCollectStatus)
module.exports = router
const Router = require('koa-router')
const { addArticle, getArticle } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
router.get('/get', getArticle)
module.exports = router
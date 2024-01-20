const Router = require('koa-router')
const { addArticle } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
module.exports = router
const Router = require('koa-router')
const { createArticle } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})
router.post('/create', createArticle)
module.exports = router
const Router = require('koa-router')
const { addArticle, getArticle, collectOrLikeArticle, commentArticle } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
router.get('/get', getArticle)
router.post('/collectOrLike', collectOrLikeArticle)
router.post('/comment', commentArticle)
module.exports = router
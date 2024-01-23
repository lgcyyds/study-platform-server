const Router = require('koa-router')
const { addArticle, getArticle, collectOrLikeArticle, commentArticle, getLikeArticle, getCollectAll } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
router.get('/get', getArticle)
router.post('/collectOrLike', collectOrLikeArticle)
router.post('/comment', commentArticle)
router.get('/getliked', getLikeArticle)
router.get('/getAllCollect', getCollectAll)
module.exports = router
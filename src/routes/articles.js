const Router = require('koa-router')
const { addArticle, getArticle, collectOrLikeArticle, commentArticle, getLikeArticle, getCollectAll, editArticle, delArticle, getReadHistory, getLikeArticleMsg, getcollectArticleMsg, getCommentArticleMsg } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
router.get('/get', getArticle)
router.post('/collectOrLike', collectOrLikeArticle)
router.post('/comment', commentArticle)
router.get('/getliked', getLikeArticle)
router.get('/getAllCollect', getCollectAll)
router.post('/edit', editArticle)
router.post('/delete', delArticle)
router.get('/getHistory', getReadHistory)
router.get('/getLikeArticleMsg', getLikeArticleMsg)
router.get('/getcollectArticleMsg', getcollectArticleMsg)
router.get('/getCommentArticleMsg', getCommentArticleMsg)
module.exports = router
const Router = require('koa-router')
const upload = require('../utils/upLoad.js')
const { addArticle, getArticle, collectOrLikeArticle, commentArticle, getLikeArticle, getCollectAll, editArticle, delArticle, getReadHistory, getLikeArticleMsg, getcollectArticleMsg, getCommentArticleMsg, delMyArticleComment, delMyComment, getComment, uploadCover } = require('../controllers/articles')
const router = new Router({
    prefix: '/articles'
})

router.post('/add', addArticle)
router.post('/uploadArticleCover', upload.single('pic'), uploadCover)
router.get('/get', getArticle)
router.post('/collectOrLike', collectOrLikeArticle)
router.post('/comment', commentArticle)
router.get('/getComment', getComment)
router.post('/delArticleComment', delMyArticleComment)
router.post('/delComment', delMyComment)
router.get('/getliked', getLikeArticle)
router.get('/getAllCollect', getCollectAll)
router.post('/edit', editArticle)
router.post('/delete', delArticle)
router.get('/getHistory', getReadHistory)
router.get('/getLikeArticleMsg', getLikeArticleMsg)
router.get('/getcollectArticleMsg', getcollectArticleMsg)
router.get('/getCommentArticleMsg', getCommentArticleMsg)
module.exports = router
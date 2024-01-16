const Router = require('koa-router')
const router = new Router()
const { searchKeyWords } = require('../controllers/search')

router.post('/search', searchKeyWords)
module.exports = router
const Router = require('koa-router')
const router = new Router()
const { index } = require('../controllers/home')
router.post('/', index)

module.exports = router
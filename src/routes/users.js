const Router = require('koa-router')
const { find, findById, login } = require('../controllers/users')
// **配置路由前缀**
const router = new Router({
    prefix: '/users'
})

router.get('/login', login)
module.exports = router

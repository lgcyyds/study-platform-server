const Router = require('koa-router')
const { find, findById, login,signIn } = require('../controllers/users')
// **配置路由前缀**
const router = new Router({
    prefix: '/users'
})

router.get('/login', login)
router.post('/signin', signIn)
module.exports = router

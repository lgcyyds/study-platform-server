const Router = require('koa-router')
const { find, findById } = require('../controllers/users')
// **配置路由前缀**
const router = new Router({
    prefix: '/users'
})

router.get('/', find)

router.get('/:id',findById)

module.exports = router

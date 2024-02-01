const Router = require('koa-router')
const { login, signIn, editUserInfo,uploadAvatar } = require('../controllers/users')
const upload = require('../utils/upLoad.js')
// **配置路由前缀**
const router = new Router({
    prefix: '/users'
})

router.get('/login', login)
router.post('/signin', signIn)
router.post('/editUserInfo', editUserInfo)
router.post('/uploadAvatar', upload.single('pic'), uploadAvatar)
module.exports = router

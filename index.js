const Koa = require('koa')
const routing = require('./routes')
const static = require('koa-static')
const logger = require('koa-logger')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const catchError = require('./middlewares/catchError.js')
const errorHandler = require('./utils/errorHandler.js')
const app = new Koa()
const db = require('./mongodb/index')
// 放到路由前面,用于解析post参数
app
    .use(logger())
    .use(bodyParser())
    .use(static(path.join(__dirname, './public/userAvatar')))
    .use(static(path.join(__dirname, './public/articleCover')))
    .use(catchError)
    .on('error', errorHandler)
// 静态文件根目录

routing(app)
app.listen(3000, () => {
    console.log("监听3000端口");
})
console.log(path.join(__dirname, 'public'));
console.log(path.join(__dirname, './public/'));

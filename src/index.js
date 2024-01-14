const Koa = require('koa')
const routing = require('./routes')
const bodyParser = require('koa-bodyparser')
const catchError = require('./middlewares/catchError.js')
const errorHandler = require('./utils/errorHandler.js')
const app = new Koa()
const db = require('./mongodb/index')
// 放到路由前面,用于解析post参数
app
    .use(bodyParser())
    .use(catchError)
    .on('error', errorHandler)

routing(app)
app.listen(3000, () => {
    console.log("监听3000端口");
})
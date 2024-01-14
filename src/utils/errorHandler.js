module.exports = function errorHandler(error, ctx) {
    ctx.status = error.status || 500
    ctx.body = {
        code: error.code,
        message: error.msg,
        data: null
    }
}
module.exports = function successHandler(ctx, data) {
    ctx.status = 200
    ctx.body = {
        code: '0000',
        message: '成功',
        data: data
    }
}
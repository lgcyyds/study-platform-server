class UsersCtl {
    async find(ctx) {
        // 操作数据库一定要 await
        ctx.body = '用户列表'
    }
    async findById(ctx) {
        ctx.body = `用户id：${ctx.params.id}`
    }
}

module.exports = new UsersCtl
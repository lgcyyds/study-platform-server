class HomeCtl {
    index(ctx) {
        console.log(ctx.url);

        ctx.body = '这是主页'
    }
}

module.exports = new HomeCtl()
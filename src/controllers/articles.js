const articleModel = require('../model/ArticleModel.js')
class articlesCtl {
    async addArticle(ctx) {
        const param = ctx.request.body
        console.log(param);
        try {
            // const result = await articleModel.create(param)
            // if (result) {
            successHandler(ctx, result)
            // }
        } catch (error) {
            externalException('数据库插入错误')
        }
    }
    async getArticle(ctx) {
        const { id, collect, liked, keywords, page } = ctx.request.body
        const sortRule = {

        }
        const findRule = {

        }
        const result = await articleModel.find(findRule).sort(sortRule).skip(10 * (page - 1)).limit(10)
    }
}
module.exports = new articlesCtl
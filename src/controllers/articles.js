const articleModel = require('../model/ArticleModel.js')
const externalException = require('../exception/externalException.js')
const successHandler = require('../utils/successHandler');
class articlesCtl {
    async addArticle(ctx) {
        const param = ctx.request.body
        try {
            const result = await articleModel.create(param)
            if (result) {
                successHandler(ctx, result)
            }
        } catch (error) {
            console.log(error);

            throw new externalException('数据库插入错误')
        }
    }
    async getArticle(ctx) {
        const { id, collected, liked, keywords, page } = ctx.request.body
        let sortRule = { createdTime: -1 }
        let findRule = {}
        if (collected) {
            sortRule = { collected: -1 }
        } else if (liked) {
            sortRule = { liked: -1 }
        }
        if (keywords) {
            findRule = { title: { $regex: keywords, $options: 'i' } }
        } else if (id) {
            findRule = { _id: id }
        }
        try {
            const result = await articleModel.find(findRule).sort(sortRule).skip(10 * (page - 1)).limit(10)
            successHandler(ctx, result)
        } catch (error) {
            console.log(error);

            throw new externalException('数据库查询错误')
        }
    }
}
module.exports = new articlesCtl
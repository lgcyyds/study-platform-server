const ExternalException = require('../exception/externalException');
const successHandler = require('../utils/successHandler');
const articleModel = require('../model/ArticleModel');
class ArticleCtl {
    async createArticle(ctx) {
        try {
            const result = await articleModel.create(ctx.request.body);
            if (result) {
                successHandler(ctx, result);
            }
        } catch (error) {
            throw new ExternalException('数据库插入错误')
        }
    }

}

module.exports = new ArticleCtl
const ExternalException = require('../exception/externalException');
const successHandler = require('../utils/successHandler');
const articleModel = require('../model/ArticleModel');
const questionModel = require('../model/QuestionModel');
class SearchCtl {
    async searchKeyWords(ctx) {
        const keyword = ctx.query.keyword
        try {
            const articleResult = await articleModel.find({ title: { $regex: keyword } })
            const questionModel = await questionModel.find({ title: { $regex: keyword } })
            const dataArr = [...articleResult, ...questionModel]
            successHandler(ctx, dataArr)
        } catch (error) {
            console.log(error);

            throw new ExternalException('数据库查询出错')
        }

    }
}

module.exports = new SearchCtl
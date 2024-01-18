const successHandler = require('../utils/successHandler');
const questionModel = require('../model/QuestionModel')
const externalException = require('../exception/externalException.js')
class QuestionCtl {
    async addQuestion(ctx) {
        const param = ctx.request.body
        // console.log(param);
        try {
            const result = await questionModel.create(param)
            if (result) {
                successHandler(ctx, result)
            }
        } catch (error) {
            externalException('数据库插入错误')
        }
    }
    async getQuestion(ctx) {
        const { page, level, tag } = ctx.query
        let sortRule = { _id: -1 }
        let findTitle = {}
        console.log(page, level, tag);
        if (level) {
            sortRule = {
                level: level == 1 ? 1 : -1,
                _id: -1
            }
        }
        if (tag) {
            findTitle = { tags: { $elemMatch: { $regex: tag ,$options:"i"} } }//不区分大小写
        }
        try {
            const result = await questionModel.find(findTitle).sort(sortRule).skip(10*(page - 1)).limit(10)
            if (result) {
                successHandler(ctx,result)
            }
        } catch (error) {
            externalException('数据库查询错误')
        }
    }
    async collectQuestion() {

    }
}
module.exports = new QuestionCtl
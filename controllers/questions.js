const successHandler = require('../utils/successHandler');
const questionModel = require('../model/QuestionModel')
const collectModel = require('../model/CollectModel')
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
        const { id, page = 1, level, tag, keywords } = ctx.query
        let sortRule = { _id: -1 }
        let findTitle = {}
        if (level) {
            sortRule = {
                level: level == 1 ? 1 : -1,
                _id: -1
            }
        }
        if (tag) {
            findTitle = { tags: { $elemMatch: { $regex: tag, $options: "i" } } }//不区分大小写
        }
        if (id) {
            findTitle = { _id: id }
        }
        if (keywords) {
            findTitle = { title: { $regex: keywords } }
        }
        try {
            const result = await questionModel.find(findTitle).sort(sortRule).skip(10 * (page - 1)).limit(10)
            if (result) {
                successHandler(ctx, result)
            }
        } catch (error) {
            externalException('数据库查询错误')
        }
    }
    //收藏题目
    async collectQuestion(ctx) {
        const { userId, questionId } = ctx.request.body
        try {
            const result = await collectModel.findOne({ userId, questionId })
            if (result) {
                successHandler(ctx, { message: '不能重复收藏' })
            } else {
                const delResult = await collectModel.create({ userId, questionId })
                successHandler(ctx, { message: '收藏成功' })
            }
        } catch (error) {
            externalException('数据库更新错误')
        }
    }
}
module.exports = new QuestionCtl
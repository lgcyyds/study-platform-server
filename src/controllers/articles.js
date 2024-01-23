const articleModel = require('../model/ArticleModel.js')
const externalException = require('../exception/externalException.js')
const successHandler = require('../utils/successHandler');
const likedModel = require('../model/LikedModel.js')
const collectModel = require('../model/CollectModel.js')
const commentModel = require('../model/CommentModel.js')
const quetionModel = require('../model/QuestionModel.js')
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
    //收藏、点赞文章
    async collectOrLikeArticle(ctx) {
        const { userId, articleId, type } = ctx.request.body
        //type=0是点赞   1是收藏
        try {
            if (type) {//收藏
                const findResult = await collectModel.findOne({ userId, articleId })
                if (!findResult) {
                    const updateResult = await collectModel.create({ userId, articleId })
                    successHandler(ctx, { message: "收藏成功" })
                } else {
                    successHandler(ctx, { message: "不可重复收藏" })
                }
            } else {//点赞
                const findResult = await likedModel.findOne({ userId, articleId })
                if (!findResult) {
                    const updateResult = await likedModel.create({ userId, articleId })
                    successHandler(ctx, { message: "点赞成功" })
                } else {
                    successHandler(ctx, { message: "不可重复点赞" })
                }
            }
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }


    }
    // 评论文章
    async commentArticle(ctx) {
        const { userId, articleId, content } = ctx.request.body
        try {
            const result = await commentModel.create({ userId, articleId, content })
            if (result) {
                successHandler(ctx, { message: "评论成功" })
            } else {
                successHandler(ctx, { message: "评论失败" })
            }
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //获取点赞的文章
    async getLikeArticle(ctx) {
        const id = ctx.query.id
        try {
            const result = await likedModel.find({ userId: id })
            if (result.length) {
                let articleIdList = result.map(element => {
                    return element.articleId
                })
                const articleList = await articleModel.aggregate([{ $match: { _id: { $in: articleIdList } } }])
                successHandler(ctx, articleList)
            } else {
                successHandler(ctx, { message: "没有点赞文章" })
            }
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //获取收藏的文章和题目
    async getCollectAll(ctx) {
        const id = ctx.query.id
        try {
            const articleList = await collectModel.find({ userId: id, questionId: null })
            const questionList = await collectModel.find({ userId: id, articleId: null })
            if (articleList.length || questionList.length) {
                let articleIdList = articleList.map(element => {
                    return element.articleId
                })
                let questionIdList = questionList.map(element => {
                    return element.questionId
                })
                const articleListResult = await articleModel.aggregate([{ $match: { _id: { $in: articleIdList } } }])
                const questionListResult = await quetionModel.aggregate([{ $match: { _id: { $in: questionIdList } } }])
                successHandler(ctx, { articleListResult, questionListResult })
                return
            }
            successHandler(ctx, { message: "没有收藏文章和题目" })
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
}
module.exports = new articlesCtl
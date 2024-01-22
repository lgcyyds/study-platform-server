const articleModel = require('../model/ArticleModel.js')
const externalException = require('../exception/externalException.js')
const successHandler = require('../utils/successHandler');
const likedModel = require('../model/LikedModel.js')
const collectModel = require('../model/CollectModel.js')
const commentModel = require('../model/CommentModel.js')
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
}
module.exports = new articlesCtl
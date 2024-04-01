const articleModel = require('../model/ArticleModel.js')
const externalException = require('../exception/externalException.js')
const successHandler = require('../utils/successHandler');
const likedModel = require('../model/LikedModel.js')
const collectModel = require('../model/CollectModel.js')
const commentModel = require('../model/CommentModel.js')
const quetionModel = require('../model/QuestionModel.js')
const userModel = require('../model/UserModel')
const mongoose = require('mongoose');
const CheckinModel = require('../model/CheckinModel.js');
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
    //文章图片上传
    async uploadCover(ctx) {
        let result = {
            filename: ctx.req.file.filename,//返回文件名
            body: ctx.req.body
        }
        successHandler(ctx, result)
    }

    async getArticle(ctx) {
        const { id, collected, liked, keywords, page } = ctx.query
        let sortRule = { createdTime: -1 }
        let findRule = {}
        if (collected == 1) {
            sortRule = { collected: -1 }
        } else if (liked == 1) {
            sortRule = { liked: -1 }
        }
        if (keywords) {
            findRule = { title: { $regex: keywords, $options: 'i' } }
        } else if (id) {
            findRule = { $or: [{ _id: id }, { author: id }] }
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
        console.log(type);
        try {
            if (type) {//收藏
                const findResult = await collectModel.findOne({ userId, articleId })
                if (!findResult) {
                    const updateResult = await collectModel.create({ userId, articleId })
                    await articleModel.updateOne({ articleId }, { $inc: { collected :1}})
                    successHandler(ctx, { message: "收藏成功" })
                } else {
                    const updateResult = await collectModel.deleteOne({ userId, articleId })
                    await articleModel.updateOne({ articleId }, { $inc: { collected: -1 } })
                    successHandler(ctx, { message: "取消收藏成功" })
                }
            } else {//点赞
                const findResult = await likedModel.findOne({ userId, articleId })
                await articleModel.updateOne({ articleId }, { $inc: { liked: 1 } })
                if (!findResult) {
                    const updateResult = await likedModel.create({ userId, articleId })
                    successHandler(ctx, { message: "点赞成功" })
                } else {
                    const updateResult = await likedModel.deleteOne({ userId, articleId })
                    await articleModel.updateOne({ articleId }, { $inc: { liked: -1 } })
                    successHandler(ctx, { message: "取消点赞成功" })
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
        console.log(userId, articleId, content);
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
    //删除我的文章里面的评论
    async delMyArticleComment(ctx) {
        const { userId, articleId, id } = ctx.request.body
        try {
            const result = await articleModel.find({ author: userId, _id: articleId })
            if (result.length) {
                await commentModel.deleteOne({ _id: id })
                successHandler(ctx, { message: "删除成功" })
            } else {
                successHandler(ctx, { message: "你没有权限删除这条评论" })
            }
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //删除我的评论
    async delMyComment(ctx) {
        const { userId, id } = ctx.request.body
        try {
            const result = await commentModel.deleteOne({ userId: userId, _id: id })
            if (result.deletedCount == 0) {
                successHandler(ctx, { message: "你没有权限删除这条评论" })
            } else {
                successHandler(ctx, { message: "删除成功" })
            }
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //获取文章评论
    async getComment(ctx) {
        const id = ctx.query.id
        const articleId = new mongoose.Types.ObjectId(id)
        try {
            // const result = await commentModel.find({ articleId: id }).sort({ _id: -1 })
            const result = await commentModel.aggregate([
                {
                    $match: { articleId: articleId }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
            ])
            successHandler(ctx, result)
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
    //编辑文章
    async editArticle(ctx) {
        const { id, title, content } = ctx.request.body
        try {
            const result = await articleModel.updateOne({ _id: id }, { title, content })
            successHandler(ctx, result)
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //删除文章
    async delArticle(ctx) {
        const id = ctx.query.id
        try {
            const result = await articleModel.deleteOne({ _id: id })
            successHandler(ctx, result)
        } catch (error) {
            throw new externalException('数据库出错')
        }
    }
    //获取阅读历史
    async getReadHistory(ctx) {
        const articleList = JSON.parse(ctx.query.articleList)
        try {
            const result = await articleModel.find({ _id: { $in: articleList } })
            successHandler(ctx, result)
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
    //获取点赞我的人和对应的文章
    async getLikeArticleMsg(ctx) {
        const id = ctx.query.id
        const userId = new mongoose.Types.ObjectId(id)
        try {
            const result = await articleModel.aggregate([
                {
                    $match: { author: userId }
                },
                {
                    $lookup: {
                        from: 'likeds',
                        localField: '_id',
                        foreignField: 'articleId',
                        as: 'liked'
                    }
                },
                {
                    $unwind: {
                        path: '$liked',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'liked.userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        liked: 1,
                        userInfo: {
                            $let: {
                                vars: {
                                    userInfoElement: { $arrayElemAt: ['$userInfo', 0] }
                                },
                                in: {
                                    username: '$$userInfoElement.username',
                                    avatar: '$$userInfoElement.avatar'
                                }
                            }
                        }
                    }
                }
            ])
            successHandler(ctx, result)
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
    //获取收藏我文章的人和对应文章的标题和id
    async getcollectArticleMsg(ctx) {
        const id = ctx.query.id
        const userId = new mongoose.Types.ObjectId(id)
        try {
            const result = await articleModel.aggregate([
                {
                    $match: { author: userId }
                },
                {
                    $lookup: {
                        from: 'collects',
                        localField: '_id',
                        foreignField: 'articleId',
                        as: 'collected'
                    }
                },
                {
                    $unwind: {
                        path: '$collected',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'collected.userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        collected: 1,
                        userInfo: {
                            $let: {
                                vars: {
                                    userInfoElement: { $arrayElemAt: ['$userInfo', 0] }
                                },
                                in: {
                                    username: '$$userInfoElement.username',
                                    avatar: '$$userInfoElement.avatar'
                                }
                            }
                        }
                    }
                }
            ])
            successHandler(ctx, result)
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
    //获取评论我文章的人和对应的评论内容和文章标题及id
    async getCommentArticleMsg(ctx) {
        const id = ctx.query.id
        const userId = new mongoose.Types.ObjectId(id)
        try {
            let result = await articleModel.aggregate([
                {
                    $match: { author: userId }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'articleId',
                        as: 'comment'
                    }
                },
                {
                    $unwind: '$comment'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'comment.userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        title: { $first: '$title' },
                        content: { $first: '$content' },
                        author: { $first: '$author' },
                        userInfo: { $first: '$userInfo' },
                        lastComment: { $first: '$comment' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        author: 1,
                        userInfo: {
                            $let: {
                                vars: {
                                    userInfoElement: { $arrayElemAt: ['$userInfo', 0] }
                                },
                                in: {
                                    username: '$$userInfoElement.username',
                                    avatar: '$$userInfoElement.avatar'
                                }
                            }
                        },
                        lastComment: 1
                    }
                }
            ])
            successHandler(ctx, result)
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
    //获取文章的点赞和收藏状态
    async getLikedAndCollectStatus(ctx) {
        const { userId, articleId } = ctx.query
        let liked = 0
        let collected = 0
        try {
            let likedState = await likedModel.find({ userId, articleId })
            let collectState = await collectModel.find({ userId, articleId })
            if (likedState.length) liked = 1;
            if (collectState.length) collected = 1;
            console.log(liked, collected);
            successHandler(ctx, { liked, collected })
        } catch (error) {
            console.log(error);
        }
    }
    //获取文章作者信息
    async getAuthorInfo(ctx) {
        const id = ctx.query.id
        try {
            const result = await userModel.findById(id)
            const signCount = await CheckinModel.find({ userId: id }).countDocuments()
            successHandler(ctx, { result, signCount })
        } catch (error) {
            console.log(error);
            throw new externalException('数据库出错')
        }
    }
}
module.exports = new articlesCtl
const axios = require('axios');
const ExternalException = require('../exception/externalException');
const successHandler = require('../utils/successHandler');
const userModel = require('../model/UserModel')
const checkInModel = require('../model/CheckinModel')
const CollectModel = require('../model/CollectModel')
const ArticleModel = require('../model/ArticleModel')
const { appID, appSecret } = require('../config');
class UsersCtl {
    async login(ctx) {
        const code = ctx.query.code
        try {
            const result = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`);
            if (result.data.session_key) {
                const resultMsg = await userModel.findOne({ openID: result.data.openid })
                if (!resultMsg) {
                    const userMsg = await userModel.create({ openID: result.data.openid })
                    let userInfo = {
                        id: userMsg._id,
                        username: userMsg.username,
                        avatar: userMsg.avatar,
                        email: resultMsg.email
                    }
                    successHandler(ctx, { msg: "登录成功", userInfo })
                    return
                }
                let userInfo = {
                    id: resultMsg._id,
                    username: resultMsg.username,
                    avatar: resultMsg.avatar,
                    email: resultMsg.email
                }
                successHandler(ctx, { msg: "登录成功", userInfo })
            } else {

                throw new ExternalException('登录失败!')
            }
        } catch (error) {
            console.log(error);

            throw new ExternalException('登录失败')
        }
    }
    async signIn(ctx) {
        const id = ctx.query.id
        //当天凌晨时间戳
        let now = new Date()
        now.setHours(0, 0, 0, 0)
        let time = now.getTime()
        try {
            const result = await checkInModel.findOne({ userId: id }).sort({ checkinTime: -1 }).limit(1)
            if (result && result.checkinTime > time) {//最后一次签到是今天凌晨后不允许签到
                successHandler(ctx, { message: '今天已经签到了', code: 0 })
                return
            }
            const signResult = await checkInModel.create({ userId: id, checkinTime: Date.now() })
            successHandler(ctx, { message: '签到成功', code: 1 })
        } catch (error) {
            console.log(error);
            throw new ExternalException('签到失败')
        }
    }
    //查询签到情况
    async checkSignIn(ctx) {
        const id = ctx.query.id
        //当天凌晨时间戳
        let now = new Date()
        now.setHours(0, 0, 0, 0)
        let time = now.getTime()
        try {
            const result = await checkInModel.findOne({ userId: id }).sort({ checkinTime: -1 }).limit(1)
            if (result && result.checkinTime > time) {//最后一次签到是今天凌晨后不允许签到
                successHandler(ctx, { message: '今天已经签到了', code: 1 })
                return
            }
            successHandler(ctx, { message: '今天没有签到', code: 0 })
        } catch (error) {
            console.log(error);
            throw new ExternalException('签到失败')
        }
    }
    //修改个人信息
    async editUserInfo(ctx) {
        const { id, username, avatar, email } = ctx.request.body
        console.log(id, username, avatar, email);
        try {
            let result = await userModel.updateOne({ _id: id }, { username, avatar, email })
            if (result) {
                successHandler(ctx, { message: '修改成功' })   
            } else {
                successHandler(ctx, { message: '修改失败' }) 
            }
        } catch (error) {
            throw new ExternalException('修改失败')
        }
    }
    //头像上传
    async uploadAvatar(ctx) {
        let result = {
            filename: '/'+ctx.req.file.filename,//返回文件名
            body: ctx.req.body
        }
        successHandler(ctx, result)
    }
    //查询签到天数、收藏数量和文章数量
    async getOtherInfo(ctx) {
        const id = ctx.query.id
        try {
            let checkInCount = await checkInModel.find({ userId: id }).countDocuments()
            let collectCount = await CollectModel.find({ userId: id }).countDocuments()
            let myArticleCount = await ArticleModel.find({ author: id }).countDocuments()
            successHandler(ctx, { checkInCount, collectCount, myArticleCount })
        } catch (error) {
            throw new ExternalException('数据库出错')
        }
    }
}

module.exports = new UsersCtl
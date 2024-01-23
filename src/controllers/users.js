const axios = require('axios');
const ExternalException = require('../exception/externalException');
const successHandler = require('../utils/successHandler');
const userModel = require('../model/UserModel')
const checkInModel = require('../model/CheckinModel')
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
                    successHandler(ctx, { msg: "登录成功", id: userMsg._id })
                    return
                }
                successHandler(ctx, { msg: "登录成功", id: resultMsg._id })
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
            const result = await checkInModel.findOne({ userId: id }).sort({ checkinTime :-1}).limit(1)
            if (result&&result.checkinTime > time) {//最后一次签到是今天凌晨后不允许签到
                successHandler(ctx, { message: '今天已经签到了' })
                return
            }
            const signResult = await checkInModel.create({ userId: id, checkinTime: Date.now() })
            successHandler(ctx, signResult)
        } catch (error) {
            console.log(error);
            throw new ExternalException('签到失败')
        }
    }
}

module.exports = new UsersCtl
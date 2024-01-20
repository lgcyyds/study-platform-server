const axios = require('axios');
const ExternalException = require('../exception/externalException');
const successHandler = require('../utils/successHandler');
const userModel = require('../model/UserModel')
const { appID, appSecret } = require('../config');
class UsersCtl {
    async find(ctx) {
        // 操作数据库一定要 await
        ctx.body = '用户列表'
    }
    async findById(ctx) {
        console.log(ctx.params);
        ctx.body = `用户id：${ctx.params.id}`
    }
    async login(ctx) {
        const code = ctx.query.code
        try {
            const result = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`);
            if (result.data.session_key) {
                const result = await userModel.findOne({ openID: result.data.openid })
                successHandler(ctx, result.data)
            } else {
                throw new ExternalException('登录失败!')
            }
        } catch (error) {
            throw new ExternalException('登录失败')
        }
    }

}

module.exports = new UsersCtl
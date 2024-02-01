const BaseException = require('./baseException');
//身份验证时抛出的错误
module.exports = class AuthException extends BaseException {
    constructor(msg) {
        super('0001', msg);
    }
}
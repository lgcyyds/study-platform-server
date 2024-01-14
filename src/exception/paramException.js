const BaseException = require('./baseException');
//参数错误异常抛出的错误
module.exports = class ParamException extends BaseException {
    constructor(msg) {
        super('0002', msg);
    }
}
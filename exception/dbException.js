const BaseException = require('./baseException');
//数据库异常抛出的错误
module.exports = class DbException extends BaseException {
    constructor(msg) {
        super('0003', msg);
    }
}
const BaseException = require('./baseException');
//外部的错误
module.exports = class ExternalException extends BaseException {
    constructor(msg) {
        super('0004', msg);
    }
}
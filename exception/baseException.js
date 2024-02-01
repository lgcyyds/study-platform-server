module.exports = class BaseException {
    constructor(code, msg) {
        this.code = code
        this.msg = msg
        this.status = 200
    }
}
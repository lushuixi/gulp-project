/**
 * commonjs模块
 */
const crypto = require("node:crypto")

function isUint8Array(value) {
    return value instanceof Uint8Array;
}

/**
 * 对文件内容进行加密
 * @param {*} data 
 * @param {Number} options 截取到多少位的hash值, 默认是前10位
 * @returns 
 */
function revisionHash(data, options={}) {
    options.start = 0
    options.end = 10
    
    if (typeof data !== 'string' && !isUint8Array(data)) {
        data = JSON.stringify(data)
        if (typeof data !== 'string' && !isUint8Array(data)) {
            throw new TypeError('Expected a Uint8Array or string');
        }
    }

    return crypto.createHash('md5').update(data).digest('hex').slice(options.start, options.end);
}

module.exports = revisionHash

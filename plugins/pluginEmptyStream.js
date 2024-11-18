/**
 * 插件的功能:
 * 创建一个流
 * 什么也不做
 * 拿到什么流,返回什么流
 * 到此一游
 */
const Stream = require("stream")

/**
 * 如果入流是一个列表, 则会逐个进入转换流, 由管道负责流的接入
 * @returns Stream
 */
function PluginEmptyStream() {
    // 创建一个装换流
    const curStream = new Stream.Transform({objectMode: true})

    curStream._transform = function (originalFile, unused, callback) {
        // originalFile: 入流
        // unused: 
        // callback: 出流
        // 把入流再传出, 不做任何处理
        callback(null, originalFile)
    }

    return curStream
}

module.exports = PluginEmptyStream
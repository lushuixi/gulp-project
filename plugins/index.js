/**
 * 自定义插件开发,尽量在index.js导出
 */

// ==对入流不做操作,再原样流出==
const PluginEmptyStream = require("./pluginEmptyStream.js")

// ==修改文件名==
const PluginRename = require("./pluginRename.js")

// ==导出==
module.exports = {
    PluginEmptyStream,
    PluginRename,
}

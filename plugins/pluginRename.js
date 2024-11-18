/**
 * gulp自定义插件开发
 * 给文件重命名,但是该项目不需要gulp-rename那么强大的功能
 * 所以自定义个重命名的插件
 * 主要实现两个功能:
 * - assets/styles/learnLoadImage.scss(已经过gulp-sass将scss转css了) -> learnLoadImageScss.css
 * - assets/styles/learnLoadImage.css(已压缩过) -> assets/styles/learnLoadImage.min.css
 * 具体实现:
 * - 入参: {minify:true,suffix:"Scss"} 
 *      minify是Boolean类型,若为true则在后缀名称前增加.min
 *      suffix是String类型,向文件名称追加指定的后缀名(规定:首字母大写的字符串)
 * - 拿到文件名称, 对文件路径处理
 */
// ==node.js内置流模块==
const Stream  = require("stream")
const {
    join,
    dirname,
    basename,
    extname,
} = require("node:path")

/**
 * 解析路径并返回
 * @param {String} path 绝对路径
 * @param {String} root 绝对路径
 * @returns Object
 */
function getParsePath(path, root) {
    const extname0 = extname(path)
    return {
        // dirname: dirname(root ? path.split(root).at(-1) : path), // array.at(-1) 取数组最后一个元素(倒着数第一个)
        dirname: dirname(path),
        basename: basename(path, extname0),
        extname: extname0, // 后缀名
    }
}

function PluginRename(options={}) {
    // ==创建转换流==
    const curStream = new Stream.Transform({objectMode: true})

    // ==对流操作==
    curStream._transform = function (originalFile, unused, callback) {
        // ==originalFile入流==
        // ==callback:出流==
        const { root, minify, suffix, hash } = options
        // ==克隆流==
        const file = originalFile.clone({contents: false})
        const parsedPath = getParsePath(file.path, root)
        if (suffix && typeof suffix === "string") {
            // ==文件名后追加名==
            parsedPath.basename = parsedPath.basename + suffix[0].toUpperCase() + suffix.substring(1)
        }
        if (hash && typeof hash === "boolean") {
            // ==计算文件内容的hash值==
            const hash = revisionHash(file.contents)
            parsedPath.basename += hash
        }
        if (minify && typeof minify === "boolean") {
            // ==格式后缀==
            parsedPath.extname = ".min" + parsedPath.extname
        }
        file.path = join(file.base, parsedPath.basename + parsedPath.extname)
        callback(null, file)
    }

    // ==返回该流==
    return curStream
}

module.exports = PluginRename
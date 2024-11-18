/**
 * 初始化目录结构
 * src/
 *  - assets
 *      - styles
 *      - js
 *      - images
 *      - fonts
 *  - public
 *      - styles
 *      - js 第三方库或者页面共用的库
 *      - images
 *      - fonts
 *  - index.html
 * plugins/ 存放插件
 * utils/ 存放工具类(在src外使用到的,辅助开发和打包)
 */
// ==解析参数工具(pnpm i minimist -D)==
const minimist = require("minimist")
// ==命令行交互工具(pnpm i prompts -D)==
const prompts = require("prompts")
// ==给console.log增加颜色(pnpm i kolorist -D)==
const {
    green,
    red,
    yellow,
} = require("kolorist")
// ==路径操作==
const {
    join,
} = require("node:path")
const {
    pluginsDir,
    utilsDir,
    srcDir,
    assetsDir,
    publicDir,
    assetTypeList,
    assetsDefaultName,
} = require("../config/paths.js")
// ==文件操作工具==
const {
    createDirSync,
    createDirSyncNoEffect,
    createFileSync,
    createFileSyncNoEffect,
} = require("../config/fs.js")
// ==脚本共用工具==
const {
    getHandlePathOfHtml,
} = require("./common.js")

/**
 * 主函数
 */
async function main() {
    // ==解析命令==
    // pnpm init:dir --force
    // ==获取命令行参数==
    const argv = minimist(process.argv.slice(2), { _string: [] })
    // ==获取参数:是否强制删除,若为true则强制删除(即使存在也删),若为false则不删==
    let force = argv.force || false

    // // ==用户交互结果==
    // let result = {}

    // ==命令行交互==
    if (force) {
        // ==向用户确认:是否强制删除,这是个危险操作==
        let result = await prompts({
            type: "select",
            name: "force",
            message: `${yellow("'--force' is a dangerous operation (which will delete all existing files) ")}
${green("please confirm: ")}`,
            choices: [
                { title: 'Y', value: true },
                { title: 'N', value: false }
            ]
        })
        // ==合并与用户的交互结果==
        force = result.force
    }
    console.log() // 空行

    //     // ==生成插件目录(不做强制删除,如果存在则不处理)==
    //     createDirSyncNoEffect(pluginsDir)
    //     createFileSyncNoEffect(join(pluginsDir, "index.js"), `/**
    //  * 自定义插件开发,尽量在index.js导出,例如
    //  * module.exports = {}
    //  */`)

    //     // ==生成工具目录==
    //     createDirSyncNoEffect(utilsDir, false, false)
    //     createFileSyncNoEffect(join(utilsDir, "index.js"), `/**
    //  * 工具类:尽量在index.js导出,例如
    //  * module.exports = {}
    //  */`)

    // ==生成src目录==
    createDirSync(srcDir, force)
    createDirSync(join(srcDir, assetsDir), force)
    createDirSync(join(srcDir, publicDir), force)
    assetTypeList.forEach(type => {
        createDirSync(join(srcDir, assetsDir, type), force)
        createDirSync(join(srcDir, publicDir, type), force)
    })
    createFileSync(join(srcDir, assetsDir, `styles/index${assetsDefaultName}.css`), `/**
 * Index页面的样式
 */
`, force)
    createFileSync(join(srcDir, assetsDir, `js/index${assetsDefaultName}.js`), `/**
 * Index页面对应脚本
 */`, force)
    createFileSync(join(srcDir, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <meta name="author" content="露水晰123,1542249206@qq.com" />
    <meta name="keywords" content="JQuery,gulp" />
    <meta name="description" content="使用gulp作为构建工具,学习JQuery" />
    <title>Index页面</title>
    <link rel="stylesheet" href="${getHandlePathOfHtml(join(assetsDir, `styles/index${assetsDefaultName}.css`))}" />
</head>
<body>
    <h3>Index页面</h3>
    <script src="${getHandlePathOfHtml(join(assetsDir, `js/index${assetsDefaultName}.js`))}"></script>
</body>
</html>`, force)
    console.log() // 空行
}

// ==执行==
try {
    main()
} catch (error) {
    console.log(red(error)) // 红色展示报错
}
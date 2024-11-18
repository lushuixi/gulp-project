// ==定义目录名称==
// process.cwd() 是启动应用程序时的工作目录(package.json所在的目录),
// __dirname是相对于当前模块的目录(不受启动目录的影响)
// package.json中scripts字段, "init:dir": "node scripts/initDir.js", 则pnpm init:dir时, process.cwd()是启动目录(package.json所在目录), __dirname是initDir.js所在目录scripts
// 二者区别参考文章:https://blog.csdn.net/tiven_/article/details/135347567
const projectDir = process.cwd()
const pluginsDir = "./plugins"
const utilsDir = "./utils"
const scriptsDir = "./scripts"
const configDir = "./config"
const srcDir = "./src"
const assetsDir = "./assets"
const publicDir = "./public"
const assetTypeList = ["images", "fonts", "styles", "js"]
const buildDir = "./build"
// ==项目拷贝目录==
const projectBackupDir = "./projectBackup"
// ==hash对应名称==
const hashFileName = "hash-mainfest.json"
// ==静态资源后缀名称==
const assetsDefaultName = "Default"

module.exports = {
    projectDir,
    pluginsDir,
    utilsDir,
    scriptsDir,
    configDir,
    srcDir,
    assetsDir,
    publicDir,
    assetTypeList,
    buildDir,
    projectBackupDir,
    hashFileName,
    assetsDefaultName,
}
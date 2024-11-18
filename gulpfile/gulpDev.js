/**
 * gulp开发环境任务配置
 */
// ==安装gulp:pnpm i gulp@4 gulp-cli -D==
const {
    src,
    series,
} = require("gulp")
// ==本地开发服务器(pnpm i gulp-webserver -D)==
const gulpWebserver = require("gulp-webserver")
// ==文件路径==
const {
    buildDir,
} = require("../config/paths.js")
// ==打包配置模块==
const {
    gulpBuild,
    gulpWatchHandle,
} = require("./gulpBuild.js")

// ==开启开发环境下服务器==
const defaultOpenPage = "./index.html" // learnLoadImage.html
function createWebserver(cb) {
    // ==原本是监听srcDir开发目录下的变化,但是发现我加上scss后不知道怎么在开发环境下的html文件引用了==
    // ==所以改用对打包目录的监听,但是需要监听静态资源的变化以打包==
    // ==每次监听范围内的文件更改后保存便触发更新==
    src(buildDir)
        .pipe(gulpWebserver({
            host: "127.0.0.1",
            port: 8000,
            livereload: true,
            open: defaultOpenPage, // 默认打开哪一个页面
        }))
    cb()
}

// ==开发环境==
// ==每次开启本地服务前先打包和监听文件变化,再开启本地服务==
// ==学习文章:https://blog.csdn.net/xiaojian044/article/details/127826587==
const gulpDev = series(
    gulpBuild,
    gulpWatchHandle,
    createWebserver
)

module.exports = gulpDev
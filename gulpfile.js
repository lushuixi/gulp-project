/**
 * gulp配置文件
 * 安装gulp:pnpm i gulp@4 gulp-cli -D
 * gulp4.x 不再有同步任务,
 */
// ==项目拷贝==
const gulpCopyProject = require("./gulpfile/gulpCopyProject.js")
// ==开发环境==
const gulpDev = require("./gulpfile/gulpDev.js")
// ==打包配置模块==
const {
    gulpBuild,
} = require("./gulpfile/gulpBuild.js")

// ==开发环境==
// ==每次开启本地服务前先打包和监听文件变化,再开启本地服务==
// ==学习文章:https://blog.csdn.net/xiaojian044/article/details/127826587==
const dev = gulpDev

// ==构建打包==
const build = gulpBuild

// ==项目拷贝==
// ==该任务是在项目开发过程中初始化项目时使用,提前备份==
const copyProject = gulpCopyProject

// ==导出==
module.exports = {
    dev,
    build,
    copyProject,
}

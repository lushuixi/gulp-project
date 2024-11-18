/**
 * 项目拷贝
 */
const {
    src,
    dest,
    series,
} = require("gulp")
const {
    projectBackupDir,
    buildDir,
} = require("../config/paths.js")
const {
    delDir,
} = require("../config/fs.js")

// ==打包前先清空打包目录==
const cleanBuidDir = (cb) => {
    // ==清空目录==
    // delDir(projectBackupDir, true)
    cb()
}

// ==拷贝项目==
// ==该任务是在项目开发过程中初始化项目时使用,提前备份==
const buildCopyProject = (cb)=> {
    // ==只匹配除了指定的文件==
    const excludeFile = [
        "!./node_modules/**", 
        `!${projectBackupDir}/**`, 
        `!${buildDir}/**`
    ]
    src([`**/*`].concat(excludeFile))
        .pipe(dest(`${projectBackupDir}/${new Date().getTime()}`)) // 增加时间戳,防止重复备份覆盖上次备份的(可根据个人要求增加压缩)
    cb()
}

// ==组合任务==
const copyProject = series(
    // cleanBuidDir,
    buildCopyProject,
)

// ==导出==
module.exports = copyProject
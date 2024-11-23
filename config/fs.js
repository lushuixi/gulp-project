/**
 * 文件操作
 */
const {
    existsSync,
    readdirSync,
    lstatSync,
    unlinkSync,
    rmdirSync,
    writeFileSync,
    mkdirSync,
} = require("node:fs")
const {
    join
} = require("node:path")
const {
    yellow,
    green,
    red,
} = require("kolorist")
const {
    projectDir,
} = require("./paths")
const del = require("del")

/**
 * 递归删除目录
 * @param {String} dir 目录
 * @param {Boolean} root 是否删除根目录,默认为true删除
 */
function delDir(dir, root = false) {
    if (existsSync(dir)) {
        const files = readdirSync(dir)
        files.forEach((file) => {
            const curPath = join(dir, file)
            if (lstatSync(curPath).isDirectory()) {
                // 递归删除子目录
                delDir(curPath)
            } else {
                // 删除文件
                unlinkSync(curPath)
            }
        })
        if (!root) {
            // 删除目录
            rmdirSync(dir)
        }
    }
}

/**
 * 获取标准路径,将路径中的\全部替换成/
 * @param {String} path 
 * @returns String
 */
function getStandardPath(path) {
    return join(path).replaceAll("\\", "/")
}

/**
 * 创建目录
 * @param {String} dir 目录
 * @param {Boolean} force 是否强制删除已经存在的dir,默认不删除
 * @param {Boolean} error 是否允许报错,默认为true
 */
function createDirSync(dir, force = false, error = true) {
    if (existsSync(dir)) {
        if (force) {
            console.log(1, dir, force, `${getStandardPath(dir)}/*`)
            // ==删除(不会删除根目录,所以无需再创建该目录)==
            del.sync([`${getStandardPath(dir)}/*`])
        } else if (error) {
            throw new Error(red(`${getStandardPath(dir)} Directory Existed!`))
        } else {
            console.log(yellow(`${getStandardPath(dir)} Existed!`))
        }
    } else {
        mkdirSync(dir)
        console.log(green(`${getStandardPath(dir)} Finished!`))
    }
}
/**
 * 创建目录(不做强制删除,也不在存在时抛出错误而影响程序继续执行)
 * @param {String} dir 目录
 */
function createDirSyncNoEffect(dir) {
    createDirSync(dir, false, false)
}

/**
 * 创建文件
 * @param {String} file 文件路径
 * @param {String} content 文件内容
 * @param {Boolean} force 是否强制删除
 * @param {Boolean} error 是否允许报错,默认为true
 */
function createFileSync(file, content, force = false, error = true) {
    if (existsSync(file)) {
        // ==file已存在==
        if (force) {
            // ==强制删除==
            unlinkSync(file)
            // ==重新创建==
            writeFileSync(file, content)
            console.log(green(`${getStandardPath(file)} Finished!`))
        } else if (error) {
            throw new Error(yellow(`${getStandardPath(file)} Existed!`))
        } else {
            console.log(yellow(`${getStandardPath(file)} Existed!`))
        }
    } else {
        // ==file不存在则创建==
        writeFileSync(file, content)
        console.log(green(`${getStandardPath(file)} Finished!`))
    }
}
/**
 * 创建文件(不做强制删除,也不在存在时抛出错误而影响程序继续执行)
 * @param {String} file 文件路径
 * @param {String} content 文件内容
 */
function createFileSyncNoEffect(file, content) {
    createFileSync(file, content, false, false)
}

module.exports = {
    delDir,
    getStandardPath,
    createDirSync,
    createDirSyncNoEffect,
    createFileSync,
    createFileSyncNoEffect,
}

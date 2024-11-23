/**
 * 创建页面
 * 终端输入命令 pmpm create:page pageName --js --css
 * 生成文件如下:
 * src/${pageName}.html
 * src/assets/js/${pageName}Default.js
 * src/assets/styles/${pageName}Default.css
 * 其中,js和css文件要引入html里
 * 
 * 需要使用到的插件:
 * - 解析命令参数工具 minimist
 * - 命令交互工具 prompts
 * - 给console.log()打印加上颜色工具 kolorist
 */
// ==解析命令参数工具 minimist==
const minimist = require("minimist")
// ==命令交互工具 prompts==
const prompts = require("prompts")
// ==给console.log()打印加上颜色工具 kolorist==
const {
    green,
    red,
    yellow,
} = require("kolorist")
const {
    writeFileSync,
    existsSync,
} = require("node:fs")
// ==注意区分join和resolve的区别==
// ==resolve会返回绝对路径==
// ==join是将入参路径拼接(若入参是相对路径则返回的也是相对路径)==
const {
    join,
    resolve,
} = require("node:path")
const {
    srcDir,
    assetsDir,
    projectDir,
    assetsDefaultName,
} = require("../config/paths.js")
const {
    getHandlePathOfHtml,
    validateOnlyAlphabet,
} = require("./common.js")
const {
    createFileSync,
    getStandardPath,
} = require("../config/fs.js")

// ==获取命令行参数==
const argv = minimist(process.argv.slice(2), { _string: [] })

/**
 * 处理文件名称,给默认的名称
 * @param {String|Boolean} val 
 * @returns 
 */
function getAssetsName(prefix, val) {
    if (val && typeof val === "string") {
        return prefix + val[0].toUpperCase() + val.substring(1)
    } else {
        return prefix + assetsDefaultName
    }
}

/**
 * 主函数
 */
async function main() {
    const pageName = (argv._[0] || "").trim() // 去掉首尾空格
    let result = {
        pageName,
    }
    if ((pageName && !validateOnlyAlphabet(pageName)) || !pageName) {
        // ==如果命令行参数页面名称不存在或校验不通过,则与用户交互,重新输入==
        result = await prompts(
            {
                type: "text",
                name: "pageName",
                message: "Please input the name of the page to be created: ", // 请输入页面名称
                format: (val) => {
                    // 去掉字符串首尾的空格
                    val = (val || "").trim()
                    // 校验:只含英文字符
                    if (validateOnlyAlphabet(val)) {
                        return val
                    } else {
                        console.log(yellow("Please enter a page name containing only English letters!")) // 请输入不含中文字符和空格的页面名称
                        return false
                    }
                }
            }
        )
    }

    // ==删除多余参数==
    delete argv._
    // ==合并参数==
    // ==Object.assign(target, ...sources)==
    // ==合并到target目标对象;有同名属性,后面覆盖前面;只会拷贝源对象自身的并且可枚举的属性到目标对象,继承属性和不可枚举属性是不能拷贝的;拷贝的是属性值,是浅拷贝;==
    // ==兼容性:IE浏览器不兼容Object.assign==
    Object.assign(result, argv)

    // ==生成文件==
    const pagePath = join(srcDir, `${result.pageName}.html`)
    if (!existsSync(join(pagePath))) {
        // ==生成scss文件==
        if (result.scss) {
            result.scss = join(assetsDir, `styles/${getAssetsName(result.pageName, result.scss)}.scss`)
            const createSCssPathAbsolute = resolve(projectDir, srcDir, result.scss)
            createFileSync(createSCssPathAbsolute, `/**
 * ${result.pageName}.html的样式
 */
`)
        }
        // ==生成css文件==
        if (result.css) {
            result.css = join(assetsDir, `styles/${getAssetsName(result.pageName, result.css)}.css`)
            const createCssPathAbsolute = resolve(projectDir, srcDir, result.css)
            createFileSync(createCssPathAbsolute, `/**
 * ${result.pageName}.html的样式
 */
`)
        }

        // ==生成js文件==
        if (result.js) {
            result.js = join(assetsDir, `js/${getAssetsName(result.pageName, result.js)}.js`)
            const createJsPathAbsolute = resolve(projectDir, srcDir, result.js)
            createFileSync(createJsPathAbsolute, `/**
 * ${result.pageName}.html的执行脚本
 */
console.log("哈喽,我是露水晰123!")
console.log("这是${result.pageName}的执行脚本")
`)
        }

        // ==生成html文件==
        // ==处理页面名称:首字母大写==
        const standardPageName = result.pageName[0].toUpperCase() + result.pageName.substring(1)
        createFileSync(resolve(srcDir, `${result.pageName}.html`), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <meta name="author" content="露水晰123,1542249206@qq.com" />
    <meta name="keywords" content="JQuery,gulp" />
    <meta name="description" content="使用gulp作为构建工具,学习JQuery" />
    <title>${standardPageName}页面</title>
    ${result.scss ? `<link rel="stylesheet" href="${getHandlePathOfHtml(result.scss)}" />` : ""}
    ${result.css ? `<link rel="stylesheet" href="${getHandlePathOfHtml(result.css)}" />` : ""}
</head>
<body>
    <h3>${standardPageName}页面</h3>
    ${result.js ? `<script src="${getHandlePathOfHtml(result.js)}"></script>` : ""}
</body>
</html>`)
    } else {
        // ==页面pagePath已存在==
        console.log(yellow(`${getStandardPath(pagePath)} Existed!`))
    }
    console.log() // 空行
}

// ==执行==
try {
    main()
} catch (error) {
    console.log(red(error)) // 红色展示报错
}

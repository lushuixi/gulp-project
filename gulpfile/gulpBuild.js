/**
 * gulp打包配置文件
 * 从gulpfile.js文件中抽离出来
 */
// ==gulp(pnpm i gulp@4 gulp-cli -D)==
const {
    src,
    dest,
    parallel,
    series,
    watch,
} = require("gulp")
// ==防止任务因错误而中断==
// const gulpPlumber = require("gulp-plumber")
// ==引入工具==
// ==在commonjs中引用esm(pnpm i esm -D)==
// const requireOfesm = require("esm")(module)
// const gulpImagemin = requireOfesm("gulp-imagemin")
// ==压缩图片插件(pnpm i gulp-imagemin -D)(使用有问题-待处理)==
// const gulpImagemin = require("gulp-imagemin")
// const imagemin = require("imagemin")
// const imageminMozjpeg = require("imagemin-mozjpeg")
// const imageminJpegtran = require('imagemin-jpegtran')
// ==构建scss(pnpm i gulp-sass@4 sass)==
const gulpSass = require("gulp-sass")
const dartSass = require("sass") // 指定的编译器
// ==自动添加前缀插件(pnpm i gulp-autoprefixer -D)==
// ==8版本的是commonjs模块,9版本的是esm==
const gulpAutoprefixer = require("gulp-autoprefixer")
// ==css压缩插件(pnpm i gulp-cssmin -D)==
const gulpCssMin = require("gulp-cssmin")
// ==js转移(兼容性处理)插件:babel将es6+转为es5(pnpm i gulp-babel @babel/core @babel/preset-env -D)==
const gulpBabel = require("gulp-babel")
// ==js压缩插件(pnpm i gulp-terser -D)==
const gulpTerser = require("gulp-terser")
// ==压缩html(pnpm i gulp-htmlmin -D)==
const gulpHtmlmin = require("gulp-htmlmin")
// ==指定内容替换(pnpm i gulp-replace -D)==
const gulpReplace = require("gulp-replace")
// ==文件重命名==
const gulpRename = require("gulp-rename")
// ==处理命令行参数(pnpm i minimist -D)==
const minimist = require("minimist")
// ==引入自定义插件==
const {
    PluginEmptyStream,
    PluginRename,
} = require("../plugins/index.js")
const { 
    srcDir,
    assetsDir,
    publicDir,
    buildDir,
} = require("../config/paths.js")
const { 
    delDir,
    getStandardPath,
} = require("../config/fs.js")
const {
    join,
} = require("node:path")

// ==存储构建工具==
const buildObject = {}

// ==打包前先清空打包目录==
buildObject.cleanBuidDir = (cb) => {
    // ==清空目录==
    delDir(buildDir, true)
    cb()
}

// ==需要打包的文件类型配置==
const assetsDirDev = getStandardPath(join(srcDir, assetsDir))
const publicDirDev = getStandardPath(join(srcDir, publicDir))
const assetsDirPro = getStandardPath(join(buildDir, assetsDir))
const publicDirPro = getStandardPath(join(buildDir, publicDir))
// ==public目录下的静态资源文件按照原样输出==
// ==minify:是否压缩==
// ==autoprefixer:是否给样式加上前缀(兼容性处理)==
// ==minify:是否压缩==
// ==babel:是否将js转译为ES5即ES6+->ES5(兼容性处理)==
// ==origin:是否按原样输出即拷贝(规定:public目录下的是原样输出)==
// ==suffix:打包后要加上的文件名后缀==
// ==handle:打包的函数名称==
// ==hash:是否要给文件名称增加hash(字体/图片内容不会发生变化,所以无需增加hash)==
const buildPathMap = {
    fontPath: [
        { src: [`${assetsDirDev}/**/*.{ttf,woff}`], dest: `${buildDir}/assets`, handle:"buildFont", },
        { src: [`${publicDirDev}/**/*.{ttf,woff}`], dest: `${buildDir}/public`, origin:true, handle:"buildFont", },
    ],
    imagesPath: [
        { src: [`${assetsDirDev}/**/*.{png,jpg,jpeg,gif,svg}`], dest: `${assetsDirPro}`, minify: true, handle:"buildImages", },
        { src: [`${publicDirDev}/**/*.{png,jpg,jpeg,gif,svg}`], dest: `${publicDirPro}`, origin: true, handle:"buildImages",},
    ],
    scssPath: [
        { src: `${assetsDirDev}/**/*.scss`, dest: `${assetsDirPro}/styles`, suffix: "Scss", hash: true, minify: true, autoprefixer: true, handle: "buildScss", },
        { src: `${publicDirDev}/**/*.scss`, dest: `${publicDirPro}`, origin: true, handle: "buildScss", },
    ],
    cssPath: [
        { src: [`${assetsDirDev}/**/*.css`], dest: `${assetsDirPro}/styles`, hash: true, minify: true, autoprefixer: true, handle: "buildCss", },
        { src: [`${publicDirDev}/**/*.css`], dest: `${publicDirPro}`, origin: true, handle: "buildCss", },
    ],
    jsPath: [
        { src: [`${assetsDirDev}/**/*.js`], dest: `${assetsDirPro}/js`, babel: true, hash: true, minify: true, handle: "buildJs", },
        { src: [`${publicDirDev}/**/*.js`], dest: `${publicDirPro}`, origin: true, handle: "buildJs", }, 
    ],
    htmlPath: [
        { src: [`${srcDir}/**/*.html`], dest: `${buildDir}`, minify: true, handle: "buildHtml", },
    ],
}

// ==构建字体==
buildObject.buildFont = (cb) => {
    const { fontPath } = buildPathMap
    fontPath.forEach(item => {
        src(item.src) // 找到文件
            .pipe(dest(item.dest)) // 放到指定目录
    })
    // ==gulp4.x异步任务必须返回==
    cb()
}
// ==构建图片==
// ==图片这里有问题gulp-imagemin(待处理)==
buildObject.buildImages = async (cb) => {
    const { imagesPath } = buildPathMap
    imagesPath.forEach(item => {
        src(item.src)
            .pipe(dest(item.dest))
    })
    cb()
}
// ==构建样式==
// ==构建scss==
// ==给gulp-sass传入编译器,否则打包出错(gulp-sass5.x官方不再提供编译器,需用户自己出传入)==
const sass = gulpSass(dartSass)
buildObject.buildScss = (cb) => {
    const { scssPath } = buildPathMap
    scssPath.forEach(item => {
        src(item.src)
            .pipe(sass({
                silenceDeprecations: ['legacy-js-api'], // 关闭警告[Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.]
            }).on('error', sass.logError)) // 解析scss为css
            .pipe(item.autoprefixer ? gulpAutoprefixer() : PluginEmptyStream())
            .pipe(item.minify ? gulpCssMin() : PluginEmptyStream())
            .pipe(PluginRename({suffix:item.suffix, minify:item.minify}))
            .pipe(dest(item.dest)) // 可以保证源目录结构输出, buildDir只是提供了一个文件夹
    })
    cb()
}
// ==构建css==
buildObject.buildCss = (cb) => {
    const { cssPath } = buildPathMap
    cssPath.forEach(item => {
        src(item.src)
            .pipe(item.autoprefixer ? gulpAutoprefixer() : PluginEmptyStream()) // 兼容处理(添加前缀)
            .pipe(item.minify ? gulpCssMin() : PluginEmptyStream()) // 压缩css
            .pipe(item.minify ? PluginRename({ suffix: item.suffix, minify: item.minify }) : PluginEmptyStream())
            .pipe(dest(item.dest))
    })
    cb()
}
// ==构建js==
buildObject.buildJs = (cb) => {
    const { jsPath } = buildPathMap
    jsPath.forEach(item => {
        // ==两种实现方式==
        // ==方式一:没有相关配置的文件每次都要流入插件PluginEmptyStream再原样流处==
        // ==好处:可自定义细化配置,且代码直观简洁==
        src(item.src)
            .pipe(item.babel ? gulpBabel({
                presets: ["@babel/env"], // 将es6+转为es5
            }) : PluginEmptyStream())
            .pipe(item.minify ? gulpTerser() : PluginEmptyStream()) // 压缩js
            .pipe(item.minify ? PluginRename({minify:item.minify}) : PluginEmptyStream()) // 重命名
            .pipe(dest(item.dest))
        // ==方式二:直接分两大类(一类按原样输出即拷贝,一类做相应处理[es6+->es5,压缩等])==
        // ==好处:不再经过PluginEmptyStream==
        // ==坏处:需要条件判断,且无法再细化配置==
        // if (item.origin) {
        //     // ==拷贝==
        //     src(item.src)
        //         .dest(item.dest)
        // } else {
        //     // ==处理==
        //     src(item.src)
        //         .pipe(item.babel ? gulpBabel({
        //             presets: ["@babel/env"], // 将es6+转为es5
        //         }) : PluginEmptyStream())
        //         .pipe(gulpTerser()) // 压缩js
        //         .pipe(dest(item.dest))
        // }
    })
    cb()
}
// ==构建html==
buildObject.buildHtml = (cb) => {
    const { htmlPath, scssPath, cssPath, jsPath } = buildPathMap
    // ==需要修改引用路径的只有assets下的scss/css/js==
    // ==assets下scss打包配置==
    const assetsScssPath = scssPath[0]
    // ==assets下scss打包配置==
    const assetsCssPath = cssPath[0]
    // ==assets下js打包配置==
    const assetsJsPath = jsPath[0]
    htmlPath.forEach(item=> {
        src(item.src)
            .pipe(item.minify ? gulpHtmlmin({
                collapseWhitespace: false, // 是否将空格去掉(开发期间可不去)
            }) : PluginEmptyStream()) // html压缩
            .pipe(assetsCssPath.minify
                ? gulpReplace(/href="(assets\/[^"]+.css)"/g, (match, p1, offset, string) => {
                    // ==注意顺序:一定是先css后scss,这两个管道顺序不可以弄反了,不然将scss修改未css后又进到css处理管道,造成.min.min.css==
                    // ==先处理css再处理scss的引用路径==
                    // ==修改html文件引用assets下的scss文件名称==
                    // ==只有匹配到了才会进这里(匹配成功的回调)==
                    // ==作用:完成引用地址的转换==
                    // ==href="assets/styles/learnLoadImageDefault.scss" -> href="assets/styles/learnLoadImageDefaultScss.min.css"==
                    // console.log(333, match, match.split(".css"))
                    return match.split(".css").at(0) + '.min.css"'
                })
                : PluginEmptyStream()
            )
            .pipe(gulpReplace(/href="(assets\/[^"]+.scss)"/g, (match, p1, offset, string)=> {
                // ==修改html文件引用assets下的scss文件名称==
                // ==作用:完成引用地址的转换==
                // ==href="assets/styles/learnLoadImageDefault.scss" -> href="assets/styles/learnLoadImageDefaultScss.min.css"==
                // console.log(222, match, match.split(".scss"))
                return match.split(".scss").at(0) + "Scss" + (assetsScssPath.minify ? ".min" : "") + '.css"' 
            }))
            .pipe(assetsJsPath.minify
                ? gulpReplace(/src="(assets\/[^"]+.js)"/g, (match, p1, offset, string) => {
                    // ==修改html文件引用assets下js文件名称==
                    // ==作用:完成引用地址的转换==
                    // ==href="assets/js/learnLoadImageDefault.js" -> href="assets/styles/learnLoadImageDefault.min.j"==
                    // console.log(444, match)
                    return match.split(".js").at(0) + '.min.js"'
                })
                : PluginEmptyStream()
            )
            .pipe(dest(item.dest))
    })
    cb()
}

// ==组合打包任务==
const gulpBuild = (()=> {
    const {
        cleanBuidDir,
        buildScss,
        buildFont,
        buildImages,
        buildCss,
        buildJs,
        buildHtml,
    } = buildObject
    
    return series(
        cleanBuidDir,
        parallel(
            buildScss,
            buildFont,
            buildImages,
            buildCss,
            buildJs
        ),
        buildHtml,
    )
})()

// ==新增:创建监听任务==
// ==每次监听范围内的文件更改后保存便触发更新==
const gulpWatchHandle = (cb) => {
    // ==Object.keys(obj):返回对象obj自身可枚举属性组成的数组==
    // ==在有修改后并保存后触发重新打包==
    Object.keys(buildPathMap).forEach((key)=> {
        const curBuildPath = buildPathMap[key]
        curBuildPath.forEach((item)=> {
            // ==监听文件变化,触发相应的handle打包==
            watch(item.src, buildObject[item.handle])
        })
    })
    cb()
}

// ==导出==
module.exports = {
    gulpBuild,
    buildHtml:buildObject.buildHtml,
    gulpWatchHandle,
}

# gulp-prject
> 日期: 2024/11/17
> 作者: 露水晰123
> 邮箱: 1542249206@qq.com

## 前言

重温gulp构建原生开发

gulp基于流, 由管道进行传输和运送。gulp的插件作用: 对入流进行操作, 再返回操作后的流。
gulp.src若是匹配到多个文件,则对应多个流(此时的一个文件便是一个流), 这些流之间是相互独立的, 分别执行相应的操作(匹配到多少文件便执行多少次对应的操作)。

## 项目安装

- 安装依赖：`pnpm i`;
- 开启本地服务：`pnpm dev`

## 目前页面

- index.html
- learnProxy.html：测试自定义脚本命令`pnpm init:dir`创建的页面；
- learnLoadImage.html：实现图片懒加载/预加载机制；


## 脚本命令

```json
"scripts": {
    "init:dir": "node scripts/initDir.js",
    "create:page": "node scripts/createPage.js",
    "dev": "gulp dev",
    "build": "gulp build --hash",
    "copy:project": "gulp copyProject",
    "init:dir:copy": "pnpm copy:project && node scripts/initDir.js --force"
}
```

### 项目目录结构初始化命令

> 请谨慎执行--force命令，尽量在项目初始化的时候执行一次该命令，项目开发过程中便不要再使用了，若要使用请提前备份。

```node
# 目录结构初始化(在pnpm init初始化完成后执行)
pnpm init:dir

# 添加参数--force，表示强制删除(会有二次确认)
pnpm init:dir --force

# 为了安全起见，增加命令`copy:project`拷贝项目做备份，以防止执行`init:dir --force`命令将原有项目给清空
pnpm copy:project

# 在项目开发过程中初始化项目,可执行该命令，该命令执行过程是先备份后初始化
pnpm init:dir:gulp
```

### 开启本地服务命令
```node
pnpm dev
```

### 打包构建命令
```
pnpm build
```

### 生成页面命令
```node
# 创建页面(不创建js和css)
pnpm create:page

# 创建learnProxy.html页面(不创建js和css)
pnpm create:page learnProxy

# 创建learnProxy.html页面及其js和css, 默认名称learnProxyDefault.js和learnProxyDefault.css
pnpm create:page learnProxy --js --css

# 创建learnProxy.html页面及其js和css, js文件名称为assets/js/learnProxySlide.js, css文件名称为为assets/styles/learnProxyDefault.css
pnpm create:page learnProxy --js slide --css 

# 创建learnProxy.html页面及其js和css, js文件名称为assets/js/learnProxySlide.js, css文件名称为assets/style/learnProxyMain.css
pnpm create:page learnProxy --js slide --css main
```

## 目录结构
- 文件命名格式: 使用**小驼峰命名**格式(首字母小写), 如 learnProxy.htmml, learnProxyDefault.js
- html页面对应的静态资源名城**必须以该html页面的名称**开头, 如about.html, 它的资源文件名称aboutDefault.js, aboutSlide.js, aboutMain.css
- 业务逻辑在src目录下进行开发，**使用相对路径**（否则可能导致打包后因路径问题而页面内容不完整问题）
- gulp-webserver开启本地服务,  **监听build目录**
- src下目录结构如下：

```
  └── src/
      ├── assets/                 	// html页面用到的静态资源(业务逻辑)
      	└── font/ 					// 存放字体
      	├── images/ 				// 存放图片
      	├── js/ 					// 存放js
      		└── about.js			// 页面about对应的脚本
      		├── index.js			// 页面index对应的脚本
      	├── styles/ 				// 存放样式
      		└── about.css			// 页面about对应的脚本
      		├── index.css			// 页面index对应的脚本
      ├── public/               	// 存放公共的静态资源(如第三方库JQuery)
      	└── font/ 					// 存放字体
      	├── images/ 			   	// 存放图片
      		└── img-1.jpg	
      		├── img-2.jpg
      		├── img-3.jpg
      		├── img-4.jpg
      		├── img-5.jpg
      	├── js/ 					// 存放js
      		└── jquery-3.7.1.min.s  // jquery
      	├── styles/	 				// 存放样式
      ├── about.html                // 页面about
      ├── index-html                // 页面index
```

- 注意：**public**目录存放三方库和原样输出的静态资源，所以该目录下所有文件是原样输出（`origin:true`），所以无需在html中更改引用路径。

## 前端性能优化之图片懒加载/预加载

懒加载页面涉及文件：

- html： **src/learnLoadImage.html**；
- js：**src/assets/js/learnLoadImageDefault.js**；
- css：**src/assets/styles/learnLoadImageDefault.css**。

### 说明

- 首先使用命令 `pnpm dev` 开启本地服务（开启服务后默认打开的是index.html）
- 在浏览器输入地址`http://127.0.0.1:8000/learnLoadImage.html`，打开懒加载页面

### 掘金文章

懒加载/预加载笔记总结在 [掘金:从原理上理解性能优化之图片加载机制（懒加载/预加载）](https://juejin.cn/post/7437763496609333275)。

## 源代码

/**
 * learnLoadImage.html的执行脚本
 */

/**
 * 添加监听事件
 * @param {*} ele 
 * @param {*} event 
 * @param {*} callback 
 */
function addEventListen(ele, event, callback) {
    if (!ele || !event) return
    if (window.addEventListener) {
        ele.addEventListener(event, callback, false)
    } else if (window.attachEvent) {
        ele.attachEvent("on" + event, callback)
    } else {
        ele["on" + event] = callback
    }
}
/**
 * 移除事件的监听
 * @param {*} ele 
 * @param {*} event 
 * @param {*} callback 
 */
function removeEventListen(ele, event, callback) {
    if (!ele || !event) return
    if (window.removeEventListener) { // ie9+ chrome firefox
        ele.removeEventListener(event, callback, false)
    } else if (window.detachEvent) { // 旧版本ie(edge不支持)
        ele.detachEvent("on" + event, callback)
    } else {
        ele["on" + event] = callback
    }
}

/**
 * 节流
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns 
 */
function throttle(fn, delay=200) {
    let timer
    return function() {
        if (timer) return
        const that = this
        timer = setTimeout(() => {
            fn.apply(that, arguments)
            clearTimeout(timer)
            timer = null
        }, delay)
    }
}

/**
 * 实现图片懒加载
 */
function lazyloadImageList() {
    console.log("开始懒加载图片")
    // ==事件监听对象==
    const watchDom = window
    // ==监听事件类型==
    const watcEventName = "scroll"
    // ==获取可视区域的高度==
    // ==window.innerHeigh:浏览器窗口的视口高度;document.documentElement.clientHeight:文档根元素的可见高度;两者值相同==
    // console.log(document.documentElement.clientHeight, window.innerHeight)
    const winViewPortHeight = window.innerHeight || document.documentElement.clientHeight

    // ==获取页面上需要懒加载的图片列表==
    const lazyImgList = Array.from(document.querySelectorAll("img.lazy")).map((dom,id)=> ({id, dom, lazy:false})) // NodeList->Array
    // ==需要加载的图片数量==
    const lazyImgLength = lazyImgList.length
    // ==记录已加载图片的数量==
    let lazyedImgCount = 0

    // ==懒加载==
    const lazyload = ()=> {
        // ===剔除掉已加载的图片=
        const curLazyImgList = lazyImgList.filter(node => !node.lazy)
        // ==是否还需加载判断==
        if (!curLazyImgList.length && lazyedImgCount >= lazyImgLength) {
            // ==移除监听事件==
            removeEventListen(watchDom, watcEventName, ()=> {
                console.log("222需要懒加载的图片已全部加载完毕！")
            })
            return
        }
        // ==当前滚动的高度==
        const scrollTop = watchDom === window ? (document.body.scrollTop || document.documentElement.scrollTop || 0) : watchDom.scrollTop || 0 // 注意:若没有滚动则scrollTop值为undefined,所以需要置为0
        // ==data-src->src==
        curLazyImgList.forEach((imgNode) => {
                const imgDom = imgNode.dom
                // ==当前图片的滚动高度==
                const curImgOffsetTop = imgDom.offsetTop

                // ==当前src(可能是预加载的占位的底图)==
                const curSrc = imgDom.getAttribute("src")
                // ==真实src==
                const realSrc = imgDom.dataset.src

                // ==是否出现在可视区域+避免重复设置判断==
                if ((curImgOffsetTop < winViewPortHeight + scrollTop) && curSrc !== realSrc) {
                    // ==设置src为真实的地址==
                    imgDom.setAttribute("src", realSrc)
                    // ==新增:真实图片加载完成后移除data-src,配合样式实现图片的淡入淡出效果==
                    imgDom.removeAttribute("data-src")
                    // ==更新已加载标识==
                    imgNode.lazy = true
                    // ==已加载图片+1==
                    lazyedImgCount++
                }
        })
    }

    // ==首次首屏加载==
    lazyload()
    // ==监听滚动以加载可视区域的图片==
    addEventListen(watchDom, watcEventName, throttle(lazyload, 100))
}

// ==预加载==
function preloadImage() {
    // ==创建Image对象==
    const image = new Image()

    // ==设置方法==
    // ==图片加载成功后的回调==
    image.onload = (data) => {
        console.log("1:图片加载成功", data)
    }
    // ==图片加载失败后的回调==
    image.onerror = (data) => {
        console.log("2:图片加载失败", data)
    }
    // ==图片加载期间用户点击的回调==
    image.onabort = (data) => {
        console.log("3:图片正则加载中", data)
    }

    // ==设置Image对象的src,表示向服务器请求图片资源==
    // ==因为在IE浏览器下,给Image对象的src赋值须在image.onload方法之后,所以将该行代码放在下面==
    image.src = "public/images/img-1.jpg"
    // ==测试图片加载失败回调==
    // image.src = "xxx"
    console.log(0)
}
// ==预加载图片:返回Promise对象==
function preloadImagePromise(imageSrc) {
    // ==创建一个Image对象==
    const image = new Image()

    // ==返回一个Promise对象==
    return new Promise((resolve, reject) => {
        // ==Promise的构造函数:立即执行==
        image.onload = (data) => {
            const message = `1:图片${imageSrc}加载成功`
            // console.log(message, data) // 去掉打印信息,在catch中捕获
            // ==图片加载成功后==
            resolve({message,data}) // 更改Promise的状态:pending->fulfilled
        }
        image.onerror = (data) => {
            const message = `2:图片${imageSrc}加载失败`
            // console.log(message, data)
            // ==图片加载失败后==
            reject({message,data}) // 更改Promise的状态:pending->rejected
        }
        image.onabort = (data) => {
            console.log(`3:图片${imageSrc}正在加载中`, data)
        }
        // ==设置Image对象的src==
        image.src = imageSrc
        // ==测试图片加载失败==
        // image.src = "xxx"
    })
}
// ==实现对多张图片的预加载及回调==
function preloadImageListPromise() {
    // ==预加载的图片列表==
    const preloadImageList = [
        "public/images/img-1.jpg",
        "public/images/img-2.jpg",
        "public/images/img-3.jpg",
        "public/images/img-4.jpg",
        "public/images/img-5.jpg",
        "public/images/img-6.jpg",
        "public/images/img-7.jpg",
        "public/images/img-8.jpg",
        "public/images/img-9.jpg",
        "public/images/img-10.jpg",
        "public/images/img-11.jpg",
        "public/images/img-12.jpg",
        "public/images/img-13.jpg",
        "public/images/img-14.jpg",
        "public/images/img-15.jpg",
        "public/images/img-16.jpg",
        "public/images/img-17.jpg",
        "public/images/img-18.jpg",
        "public/images/img-19.jpg",
        "public/images/img-20.jpg",
    ]
    // ==预加载图片的回调(也可以将此Promise返回,在外部处理,根据需求选择)==
    // ==Promise.all(Promise对象组成的数组):全部成功后触发then;只要有一个执行失败便返回触发catch==
    // ==Promise.all:成功返回数组且子项的顺序是一致的(不管子项返回的早还是晚);失败返回失败那条对应的数据且不再继续往下执行直接退出==
    // ==Promise.all:并行执行里面所有的Promise对象==
    Promise.all(preloadImageList.map((imageNode => preloadImagePromise(imageNode))))
        .then(data=> {
            console.log("预加载的图片全部加载成功", data)
            // ==新增:图片先预加载再懒加载(从缓存中拿)==
            lazyloadImageList()
        }).catch(data=> {
            console.log("预加载图片失败", data)
        })
}



window.onload = ()=> {
    setTimeout(() => {
        // ==实现图片懒加载==
        // lazyloadImageList()
        // ==实现图片预加载==
        // preloadImage()
        // ==图片地址==
        // const imageSrc = "public/images/img-1.jpg"
        // preloadImagePromise(imageSrc).then(data=> {
        //     console.log("4:图片预加载成功", data)
        // }).catch(data=> {
        //     console.log("5:图片预加载失败", data)
        // })
        // ==新==
        preloadImageListPromise()
    }, 1000);
}

console.log("哈喽，我是露水晰123！")
console.log("哈喽，我是露水晰123！")
console.log("哈喽，我是露水晰123！")
/**
 * 将在html页面上引用的路径上的\替换成/
 * @param {String} path 
 * @returns String
 */
function getHandlePathOfHtml(path) {
    return typeof path === "string" ? path.replaceAll("\\", "/") : ""
}

/**
 * 校验字符串是否只含英文字母
 * @param {String} val 
 * @returns Boolean
 */
function validateOnlyAlphabet(val) {
    const reg = /^[A-Za-z0-9]+$/
    if (reg.test(val)) {
        return true
    } else {
        return false
    }
}

module.exports = {
    getHandlePathOfHtml,
    validateOnlyAlphabet,
}

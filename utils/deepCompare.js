/**
 * 作者:露水晰123(掘金)
 * 日期:2024年11月19日
 * 功能:深层比较两个数据
 */

/**
 * 获取引用类型的具体类型=
 * @param {Object} obj 
 * @returns "[object 具体类型]"
 */
function getObjectType(obj) {
    return Object.prototype.toString.call(obj)
}

/**
 * 比较两个对象是否相同
 * @param {Object} curNewItem 
 * @param {Object} curOldItem 
 * @returns 
 */
function compareObject (curNewItem, curOldItem) {
    // ==获取自身定义的key集合==
    const newKeys = Object.keys(curNewItem)
    const oldKeys = Object.keys(curOldItem)
    if (newKeys.length !== oldKeys.length) {
        // ==长度不同==
        return false
    }
    // ==长度相同==
    if (newKeys.length === 0) {
        // ==长度相同且为0==
        // console.log(4)
        return true
    }
    let i = 0
    while (i < newKeys.length) {
        // ==当前key==
        const curKey = newKeys[i]
        // ==新增:搞乱key的顺序依然可以根据key比较==
        const curOldItemHasKey = oldKeys.includes(curKey)
        if (!curOldItemHasKey) {
            // ==有不同的key==
            // ==修改:若new中的key在old中不存在即有不同==
            // ==修改:在curOldItem找不到curNewItem对应的key==
            return false
        }
        if (!compareTwoData(curNewItem[curKey], curOldItem[curKey])) {
            return false
        }
        i++
    }
    return true
}

/**
 * 比较两个数组是否相同且数组项是对象
 * @param {*} newArr 
 * @param {*} oldArr 
 * @returns 
 */
function compareArray(newArr, oldArr) {
    if (newArr.length !== oldArr.length) {
        // ==长度不同=
        // console.log(1)
        return false
    }
    // ==长度相同==
    if (newArr.length === 0) {
        // console.log(2)
        return true
    }
    let i = 0
    while (i < newArr.length) {
        if (!compareTwoData(newArr[i], oldArr[i])) {
            return false
        }
        i++
    }
    return true
}

/**
 * 比较两个数据是否相同
 * @param {*} curNewItem 
 * @param {*} curOldItem 
 * @returns 
 */
function compareTwoData(curNewItem, curOldItem) {
    let curNewItemType = typeof curNewItem
    let curOldItemType = typeof curOldItem
    if (curNewItemType !== curOldItemType) {
        // ==类型不同==
        return false
    }
    // 类型相同
    if (curNewItemType === "object") {
        // ==类型相同且都是引用数据类型==
        curNewItemType = getObjectType(curNewItem)
        curOldItemType = getObjectType(curOldItem)
        if (curNewItemType !== curOldItemType) {
            // ==具体的引用类型不同==
            return false
        }
        if (curNewItemType === "[object Object]") {
            // ==同为原生的对象类型==
            return compareObject(curNewItem, curOldItem)
        }
        if (curNewItemType === "[object Array]") {
            // ==同为数组==
            return compareArray(curNewItem, curOldItem)
        }
    }
    if (curNewItem !== curOldItem) {
        // ==基本数据类型和非原生对象和数组类型==
        return false
    }
    return true
}

// ==测试:node deepCompare.js==
// console.log(compareArray([{
//     id:12,
//     child: [],
//     name:"露水晰",
//     price:null,
// }],[{
//     id:12,
//     child:[],
//     name:"露水晰",
//     price:null
// }]))

export {
    compareObject,
    compareArray,
    compareTwoData,
}

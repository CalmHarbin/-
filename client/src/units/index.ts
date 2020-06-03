/*
 * 时间格式化
 * @method GetDateTime
 * @param {Object} dateObj 时间对象 new Date()
 * @param {string} format 格式 例如 'Y-m-d h:i:s'
 * @return {string}
 */
export const $_GetDateTime = function(dateObj: Date, format: string) {
    if (dateObj) {
        let date = new Date(dateObj)

        let obj: any = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            min: date.getMinutes(),
            s: date.getSeconds()
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let element = obj[key]
                obj[key] = element < 10 ? '0' + element : element
            }
        }
        if (format) {
            return format
                .replace('Y', obj.y)
                .replace('m', obj.m)
                .replace('d', obj.d)
                .replace('h', obj.h)
                .replace('i', obj.min)
                .replace('s', obj.s)
        }

        return (
            obj.y +
            '-' +
            obj.m +
            '-' +
            obj.d +
            ' ' +
            obj.h +
            ':' +
            obj.min +
            ':' +
            obj.s
        ) //返回时间格式
    } else return console.error('$_GetDateTime方法请至少传入一个参数')
}
/*
 * 比较两个对象是否相等
 * @method deepCompare
 * @param { Object } x 对象1
 * @param { Object } y 对象2
 * @return { Boolean } true相等  false不相等
 */
// eslint-disable-next-line no-unused-vars
export const $_deepCompare = function(x: any, y: any) {
    let i, l, leftChain, rightChain
    function compare2Objects(x: any, y: any) {
        let p

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (
            isNaN(x) &&
            isNaN(y) &&
            typeof x === 'number' &&
            typeof y === 'number'
        ) {
            return true
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if (
            (typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)
        ) {
            return x.toString() === y.toString()
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false
        }

        if (x.constructor !== y.constructor) {
            return false
        }

        if (x.prototype !== y.prototype) {
            return false
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false
            } else if (typeof y[p] !== typeof x[p]) {
                return false
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false
            } else if (typeof y[p] !== typeof x[p]) {
                return false
            }

            switch (typeof x[p]) {
                case 'object':
                case 'function':
                    leftChain.push(x)
                    rightChain.push(y)

                    if (!compare2Objects(x[p], y[p])) {
                        return false
                    }

                    leftChain.pop()
                    rightChain.pop()
                    break

                default:
                    if (x[p] !== y[p]) {
                        return false
                    }
                    break
            }
        }

        return true
    }

    // eslint-disable-next-line no-undef
    if (arguments.length < 2) {
        // return true //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
        console.error('请传入两个参数')
    }

    // eslint-disable-next-line no-undef
    for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = [] //Todo: this can be cached
        rightChain = []
        // eslint-disable-next-line no-undef
        if (!compare2Objects(arguments[0], arguments[i])) {
            return false
        }
    }
    return true
}

/**
 * 存储localStorage
 * @param {string} name 健名
 * @param {string,object} content 健值
 * @param { bool } content true为存session，false为存local
 */
export const setStore = (name, content, flag) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    flag ? window.sessionStorage.setItem(name, content) : window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 * @param {string} name 健名
 * @param { bool } content true为查session，false为查local
 */
export const getStore = (name, flag) => {
    if (!name) return;
    return flag ? window.sessionStorage.getItem(name) : window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 * @param {string} name 健名
 * @param { bool } content true为删session，false为删local
 */
export const removeStore = (name, flag) => {
    if (!name) return;
    flag ? window.sessionStorage.removeItem(name) : window.localStorage.removeItem(name);
}

// 换取时间格式： 年-月-日
export const formatDate = (value) => {
    return value.getFullYear() + '-' + ((value.getMonth() + 1) <= 9 ? '0' + (value.getMonth() + 1) : (value.getMonth() + 1)) + '-' + (value.getDate() <= 9 ? '0' + value.getDate() : value.getDate());
}

/**
 * 设置cookie
 * @param name cookie的名称
 * @param value cookie的值
 * @param day cookie的过期时间 不传，默认永久存储
 */
// export const setCookie = (name='', value='', day = '30') => {
// 	if(day !== 0) {     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
// 	var expires = day * 24 * 60 * 60 * 1000;
// 	var date = new Date(+new Date()+expires);
// 	document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
// 	} else {
// 		document.cookie = name + "=" + escape(value);
// 	}
// }
export const setCookie = (name = '', value = '', days = Infinity) => {
    var str = name + "=" + escape(value);
    if (days > 0) {
        var date = new Date();
        var ms = days * 24 * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    if (days === Infinity) {
        str += "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }

    document.cookie = str;
}

/**
 * 获取对应名称的cookie
 * @param name cookie的名称
 * @returns {null} 不存在时，返回null
 */
export const getCookie = (name) => {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2])
    } else {
        return null
    }
}

/**
 * 删除cookie
 * @param name cookie的名称
 */
export const removeCookie = (name) => {
    setCookie(name, ' ', -1)
}

/* ================================== 获取 url 参数 =================================== */
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach'
import toUpper from 'lodash/toUpper';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import functionsIn from 'lodash/functionsIn';
import keysIn from 'lodash/keysIn';

/**
 * 是否触摸设备
 */
const isTouchDevice = function() {
    return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
}

const allUrlObj = function (str) {
    if (typeof str === 'undefined') {
        str = window.location.search.substr(1);
    }
    if (str.indexOf('#') >= 0) {
        str = str.split('#')[0];
    }
    var UrlObj = {}, urlArr = str.split('&');
    for (var i = 0, len = urlArr.length; i < len; i++) {
        UrlObj[urlArr[i].split('=')[0]] = urlArr[i].split('=')[1];
    }
    return UrlObj;
};

const getRequest = function (key, exceptKey, isReStr, strSearch) {
    var url = typeof strSearch === 'undefined' || $.trim(strSearch) === '' ? location.search : strSearch; //获取url中"?"符后的字串
    var theRequest = {};
    var tmpArr = [];
    if (url.indexOf("?") != -1) {
        if (typeof exceptKey == 'undefined' || null == exceptKey || !$.isArray(exceptKey)) {
            exceptKey = [];
        }
        var str = $.trim(url.substr(1));
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if ($.inArray(strs[i].split("=")[0], exceptKey) == -1) {
                tmpArr.push(strs[i]);
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
    }
    if (isReStr) {
        return tmpArr.join('&');
    }
    if (typeof key == 'undefined' || key == '' || !key) {
        return theRequest;
    }
    return theRequest[key];
};

/* ================================== 校验数据相关 =================================== */

const validateMobile = function (mobile, reg) {
    //return true;
    var default_reg = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|17\d{9}|16\d{9}$/;
    if (reg != '' && reg != undefined && reg != null) {// 验证手机号码格式是否正确
        default_reg = reg;
    }
    if ($.trim(mobile) === '' || !default_reg.test($.trim(mobile))) {
        return false;
    } else {
        return true;
    }

};

const validateEmail = function (email) {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    if (!reg.test(email)) {
        return false;
    }
    return true;
};

const verifyIdCard = function (card) {
    /* 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X*/
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
        return false;
    } else {
        return true;
    }
};

/**
 * 验证价格是否合法(保留2位小数)
 * @param price
 * @returns {boolean}
 */
const verifyPrice = function (price) {
    var reg = /^\d+(\.\d{2})?$/;
    if (!reg.test(price)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 验证字符串是否是数字(无小数)
 * @param number
 * @returns {boolean}
 */
const verifyNum = function (number) {
    var reg = /^[0-9]*$/;
    if (!reg.test(number)) {
        return false;
    } else {
        return true;
    }
};

const verifyLen = function (str, startLen, endLen) {
    if (typeof startLen == 'undefined' || isNaN(parseInt(startLen))) {
        startLen = 1;
    }
    if (typeof endLen == 'undefined' || isNaN(parseInt(endLen))) {
        endLen = 256;
    }
    return (startLen <= $.trim(str).length && endLen >= $.trim(str).length);
};

/* ============================= 自定义的工具方法====================================== */

/**
 * 判断数据（数组或对象）是否存在某值（支持字符串和数字）
 * @param needle 判断的目标值（字符串或数字）
 * @param srcData 等待被判断的源数据（数组或对象）
 * @param bool 是否返回源数据中的键（true 则返回）
 * @returns {*}
 */
const myInArray = function (needle, srcData, bool) {
    if (typeof needle == "string" || typeof needle == "number") {
        for (var i in srcData) {
            if (needle === srcData[i]) {
                if (bool) {
                    return i;
                }
                return true;
            }
        }
        return false;
    }
};

const inArray = function (target, array, key) {
    for (var i in array) {
        if (target == array[i][key]) {
            return i;
        }
    }
    return -1;
};
const getFromObjByKeys = function (srcO, keys) {

    if (!isObject(srcO)) {
        return false;
    }
    var o = {};

    forEach(keys, function (item) {

        if ('undefined' != typeof srcO[item]) {
            o[item] = srcO[item];
        }
    });
    return o;
}
/**
 * 克隆一个对象（递归）
 * @param fromObj
 * @returns {{}}
 */
const myCloneObj = function (fromObj) {
    var toObj = {};
    for (var i in fromObj) {
        if (typeof fromObj[i] == "object") {
            toObj[i] = myCloneObj(fromObj[i]);
        } else {
            toObj[i] = fromObj[i];
        }
    }
    return toObj;
};

/**
 * 与增删查改无关的，通过此方法生成 action 类型
 * @param keys （字符串或数组）
 * @param asyn true:生成异步类型；false:同步类型
 * @returns {{}}
 */
const generateAsynActionType = (keys = [], asyn = false) => {
    isString(keys) && (keys = [keys]);

    if (isArray(keys)) {
        let tO = {}, tArr, i, j;

        for (i in keys) {

            if (isString(keys[i])) {
                tArr = asyn ? [
                    `${keys[i]}_REQUEST`,
                    `${keys[i]}_SUCCESS`,
                    `${keys[i]}_FAILURE`
                ] : [keys[i]];

                for (j in tArr) {
                    tO[tArr[j]] = tArr[j];
                }
            }
        }
        return tO;

    } else {
        return {};
    }
};

/**
 * 针对actionType 生成一个对象, 包含有三种请求状态的增删查改的数组
 * 与增删查改相关的，通过此方法生成 action 类型
 * @param keys
 * @returns {{}}
 */
const generateAsynCRUDTypeArr = (keys = []) => {
    isString(keys) && (keys = [keys]);

    if (isArray(keys)) {
        let typesObject = {},
            type = ['list', 'item', 'save', 'delete'],
            result = ['Success', 'Request', 'Failure'];
        for (var i in keys) {

            if (isString(keys[i])) {
                type.map((tItem, tIndex) => {
                    result.map((rItem, rIndex) => {
                        if (typeof typesObject[`${tItem}${rItem}Types`] === 'undefined') {
                            typesObject[`${tItem}${rItem}Types`] = []
                        }
                        typesObject[`${tItem}${rItem}Types`].push(`${keys[i]}_${toUpper(tItem)}_${toUpper(rItem)}`)
                    })
                });
            }
        }
        return typesObject;

    } else {
        return {};
    }
};

/**
 * 自定义格式化时间/日期
 * @param format 格式（'y':年,'M':月,'d':日,'h':时,'m':分,'s':秒,'S':毫秒），会直接改变这个参数
 * @param timestamp 时间戳（毫秒/秒）
 */
const myFormatTime = function (format, timestamp) {
    if (null == format || '' == $.trim(format)) {
        format = 'yyyy-MM-dd hh:mm:ss'
    }
    if (!window.myFormatDate || typeof window.myFormatDate == 'undefined') {
        window.myFormatDate = new Date();
    }
    return window.myFormatDate.format(format, timestamp);
};

Date.prototype.format = function (format, timestamp) {
    var tempDate;

    if (timestamp && timestamp > 0) {
        if (timestamp > 9999999999) {
            tempDate = new Date(timestamp);
        } else {
            tempDate = new Date(timestamp * 1000);
        }
    } else {
        tempDate = this;
    }
    var date = {
        "M+": tempDate.getMonth() + 1,
        "d+": tempDate.getDate(),
        "h+": padLeft(tempDate.getHours().toString(), 2),
        "m+": padLeft(tempDate.getMinutes().toString(), 2),
        "s+": padLeft(tempDate.getSeconds().toString(), 2),
        "q+": Math.floor((tempDate.getMonth() + 3) / 3),
        "S+": tempDate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (tempDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};


/**
 * 为 【表单自动校验功能】 处理错误提示
 * 需要为dom 表单元素设置的属性包括：
 *
 *      data-check-need="y"    表示该表单元素需要校验
 *      data-check-rule="val"   表示校验规则，包括val、phone、email、len、custom、accord
 *      data-check-tip=""      表示校验提示信息
 *
 *      data-check-len="5:10"   当校验规则为len时，需要额外加多这个属性，表示字符串的长度限制
 *      data-check-accord="#confirmPassword"    当校验规则为accord时，需要额外加多这个属性，
 *                          表示要与当前表单元素值比较的另一个表单元素的选择器
 *      data-check-custom="1"    当校验规则为custom时，需要额外加多这个属性，当这个属性的值为1时，表示校验通过
 *
 * @param dom [data-check-need]元素，即需要校验的form表单中的dom元素
 * @param errTipO
 * @param checkTipCb     自定义校验提示信息的回调函数，用于提示校验信息
 * @returns {boolean}
 */
const dealFormCheckErrTip = (dom, errTipO, checkTipCb) => {
    var rt = true;
    /*此属性是必须的*/
    if ($(dom).attr("data-check-need") === 'y') {
        /**
         * 校验数据的规则，有值：
         *  'val': 只校验值是否为空,默认值;
         *  'phone': 校验手机号码格式是否正确;
         *  'email': 校验邮箱格式是否正确;
         *  'len': 校验长度，需要定义 "data-check-len"属性，上限下限由":"分号隔开;
         *  'custom': 由自定义的函数完成校验，则直接检查 “data-check-custom” 属性的值（1：通过检验；0：不通过校验）;
         *  'accord': 与什么保持一致，一般用于 确认密码 的校验, 需要定义 "data-check-accord" 属性，例如:data-check-accord="#check_psw_1",即与id="check_psw_1"的元素的值保持一致;
         */
        var rule = 'val';
        if (typeof $(dom).attr("data-check-rule") != 'undefined') {
            rule = $(dom).attr("data-check-rule");
        }
        if (rule === 'val') {
            if ($.trim($(dom).val()) == '' || $.trim($(dom).val()) == '0') {
                rt = false;
            }
        } else if (rule == 'phone') {
            rt = validateMobile($.trim($(dom).val()));
        } else if (rule == 'email') {
            rt = validateEmail($.trim($(dom).val()));
        } else if (rule == 'len') {
            //console.log($(dom).attr('data-check-len'));
            //if ($(this).attr('data-check-len')) {
            var lenArr = $(dom).attr('data-check-len').split(':');
            //console.log((lenArr[0] <= $.trim($(dom).val()).length && lenArr[1] >= $.trim($(dom).val()).length));
            //rt = (lenArr[0] <= $.trim($(dom).val()).length && lenArr[1] >= $.trim($(dom).val()).length);
            rt = verifyLen($(dom).val(), lenArr[0], lenArr[1]);
            //}
        } else if (rule == 'custom') {
            rt = (parseInt($(dom).attr('data-check-custom')) == 1);
        } else if (rule == 'accord') {
            /*与什么保持一致，一般用于 确认密码 的校验*/
            rt = $.trim($($(dom).attr('data-check-accord')).val()) == $.trim($(dom).val());
        } else if (rule == 'idcard') {
            /*身份证*/
            rt = verifyIdCard($.trim($(dom).val()));
        } else if (rule == 'number') {
            /* 数字 */
            rt = verifyNumber($.trim($(dom).val()));
        }
//                alert('check:'+rt);

        if (!rt) {
            /*显示错误提示*/
            var tip = '请完善必要信息';
            if (typeof $(dom).attr('data-check-tip') !== 'undefined') {
                tip = $(dom).attr('data-check-tip');
            }

            checkTipCb && checkTipCb(tip);

            errTipO && (errTipO.err = tip);
            $(dom).closest('[data-check-parent]')
                /*.removeClass('has-success').addClass('has-error')*/
                .find('[data-check-tip-ele]').addClass('error text-red pt5').html('&nbsp;&nbsp;<i class="fa fa-times-circle-o"></i>&nbsp;' + tip);
        } else {
            /*撤销错误提示*/
            $(dom).closest('[data-check-parent]')
                /*.removeClass('has-error').addClass('has-success')*/
                .find('[data-check-tip-ele]').removeClass('error text-red pt5').html('');
        }

    }
    return rt;
};

/**需要为dom 元素添加的属性：
 * data-save-item-for="#saveItem"   表示包裹着所有需要提交的表单元素的最外围元素的选择器
 *
 * data-item-detail     如果dom 元素没有设置data-save-item-for 属性，则可以为最外围元素设置这个属性，
 *                      前提是dom 元素必须包含在最外围元素里面
 *
 * 自动封装表单的字段，将返回一个基于 params 的对象
 * @param dom 所指定表单里面的某个元素，一般指表单里面的保存之类的按钮
 * @param params 需要额外添加的数据
 * @param checkTipCb 自定义校验提示信息的回调函数，用于提示校验信息
 */
const dealFormAttrForForm = (dom, params, checkTipCb) => {
    var rt = true,
        cuParams = merge({}, params),
        $tmpP = $($.trim($(dom).attr('data-save-item-for'))).length > 0 ?
            $($.trim($(dom).attr('data-save-item-for'))) : $(dom).closest("[data-item-detail]").eq(0);

    // 先给嵌套的 data-item-detail 的 data-item-attr 添加标示以忽略
    $tmpP.find('[data-item-detail] [data-item-attr]').addClass('attr-ignore');

    $tmpP.find('[data-item-attr]:not(.attr-ignore)').each(function () {

        if (dealFormCheckErrTip(this, null, checkTipCb)) {

            if ('' != $.trim($(this).attr('data-item-attr'))) {

                if ($(this).is('input') || $(this).is('textarea') || $(this).is('select')) {
                    cuParams[$(this).attr('data-item-attr')] = $(this).val();

                } else if ('radio' == $(this).attr('data-item-type')) {
                    cuParams[$(this).attr('data-item-attr')] =
                        $(this).find(`input[name="${$(this).attr('data-item-attr')}"]:checked`).eq(0).val();
                }
            }
        } else {
            $(this).focus();
            rt = false;
            return false;
        }

    });

    $tmpP.find('[data-item-detail] [data-item-attr]').removeClass('attr-ignore');

    if (rt === false) {
        cuParams = false;
    }
    return cuParams;
};



/**
 *
 */
function isObjectValEqual(srcObj, othObj) {
    return isEqual(omit(srcObj, functionsIn(srcObj)), omit(othObj, functionsIn(othObj)));
}

function padLeft(str, length) {
    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}

var _utils = {
    isTouchDevice,
    allUrlObj,
    getRequest,
    validateMobile,
    validateEmail,
    verifyIdCard,
    verifyLen,
    verifyNum,
    verifyPrice,
    myInArray,
    inArray,
    myCloneObj,
    getFromObjByKeys,
    myFormatTime, 
    dealFormCheckErrTip,
    dealFormAttrForForm,
    generateAsynActionType,
    generateAsynCRUDTypeArr,
    isObjectValEqual
};

module.exports = _utils;

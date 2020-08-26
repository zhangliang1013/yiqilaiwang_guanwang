window.beastTools = {
    allUrlObj: function (str) {
        str == undefined ? window.location.href : str;
        str = window.location.search.substr(1);
        if (str.indexOf('#') >= 0) {
            str = str.split('#')[0];
        }
        var UrlObj = {}, urlArr = str.split('&');
        for (var i = 0, len = urlArr.length; i < len; i++) {
            UrlObj[urlArr[i].split('=')[0]] = urlArr[i].split('=')[1];
        }
        return UrlObj;
    },
    getRequest: function (key, exceptKey, isReStr, strSearch) {
        var url = typeof strSearch === 'undefined' || $.trim(strSearch) === '' ? location.search : strSearch; //获取url中"?"符后的字串
        var theRequest = {};
        var tmpArr = [];
        if (url.indexOf("?") != -1) {
            if (typeof exceptKey == 'undefined' || null == exceptKey || !$.isArray(exceptKey)) {
                exceptKey = [];
            }
            var str = $.trim(url.substr(1));
            strs = str.split("&");
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
    },
    validateMobile: function (mobile, reg) {
        if (11 != $.trim(mobile).length) {
            return false;
        }
        var default_reg = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|17\d{9}|19\d{9}|16\d{9}$/;
        if (reg != '' && reg != undefined && reg != null) {// 验证手机号码格式是否正确
            default_reg = reg;
        }
        if ($.trim(mobile) === '' || !default_reg.test($.trim(mobile))) {
            return false;
        } else {
            return true;
        }

    },
    validateEmail: function (email) {
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

        if (!reg.test(email)) {
            return false;
        }
        return true;
    },
    verifyIdCard: function (card) {
        /* 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X*/
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) === false) {
            return false;
        } else {
            return true;
        }
    },
    verifyPrice: function (price) {// 验证价格是否合法保留1位小数
        var reg = /^\d+(\.\d{1})?$/;
        if (!reg.test($.trim(price))) {
            return false;
        } else {
            return true;
        }
    },
    verifyNum: function (number) {// 验证字符串是否是数字
        var reg = /^[0-9]*$/;
        if (!reg.test($.trim(number))) {
            return false;
        } else {
            return true;
        }
    },
    verifyLen: function (str, startLen, endLen) {
        if (typeof startLen == 'undefined' || isNaN(parseInt(startLen))) {
            startLen = 1;
        }
        if (typeof endLen == 'undefined' || isNaN(parseInt(endLen))) {
            endLen = 256;
        }
        return (startLen <= $.trim(str).length && endLen >= $.trim(str).length);
    },
    myInArray: function (needle, array, bool) { /*判断数据书否存在某值（支持字符串和数字）*/
        if (typeof needle == "string" || typeof needle == "number") {
            for (var i in array) {
                if (needle === array[i]) {
                    if (bool) {
                        return i;
                    }
                    return true;
                }
            }
            return false;
        }
    },
    myCloneObj: function (fromObj) {
        var toObj = {};
        for (var i in fromObj) {
            if (typeof fromObj[i] == "object") {
                toObj[i] = window.beastTools.myCloneObj(fromObj[i]);
            } else {
                toObj[i] = fromObj[i];
            }
        }
        return toObj;
    },
    myFormatTime: function (format, timestamp) {
        if (!this.date || typeof this.date == 'undefined') {
            this.date = new Date();
        }
        return this.date.format(format, timestamp);
    },
    inArray: function (target, array, key) {
        for (var i in array) {
            if (target == array[i][key]) {
                return i;
            }
        }
        return -1;
    },
    dynGetJsFile: function (filePath) {
        if ($.isArray(filePath) && filePath.length > 0) {
            var tmpHtml = '';
            filePath.forEach(function(obj) {
                if ('' !== $.trim(obj)) {
                    tmpHtml +='<script src=\"' + $.trim(obj) + '\" type=\"text/javascript\"><\/script>';
                }
            });
            $('body').append(tmpHtml);
        } else if ('' !== $.trim(filePath)) {
            $('body').append('<script src=\"' + $.trim(filePath) + '\" type=\"text/javascript\"><\/script>');
        }
    }
};
Date.prototype.format = function (format, timestamp) {
    var tempDate;

    if (timestamp && timestamp > 0) {
        if(timestamp > 9999999999) {
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

function padLeft(str, length) {
    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}

function elementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft;
        curtop = obj.offsetTop;
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
    }
    return {x: curleft, y: curtop};
}
function ScrollToControl(id)
{
    var elem = document.getElementById(id);
    var scrollPos = elementPosition(elem).y;
    //console.log('scrollPos', elem);
    scrollPos = scrollPos - document.documentElement.scrollTop;
    var remainder = scrollPos % 50;
    var repeatTimes = (scrollPos - remainder) / 50;
    ScrollSmoothly(scrollPos, repeatTimes);
    window.scrollBy(0, remainder);
}
var repeatCount = 0;
var cTimeout;
var timeoutIntervals = new Array();
var timeoutIntervalSpeed;
function ScrollSmoothly(scrollPos, repeatTimes)
{
    if (repeatCount < repeatTimes)
    {
        window.scrollBy(0, 50);
    }
    else
    {
        repeatCount = 0;
        clearTimeout(cTimeout);
        return;
    }
    repeatCount++;
    cTimeout = setTimeout("ScrollSmoothly('" + scrollPos + "','" + repeatTimes + "')", 10);
}


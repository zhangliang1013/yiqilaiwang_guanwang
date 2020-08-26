/**
 * 判断是否 ie8
 */
const isIE8 = function () {
    return (window.attachEvent && !window.addEventListener);
};

const isIE = () => {
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1) {
        return true;
    } else {
        return false;
    }
}
/**
 * 禁止键盘输入
 * @param {type} e
 * @returns {undefined}
 */
const noPermitInput = (e) => {
    var evt = window.event || e;
    if (isIE()) {
        evt.returnValue = false; //ie 禁止键盘输入
    } else {
        evt.preventDefault(); //fire fox 禁止键盘输入
    }
}

export {
    isIE8,isIE,noPermitInput
}
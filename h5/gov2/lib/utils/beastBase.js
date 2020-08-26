import "sweetalert/dist/sweetalert.css"
import "toastr/toastr.less"
import toastr from 'toastr';
import 'sweetalert';
import indexOf from 'lodash/indexOf'
import isString from 'lodash/isString'
import forEach from 'lodash/forEach'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isEmpty from 'lodash/isEmpty'
import merge  from 'lodash/merge'
import {
    REACT_INITIAL_VALUE, REACT_UNIQ_VALUE_ARR,
    ORDER_STATUS_OBJ,
    ORDER_PAY_MODE_OBJ,
    ORDER_PAY_STATUS_OBJ,
    REFUND_STATUS_OBJ,
    RETURN_STATUS_OBJ,
    COMMENT_STATUS_OBJ,
    SUBSCRIBE_SCENE_OBJ
} from 'pageCommon/constants/COMMON'
import {myFormatTime, validateMobile, validateEmail, verifyLen, verifyIdCard, verifyNumber} from './beastUtils'

/** 提示信息 **/
const alertMsg = (title, msg, msgType, options) => {

    toastr.options = $.extend({
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-center",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": '2000',
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }, options);

    undefined === msgType && (msgType = 'info');
    undefined === title && (title = '温馨提示');
    undefined === msg && (msg = '');

    msgType === 'warning' ? toastr.options.timeOut = '3000' : toastr.options.timeOut = '2000';
    $('#toast-container').empty();
    toastr[msgType](msg, title);
};

/** 确认信息或者提示信息 **/
const confirmMsg = (msg, detail, callBack, msgType, options = {showCancelButton: true}, confirmBtnText = '确认', cancelBtnText = '取消') => {
    typeof msgType === 'undefined' && (msgType = 'warning');

    var defaults = {
        title: msg,
        text: $.trim(detail),
        type: msgType,
        confirmButtonText: confirmBtnText,
        cancelButtonText: cancelBtnText,
        closeOnConfirm: true,
        closeOnCancel: true
    };
    var option = $.extend(defaults, options);

    if (callBack && $.isFunction(callBack)) {
        swal(option, callBack);
    } else {
        swal($.extend({
            title: msg,
            text: $.trim(detail),
            type: msgType
        }, options));
    }
    if (options.showCancelButton == false) {
        $('body').find('.sweet-alert').find('.sa-button-container').addClass('hideCancelBtn');
    }
};

/* 绑定基础的公用 JQ 事件 */
const bindBaseEvent = function () {

    $('body').on('click', '[data-jump-url]', function () {
        if ('' !== $.trim($(this).attr('data-jump-url'))) {
            if ($.trim($(this).attr('data-jump-url')).indexOf('index') != -1) {
                return;
            }
            var urlParams = $.trim($(this).attr('data-url-params'));
            window.location.href = $.trim($(this).attr('data-jump-url')) + '&' + urlParams;
        }
    });

    /**自定义 radio 效果**/
    $('body').on('click', '.my-radio', function () {
        if ($(this).hasClass('active')) {
            return;
        }
        $(this).closest('.my-radio-parent').eq(0).find('.my-radio').each(function () {
            $(this).removeClass('active').find('.check-val').val(0);
        });
        $(this).addClass('active').find('.check-val').val(1);
    });

    /**【表单自动校验】当需要校验的元素的失去焦点后自动校验 **/
    $('body').on('focusout', '[data-check-need]', function (event) {
        /*实现自动校验，将当前 "Dom" 元素传过去*/
        dealFormCheckErrTip(this);
    });

    $('body').on('focusin', 'input', function () {
        $(this).select();
    })

    /* 解决 dropdown 一点击就关闭问题 */
    $('body').on("ul.dropdown-menu", "click", "[data-stopPropagation]", function (e) {
        e.stopPropagation();
    });

    /**
     * 关闭通知栏
     */
    $('body').on('click', '.close-message', function () {
        $(this).closest('.notification-wrapper').hide(300);
    });

};

/**
 * 事件绑定
 * @returns 无返回
 */
const bindBeastEvent = function () {

    if (typeof window.hadBindBeastEvent !== 'undefined' && window.hadBindBeastEvent == true) {
        return false;
    }
    window.hadBindBeastEvent = true;
    bindBaseEvent();
};

const myGetDateTime = function (dates, format = '') {
    return myFormatTime(format, dates);
};

/**
 * 判断是否可以发货
 * @param status
 */
const canDispatchOrder = function (status) {
    return parseInt(status) == 1 || parseInt(status) == 2;
};

const getCurRootRouterPath = function () {
    let tArr = window.location.pathname.split('/');
    return tArr.slice(0, 3).join('/');
};

const CUR_ROOT_ROUTER_PATH = getCurRootRouterPath();

const getListRouter = function (pathLength) {
    let tmpLen = 3;

    // 如果未传入 pathLength，而且是在后台管理页面(单页面)，则默认是取到4
    if (typeof pathLength == 'undefined' &&
        -1 !== window.location.pathname.indexOf('adminWeb/index')) {
        tmpLen = 4;
    } else if (typeof pathLength !== 'undefined') {
        tmpLen = pathLength;
    }
    let listRouter = window.location.pathname.split('/').slice(0, tmpLen + 1).join('/');
    return listRouter;
};

/* 将state中的指定字段设置为初始值 */
const setStateInitValue = function (stateField, action, state) {
    if (typeof stateField == 'undefined' || !isString(stateField)) {
        throw new Error('必须传入state的相关字段并且必须为字符串！');
    }
    if (typeof action == 'undefined' || typeof action.stateFields == 'undefined') {
        throw new Error('必须传入action并且action中必须含有stateFields属性 ！');
    }

    if (!isEmpty(action.stateFields) && isArray(action.stateFields) &&
        $.inArray(stateField, action.stateFields) >= 0) {
        return REACT_INITIAL_VALUE;
    }
    return state;
};

/* 判断传进来的 value 是否为系统有效值（若存在于 REACT_UNIQ_VALUE_ARR 数组中，则为无效值） */
const isUseFulValue = function (value) {
    if (!isString(value)) {
        return true;
    }
    return (indexOf(REACT_UNIQ_VALUE_ARR, value) === -1)
}

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
                .find('[data-check-tip-ele]').addClass('error pt5').html('&nbsp;&nbsp;<i class="fa fa-times-circle-o"></i>&nbsp;' + tip);
        } else {
            /*撤销错误提示*/
            $(dom).closest('[data-check-parent]')
                /*.removeClass('has-error').addClass('has-success')*/
                .find('[data-check-tip-ele]').removeClass('error pt5').html('');
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
 * 接单信息推送,由app端进行调用
 */
window.triggerTaskMessages = () => {
    var _html = (
        `<div class="message-box">
            <div class="message-head">
                抢单通知
                <i class="fa fa-close close-message" role="button"></i>
            </div>
            <a href="${getListRouter(2)}/service" class="message-body">
                有新的服务订单哦!
            </a>
        </div>`
    );
    if (window.location.pathname.indexOf('service') != -1
        && window.location.pathname == '/appWeb/index/service') {
        if (typeof window.refreshTaskMessage != 'undefined') {
            window.refreshTaskMessage &&
            window.refreshTaskMessage();
        } else {
            $('body').find('.notification-wrapper').html(_html).show(300);
        }
    } else {
        $('body').find('.notification-wrapper').html(_html).show(300);
    }
    setTimeout(()=> {
        $('body').find('.notification-wrapper').hide(300);
    }, 5000);
};

/*app返回键*/
window.pageHistoryBack = ()=> {
    if (window.location.pathname.trim() == '/appWeb/index/dealer') {
        return 0;
    } else if (window.location.pathname.trim() == '/appWeb/index/service') {
        return 0
    } else if (window.location.pathname.trim() == '/appWeb/index/finance') {
        return 0;
    } else if (window.location.pathname.trim() == '/appWeb/index/user') {
        return 0;
    } else if (window.location.pathname.indexOf('payResult') != -1) {
        window.location.href = `/appWeb/index/dealer`;
        return 1
    }
    window.history.back();
    return 1;
};


/**
 * 订单状态
 * @param status
 */
const formatOrderStatus = function (status) {
    //0待支付、1待发货、2待收货、3待评论、4已完成、5取消中、6已取消、7申请退货中、8待退货、9已退货退款
    return isObject(ORDER_STATUS_OBJ[`s_${status}`]) ? ORDER_STATUS_OBJ[`s_${status}`]['cnTxt'] : '';
};

/**
 * 支付方式
 * @param status
 */
const formatPayMode = function () {

};

/**
 * 订单支付状态
 * @param status
 */
const formatOrderPayStatus = function (status) {
    //0未付款、1已付款、2已退款
    return isObject(ORDER_PAY_STATUS_OBJ[`s_${status}`]) ? ORDER_PAY_STATUS_OBJ[`s_${status}`]['cnTxt'] : '';
};

/**
 * 退款申请状态
 * @param status
 */
const formatRefundStatus = function (status) {
    return isObject(REFUND_STATUS_OBJ[`s_${status}`]) ? REFUND_STATUS_OBJ[`s_${status}`]['cnTxt'] : '';
};

/**
 * 退换货状态
 * @param status
 */
const formatReturnStatus = function (status) {
    return isObject(RETURN_STATUS_OBJ[`s_${status}`]) ? RETURN_STATUS_OBJ[`s_${status}`]['cnTxt'] : '';
};

const formatSubscribe = function(status){
    return SUBSCRIBE_SCENE_OBJ[`S_${status}`]?SUBSCRIBE_SCENE_OBJ[`S_${status}`]:'微信登录授权';
};

const log = (tip, msg)=>{
    if(msg){
        console.log(tip, msg);
    }else {
        console.log(tip);
    }
}

const warn = (tip, msg)=>{
    if(msg){
        console.warn(tip, msg);
    }else {
        console.warn(tip);
    }
}

const error = (tip, msg)=>{
    if(msg){
        console.error(tip, msg);
    }else {
        console.error(tip);
    }
}

/**
 * 获取指定日期未来或过去几天的日期
 * @param curTime    开始日期时间戳
 * @param mode      模式 0，表示向前获取指定数目的日期
 *                  模式 1，表示向后获取指定数目的日期
 *                  模式 2， 表示向前向后获取相同数目的日期（暂定）
 * @param num       表示取未来多少天的日期
 * @param formatTime    日期格式
 * @returns {*[]}   返回如[2017-3-29, ...]
 * @private
 */
const getSeriesDates = (curTime, num=7, mode=1, formatTime='yyyy-MM-dd')=>{
    let curDate = new Date(curTime),
        dateArr = [],
        dateCount = parseInt(num, 10) - 1;

    if(mode == 1){
        dateArr = [myFormatTime(formatTime, curTime)]
    }

    for(let i=1; i<=dateCount; i++){
        let newDate = new Date(curDate), dateTime,
            dateNum = 0;

        if(mode == 0){
            dateNum = -i;
        }else if(mode == 1){
            dateNum = i;
        }

        newDate.setDate(curDate.getDate() + dateNum);
        dateTime = myFormatTime(formatTime, Date.parse(newDate));
        dateArr.push(dateTime);
    }

    return dateArr;
}

export {
    bindBaseEvent,
    bindBeastEvent,
    alertMsg,
    confirmMsg,
    myGetDateTime,
    canDispatchOrder,
    getCurRootRouterPath,
    CUR_ROOT_ROUTER_PATH,
    getListRouter,
    setStateInitValue,
    isUseFulValue,
    dealFormCheckErrTip,
    dealFormAttrForForm,

    formatOrderStatus,
    formatPayMode,
    formatOrderPayStatus,
    formatRefundStatus,
    formatReturnStatus,
    formatSubscribe,
    log, warn, error,
    getSeriesDates
};

//if (typeof exports === 'object' && typeof module !== 'undefined') {
//    module.exports = _utils;
//} else {
//
//    if (typeof window !== 'undefined') {
//        // set as global.
//        window.beastBase = _utils;
//    } else {
//        console.error('beastBase: window 居然是 undefined！');
//    }
//}
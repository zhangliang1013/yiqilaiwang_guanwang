$(function() {
    const VRESION = '1.2.6';
    if ('undefined' !== typeof Ractive) { Ractive.DEBUG = false; }

    // if ('addEventListener' in document) {
    //     document.body.addEventListener('touchstart', function() {});
    // }

    window.beastBase = {
        host: '',
        apiUrl: "",
        ftUrl: '',
        defaultImg: '../lib/images/default.jpg',
        needLoadingPlay: true,
        init: function() {
            // this.initDropDown();
            this.bindEvent();
        },
        //initDropDown: function () {
        //    $('.f-dropdown-content').each(function () {
        //        $(this).css('top', '-' + $(this).height() + 'px');
        //    });
        //},
        bindEvent: function() {
            if (typeof this.hadBindEvent !== 'undefined') {
                return false;
            }
            var $this = this;
            //返回上一页
            $('body').on('click', '#page-back-btn', function(e) {
                // console.log('back');
                window.history.back();
            });
            //关闭当前页面
            $('body').on('click', '#page-close-btn', function(e) {
                // e.preventDefault();
                // console.log('close');
                appClosePage();
            });
            //返回首页
            $('body').on('click', '#page-back-home', function(e) {
                // e.stopPropagation();
                // console.log('back-home');
                appBackHome();
            });

            $('body').on('click', '#page-share-btn', function(e) {
                console.log('share');
                window.beastBase.alertMsg('此功能尚未开放', '', 'info');
                // if (window.phoneType == 'android' && window.android && window.android.backHome) {
                //     window.android.backHome();
                // } else if (window.phoneType == 'ios' && window.webkit &&
                //   window.webkit.messageHandlers && window.webkit.messageHandlers.backHome &&
                //   window.webkit.messageHandlers.backHome.postMessage) {
                //     window.webkit.messageHandlers.backHome.postMessage(null);
                // }
            });
            //打开弹框
            $('body').on('click', '#page-more-btn', function(e) {
                $('.page-mask-menu').fadeIn();
                $('.page-mask').fadeIn();
            });
            //关闭弹框
            $('body').on('click', '#page-mask-click', function(e) {
                $('.page-mask-menu').hide();
                $('.page-mask').hide();
            });

            // tab
            $('body').on('click', '.nav-tab>div', function() {
                var tabId = $.trim($(this).attr('data-tab'));
                $(this).addClass('active').siblings('div').removeClass('active');

                if (tabId && $(tabId)) {
                    $(tabId).addClass('active').siblings('.nav-tab-panel').removeClass('active');
                }
            });

            $('body').delegate('[data-jump-url]', 'click', function() {
                if (null !== $(this).attr('data-jump-url') && '' !== $.trim($(this).attr('data-jump-url'))) {
                    var urlParams = encodeURI($.trim($(this).attr('data-url-params')));
                    window.location.href = $.trim($(this).attr('data-jump-url')) +
                        '?' + urlParams;
                }
            });

            $('body').delegate(".back", 'click', function() {
                if ($(this).hasClass('his-back')) {
                    window.history.back();
                } else if (typeof $(this).attr('data-back-to') !== 'undefined' &&
                    $.trim($(this).attr('data-back-to')).length > 0) {
                    var urlParams = $.trim($(this).attr('data-url-params'));
                    window.location.href = $(this).attr('data-back-to') + '?' + urlParams;
                }
            });

            $('body').delegate(".reset-icon", 'click', function() {
                $(this).closest('.form-group').find('input,textarea').each(
                    function() {
                        $(this).val('').focus();
                    });
            });

            $('.f-dropdown-a').unbind('click');
            $(".f-dropdown-a").on('click', function(e) {
                var $this = $(this);
                var $parent = $this.closest('.f-dropdown-parent');

                if (!$this.hasClass('drop-work')) {
                    /* 展开 */
                    $this.addClass('drop-work');
                    $this.find('.f-work-1').hide();
                    $this.find('.f-work-2').fadeIn();
                    $parent.find(".f-dropdown-content").each(function() {
                        $(this).css('top', ($this.height()));
                    });
                    $this.trigger('dropdown-open');
                } else {
                    /* 收缩 */
                    $this.removeClass('drop-work');
                    $this.find('.f-work-1').fadeIn();
                    $this.find('.f-work-2').hide();
                    $parent.find(".f-dropdown-content").each(function() {
                        $(this).css('top',
                            '-' + $(this).height() + 'px');
                    });
                    $this.trigger('dropdown-close');
                }
            });

            $('body').delegate('.mask-work-for', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('mask-active')) {
                    $(this).removeClass('mask-active');
                    if ($('.mask-work-for.mask-active').length > 0) {
                        return;
                    } else {
                        $('.mask').removeClass('active');
                    }
                } else {
                    $(this).addClass('mask-active');
                    $('.mask').addClass('active');
                }
                /* 如果遮罩所束缚的所有元素都 */
            });

            $('body').delegate(".mask", 'click', function(e) {
                e.preventDefault();
                $('.mask-work-for').each(function() {
                    if ($(this).hasClass('mask-active')) {
                        $(this).trigger('click');
                    }
                });
                // $(this).closest('.f-dropdown-parent').find('.f-dropdown-a').trigger('click');
                // $(".f-dropdown-a").trigger('dropdown-close');
            });
            $(".f-dropdown-content > li > a").on('click', function(e) {
                e.preventDefault();
                $(this).closest('.f-dropdown-parent').find('.f-dropdown-a')
                    .trigger('click');
                $(".f-dropdown-a").trigger('dropdown-close');
            });

            $('body').on('click', "[data-tool-target]", function(e) {
                //alert(0);
                e.preventDefault();
                $(this).toggleClass('active');
                var target = $(this).attr('data-tool-target');
                $(target).toggleClass('active');
            });


            /**自定义 radio 效果**/
            $('body').delegate('.my-radio', 'click', function() {
                if ($(this).hasClass('active')) {
                    return;
                }
                var val = $(this).attr('data-val');
                $(this).addClass('active').siblings('.my-radio').removeClass('active');

                $(this).closest('.my-radio-parent').eq(0).find('.check-val').val(val);

            });

            /** *实现自定义的checkbox效果** */
            $('body').delegate('.my-checkbox', 'click', function() {
                if ($(this).hasClass('active')) {
                    /* 取消勾选操作 */
                    $(this).find('.check-val').val(0);
                } else {
                    /* 勾选操作 */
                    $(this).find('.check-val').val(1);
                }
                $(this).toggleClass('active');
            });

        },
        /*改变商品数量*/
        changeGdsCnt: function(tarThis, isReflesh) {
            if ($(tarThis).closest('.sel-cal-parent').length <= 0) {
                return false;
            }
            var $tmpP = $(tarThis).closest('.sel-cal-parent').eq(0);

            var cntShowTar = $.trim($tmpP.attr('data-cnt-show'));
            var priceShowTar = $.trim($tmpP.attr('data-price-show'));
            var totalGdsCnt = 0;
            var totalGdsPrice = 0;
            $tmpP.find('.sel-contain').each(function() {
                if (isReflesh) {
                    $(this).find('.sel-num-input').val(0);
                } else if (!isNaN(parseInt($(this).find('.sel-num-input').val()))) {
                    totalGdsCnt += parseInt($(this).find('.sel-num-input').val());
                    if ('' !== $.trim($(this).attr('data-sel-price')) &&
                        !isNaN(parseFloat($(this).attr('data-sel-price')))) {
                        totalGdsPrice += parseInt($(this).find('.sel-num-input').val()) * parseFloat($(this).attr('data-sel-price'));
                    }
                }
            });
            window.curGoodsCount = totalGdsCnt;

            if ('' !== cntShowTar) $(cntShowTar + '').text(window.curGoodsCount);
            if ('' !== priceShowTar) $(priceShowTar + '').text(totalGdsPrice.toFixed(2));
            //console.log('after window.curGoodsCount', window.curGoodsCount);
        },
        /**
         * ajax请求 依赖jquery1.11.1.min.js
         *
         * @param {String}
         *            url 请求url
         * @param {Object}
         *            ajaxData 请求数据
         * @param {String}
         *            reqType 'POST'/'GET'，默认为 'POST'
         * @param {Function}
         *            doneCallBack ajax请求完成后的回调
         * @param {Function}
         *            errorCallBack ajax请求出错的回调
         * @param {bool}
         *            async true(异步请求)/false(同步请求)，默认为true
         * @returns 无返回
         */
        ajaxGo: function(url, ajaxData, reqType, doneCallBack, errorCallBack,
            async, getStatics, $dom, isAllUrl) {
            // window.alert('in ajaxGo')
            // window.tokenVal = "eyJkZXZpY2VJZCI6IkEyQTNGQURBLUY5QkQtNDNGNS04MTM2LUM3QTRFMTY1MTdDMCIsImFsZyI6IkhTMjU2In0.eyJqdGkiOiJkNGFmNGIyNjA2YTExMWVhYjQ3ZTAwMTYzZTA1ZmY2NiIsImlhdCI6MTU4ODA2MDYwMywiZXhwIjoxNTg4MzE5ODAzfQ.S3xO-KCEFqrZ23ZekMuYrtwd5gRhIfZr0jBU8sVGOQQ"
            if ('' === $.trim(window.tokenVal)) {
                // this.alertMsg('无 token 信息');
                getAppUserToken();
                var $this = this;
                setTimeout(function(params) {
                    $this.ajaxGo(url, ajaxData, reqType, doneCallBack, errorCallBack,
                        async, getStatics, $dom, isAllUrl)
                }, 100);
                return;
            }

            if ($dom) {
                $($dom).addClass('disabled');
            }
            var ajaxUrl;
            var dataType = 'json';
            if (getStatics) {
                ajaxUrl = url;
                dataType = 'text';
            } else {
                if (isAllUrl) {
                    ajaxUrl = url;
                } else {
                    ajaxUrl = this.apiUrl + url;
                }
            }

            var ajaxAsync = typeof async == 'undefined' || null == async ||
                '' == async ? true : async;
            var ajaxType = typeof reqType == 'undefined' ? 'POST' : reqType;
            var parent = this.get_request('parent');
            if ('undefined' != typeof(parent)) {
                ajaxData.parent = parent;
            } else {
                parent = null;
            }
            if (true === this.needLoadingPlay && 'none' === $(".loading-contain").css('display')) {
                //$(".loading-contain").fadeIn(200);
                $(".loading-contain").css({ 'display': 'block' });
            }


            // window.alert('before $ajax:' + ajaxUrl + ajaxType + JSON.stringify(ajaxData));

            $.ajax({
                url: ajaxUrl,
                data: JSON.stringify(ajaxData),
                dataType: dataType,
                cache: false,
                async: ajaxAsync,
                type: ajaxType,
                headers: {
                    'token': window.tokenVal,
                    'api-client': 'f07684ed4d4411e9ac1ffa163e4d6ba1',
                    'api-version': VRESION,
                    'Content-Type': 'application/json'
                },
            }).done(function(rsp) {
                // window.alert('in $ajax done:' + JSON.stringify(rsp));
                //$(".loading-contain").fadeOut(300);
                if ('none' != $(".loading-contain").css('display')) {
                    $(".loading-contain").css({ 'display': 'none' });
                }
                setTimeout(function() {
                    $(".loading-contain").addClass('ajax-load');
                }, 500);

                if ($dom) {
                    $($dom).removeClass('disabled');
                }
                if (!getStatics) {
                    // if (rsp.code != 200) {
                    //     if (90005 == rsp.errcode || 90006 == rsp.errcode || 90007 == rsp.errcode) {
                    //         window.beastBase.alertMsg(rsp.errmsg + (rsp.data && rsp.data[0] ? rsp.data[0] : ''), '', 'warning');

                    //         setTimeout(function() {
                    //             //window.beastBase.alertMsg(rsp.errmsg + (rsp.data && rsp.data[0] ? rsp.data[0] : ''), '', 'warning');
                    //             window.location.href = rsp.url;
                    //         }, 2000);
                    //     } else {
                    //         window.location.href = rsp.url;
                    //     }
                    //     return;
                    // } else if (30013 == rsp.errcode || 50011 == rsp.errcode || 50012 == rsp.errcode || 50013 == rsp.errcode || 20006 == rsp.errcode) {
                    //     if (doneCallBack != undefined && doneCallBack != null) {
                    //         doneCallBack(rsp);
                    //     }
                    //     return;

                    // } else 
                    if (rsp.code != 200) {
                        window.beastBase.alertMsg('请求失败:' + rsp.msg, '', 'warning');
                        return;
                    }
                }
                if (doneCallBack != undefined && doneCallBack != null) {
                    doneCallBack(rsp);
                }

            }).error(function(ex) {
                // window.alert('in $ajax error:' + JSON.stringify(ex));

                if ($dom) {
                    $($dom).removeClass('disabled');
                }
                $(".loading-contain").css('display', 'none');
                // window.beastBase.alertMsg('网络错误', '请稍后重试', 'warning');
                if (errorCallBack != undefined && errorCallBack != null) {
                    errorCallBack(ex);

                } else if (ex && ex.status) {
                    window.beastBase.alertMsg('请求失败:' + ex.status, '', 'warning');
                }
            });
        },
        alertMsg: function(title, msg, msgType, options) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "positionClass": "toast-center",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": '3000',
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            if (options != undefined) {
                for (var i in options)
                    toastr.options[i] = options[i];
            }

            if (msgType == undefined || '' == msgType)
                msgType = 'info';
            /* msgType:success,info,warning */
            if (title == undefined)
                title = '';
            if (msg == undefined)
                msg = '';

            if (msgType == 'warning') {
                msg = title;
                title = '';
                toastr.options.timeOut = '3000';
            } else if (msgType == 'noclose') {
                toastr.options.timeOut = 'false';
                msgType = 'info';
            }
            // alert(title + ' ' + msg);
            $('[role="alert"]').remove();
            toastr[msgType](msg, title);
        },
        confirmMsg: function(msg, detail, callBack, msgType) {
            if (typeof msgType === 'undefined' || '' === $.trim(msgType)) {
                msgType = 'warning';
            }
            swal({
                title: msg,
                text: $.trim(detail),
                type: msgType,
                showCancelButton: true,
                confirmButtonColor: "#00a65a",
                closeButtonColor: "#00a65a",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
            }, callBack);
            return true;
        },
        get_request: function(key) {
            var url = location.search; // 获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                }
            }
            return theRequest[key];
        },
        dataBind: function(array, parentDom) {
            //console.log('dataBind array',array);
            //console.log('dataBind parentDom',parentDom);
            if (typeof array == 'object' && null !== array) {
                var i;
                for (i in array) {
                    var bind_element = typeof parentDom === 'undefined' ?
                        $('[bt-data-bind=' + i + ']') : $(parentDom).find('[bt-data-bind=' + i + ']');

                    if (bind_element.length > 0) {
                        //console.log(parentDom+' bind_element',bind_element);
                        //console.log(parentDom+' array[i]',array[i]);

                        if (bind_element.is('input') || bind_element.is('textarea') ||
                            bind_element.is('select')) {
                            bind_element.val(array[i]);
                        } else if (bind_element.is('img')) {
                            bind_element.attr('src', array[i]);
                        } else {
                            bind_element.html(array[i]);
                        }
                    }
                    var show_element = $('[bt-data-show=' + i + ']');
                    if (show_element.length > 0) {
                        if (array[i] > 0) {
                            show_element.show();
                            // show_element.css('display', 'block');
                        } else {
                            show_element.hide();
                            // show_element.css('display', 'none');
                        }
                    }
                }
            }
        },
        /**
         * 为 【表单自动校验功能】 处理错误提示
         *
         * @param {type}
         *            dom [data-check-need]元素，即需要校验的form表单中的dom元素
         * @returns {undefined}
         */
        _dealFormCheckErrTip: function(dom, errTip) {
            if (typeof errTip === 'undefined') {
                var errTip = {
                    err: ''
                };
            }
            var rt = true;
            /* 此属性是必须的 */
            if ($(dom).attr("data-check-need") === 'y') {
                /**
                 * 校验数据的规则，有值： 'val': 只校验值是否为空,默认值; 'phone': 校验手机号码格式是否正确; 'email':
                 * 校验邮箱格式是否正确; 'len': 校验长度，需要定义 "data-check-len"属性，上限下限由":"分号隔开;
                 * 'custom': 由自定义的函数完成校验，自定义的方法必须是扩展 window.beastTable 这个类的方法;
                 * 'accord': 与什么保持一致，一般用于 确认密码 的校验, 需要定义 "data-check-accord"
                 * 属性，例如:data-check-accord="#check_psw_1",即与id="check_psw_1"的元素的值保持一致;
                 */
                var rule = 'val';
                if (typeof $(dom).attr("data-check-rule") != 'undefined') {
                    rule = $(dom).attr("data-check-rule");
                }
                if (rule === 'val') {
                    if ($.trim($(dom).val()) == '') {
                        rt = false;
                    }
                } else if (rule == 'phone') {
                    rt = window.beastTools.validateMobile($.trim($(dom).val()));
                } else if (rule == 'email') {
                    rt = window.beastTools.validateEmail($.trim($(dom).val()));
                } else if (rule == 'len') {
                    //console.log($(dom).attr('data-check-len'));
                    if ($(this).attr('data-check-len')) {
                        var lenArr = $(dom).attr('data-check-len').split(':');
                        //console
                        //    .log((lenArr[0] <= $.trim($(dom).val()).length && lenArr[1] >= $
                        //        .trim($(dom).val()).length));
                        rt = (lenArr[0] <= $.trim($(dom).val()).length && lenArr[1] >= $
                            .trim($(dom).val()).length);
                    }
                } else if (rule == 'custom') {
                    rt = window.beastTable[$(dom).attr('data-check-custom')](dom,
                        errTip);
                } else if (rule == 'accord') {
                    /* 与什么保持一致，一般用于 确认密码 的校验 */
                    rt = $.trim($($(dom).attr('data-check-accord')).val()) == $
                        .trim($(dom).val());
                }
                // alert('check:'+rt);

                if (!rt) {
                    /* 显示错误提示 */
                    var tip = '请完善必要信息';
                    if (typeof $(dom).attr('data-check-tip') !== 'undefined') {
                        tip = $(dom).attr('data-check-tip');
                    }
                    if (typeof errTip !== 'undefined') {
                        errTip.err = tip;
                    }
                    $(dom)
                        .closest('[data-check-parent]')
                        .removeClass('has-success')
                        .addClass('has-error')
                        .find('[data-check-tip-ele]')
                        .html('&nbsp;&nbsp;<i class="fa fa-times-circle-o"></i>&nbsp;' +
                            tip);
                } else {
                    /* 撤销错误提示 */
                    $(dom).closest('[data-check-parent]').removeClass('has-error')
                        .addClass('has-success').find('[data-check-tip-ele]')
                        .html('');
                }

            }
            return rt;
        },
        /**
         * 自动封装表单的字段追加到 params 参数中
         *
         * @param {type}
         *            dom 所指定表单里面的某个元素，例如表单里面的按钮
         * @param {type}
         *            params 已有的对象
         * @returns {Window.beastTable._dealFormAttrForForm.params|Boolean|jQuery}
         */
        _dealFormAttrForForm: function(dom, params) {
            $(dom).closest("[data-item-detail]").find('[data-item-attr]').each(
                function(event) {
                    params[$(this).attr('data-item-attr')] = $(this).val();
                });
            return params;
        },
        formVerify: {
            verifyPhone: function(mobile, reg) {
                if (11 != $.trim(mobile).length) {
                    return false;
                }
                var default_reg = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|17\d{9}$/;
                if (reg != '' && reg != undefined && reg != null) { // 验证手机号码格式是否正确
                    default_reg = reg;
                }
                if ($.trim(mobile) === '' || !default_reg.test($.trim(mobile))) {
                    return false;
                } else {
                    return true;
                }
            },
            verifyNotNull: function(str) { // 验证字符是否为空
                if ($.trim(str) === '' || null === str) {
                    return false;
                } else {
                    return true;
                }
            },
            verifyPrice: function(price) { // 验证价格是否合法保留1位小数
                var reg = /^\d+(\.\d{1})?$/;
                if (!reg.test($.trim(price))) {
                    return false;
                } else {
                    return true;
                }
            },
            verifyNum: function(number) { // 验证字符串是否是数字
                var reg = /^[0-9]*$/;
                if (!reg.test($.trim(number))) {
                    return false;
                } else {
                    return true;
                }
            },
            verifyLen: function(str, startLen, endLen) {
                if (typeof startLen == 'undefined' || isNaN(parseInt(startLen))) {
                    startLen = 1;
                }
                if (typeof endLen == 'undefined' || isNaN(parseInt(endLen))) {
                    endLen = 256;
                }
                return (startLen <= $.trim(str).length && endLen >= $.trim(str).length);
            },
            formatTime: function(time) {
                // return new Date(time * 1000).toLocaleString();
                if (time > 0) {
                    return window.beastTools.myFormatTime('yyyy/M/d h:m', time);
                } else {
                    return '暂无';
                }
            },
            formatDate: function(time) {
                return new Date(time * 1000).toLocaleDateString();
            },
            verifyIdCard: function(card) {
                /* 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X*/
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(card) === false) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        formatTime: function(time) {
            // return new Date(time * 1000).toLocaleString();
            if (time > 0) {
                return window.beastTools.myFormatTime('yyyy-MM-dd hh:mm', time);
            } else {
                return '暂无';
            }
        },
        orderStatus: {
            s_0: '未支付',
            s_1: '已支付',
            s_2: '已取消',
            s_3: '待退款',
            s_4: '已结单',
            s_5: '配送中',
            s_6: '已退款',
            s_7: '已结单'
        },
        /**
         * 订单状态
         * @param status
         */
        formatOrderStatus: function(status) {
            // 0未支付,1已支付,2已取消,3待退款,4异常结单,5已派工,6已退款
            return $.trim(window.beastBase.orderStatus['s_' + status]);
        },
        getFirstHostName: function() {
            var hostName = window.location.host,
                arr = hostName.split('.');
            if (arr.length < 3) {
                return false;
            }
            return arr[0];
        }
    };

    window.beastBase.init();

    // $('body').prepend
});

window.beastConfig = {};
window.otherErr = {};

window.serviceKey = {};

function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function verifySpescialChar(str) {
    var pattern = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
    if (pattern.test(str)) {
        return false;
    }
    return true;
}

function getSystemType() {
    // 判断 机型
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
        return 'ios';
    } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
        return 'Android';
    } else {
        //pc
        return "";
    }

    // var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // var type = isAndroid ? 'android' : (isiOS ? 'ios' : '');
    // return type;
}

window.phoneType = getSystemType();


// IOS: window.webkit.messageHandlers. getUserToken.postMessage(null);
// Android：window. Jump. getUserToken ()
// 获取用户Token
function getAppUserToken() {
    // window.alert('getAppUserToken')
    if (window.phoneType == 'Android' && window.jump && window.jump.getUserToken) {
        window.jump.getUserToken();
    } else if (window.phoneType == 'Android' && window.android && window.android.getUserToken) {
        window.android.getUserToken();
    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.getUserToken &&
        window.webkit.messageHandlers.getUserToken.postMessage) {
        window.webkit.messageHandlers.getUserToken.postMessage(null);
    }
}
getAppUserToken();

window.getUserToken = function(token) {
    // window.alert('window.getUserToken:' + token)
    window.tokenVal = token;
}
// 关闭页面
function appClosePage() {

    if (window.phoneType == 'Android' && window.android && window.android.closePage) {
        window.android.closePage();
    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.closePage &&
        window.webkit.messageHandlers.closePage.postMessage) {
        window.webkit.messageHandlers.closePage.postMessage(null);
    }
}

// 回首页
function appBackHome() {
    if (window.phoneType == 'Android' && window.android && window.android.backHome) {
        window.android.backHome();
    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.backHome &&
        window.webkit.messageHandlers.backHome.postMessage) {
        window.webkit.messageHandlers.backHome.postMessage(null);
    }
}

// 
// 分享
/**
 * 分享
 * @param shareType  '分享的类型', 
 * @param title '分享的标题',
 * @param link ’链接’
 * */
function appShare(shareType, title, link) {
    if (window.phoneType == 'Android' && window.android && window.android.share) {
        window.android.share(shareType, title, link);
    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.share &&
        window.webkit.messageHandlers.share.postMessage) {
        window.webkit.messageHandlers.share.postMessage([shareType, title, link]);
    }
}

// 洽谈
// @param 发布人名字、发布人头像URL、发布人uid
function appQiaTan(name, picUrl, uid) {
    if (window.phoneType == 'Android' && window.android && window.android.negotiate) {
        window.android.negotiate(name, picUrl, uid);
    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.negotiate &&
        window.webkit.messageHandlers.negotiate.postMessage) {
        window.webkit.messageHandlers.negotiate.postMessage([name, picUrl, uid]);
    }
}

// 图片预览
// @param '当前点击的图片链接', '所有支持预览的图片地址( 数组 )'
function appViewPic(curPic, picArr) {

    if (window.phoneType == 'Android' && window.android && window.android.picturePreview) {
        window.android.picturePreview(curPic, picArr);

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.picturePreview &&
        window.webkit.messageHandlers.picturePreview.postMessage) {
        window.webkit.messageHandlers.picturePreview.postMessage([
            curPic, picArr
        ]);
    }
}

// 下载
// @param 文件地址, 文件名称
function appDownload(filePath, fileName) {

    if (window.phoneType == 'Android' && window.android && window.android.fileDownload) {
        window.android.fileDownload(filePath, fileName);

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.fileDownload &&
        window.webkit.messageHandlers.fileDownload.postMessage) {
        window.webkit.messageHandlers.fileDownload.postMessage([filePath, fileName]);
    }
}

// 回登录界面  token过期时调用（暂时无用）
function appToLogin() {

    if (window.phoneType == 'Android' && window.android && window.android.login) {
        window.android.login()

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.login &&
        window.webkit.messageHandlers.login.postMessage) {
        window.webkit.messageHandlers.login.postMessage(null);
    }
}

// 查看组织成员列表 
// @param 成员uid , 组织类型(传字符串   1 商会 2 协会 3 其他 4 工商联 5 商务局 6 自贸区 7 企业)
function appZZCY(uid, memberType) {

    if (window.phoneType == 'Android' && window.android && window.android.orgMember) {
        // window.android.orgMember('8a04f08b0c3111ea995200163e05ff66', '1');
        window.android.orgMember(uid, memberType);

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.orgMember &&
        window.webkit.messageHandlers.orgMember.postMessage) {
        window.webkit.messageHandlers.orgMember.postMessage([uid, memberType]);
    }
}

// 举报
// @param id, 类型
function appReport(uid, reportType) {

    if (window.phoneType == 'Android' && window.android && window.android.report) {
        // window.android.report('006023d5045111ea945200163e05ff66', '4');
        window.android.report(uid, reportType);

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.report &&
        window.webkit.messageHandlers.report.postMessage) {
        window.webkit.messageHandlers.report.postMessage([uid, reportType]);
    }
}

// 上传
function appUpload() {

    if (window.phoneType == 'Android' && window.android && window.android.fileUpload) {
        window.android.fileUpload();

    } else if (window.phoneType == 'ios' && window.webkit &&
        window.webkit.messageHandlers && window.webkit.messageHandlers.fileUpload &&
        window.webkit.messageHandlers.fileUpload.postMessage) {
        window.webkit.messageHandlers.fileUpload.postMessage(null);
    }
}
/**
 * app 上传图片成功之后的回调
 * @param url 图片链接
 * @param name 图片名称
 */
window.uploadFileSuess = function(url, name) {

}
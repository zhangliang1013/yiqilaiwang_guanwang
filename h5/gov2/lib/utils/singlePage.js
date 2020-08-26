/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.beastConfig.tplDir = '../lib/mobile/pageTemplate/';
$(function () {

    window.SinglePage = {
        maxZIndex: 1000,
        pageArr: [],
        listOpen: '',
        initFunc: function (option) {
            var maskHtml = '<div class="my-mask"></div>';
            if ($('.my-mask').length == 0) {
                $('body').prepend(maskHtml);
            }
            var reqPage = 'undefined' != typeof window.beastTools.getRequest ?$.trim(window.beastTools.getRequest('page')):'curPage';
            var inPage = 'undefined' != typeof window.beastTools.getRequest ? $.trim(window.beastTools.getRequest('inPage')):'';
            var curPage = 'curPage';
            var defaultTile = option&&option.title?option.title:'';
            /*设置模板的文件路径*/
            if (typeof option !== 'undefined' && null !== option) {
                if (option.tplDir) {
                    window.beastConfig.tplDir = option.tplDir;
                }
                if ('' !== $.trim(option.curPage)) {
                    curPage = option.curPage;
                    this.listOpen = 'open';
                }
            }
            this.pageArr.push({page: curPage,title:defaultTile});

            var pageM = 'undefined' != typeof  window.beastTools.getRequest?window.beastTools.getRequest('', ['page','inPage'],true):'';
            History.replaceState({page: curPage}, defaultTile, "?page=" + curPage + '&' + pageM);
            this.bindCommonEvent();
            if(reqPage !== '' && 'curPage' !== reqPage && '' === inPage) {
                var state = {page: reqPage, partial: reqPage + '.html', title: defaultTile};
                window.SinglePage.pageArr.push(state);
                History.pushState(state, $.trim(state.title) == '' ? '' : state.title,
                    "?page=" + state.page + "&" + pageM);
            }
        },
        bindCommonEvent: function () {
            if (!this.hadBindEvent || typeof this.hadBindEvent === 'undefined') {
                this.bindEvent();
                this.hadBindEvent = true;
            }
        },
        bindEvent: function () {
            var $this = this;

            History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
                var state = History.getState(); // Note: We are using History.getState() instead of event.state
                //console.log('【statechange 事件】 state:', state);
                //alert('【statechange 事件】 state.title:', state.title);
                document.title = state.title;
                $('.' + state.page + '_title').html(state.title);
                $this.changeUrl(state.data);
            });
        },
        /**
         * 改变当前页面的url之后的回调，类似单页面应用的形式
         * @param {type} params 此参数会传递到对应的 页面模板类（subHtml 中定义的页面模板类） 的 initFunc 方法中
         * @param {type} isNeedHtml 是否需要将模板 html 提取出来，一般是在点击添加时我们需要从页面中获取到详情 item 的默认字段时候才需要进行此操作，默认不提取
         * @param {type} showTplEleId 显示页面的 dom 元素 id，例如：'#showTpl'
         * @param {type} dom 被点击的dom节点
         * @returns {undefined}
         */
        changeUrl: function (params) {
            //alert('in changeUrl');
            var $this = this;
            $this.maxZIndex = 1000;
            $('.my-inner-page.open').each(function () {
                $this.maxZIndex = $this.maxZIndex < parseInt($(this).css('z-index')) ?
                    parseInt($(this).css('z-index')) : $this.maxZIndex;
            });
            /*获取最后的页面*/
            var lastPage = $this.pageArr[this.pageArr.length - 1];
            //alert('in changeUrl 1');
            //console.log('lastPage:' + lastPage.page + ',curpage:' + params.page);
            /*如果最后的页面不是当前url中的页面，即说明是后退操作*/
            if ($.trim(params.page) !== $.trim(lastPage.page)) {
                //alert('in changeUrl 2');

                // 关闭页面
                $("#TMP_" + $.trim(lastPage.page)).removeClass('open');
                setTimeout(function () {
                    $("#TMP_" + $.trim(lastPage.page)).css('z-index', 1000);
                }, 200);
                $this.pageArr.pop();
                if ($('.my-inner-page.open').length == 0) {
                    $('body').css('position', 'initial');
                    $('.my-mask').hide();
                }
                return;
            }
            //alert('in changeUrl 3');
            $('body').css({'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'bottom': '0'});

            var page = $.trim(params.page) === '' ? 'errorPage' : $.trim(params.page);
            var partial = $.trim(params.partial) === '' ? page + '.html' : $.trim(params.partial);

            /*若已经获取过此页面，则直接初始化此页面*/
            if ($("#TMP_" + page).length > 0) {
                //alert('in changeUrl 4');
                $('.my-mask').show();
                $("#TMP_" + page).addClass('open').css('z-index', $this.maxZIndex + 1);
                //console.log(typeof window[page]);
                if (typeof window[page] !== 'undefined' && null !== window[page] && typeof window[page].initFunc !== 'undefined') {
                    window[page].initFunc(params);
                }
            } else {
                //alert('in changeUrl 5');
                /*获取此页面*/
                window.beastBase.ajaxGo(window.beastConfig.tplDir + partial, '', 'GET', function (rsp) {

                    //alert('in changeUrl 6');

                    $this._dealHtmlCache(rsp, params);
                }, function (rsp) {
                    //alert('in changeUrl 7');

                    /*如果获取页面模板失败，展示错误页面*/
                    if ($("#TMP_errorPage").length > 0) {
                        $('.my-mask').show();
                        $("#TMP_errorPage").addClass('open').css('z-index', $this.maxZIndex + 1);
                        window.errorPage.initFunc({page: 'errorPage'});
                    } else {
                        window.beastBase.ajaxGo(window.beastConfig.tplDir + 'errorPage.html', '', 'GET', function (rsp) {
                            $this._dealHtmlCache(rsp, {page: 'errorPage'});
                        }, function () {
                            window.beastBase.alertMsg('网络异常', '', 'error');
                            return false;
                        }, true, true);
                    }
                }, true, true);
            }
        },
        /**
         * 【页面缓存】处理页面模板缓存
         * @param {type} rsp ajax请求换取到的页面模板代码，一般为静态页面
         * @param {type} params 此参数会传递到对应的 页面模板类（subHtml 中定义的页面模板类） 的 initFunc 方法中
         * @returns {undefined} 无
         */
        _dealHtmlCache: function (rsp, params) {
            //alert('in _dealHtmlCache');
            //alert(typeof params);
            //alert(params.page);
            var $this = this;
            //alert('in _dealHtmlCache 1');
            if ($('#TMP_' + params.page).length === 0) {

                //alert('in _dealHtmlCache 2');

                $("body").append(
                    '<div id="TMP_' + params.page + '" class="my-inner-page ' + this.listOpen + '">' + rsp + '</div>');

                //alert('in _dealHtmlCache 22');
            }
            //alert('in _dealHtmlCache 3');
            /*如果需要提取模板的 html，而且该模板类设置了模板代码元素的属性（例如：subHtml 类中为此子类设置了 tplEle 属性）*/
            if (typeof params.isNeedHtml !== 'undefined' && $('#' + params.page + 'Tpl').length > 0) {

                //alert('in _dealHtmlCache 4');

                $('#TMP_' + params.page).append('<div data-sim-tpl style="display:none;">' + $('#' + params.page + 'Tpl').html() + '</div>');
            }
            //alert('in _dealHtmlCache 5');

            setTimeout(function () {
                //alert('in _dealHtmlCache 6');
                $('.my-mask').show();
                $("#TMP_" + params.page).addClass('open').css('z-index', $this.maxZIndex + 1);

                // 在页面内添加【创意广告】
                window.beastBase.dealAdvByPageName(params.page, $this.maxZIndex + 1, "#TMP_" + params.page);
            }, 100);

            //console.log(window[params.page]);
            //alert(params.page);
            //alert(typeof window[params.page]);
            //alert(window[params.page]);
            if (typeof window[params.page] !== 'undefined' && null !== window[params.page]) {
                window[params.page].initFunc(params);
            }
        }
    };
    window.errorPage = {
        partial: "errorPage.html",
        /**
         * 页面初始化方法
         * @param {type} params 获取页面之前传入的参数
         * @param {type} showTplEleId 回显模板页面信息的元素 id，如："#listShow"
         * @returns {undefined}
         */
        initFunc: function (params, showTplEleId) {
            $(showTplEleId).html($('#TMP_errorPage').html());
        }
    };

});
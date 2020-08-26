
window.scrollPageInfo = (function (func) {
    var pubs = {};

    pubs.setPageNum = function (pageInfo, func, scrollEle, listEle) {
        if ('undefined' === typeof scrollEle || null === scrollEle || $(scrollEle).length == 0) {
            console.log('【scrollPageInfo】 缺少操作元素参数！');
            return false;
        }
        if ('string' === typeof scrollEle) {
            pubs.scrollEle = scrollEle;/*需要操作的列表元素，例如：'#listShow'*/
            if ($(scrollEle).length > 0) {
                pubs.nDivHight = $(scrollEle)[0].clientHeight;
            }
            if ($.trim(listEle) == '') {
                listEle = scrollEle;
            }
            $('#' + $.trim(listEle).substr(1) + '_listLoading').remove();
        } else {
            pubs.scrollEle = window;
            pubs.nDivHight = pubs.getWindowHeight();
            if ($.trim(listEle) !== '') {
                $('#' + $.trim(listEle).substr(1) + '_listLoading').remove();
            }
        }
        pubs.listEle = $.trim(listEle);
        pubs.func = func; /*加载列表数据的回调函数*/
        pubs.totalPn = parseInt(pageInfo.dataSize % pageInfo.psize) === 0 ? parseInt(pageInfo.dataSize / pageInfo.psize) : parseInt(pageInfo.dataSize / pageInfo.psize) + 1;
        pubs.dataSize = pageInfo.dataSize;
        pubs.curNum = pageInfo.curNum;
        pubs.index = parseInt(pageInfo.num) > 0 ? parseInt(pageInfo.num) : 1;
        pubs.isLoading = false;
        pubs.bindEvent();
    };
    pubs.bindEvent = function () {

        $(pubs.scrollEle).scroll(function () {
//            console.log('【curNum】:', pubs.index);
            if (pubs.isLoading == true || pubs.index >= pubs.totalPn) {
                return false;
            }
            if (typeof pubs.scrollEle === 'string') {
                pubs.nScrollHight = $(this)[0].scrollHeight;
                pubs.nScrollTop = $(this)[0].scrollTop;
            } else {
                pubs.nScrollHight = pubs.getScrollHeight();
                pubs.nScrollTop = pubs.getScrollTop();
            }

//            console.log('【nScrollHight】:', pubs.nScrollHight);
//            console.log('【nScrollTop】:', pubs.nScrollTop);
//            console.log('【nDivHight】:', pubs.nDivHight);

            if (pubs.nScrollTop + pubs.nDivHight >= pubs.nScrollHight) {
                if (pubs.listEle.length > 0) {
                    if ($('#' + pubs.listEle.substr(1) + '_listLoading').length == 0) {
                        $(pubs.listEle).append('<div id="' + pubs.listEle.substr(1) + '_listLoading" style="background-color:#f9f9f9;padding:20px 0;line-height:30px; text-align:center;">正在加载...</div>');
                    } else {
                        $('#' + pubs.listEle.substr(1) + '_listLoading').html('正在加载...');
                    }
                }
                pubs.isLoading = true;
                pubs.index++;
                pubs.func({pn: pubs.index, needLoadingPlay: true});
            }
        });

    };
    /*滚动条在Y轴上的滚动距离*/
    pubs.getScrollTop = function () {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    };
    /*文档的总高度*/
    pubs.getScrollHeight = function () {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    };
    /*浏览器视口的高度*/
    pubs.getWindowHeight = function () {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    };
    return pubs;

})();



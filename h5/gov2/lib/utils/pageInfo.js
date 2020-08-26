/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.pageInfo = (function () {
    var pubs = {};
    pubs.numArr = [];
    pubs.showDom = '.pagination-contain';
    pubs.hadBindE = false;
    pubs.setPageNum = function (pageInfo, func, showDom) {
        if(typeof showDom != 'undefined') {
            pubs.showDom = showDom;
        }
        pubs.func = func;
        pubs.total_pn = parseInt(pageInfo.dataSize % pageInfo.psize) == 0 ? parseInt(pageInfo.dataSize / pageInfo.psize) : parseInt(pageInfo.dataSize / pageInfo.psize) + 1;
        pubs.groupCount = 10;
        pubs.dataSize = pageInfo.dataSize ? pageInfo.dataSize : '0' ;
        pubs.curNum = pageInfo.curNum;pubs.index = parseInt(pageInfo.num) > 0 ? parseInt(pageInfo.num) : 1;
        pubs.executeNum();
        pubs.bindEvent();
    };
    pubs.executeNum = function (recentNo) {
        if (typeof recentNo !== 'undefined' && !isNaN(parseInt(recentNo))) pubs.index = recentNo;
        $($(pubs.showDom).find('.pagination')[0]).empty();
        pubs.numArr.splice(0, pubs.numArr.length);
        /*如果总页数大于10页*/
        if (pubs.total_pn > 10) {

            /*如果当前页数小于7，显示1,2,3,4,5,6,7...-1,totalPages*/
            if (pubs.index < 7) {
                for (var i = 1; i < 8; i++) {
                    pubs.numArr.push(i);
                }
                pubs.numArr.push("...", parseInt(pubs.total_pn) - 1, pubs.total_pn);
            }
            /*如果当前页大于totalPages-5,显示1,2...totalPages-6,-5,-4,-3,-2,-1,totalPages*/
            else if (pubs.index > (pubs.total_pn - 5)) {
                pubs.numArr.push(1, 2, '...');
                for (var i = parseInt(pubs.total_pn) - 6; i < parseInt(pubs.total_pn) + 1; i++) {
                    pubs.numArr.push(i);
                }

            } else {
                /*其他的，显示1,2...-2,-1,pageNo,+1,+2...-1,totalPages*/
                pubs.numArr.push(1, 2, '...');
                for (var i = parseInt(pubs.index) - 2; i < parseInt(pubs.index) + 3; i++) {
                    pubs.numArr.push(i);
                }
                pubs.numArr.push("...", parseInt(pubs.total_pn) - 1, parseInt(pubs.total_pn));
            }
        } else {
            for (var i = 1; i < parseInt(pubs.total_pn) + 1; i++) {
                pubs.numArr.push(i);
            }
        }
        var numHtml = '';
        if (parseInt(pubs.index) > 1) {
            numHtml += '<li><a class="arrow" href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">上一页</span></a></li>';
        } else {
            numHtml += '<li class="disabled"><a class="arrow" href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">上一页</span></a></li>';
        }
        for (var i = 0; i < pubs.numArr.length; i++) {
            if (pubs.numArr[i] == '...') {
                numHtml += '<li class="disabled"><a href="javascript:void(0);" aria-label="nextMore">'
                        + pubs.numArr[i] + '</a></li>';
            } else {
                if (pubs.index == pubs.numArr[i]) {
                    numHtml += '<li class="active"><a href="javascript:void(0);" class="pagenum" aria-label="pagenum" aria-val="' + pubs.numArr[i] + '">'
                            + pubs.numArr[i] + '</a></li>';
                } else {
                    numHtml += '<li><a href="javascript:void(0);" class="pagenum" aria-label="pagenum" aria-val="' + pubs.numArr[i] + '">'
                            + pubs.numArr[i] + '</a></li>';
                }
            }
        }
        if (parseInt(pubs.index) < parseInt(pubs.total_pn)) {
            numHtml += '<li><a class="arrow" href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">下一页</span></a></li>';
        } else {
            numHtml += '<li class="disabled"><a class="arrow" href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">下一页</span></a></li>';
        }
        $($(pubs.showDom).find('.pagination')[0]).html(numHtml);
        $($(pubs.showDom).find(".pagination-detail")[0]).html('本页显示 ' + pubs.curNum + ' 条记录，总共 ' + pubs.dataSize + ' 条记录');

    };
    pubs.bindEvent = function() {
        if(false == pubs.hadBindE) {
            pubs.hadBindE = true;
        }
        $('.pagenum').unbind('click');
        $('.arrow').unbind('click');
        $('.pagenum').click(function () {
            if ($(this).closest('li').hasClass('disabled') || $(this).closest('li').hasClass('active')) {
                return;
            }
            var pn = $(this).attr('aria-val');
            pubs.executeNum(pn);
            if (pubs.func != undefined)
                pubs.func(pn);
        });
        $('.arrow').click(function () {
            if ($(this).closest('li').hasClass('disabled') || $(this).closest('li').hasClass('active')) {
                return;
            }
            var type = $(this).attr('aria-label');
            switch (type) {
                case 'Previous':
                    pubs.index--;
                    break;
                case 'Next':
                    pubs.index++;
                    break;
            }
            pubs.executeNum(pubs.index);
            if (pubs.func != undefined)
                pubs.func(pubs.index);
        });
    };
    return pubs;
})();


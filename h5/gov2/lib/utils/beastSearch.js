/* 
 * 搜索
 */
const initSearchFunc = function () {
    if (typeof window.hadBindSearchEvent !== 'undefined' && window.hadBindSearchEvent == true) {
        return false;
    }
    window.hadBindSearchEvent = true;
    _bindEvent();
};

const _bindEvent = function () {

    /*点击马上会触发搜索的属性，例如：点击订单状态按钮，会马上触发搜索功能*/
    $('body').on('click', "[data-s-btn-for]", function () {
        var $tmpParent = $(this).closest('[data-s-parent]').eq(0);
        /*赋值到指定元素*/
        $tmpParent.find('[data-s-attr="' + $(this).attr('data-s-btn-for') + '"]').val($(this).attr('data-s-val'));
        $tmpParent.find('[data-s-btn]').eq(0).trigger('click');
    });

    /*点击 列表头部的排序元素，例如：点击列表头部的“添加时间”，先是升序，再点击就是降序，再点击就移除排序；会马上触发搜索*/
    $("[data-s-orderby]").unbind('click');
    $('body').on('click', "[data-s-orderby]", function () {

        if ($(this).attr('data-s-orderby') === null || $.trim($(this).attr('data-s-orderby')) === '') {
            $(this).addClass('active').attr('data-s-val', '').siblings('[data-s-orderby]').removeClass('active s-up s-down').attr('data-s-val', '')
                .find('.s-icon.s-init').addClass('active').siblings('.s-icon').removeClass('active');

//                    $(this).addClass('s-up').attr('data-s-val', 'asc');
//                    $(this).find('.s-icon.s-up').addClass('active').siblings('.s-icon').removeClass('active');
        } else {
            /*改变当前排序icon及字段值*/
            if ($(this).hasClass('s-up')) {/*当前是升序状态，则改为降序*/
                $(this).addClass('active');
                $(this).removeClass('s-up').addClass('s-down').attr('data-s-val', 'desc');
                $(this).find('.s-icon.s-down').addClass('active').siblings('.s-icon').removeClass('active');
            } else if ($(this).hasClass('s-down')) { /*当前是降序状态，则改为无排序*/
                $(this).removeClass('s-down').attr('data-s-val', '');
                $(this).find('.s-icon').removeClass('active');
                $(this).find('.s-icon.s-init').addClass('active');
                $(this).removeClass('active');
            } else { /*当前为无排序状态，则改为升序,取消其他排序条件*/
                $(this).closest('[data-s-parent]').eq(0).find('[data-s-orderby]')
                    .removeClass('active s-up s-down').attr('data-s-val', '')
                    .find('.s-icon.s-init').addClass('active').siblings('.s-icon').removeClass('active');
                $(this).addClass('active');
                $(this).addClass('s-up').attr('data-s-val', 'asc');
                $(this).find('.s-icon.s-up').addClass('active').siblings('.s-icon').removeClass('active');
            }
        }
        var $tmpParent = $(this).closest('[data-s-parent]').eq(0);
        /*触发搜索*/
        $tmpParent.find('[data-s-btn]').eq(0).trigger('click');
    });

    $('body').on('keyup', 'input[data-s-attr]', function (event) {
        if (event.keyCode == "13") {
            var $tmpParent = $(this).closest('[data-s-parent]').eq(0);
            $tmpParent.find('[data-s-btn]').eq(0).trigger('click');
        }
    });

    /*【重置搜索条件--点击事件】*/
    $('body').on('click', '[data-reset-btn]', function () {
        clearSearch(this);
    });


};

/**
 * 获取所有搜索的条件
 * @param $sBtn 点击的按钮
 * @param isReStr 是否已字符串的形式返回
 * @returns {{}}
 */
const getSearchObj = function ($sBtn, isReStr) {
    var sData = {};
    var $tmpParent = $($sBtn).closest('[data-s-parent]').eq(0);

    /*遍历搜索字段*/
    $tmpParent.find("[data-s-attr]").each(function () {
        /* data-s-attr="start_time;end_time" data-s-type="sep" data-s-val-sep="~"  data-is-timestamp="1" */
        if ('sep' == $(this).attr('data-s-type') && '' != $.trim($(this).attr('data-s-val-sep'))) {
            var attrArr = $.trim($(this).attr("data-s-attr")).split(';');
            var valArr = $.trim($(this).val()).split($.trim($(this).attr('data-s-val-sep')));
            var isTimestamp = $.trim($(this).attr("data-is-timestamp"));

            attrArr.forEach(function (item, i) {
                if ($.trim(valArr[i]).length > 0) {
                    if(isTimestamp == 1){
                        sData[item] = Date.parse($.trim(valArr[i]))/1000;
                    }else{
                        sData[item] = $.trim(valArr[i]);
                    }
                }
            });

        } else if ('val' == $(this).attr('data-s-type')) {
            /*去value值，例如 input 、select等的取值*/
            if ($(this).val().length > 0) {
                sData[$(this).attr("data-s-attr")] = $(this).val();
            }
        } else {
            if ($.trim($(this).attr("data-s-val")).length > 0) {
                sData[$(this).attr("data-s-attr")] = $(this).attr("data-s-val");
            }
        }
    });
    /*遍历排序的字段*/
    var orderBy = [];
    var orderVal = [];
    $tmpParent.find("[data-s-orderby]").each(function () {
        if ($(this).attr('data-s-val').length > 0) {
//                    console.log($(this).attr('data-s-orderby'));
//                    console.log($(this).attr('data-s-val'));
            orderBy.push($(this).attr('data-s-orderby'));
            orderVal.push($(this).attr('data-s-val'));
        }
    });
    if (orderBy.length > 0) {
        sData.orderBy = orderBy;
    }
    if (orderVal.length > 0) {
        sData.orderVal = orderVal;
    }
    if(isReStr) {
      return dealObj2Str(sData);
    }
    return sData;
};

const clearSearch = ($sBtn, exceptArr) => {
    var $tmpParent = $($sBtn).closest('[data-s-parent]');

    /* 遍历搜索字段 */
    $tmpParent.find("[data-s-attr]").each(function () {

        if ('undefined' === typeof exceptArr ||
            exceptArr.indexOf($.trim($(this).attr('data-s-attr'))) === -1) {
            /* data-s-attr="start_time;end_time" data-s-type="sep" data-s-val-sep="~" */
            if ('sep' == $(this).attr('data-s-type') && '' != $.trim($(this).attr('data-s-val-sep'))) {
                $(this).val('');
            } else if ('val' == $(this).attr('data-s-type')) {
                $(this).val('');
            } else {
                $(this).attr("data-s-val", '');
            }
        }
    });
    /* 将按钮的样式初始化为未选中状态 */
    $tmpParent.find('[data-s-btn-for]').removeClass('active');
    /* 遍历排序的字段 */
    $tmpParent.find("[data-s-orderby]").each(function () {
        $(this).removeClass('active s-down s-up').attr('data-s-val', '');
        $(this).find('.s-icon').removeClass('active');
        $(this).find('.s-icon.s-init').addClass('active');
    });
};

const dealObj2Str = (sObj) => {
    var tmpStr = '';
    if (sObj) {
        for (var i in sObj) {
            if($.isArray(sObj[i])) {
                tmpStr += i + '[]='+sObj[i]+'&';
            } else {
                tmpStr += i + '='+sObj[i]+'&';
            }
        }
    }
    return tmpStr;
};

export {
    initSearchFunc,
    getSearchObj,
    clearSearch,
    dealObj2Str
};

/*
 if(typeof exports === 'object' && typeof module !== 'undefined') {
 module.exports = _utils;
 } else {

 if (typeof window !== 'undefined') {
 // set as global.
 window.beastSearch  = _utils;
 } else {
 console.error('beastSearch: window 居然是 undefined！');
 }
 }
 */
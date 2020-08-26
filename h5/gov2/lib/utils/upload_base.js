!function ($) {

    /**
     * 输出提示信息
     * @param {type} txtClr
     * @param {type} bdClr
     * @param {type} bgClr
     * @param {type} msg
     */
    function displayTip(txtClr, bdClr, bgClr, msg) {
        window.alert(msg);
    }

    /*删除图片*/
    $(".data-pic-contain .data-act-icon").unbind('click');
    $('body').delegate('.data-pic-contain .data-act-icon', 'click', function () {
        var hiddenEle = $($(this).closest('.pic_div').find('input[type="hidden"]')[0]);
        var inputEle = $($(this).closest('.pic_div').find('.needInput')[0]);
//        console.log('shanchu');
//        console.log(hiddenEle.val());
//        console.log(inputEle.val());
//            console.log($(this));
        if (hiddenEle) {
            var tmpPics = [];
            var inputs = [];
            var t = $(this).closest('.data-pic-contain');
            var $this = $(this);
            var ele = $this.closest('.pictype');
            t.fadeOut(100);
            setTimeout(function () {
                t.remove();
                    console.log(ele);
                ele.find("img").each(function () {
                        console.log('img', $(this).attr('src'));
                    tmpPics.push($(this).attr('src'));
                });
                ele.find('.data-need-input').each(function () {
                    inputs.push($(this).val());
                });
                console.log('tmpPics',tmpPics);
                hiddenEle.val(tmpPics.join(';'));
                if (inputEle.length > 0) {
                    inputEle.val(inputs.join(';'));
                }
                
                if ('' !== $.trim(hiddenEle.attr('data-max-num')) && $.trim(hiddenEle.attr('data-max-num')) > 0 &&
                        tmpPics.length < parseInt($.trim(hiddenEle.attr('data-max-num')))) {
                    hiddenEle.closest('.pic_div').find('.my-upload-btn').removeClass('disabled');
                    hiddenEle.closest('.pic_div').find('.input_file').removeClass('disabled');
                }
//                    console.log(hiddenEle.val());
            }, 300);
        }

    });

    /*输入信息框中的信息有变化时候*/
    $(".data-pic-contain").find('.data-need-input').unbind('focusout');
    $('body').delegate('.data-pic-contain .data-need-input', 'focusout', function () {
        var inputEle = $($(this).closest('.pic_div').find('.needInput')[0]);
//        console.log('shuru');
//            console.log($(this));
        if (inputEle.length > 0) {
            var inputs = [];
            var ele = $(this).closest('.pictype');
            ele.find('.data-need-input').each(function () {
                inputs.push($(this).val());
            });
            if (inputEle.length > 0) {
                inputEle.val(inputs.join(';'));
            }
        }
//        console.log(inputEle.val());

    });

    /*上传图片*/
    $.fn.upload_img = function (options, childEle) {
        var opt = $.extend({}, $.fn.upload_img.defaults, options);
        var $this;

        if (typeof childEle != 'undefined' && this.find(childEle)) {
            $this = this.find(childEle);
        } else {
            $this = this;
        }

        return $this.each(function () {
            var eachThis = this;
            console.log('each');
            var showImgEle = $(this).find(opt.showImgEle);
            var hiddenEle = $($(this).find(opt.hiddenEle)[0]);
            var needInputEle = $($(this).find('.needInput')[0]);
            var fileEle = $(this).find(opt.fileEle);
            var showTipEle = $(this).find(opt.showTipEle);
            var picInd = 0;

            if (hiddenEle && hiddenEle.val()) {
                /*如果文件格式为图片，而且有值，则回显图片*/
                if (opt.uploadType === 'pic') {
                    var temp = hiddenEle.val().split(';');
                    if (opt.needInput) {
                        var inputArr = $(eachThis).find('.needInput').val().split(';');
                    }
                    console.log('hiddenEle.val().split(\';\'):',temp);
                    if (temp && temp.length > 0) {
                        var newPics = [];
                        var newInputs = [];
                        var tHtml;
                        /*回显图片*/
                        for (var i = 0; i < temp.length; i++) {
                            /*onerror="this.onerror=null; this.src=\''+opt.defaultPic+'\'; "*/
                            if (temp[i] && temp[i].length > 0) {
                                tHtml = '<div class="data-pic-contain" style="width:' + opt.picW + ';" data-pic-ind="' + i + '">' +
                                        '<img src="http://cictest.xiweigas.cn' + temp[i] + '"  />' +
                                        '<div class="data-act-icon act-del" style="" data-pic-ind="' + i + '">×</div>';
                                if (opt.needInput) {
                                    tHtml += '<div class=""><input class="data-need-input form-control" type="text"  placeholder="' + opt.inputTip + '" value="' + inputArr[i] + '" /></div>';
                                    newInputs.push(inputArr[i]);
                                }
                                tHtml += '</div>';
                                showImgEle.append(tHtml);
                                newPics.push(temp[i]);
                                picInd++;
                            }
                        }
                        hiddenEle.val(newPics.join(';'));
                        if (opt.needInput) {
                            needInputEle.val(newInputs.join(';'));
                        }
                    }
                } else if (opt.uploadType === 'file') {
                    /*如果上传的是文件回显文件名*/
                    var temp = hiddenEle.val().split(';');
                    if (temp && temp.length > 0) {
                        var newFiles = [];
                        /*回显图片*/
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] && temp[i].length > 0) {
                                showImgEle.append('<span class="file_item_tip">' + temp[i] + '</span>');
                                newFiles.push(temp[i]);
                            }
                        }
                        hiddenEle.val(newFiles.join(';'));
                    }
                }
            }

            fileEle.fileupload({
                url: opt.url,
                dataType: 'json',
                add: function (e, data) {
//                    previewImage(data, $("#preview"));
//                    console.log(data);
                    /*提示*/
//                    showTipEle.append('<div class="progress xxs"><div class="progress-bar progress-bar-red" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">'+
//                      '<span class="sr-only">80% Complete</span></div></div>');
//                    return;
                    /*fire to upload*/
                    $(".loading-contain").css('display', 'block');
                    
                    $(eachThis).find('.my-upload-btn').addClass('disabled');
                    $(eachThis).find('.input_file').addClass('disabled');
                            
                    data.submit(); // 直接上传
                },
                done: function (e, data) { // 上传完毕
                    $(".content-wrapper").find('.overlay-wrapper').remove();
                    $(".loading-contain").css('display', 'none');

                    $(eachThis).find('.my-upload-btn').removeClass('disabled');
                    $(eachThis).find('.input_file').removeClass('disabled');
                    if (data.jqXHR.responseJSON.errcode == 0) {
                        if(!data.jqXHR.responseJSON.data) {
                            return ;
                        }
                        var picPath = data.jqXHR.responseJSON.data.pic;
                        var tmpHtml = '';
                        if (opt.uploadType === 'pic') {
                            /*回显图片*/
                            tmpHtml = '<div class="data-pic-contain" style="width:' + opt.picW + ';" data-pic-ind="' + (picInd) + '">' +
                                    '<img src="http://cictest.xiweigas.cn'
                                + picPath
                                + '"  />' +
                                    '<div class="data-act-icon act-del" style="" data-pic-ind="' + (picInd++) + '">×</div>';
                            if (opt.needInput) {
                                tmpHtml += '<div class="data-need-input"><input class="data-need-input form-control" type="text"  placeholder="' + opt.inputTip + '" value="" /></div>';
                            }
                            tmpHtml += '</div>';
                        } else if (opt.uploadType === 'file') {
                            /*回显文件名*/
                            tmpHtml = '<span class="file_item_tip">' + picPath + '</span>';
                        }
                        if (opt.isMulti) {
                            showImgEle.append(tmpHtml);
                            /*保存图片路径到设置好的hiddenEle元素中*/
                            if (typeof hiddenEle.val() === 'undefined' || !hiddenEle.val() || hiddenEle.val() == '') {
                                hiddenEle.val(picPath);
                                needInputEle.val('');
                            } else {
                                hiddenEle.val(hiddenEle.val() + ';' + picPath);
                                needInputEle.val(needInputEle.val() + ';' + '');
                            }
                            if ('' !== $.trim(hiddenEle.attr('data-max-num')) && $.trim(hiddenEle.attr('data-max-num')) > 0 &&
                                    $.trim(hiddenEle.attr('data-max-num')) <= hiddenEle.val().split(';').length) {
                                $(eachThis).find('.my-upload-btn').addClass('disabled');
                                $(eachThis).find('.input_file').addClass('disabled');
                            }
                        } else {
                            showImgEle.html(tmpHtml);
                            hiddenEle.val(picPath);
                            needInputEle.val('');
                        }
                        if(opt.callback) {
                            opt.callback(eachThis, picPath, opt.callbackOption);
                        }
                    } else {/*上传出错*/
                        displayTip("#fc8383", "#fc8383", "#fbeded", data.jqXHR.responseJSON.errmsg);
                    }

                },
                fail: function (e, data) {/*失败*/
                    displayTip("#fc8383", "#fc8383", "#fbeded", "请求失败");
//                    showImgEle.attr('src', '../lib/images/upload_comn.png');
                },
                progressall: function (e, data) { //设置上传进度事件的回调函数
//        ctio        var progress = parseInt(data.loaded / data.total * 100, 10);
//                    console.log(progress);
                }
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
        });
    };

    $.fn.upload_img.defaults = {
        url: 'http://cictest.xiweigas.cn/api/common/upload/uploadImageAjax',
        defaultPic: '/lib/assets/images/upload_comn.png',
        showImgEle: '.pictype', /*用于回显图片的元素*/
        hiddenEle: 'input[type="hidden"]', /*用于存放图片保存路径的元素*/
        fileEle: '.input_file', /*file元素*/
        showTipEle: '.tip_ele', /*显示提示信息的dom*/
        uploadType: 'pic', /*上传的文件格式（'pic':图片; 'file':文件），默认是图片*/
        needInput: false, /*是否需要输入信息*/
        inputTip: '', /*输入的信息提示*/
        isMulti: true, /*是否可上传多个*/
        picW: '200px',
        picH: '200px',
        callback: false, /*回调函数，默认回调*/
        callbackOption: {}
    };

}(jQuery);


window.picNum = 0;

//图片上传预览    IE是用了滤镜。
function previewImage(file, previewEle)
{
    var MAXWIDTH = 260;
    var MAXHEIGHT = 180;
//    var div = previewEle;
    if (file.files && file.files[0])
    {
        previewEle.append('<img id=imghead' + picNum + '>');
        var img = document.getElementById('imghead' + picNum);
        img.onload = function () {
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width = rect.width;
            img.height = rect.height;
//                 img.style.marginLeft = rect.left+'px';
            img.style.marginTop = rect.top + 'px';
        }
        var reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        previewEle.append('<img id=imghead' + picNum + '>');
        var img = document.getElementById('imghead' + picNum);
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        previewEle.append("<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>");
    }
    picNum++;
}
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = {top: 0, left: 0, width: width, height: height};
    if (width > maxWidth || height > maxHeight)
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if (rateWidth > rateHeight)
        {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}



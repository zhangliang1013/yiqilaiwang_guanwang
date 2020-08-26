$(function(){
    layer.open({
        type:2, 
        title: ['加载中', 'color: #eee;font-size:20px']
    });
    var article_id = -1;
    var params = getQueryParams(), orgMsgId = params["orgMsgId"];
    var verInfo = detectVersion();
    // console.log(verInfo);

    function fillArticle(rsp){//填充文章数据
        if (rsp.code==200){
            layer.closeAll()
            var orgMsg = rsp.data;
            $(".body").removeClass("hide");  
            $(".title").text(orgMsg.title);
            $(".author img").attr("src", orgMsg.createHeadUrl);
            $(".author .author-name").text(orgMsg.createName+"   "+orgMsg.companyName);
            $(".author .pub-time").text(orgMsg.createTime);
            $(".read-cnt").text("（已有"+orgMsg.seeNumber+"人阅读）");
            $(".article section").html(orgMsg.content+"<p>&nbsp;</p>");


            if (orgMsg.shareRecommendMsgList.length>0){
                var items = $(".article-list .list-item");
                var it = null;

                for(var i=0; i<orgMsg.shareRecommendMsgList.length; i++){
                    var ar = orgMsg.shareRecommendMsgList[i];

                    if (i==0) it = items.eq(0);
                    else{
                        it = items.eq(0).clone();
                        $(".article-list").append(it);
                    }

                    it.children(".item-title").text(ar.title);
                    it.children(".item-pic").css({
                        "background":"url("+ar.imageUrl+") no-repeat",
                        "background-size":"100% 100%"
                    });
                }
            }

            var title = $(".title").text();
            var imgUrl = $(".article section img");
            if (imgUrl.length==0){
                imgUrl = "https://img.yiqilaiwang.com/o_1ea3olf5j1qqdhan1aq113cv16lrg.png?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png";
            }else{
                imgUrl.css({width:"100%",height:"auto"});
                imgUrl = imgUrl.eq(0).attr("src");
            }
            // 判断隐藏下拉箭头
            setTimeout(()=>{
                if($(".article").length && $(".article section")[0].offsetHeight < 300){
                    $(".down-arrow").remove();
                }
            },1000)
            var desc = '来自数字商协会平台的内容分享';

            setWxShare(title, imgUrl, desc);
            setQYWxShare(title, imgUrl, desc);
        }
    }
    //下拉箭头
    $(".down-arrow").on("click", function(){
        $(".article section").css({'max-height':"none"});
        $(".lg-cover").addClass("hide");
        $(this).addClass("hide");
    });
    //打开app按钮
    $(".open-btn").on("click", function(){
        if ($(this).parent().hasClass("dlg-open-app")==false){
            article_id = $(".article").attr("aid");//本文的id
        }

        if (verInfo.isAndroid){
            openApp("yiqilaiwang://www.yiqilaiwang.com/open", verInfo);
        }else if (verInfo.isIOS9){
            openApp("https://apps.apple.com/cn/app/id1473793767", verInfo);
        }else if (verInfo.isIOS){
            openApp("https://apps.apple.com/cn/app/id1473793767", verInfo);
        }
    });
    //推荐文章列表项
    $(".article-list").on("click", ".list-item", function(){
        $(".modal-layer").removeClass("hide");

        article_id = $(this).attr("aid");//点击的文章id
    });
    //关闭对话框按钮
    $(".modal-layer .close-dlg").on("click", function(){
        $(".modal-layer").addClass("hide");
    });

    //加载资讯数据
    $.ajax({
        url: BASE_URL + "/h5/org/shareOrgMsg",
        headers: {"api-version":VRESION,"api-client":judgeApiClient('wechat')},
        contentType: "application/json; charset=utf-8",
        type: "POST",
        data: JSON.stringify({"orgMsgId":orgMsgId}),
        dataType: "json",
        success: function(rsp){
            fillArticle(rsp);
        },
        error: function(xhr, msg){
            alert("错误："+msg);
        }
    });
});
$(function () {
    $("#back-to-top").hide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 500) {
            $("#back-to-top").show();
        }
        else
        {
            $("#back-to-top").hide();
        }
    });
    /*当点击跳转链接后，回到页面顶部位置*/
    $("#back-to-top").click(function () {
        $('body,html').animate({scrollTop: 0}, 300);
        return false;
    });
});
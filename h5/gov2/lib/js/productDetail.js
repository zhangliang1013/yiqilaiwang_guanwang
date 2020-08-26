$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));
    window.main = {
        ajaxUrl: {
            listUrl: '',
        },
        initFunc: function() {
            var $this = this;

            // ractive 实例

            this.bindEvent();

            window.setTimeout(function() {
                $this.initSwiper();
            }, 1500)
        },


        bindEvent: function() {
            if (typeof this.hadBindEvent === 'undefined' || this.hadBindEvent === null) {
                this.hadBindEvent = true;
                var $this = this;

            }
        },

        initSwiper: function() {
            //banner轮播图
            var bannerSwiper = new Swiper('#indexSwiper', {
                pagination : '.swiper-pagination',
                paginationType : 'fraction',
                autoplay: 5000,
                direction: 'horizontal',
                loop: true,

            });
            // bannerSwiper.on
            $('#indexSwiper').addClass('op-show');
        },

    };
    window.main.initFunc();
});
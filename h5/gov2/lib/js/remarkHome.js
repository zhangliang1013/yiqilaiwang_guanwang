$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));

    window.remarkHome = {
        ajaxUrl: {
            listUrl: '/app/business/commerceIntroduce',
        },
        data: {},
        initFunc: function() {
            var $this = this;
            // ractive 实例
            if ('undefined' === typeof $this.listRactive || null === $this.listRactive) {
                $this.listRactive = new Ractive({
                    el: '#showContain',
                    template: '#tplContain',
                    data: {
                        logoPic: function(str) {
                            return str && str.length > 0 ? str[0] : '';
                        },
                        orgId: orgId,
                        detail: {}
                    }
                });
            }
            this.bindEvent();
            this.getData();
        },
        getData: function() {
            var $this = this;
            window.beastBase.ajaxGo(this.ajaxUrl.listUrl, { orgId: orgId }, 'post', function(rsp) {
                // console.log(rsp)
                if (rsp && rsp.code == 200) {
                    $this.listRactive.set('detail', rsp.data || {});
                }
            });
        },
        bindEvent: function() {
            if (typeof this.hadBindEvent === 'undefined' || this.hadBindEvent === null) {
                this.hadBindEvent = true;
                var $this = this;

            }
        },

        // initSwiper: function() {
        //     //banner轮播图
        //     var bannerSwiper = new Swiper('#indexSwiper', {
        //         autoplay: 5000,
        //         direction: 'horizontal',
        //         // loop: true,
        //         // 如果需要分页器
        //         // pagination: '#indexSwiperPg',
        //         autoheight: true,
        //         slidesPerView: 2,
        //         spaceBetween: 5,
        //         freeMode: true
        //     });
        // },

    };
    window.remarkHome.initFunc();
});
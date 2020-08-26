$(function() {

    // var toPage = $.trim(window.beastTools.getRequest('toPage'));

    var id = window.beastTools.getRequest('id');
    var type = window.beastTools.getRequest('type');

    window.infoDetail = {
        ajaxUrl: {
            listUrl: '',
            infoUrl: '/app/business/activityDetail',
        },
        initFunc: function() {
            this.bindEvent();
            var $this = this;
            if ('undefined' === typeof $this.detailsRactive || null === $this.detailsRactive) {
                $this.detailsRactive = new Ractive({
                    el: '#showContain',
                    template: '#containTpl',
                    data: {
                        details: null
                    }
                });
            }

            var ajaxData = {
                id: id,
                type: type
            };
            window.beastBase.ajaxGo($this.ajaxUrl.infoUrl, ajaxData, 'post', function(res) {
                if (res && 200 === res.code) {
                    var payload = res.data;
                    if (payload) {
                        $this.detailsRactive.set('details', payload);
                    }
                }
            });

        },

        bindEvent: function() {
            if (typeof this.hadBindEvent === 'undefined' || this.hadBindEvent === null) {
                this.hadBindEvent = true;
                var $this = this;

                $('body').on('click', '.doc-act', function() {
                    var url = $.trim($(this).attr('data-download'));
                    var name = $.trim($(this).attr('data-name'));
                    appDownload(url, name);
                });
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
    window.infoDetail.initFunc();
});
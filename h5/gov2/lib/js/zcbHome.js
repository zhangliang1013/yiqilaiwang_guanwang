$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));

    window.main = {
        ajaxUrl: {
            listUrl: '/app/businessGov/arbitrationHome',
        },
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
            window.setTimeout(function() {
                $this.initSwiper();
            }, 1500);

        },

        getData: function() {
            var $this = this;
            window.beastBase.ajaxGo(this.ajaxUrl.listUrl, { orgId: orgId }, 'post', function(rsp) {
                if (rsp && rsp.code == 200) {
                    var data = rsp.data || {};
                    if (data.title) {
                        $('#pageTitle').text(data.title)
                    }
                    $this.listRactive.set('detail', data);
                }
            });
        },

        bindEvent: function() {
            if (typeof this.hadBindEvent === 'undefined' || this.hadBindEvent === null) {
                this.hadBindEvent = true;
                var $this = this;

                //返回上一页
                $('body').on('click', '#page-back-btn', function(e) {
                    appClosePage();
                });
            }
        },

        initSwiper: function() {
            //banner轮播图
            var bannerSwiper = new Swiper('#indexSwiper', {
                autoplay: 5000,
                direction: 'horizontal',
                // loop: true,
                // 如果需要分页器
                // pagination: '#indexSwiperPg',
                autoheight: true,
                slidesPerView: 2,
                spaceBetween: 5,
                freeMode: true
            });
            $('#indexSwiper').addClass('op-show');
        },

    };
    window.main.initFunc();
});
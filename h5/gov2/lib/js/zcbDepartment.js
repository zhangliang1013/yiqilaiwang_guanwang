$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));
    var detail= $.trim(window.beastTools.getRequest('detail'));
    var index= $.trim(window.beastTools.getRequest('index'));
    detail = JSON.parse(decodeURI(detail))[index]
    // console.log(detail)
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5+"px";

    window.onresize = function(){
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";
    }

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
                        detail: detail,
                        index:index
                    }
                });
            }
            console.log(detail)
            // this.bindEvent();
            // this.getData();
            // window.setTimeout(function() {
            //     $this.initSwiper();
            // }, 1500);
            // $this.listRactive.set('detail', detail);
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
$(function() {

    // var toPage = $.trim(window.beastTools.getRequest('toPage'));
    var listType = $.trim(window.beastTools.getRequest('type'));
    var orgId = $.trim(window.beastTools.getRequest('orgId'));
    var tb = $.trim(window.beastTools.getRequest('tb'));

    window.main = {
        ajaxUrl: {
            listUrl: '/app/businessGov/activities',
        },
        initFunc: function() {
            var $this = this;
            if ('undefined' === typeof $this.listRactive || null === $this.listRactive) {
                $this.listRactive = new Ractive({
                    el: '#infoListShow',
                    template: '#infoListTpl',
                    data: {
                        tableList: [],
                        listType: listType
                    }
                });
            }
            this.bindEvent();
            // this.initSwiper();
            // var orgId = $.trim(window.beastTools.getRequest('orgId'));
            // if(orgId){
            //
            // }
            // if (orgId) {
            this.getData();
            // }
            if (tb) {
                var bthumbCur = window.getLocatMessage(tb);
                $('#bthumbCur').text(bthumbCur);
                $('#pageTitle').text(bthumbCur);
            }
        },
        getData: function(option) {
            var $this = this,
                ajaxData = {
                    pageSize: 10000,
                    entityId: orgId,
                    type: listType
                };
            if (option && 'undefined' !== typeof option.pn && null !== option.pn && !isNaN(parseInt(option.pn))) {
                ajaxData.pageNumber = parseInt(option.pn);
            } else {
                ajaxData.pageNumber = 1;
            }
            window.beastBase.ajaxGo($this.ajaxUrl.listUrl, ajaxData, 'post', function(res) {
                if (res && res.code == 200) {
                    var newPayload = res.data;
                    // var pageInfo = null;// data.data.pageInfo;
                    if (newPayload && newPayload.length > 0) {
                        var oldList = $this.listRactive.get('tableList');
                        if ('undefined' !== typeof oldList && null !== oldList && $.isArray(oldList) && oldList.length > 0) {
                            $this.listRactive.set('tableList', oldList.concat(newPayload));
                        } else {
                            $this.listRactive.set('tableList', newPayload);
                        }
                        // if ('undefined' !== typeof pageInfo && null !== pageInfo && pageInfo) {
                        //     window.scrollPageInfo.setPageNum(pageInfo, function (tmpOp) {
                        //         $this.getData(tmpOp);
                        //     }, '#infoListShowBody', '#infoListShow');
                        //     $this.listRactive.set('pageInfo', window.scrollPageInfo);
                        // }
                    }
                }
            });
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
        },

    };
    window.main.initFunc();
});
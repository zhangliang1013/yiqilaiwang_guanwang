$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));
    window.main = {
        ajaxUrl: {
            listUrl: '/app/businessGov/industryHome',
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
            // window.alert('initFunc')
            this.bindEvent();
            this.getData();
            window.setTimeout(function() {
                $this.initSwiper();
            }, 1500);

        },

        getData: function() {
            var $this = this;
            // window.alert('getData')
            window.beastBase.ajaxGo(this.ajaxUrl.listUrl, { orgId: orgId }, 'post', function(rsp) {
                // window.alert('ajaxGo after:' + JSON.stringify(rsp))
                // console.log(rsp)
                // let rsp = {
                //     "code": 200,
                //     "msg": "操作成功",
                //     "data": {
                //         "news": [{
                //             "id": "asdfawerwe34243",
                //             "entity": "",
                //             "creator": "",
                //             "creatorName": "",
                //             "createdDate": 1586411934794,
                //             "title": "国家卫检委：加强14个相关城市",
                //             "content": "",
                //             "address": "",
                //             "description": "",
                //             "status": 0,
                //             "attachments": [
                //                 "https://img.yiqilaiwang.com/Fnr3hD-oiNXFpEpNlqno0Nf3v66V"
                //             ],
                //             "type": 0,
                //             "typeName": "政策下发",
                //             "startTime": "",
                //             "endTime": "",
                //             "createdDateStr": "2020年04月09日 13:58:54",
                //             "startTimeStr": "",
                //             "endTimeStr": "",
                //             "reply": false
                //         }],
                //         "member": [{
                //             "id": "asdfawerwe34243",
                //             "entity": "",
                //             "creator": "",
                //             "creatorName": "",
                //             "createdDate": 1586411934794,
                //             "title": "国家卫检委：加强14个相关城市",
                //             "content": "",
                //             "address": "",
                //             "description": "",
                //             "status": 0,
                //             "attachments": [
                //                 "https://img.yiqilaiwang.com/Fnr3hD-oiNXFpEpNlqno0Nf3v66V"
                //             ],
                //             "type": 0,
                //             "typeName": "政策下发",
                //             "startTime": "",
                //             "endTime": "",
                //             "createdDateStr": "2020年04月09日 13:58:54",
                //             "startTimeStr": "",
                //             "endTimeStr": "",
                //             "reply": false
                //         }],
                //         "act": [{
                //             "id": "asdfawerwe34243",
                //             "entity": "",
                //             "creator": "",
                //             "creatorName": "",
                //             "createdDate": 1586411934794,
                //             "title": "国家卫检委：加强14个相关城市",
                //             "content": "",
                //             "address": "",
                //             "description": "",
                //             "status": 0,
                //             "attachments": [
                //                 "https://img.yiqilaiwang.com/Fnr3hD-oiNXFpEpNlqno0Nf3v66V"
                //             ],
                //             "type": 0,
                //             "typeName": "政策下发",
                //             "startTime": "",
                //             "endTime": "",
                //             "createdDateStr": "2020年04月09日 13:58:54",
                //             "startTimeStr": "",
                //             "endTimeStr": "",
                //             "reply": false
                //         }],
                //         "service": [{
                //             "id": "asdfawerwe34243",
                //             "entity": "",
                //             "creator": "",
                //             "creatorName": "",
                //             "createdDate": 1586411934794,
                //             "title": "国家卫检委：加强14个相关城市",
                //             "content": "",
                //             "address": "",
                //             "description": "",
                //             "status": 0,
                //             "attachments": [
                //                 "https://img.yiqilaiwang.com/Fnr3hD-oiNXFpEpNlqno0Nf3v66V"
                //             ],
                //             "type": 0,
                //             "typeName": "政策下发",
                //             "startTime": "",
                //             "endTime": "",
                //             "createdDateStr": "2020年04月09日 13:58:54",
                //             "startTimeStr": "",
                //             "endTimeStr": "",
                //             "reply": false
                //         }]
                //     }
                // };
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
                    // console.log('back');
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
$(function() {

    var orgId = $.trim(window.beastTools.getRequest('orgId'));

    window.remarkHome = {
        ajaxUrl: {
            listUrl: '/app/businessGov/arbitrationAboutUs',
        },
        data: {},
        initFunc: function() {
            var $this = this;
            // console.log($this.listRactive,'$this.listRactive')
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
                        detail: {},
                        deptList:"",
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
                    $this.listRactive.set('deptList', JSON.stringify(rsp.data.deptList) || "");
                }
            });
        },
        bindEvent: function() {
            if (typeof this.hadBindEvent === 'undefined' || this.hadBindEvent === null) {
                this.hadBindEvent = true;
                var $this = this;

            }
        },

    };
    window.remarkHome.initFunc();
});
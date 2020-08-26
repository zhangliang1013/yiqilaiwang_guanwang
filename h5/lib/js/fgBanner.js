window.onload = function () {

    new Vue({
        el: "#index",
        data: {
            name: "", // 请求过来的组织或个人
            calName:"",
            avatarUrl: "", // 头像
            relationUrl: '',
            upload: true,
            nothingImg:  "./lib/image/fgBanner/zy.png",
            tableData: {},
            calendar:'',
        },
        methods: {
            // 关闭
            close () {
                this.isShow = !this.isShow
            },
            // 获取打卡日期
            getCalendar(){
                var that = this;
                axios({
                    url: BASE_URL + "webSite/resumptionWork/share?time=" + new Date().getTime(),
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'api-client': judgeApiClient('webSite'),
                        'api-version': VRESION,
                    },
                    data: {
                        'uid':that.tableData.uid,
                        "orgId": that.tableData.orgId
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        that.calendar = data.data.dates; 
                        that.calName = data.data.name;
                        that.avatarUrl = data.data.avatarUrl;
                    }
                }).catch((error) => {
                    // console.log(error)
                })
            },
            dealCal(val){
                var dateTime = new Date(val);
                var link = false;
                dateTime=dateTime.setDate(dateTime.getDate()-1);
                dateTime=new Date(dateTime).format('yyyy-MM-dd');
                for(var item of this.calendar){
                    if(item == dateTime){
                        link = true
                        return link
                    }
                }
                return link
            },
            // 获取平安打卡相关信息
            getUserInfo () {
                var that = this;
                axios({
                    url: BASE_URL + "webSite/epidemic/epidemicRelation",
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'api-client': judgeApiClient('webSite'),
                        'api-version': VRESION,
                    },
                    data: {
                        "type": 1,
                        "relationId": that.tableData.orgId
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        that.name = data.data.relationName
                        that.relationUrl = data.data.relationUrl
                        this.getWxCode()
                    }
                }).catch((error) => {
                    // console.log(error)
                })
            },
            // 获取微信参数
            getWxCode () {
                var title = '';
                if(this.tableData.isOrg == 0){
                    title = '我正在用一起来往「复工打卡」，今天你打卡了吗？';
                }else{
                    title = this.name + "邀请你用一起来往进行复工打卡";
                }
                var imgUrl = this.relationUrl;
                var desc = '一起来往全力保障社会组织、企业等平安复工';
                setWxShare(title, imgUrl, desc);
                setQYWxShare(title, imgUrl, desc);
            },
        },
        created () {
            this.tableData.uid = getUrlParameter('uid');
            this.tableData.orgId = getUrlParameter('relationId');
            this.tableData.isOrg = getUrlParameter('isOrg');
            // console.log(this.tableData)
            if(this.tableData.isOrg == 0){
                this.getCalendar();
            }
            this.getUserInfo();
        },
    })
}
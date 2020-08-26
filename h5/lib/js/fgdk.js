window.onload = function () {

    new Vue({
        el: "#index",
        data: {
            message: "",
            isTel: false,
            isOk: false,
            isShow: false,
            isTrue: true,
            date: "", //当前日期
            date2: '',// 过去14天的时间
            name: "", // 请求过来的组织或个人
            tel: "", // 联系方式
            relationUrl: '',
            detail: '',
            upload: true,
            nothingImg: "./lib/image/fgdk/zy.png",
            imgs: '', //轮播图
            tableData: {
                relationId: '', //组织id或个人id
                type: "",//1：组织 2：个人
                posterUrl: "",
                reportName: "",
                reportTel: "",
                reportDept: "",
                currentAddress: "",
                latitude: "",
                longitude: "",
                backDate: "2020-01-23",
                isTemperature: "",
                temperature: "",
                isCough: "",
                isSymptom: "",
                symptomInfo: "",
                familyNumber: "",
                familyRelation: "",
                familyIsTemperature: "",
                familyTemperature: "",
                familyIsCough: "",
                familyIsSymptom: "",
                familySymptomInfo: "",
                liveCity: "",
                isStayedHotel: "",
                stayedDate: "",
                stayedHotel: "",
                isAirplane: "",
                airplaneDate: "",
                airplaneNum: "",
                isTrain: "",
                trainDate: "",
                trainNum: "",
                isSubway: "",
                subwayDate: "",
                subwayNum: "",
                isBus: "",
                busDate: "",
                busNum: "",
                isOthers: "",
                othersDate: "",
                othersNum: "",
                isQuarantine: ""
            }
        },
        watch: {
            'tableData.temperature' (newVal) {
                if (newVal) {
                    this.tableData.isTemperature = '1'
                }
            },
            'tableData.isTemperature' (newVal) {
                if (newVal == 0) {
                    this.tableData.temperature = ''
                }
            },
            'tableData.familyTemperature' (newVal) {
                if (newVal) {
                    this.tableData.familyIsTemperature = '1'
                }
            },
            'tableData.familyIsTemperature' (newVal) {
                if (newVal == 0) {
                    this.tableData.familyTemperature = ''
                }
            }
        },
        mounted () {
            this.getNowLocation()
            this.BirthDateSelect()
            this.otherSelect()
            this.busSelect()
            this.subwaySelect()
            this.trainSelect()
            this.planeSelect()
            this.stayedDateSelect()
        },
        methods: {
            // 关闭
            close () {
                this.isShow = !this.isShow
            },
            // 返回日期
            BirthDateSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.time1' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    viewDate : "2020-1-23",
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.backDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            otherSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.other' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.othersDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            busSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.bus' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.busDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            subwaySelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.subway' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.subwayDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            trainSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.train' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.trainDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            planeSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.plane' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.airplaneDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },
            stayedDateSelect () {
                let that = this
                var calendar = new datePicker();
                calendar.init({
                    trigger: '.stayedDate' /*按钮选择器，用于触发弹出插件*/,
                    type: "date", /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/
                    minDate: "2019-1-1" /*最小日期*/,
                    maxDate: "2020-12-31" /*最大日期*/,
                    onSubmit: function () {
                        /*确认时触发事件*/
                        that.tableData.stayedDate = calendar.value;
                    },
                    onClose: function () {
                        /*取消时触发事件*/
                    }
                });
            },

            // 刷新地址
            refreshAddress () {
                this.getNowLocation()
            },
            // 定时关闭
            setTimeOut (val) {
                this.message = val
                this.isOk = true
                setTimeout(() => {
                    this.isOk = false
                }, 3000);
            },
            // 提交
            submit () {
                var that = this;
                let data = that.tableData
                if (!data.reportName) {
                    this.setTimeOut('请输入姓名')
                    return false
                }
                if (this.tel) {
                    if (!(/^1(3[0-9]|4[5-9]|5[0-3,5-9]|6[2,5,6,7]|7[0-8]|8[0-9]|9[1,3,5,8,9])\d{8}$/.test(that.tel))) {
                        this.setTimeOut('手机号格式有误')
                        return false
                    }
                } else {
                    this.setTimeOut('请输入联系方式')
                    return false
                }
                if (!data.reportDept) {
                    this.setTimeOut('请输入所在单位或组织')
                    return false
                }
                if (!data.currentAddress) {
                    this.setTimeOut('请重新获取所在地址')
                    return false
                }
                if (!data.backDate) {
                    this.setTimeOut('请选择返回日期')
                    return false
                }
                if (!data.isTemperature) {
                    this.setTimeOut('请选择个人是否发烧')
                    return false
                } else if (data.isTemperature == 1 && !data.temperature) {
                    this.setTimeOut('请输入个人发热体温')
                    return false
                }
                if (!data.isCough) {
                    this.setTimeOut('请选择个人是否咳嗽')
                    return false
                }
                if (!data.isSymptom) {
                    this.setTimeOut('请选择个人是否有其他症状')
                    return false
                } else if (data.isSymptom == 1 && !data.symptomInfo) {
                    this.setTimeOut('请输入个人的症状')
                    return false
                }
                if (!data.familyNumber) {
                    this.setTimeOut('请输入共同居住人数')
                    return false
                }
                if (!data.familyRelation) {
                    this.setTimeOut('请选择居住人关系')
                    return false
                }
                if (!data.familyIsTemperature) {
                    this.setTimeOut('请选择同居人是否发烧')
                    return false
                } else if (data.familyIsTemperature == 1 && !data.familyTemperature) {
                    this.setTimeOut('请输入同居人体温')
                    return false
                }
                if (!data.familyIsCough) {
                    this.setTimeOut('请选择同居人是否咳嗽')
                    return false
                }
                if (!data.familyIsSymptom) {
                    this.setTimeOut('请选择同居人是否有其他症状')
                    return false
                } else if (data.familyIsSymptom == 1 && !data.familySymptomInfo) {
                    this.setTimeOut('请输入同居人的症状')
                    return false
                }
                if (!data.liveCity) {
                    this.setTimeOut('请输入旅行过的城市')
                    return false
                }
                if (!data.isStayedHotel) {
                    this.setTimeOut('请选择最近是否住过酒店')
                    return false
                } else if (data.isStayedHotel == 1 && !data.stayedHotel) {
                    this.setTimeOut('请输入酒店名称')
                    return false
                } else if (data.isStayedHotel == 1 && !data.stayedDate) {
                    this.setTimeOut('请选择住店日期')
                    return false
                }
                if (!data.isAirplane) {
                    this.setTimeOut('请选择最近是否搭乘去程飞机')
                    return false
                } else if (data.isAirplane == 1 && !data.airplaneDate) {
                    this.setTimeOut('请选择去程飞机的日期')
                    return false
                }else if (data.isAirplane == 1 && !data.airplaneNum) {
                    this.setTimeOut('请输入去程飞机航班号')
                    return false
                }
                if (!data.isTrain) {
                    this.setTimeOut('请选择最近是否搭乘返程飞机')
                    return false
                } else if (data.isTrain == 1 && !data.trainDate) {
                    this.setTimeOut('请选择返程飞机的日期')
                    return false
                } else if (data.isTrain == 1 && !data.trainNum) {
                    this.setTimeOut('请输入返程飞机航班号')
                    return false
                } 
                if (!data.isSubway) {
                    this.setTimeOut('请选择最近是否乘坐去程火车')
                    return false
                } else if (data.isSubway == 1 && !data.subwayDate) {
                    this.setTimeOut('请选择去程火车的日期')
                    return false
                }else if (data.isSubway == 1 && !data.subwayNum) {
                    this.setTimeOut('请输入去程火车车次')
                    return false
                } 
                if (!data.isBus) {
                    this.setTimeOut('请选择最近是否乘坐返程火车')
                    return false
                } else if (data.isBus == 1 && !data.busDate) {
                    this.setTimeOut('请选择返程火车的日期')
                    return false
                } else if (data.isBus == 1 && !data.busNum) {
                    this.setTimeOut('请输入返程火车车次')
                    return false
                } 
                if (!data.isOthers) {
                    this.setTimeOut('请选择最近是否乘坐其他行程')
                    return false
                } else if (data.isOthers == 1 && !data.othersDate) {
                    this.setTimeOut('请选择乘坐的其他行程日期')
                    return false
                } else if (data.isOthers == 1 && !data.othersNum) {
                    this.setTimeOut('请输入乘坐的其他方式')
                    return false
                }
                if (!data.isQuarantine) {
                    this.setTimeOut('请选择是否自行隔离')
                    return false
                }
                data.backDate = data.backDate && data.backDate.split(" ").length === 1 ? data.backDate + ' 00:00:00' : data.backDate
                data.airplaneDate = data.airplaneDate && data.airplaneDate.split(" ").length === 1 ? data.airplaneDate + ' 00:00:00' : data.airplaneDate
                data.trainDate = data.trainDate && data.trainDate.split(" ").length === 1 ? data.trainDate + ' 00:00:00' : data.trainDate
                data.subwayDate = data.subwayDate && data.subwayDate.split(" ").length === 1 ? data.subwayDate + ' 00:00:00' : data.subwayDate
                data.busDate = data.busDate && data.busDate.split(" ").length === 1 ? data.busDate + ' 00:00:00' : data.busDate
                data.othersDate = data.othersDate && data.othersDate.split(" ").length === 1 ? data.othersDate + ' 00:00:00' : data.othersDate
                data.stayedDate = data.stayedDate && data.stayedDate.split(" ").length === 1 ? data.stayedDate + ' 00:00:00' : data.stayedDate
                data.reportTel = this.tel
                data.posterUrl = this.imgs;
                axios({
                    url: BASE_URL + "webSite/epidemic/epidemicReport",
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'api-client': judgeApiClient('webSite'),
                        'api-version': VRESION,
                    },
                    data: data
                }).then(({ data }) => {
                    if (data.code === 200) {
                        that.isShow = true
                        that.tableData.reportTel = ""
                        that.tableData.reportDept = ""
                        that.tableData.backDate = ""
                        that.tableData.isTemperature = ""
                        that.tableData.temperature = ""
                        that.tableData.isCough = ""
                        that.tableData.isSymptom = ""
                        that.tableData.symptomInfo = ""
                        that.tableData.familyNumber = ""
                        that.tableData.familyRelation = ""
                        that.tableData.familyIsTemperature = ""
                        that.tableData.familyTemperature = ""
                        that.tableData.familyIsCough = ""
                        that.tableData.familyIsSymptom = ""
                        that.tableData.familySymptomInfo = ""
                        that.tableData.liveCity = ""
                        that.tableData.isStayedHotel = ""
                        that.tableData.stayedDate = ""
                        that.tableData.stayedHotel = ""
                        that.tableData.isAirplane = ""
                        that.tableData.airplaneDate = ""
                        that.tableData.airplaneNum = ""
                        that.tableData.isTrain = ""
                        that.tableData.trainDate = ""
                        that.tableData.trainNum = ""
                        that.tableData.isSubway = ""
                        that.tableData.subwayDate = ""
                        that.tableData.subwayNum = ""
                        that.tableData.isBus = ""
                        that.tableData.busDate = ""
                        that.tableData.busNum = ""
                        that.tableData.isOthers = ""
                        that.tableData.othersDate = ""
                        that.tableData.othersNum = ""
                        that.tableData.isQuarantine = ""
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            // 获取当前位置
            getNowLocation () {
                let that = this
                AMap.plugin('AMap.Geolocation', function () {
                    var geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000,
                    })

                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', onComplete);
                    AMap.event.addListener(geolocation, 'error', onError);

                    function onComplete (data) {
                        // data是具体的定位信息
                        // console.log('定位成功信息：', JSON.stringify(data));
                        that.tableData.currentAddress = data.formattedAddress
                        that.tableData.latitude = data.position.lat
                        that.tableData.longitude = data.position.lng
                    }

                    function onError (data) {
                        // 定位出错
                        // console.log('定位失败错误：', data);
                    }
                })
            },
            // 获取当前日期
            getDate () {
                var year = new Date().getFullYear();
                var month = new Date().getMonth() + 1;
                var day = new Date().getDate();
                this.date = year + "年" + month + "月" + day + "日";
                // 获取14天
                var date = new Date().setDate((new Date().getDate() - 13))
                var month2 = new Date(date).getMonth() + 1
                var day2 = new Date(date).getDate()
                this.date2 = month2 + '月' + day2 + '日'
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
                        "type": that.tableData.type,
                        "relationId": that.tableData.relationId,
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        that.name = data.data.relationName
                        that.tel = data.data.tel
                        that.tableData.reportName = data.data.name
                        that.relationUrl = data.data.relationUrl
                        this.getWxCode()
                    } else {
                        that.isTrue = !that.isTrue
                    }
                }).catch((error) => {
                    that.isTrue = !that.isTrue
                    // console.log(error)
                })
            },

            // 获取微信参数
            getWxCode () {
                var title = this.name + "邀请你进行平安打卡，免费领口罩";
                var imgUrl = this.relationUrl;
                var desc = '一起来往，组织疫情统计工具';
				setWxShare(title, imgUrl, desc);
				setQYWxShare(title, imgUrl, desc);
            },
            // 获取海报
            getImg () {
                var that = this;
                axios({
                    url: BASE_URL + "webSite/epidemic/getPictureListByType",
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'api-client': judgeApiClient('webSite'),
                        'api-version': VRESION,
                    },
                    data: {
                        "type": "25",
                        "pageSize": 10,
                        "pageNumber": 1
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        if (data.data.rows.length > 0) {
                            that.imgs = data.data.rows[0].url
                        }
                    }
                }).catch((error) => {
                    // console.log(error)
                })
            }


        },
        created () {
            this.getDate();
            if (window.location.search) {
                var urlData = window.location.search.split("=");
                this.tableData.relationId = urlData[1].split("&")[0];
                this.tableData.type = urlData[2].split("&")[0];
            }
            // var urlData = getUrlParameter('')
            this.getUserInfo();
            this.getImg();
        },
    })

}
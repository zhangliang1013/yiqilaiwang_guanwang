window.onload = function(){  

    new Vue({
        el: "#index",
        data:{
            type:'',//  1:普通组织统计 2:高级组织
            // orgId:"bc13418e4bda11eab7e900163e05ff66",
            orgId:"",
            // uid:"789b0074fa1311e9945200163e05ff66",
            uid:"",
            status:1,
            detail:{},
            typeSeve:true,
            option:{
                color:[ '#41EE8B', '#F41818', '#CCCCCC'],
                data1:"",
                data2:"",
                data3:"",
            },
            option2:{
                color:['#3F98DB'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}',
            },
            option3:{
                color:['#E062AE'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}%',
            },
            option4:{
                color:['#E062AE'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}',
            },
            option5:{
                color:['#E062AE'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}%',
            },
            option6:{
                color:['#E062AE'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}',
            },
            option7:{
                color:['#E062AE'],
                data:[],
                x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                xSize:20,
                barWidth:60,
                formatter: '{c}',
            },
        },
        methods: {
            // 组织成员疫情，今日统计
            getDetail(){
                var that = this;
                var url="";
                if(this.type==1 ){
                    if(this.status ==1){
                        url = 'app/resumptionWork/myOrgTodayStats';
                    }else if(this.status ==2){
                        url = 'app/resumptionWork/myOrgThisWeekStats';
                    }else if(this.status ==3){
                        url = 'app/resumptionWork/myOrgThisMonthStats'
                    }
                }else {
                    url = "app/resumptionWork/parentOrgStats";
                }
                url = BASE_URL + url + "?uid=" + that.uid + "&time="+ new Date().getTime();
                // console.log(url)
                axios({
                    url:  url,
                    method:"post",
                    headers: {
                        'Content-Type': 'application/json',
                        'api-client': judgeApiClient(url),
                        'api-version': VRESION,
                    },
                    data:{
                        "orgId":that.orgId,
                    }
                }).then((res) => {
                    var detail = res.data.data;
                    that.detail = detail;
                    if(res.data.code == 200 && res.data.data.flag == 1){
                        // 本日
                        if(that.type==1 && that.status ==1){
                            // 饼形图颜色为空时设置
                            if(that.detail && !detail.todayNomalPerson && !detail.todayFocusOnPerson && !detail.unsignPerson){
                                that.option.color = ['#eeeeee'];
                            }
                            var date = [];
                            var split = '';
                            var time = '';
                            for(var i in detail.weekDateStrList){
                                split = detail.weekDateStrList[i].split('-');
                                time = parseFloat(split[1]) + '月' + parseFloat(split[2]) + '日';
                                date.push(time)
                            }
                            console.log(detail.weekResumptionWorkPerson,detail.weekResumptionRatio,detail.weekLeftIsolatePersonList)
                            that.option2.data = detail.weekResumptionWorkPerson;
                            that.option3.data = detail.weekResumptionRatio;
                            that.option4.data = detail.weekLeftIsolatePersonList;//一周每日隔离请假隔离人数
                            that.option2.x = date;
                            that.option3.x = date;
                            that.option4.x = date;
                            that.option2.xSize = 20;
                            that.option3.xSize = 20;
                            that.option4.xSize = 20;
                            that.option3.color = ['#E062AE'];
                            that.option4.color = ['#F0C610'];
                            that.option.color = [ '#41EE8B', '#F41818', '#CCCCCC'];
                            that.option.data1 = detail.todayNomalPerson;
                            that.option.data2 = detail.todayFocusOnPerson;
                            that.option.data3 = detail.unsignPerson;
                            that.option3.formatter = '{c}%';
                        // 本周
                        }else if(that.type==1 && that.status ==2){
                            if(detail.weekDateStrList && detail.lastWeekDateStrList){
                                var time = detail.weekDateStrList[0].split("-");
                                var time1 = detail.weekDateStrList[6].split("-");
                                var start = parseFloat(time[1]) + "月" + parseFloat(time[2]) + '日-' +  parseFloat(time1[1]) + "月" + parseFloat(time1[2]) + '日';  
                                var time2 = detail.lastWeekDateStrList[0].split("-");
                                var time3 = detail.lastWeekDateStrList[6].split("-");
                                var end = parseFloat(time2[1]) + "月" + parseFloat(time2[2]) + '日-' + parseFloat(time3[1]) + "月" + parseFloat(time3[2]) + '日'; 
                                that.option2.x = [end,start];
                                that.option3.x = [end,start];
                                that.option4.x = [end,start];
                                that.option5.x = [end,start];
                            }
                            that.option2.xSize = 25;
                            that.option3.xSize = 25;
                            that.option4.xSize = 25;
                            that.option5.xSize = 25;
                            that.option3.color = ['#F41818'];
                            that.option4.color = ['#F0C610'];
                            that.option5.color = ['#E062AE'];
                            that.option2.data = detail.compareResumptionWorkPerson;
                            that.option3.data = detail.compareFocusOnPerson;
                            that.option4.data = detail.compareLeftIsolatePersonTime;
                            that.option5.data = detail.compareResumptionWorkRatio;
                            that.option3.formatter = '{c}';
                            that.option5.formatter = '{c}%';
                        // 本月
                        }else if (that.type==1 && that.status ==3){
                            if(detail.thisMonthFirstStr && detail.lastMonthFirstStr){
                                var end = parseFloat(detail.lastMonthFirstStr.split("-")[1]) + '月';
                                var start = parseFloat(detail.thisMonthFirstStr.split("-")[1]) + '月';
                                that.option2.x = [end,start];
                                that.option3.x = [end,start];
                                that.option4.x = [end,start];
                                that.option5.x = [end,start];
                            }
                            that.option2.xSize = 25;
                            that.option3.xSize = 25;
                            that.option4.xSize = 25;
                            that.option5.xSize = 25;
                            that.option3.color = ['#F41818'];
                            that.option4.color = ['#F0C610'];
                            that.option5.color = ['#E062AE'];
                            that.option2.data = detail.compareResumptionWorkPerson;
                            that.option3.data = detail.compareFocusOnPerson;
                            that.option4.data = detail.compareLeftIsolatePersonTime;
                            that.option5.data = detail.compareResumptionWorkRatio;
                            that.option3.formatter = '{c}';
                            that.option5.formatter = '{c}%';
                        // 高级
                        }else if(that.type==2 && that.typeSeve){
                            // console.log('高级',detail)
                            detail.fourteenAverageResumptionWorkRatio = [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenFocusOnOrgNum= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenLowResumptionWorkRatio= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenReportOrgNumList= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenReportPersonList= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenResumptionWorkOrgNum= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            var date = [];
                            var split = '';
                            var time = '';
                            detail.fourteenDateStr = detail.fourteenDateStr.slice(-7);
                            for(var i in detail.fourteenDateStr){
                                split = detail.fourteenDateStr[i].split('-');
                                time = parseFloat(split[1]) + '月' + parseFloat(split[2]) + '日';
                                date.push(time)
                            }
                            that.option2.x = date;
                            that.option3.x = date;
                            that.option4.x = date;
                            that.option5.x = date;
                            that.option6.x = date;
                            that.option7.x = date;
                            that.option2.data = detail.fourteenReportOrgNumList.slice(-7);
                            that.option3.data = detail.fourteenReportPersonList.slice(-7);
                            that.option4.data = detail.fourteenResumptionWorkOrgNum.slice(-7);
                            that.option5.data = detail.fourteenAverageResumptionWorkRatio.slice(-7);
                            that.option6.data = detail.fourteenFocusOnOrgNum.slice(-7);
                            that.option7.data = detail.fourteenLowResumptionWorkRatio.slice(-7);
                            that.option2.xSize = 20;
                            that.option3.xSize = 20;
                            that.option4.xSize = 20;
                            that.option5.xSize = 20;
                            that.option6.xSize = 20;
                            that.option7.xSize = 20;
                            that.option2.color = ['#FF985A'];
                            that.option3.color = ['#FF985A'];
                            that.option4.color = ['#4CB3EF'];
                            that.option5.color = ['#E062AE'];
                            that.option6.color = ['#F41818'];
                            that.option7.color = ['#E062AE'];
                            that.option2.barWidth = 60;
                            that.option3.barWidth = 60;
                            that.option4.barWidth = 60;
                            that.option5.barWidth = 60;
                            that.option6.barWidth = 60;
                            that.option7.barWidth = 60;
                            that.option3.formatter = '{c}';
                        }else if(that.type==2 && !that.typeSeve) {
                            detail.fourteenAverageResumptionWorkRatio = [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenFocusOnOrgNum= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenLowResumptionWorkRatio= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenReportOrgNumList= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenReportPersonList= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            detail.fourteenResumptionWorkOrgNum= [89, 10, 12, 0, 60, 0, 0, 80, 100, 0, 0, 55, 0, 0];
                            var date = [];
                            var split = '';
                            var time = '';
                            for(var i in detail.fourteenDateStr){
                                split = detail.fourteenDateStr[i].split('-');
                                time = parseFloat(split[1]) + '月' + parseFloat(split[2]) + '日';
                                date.push(time)
                            }
                            that.option2.x = date;
                            that.option3.x = date;
                            that.option4.x = date;
                            that.option5.x = date;
                            that.option6.x = date;
                            that.option7.x = date;
                            that.option2.barWidth = 40;
                            that.option3.barWidth = 40;
                            that.option4.barWidth = 40;
                            that.option5.barWidth = 40;
                            that.option6.barWidth = 40;
                            that.option7.barWidth = 40;
                            that.option2.data = detail.fourteenReportOrgNumList;
                            that.option3.data = detail.fourteenReportPersonList;
                            that.option4.data = detail.fourteenResumptionWorkOrgNum;
                            that.option5.data = detail.fourteenAverageResumptionWorkRatio;
                            that.option6.data = detail.fourteenFocusOnOrgNum;
                            that.option7.data = detail.fourteenLowResumptionWorkRatio;
                            that.option2.xSize = 10;
                            that.option3.xSize = 10;
                            that.option4.xSize = 10;
                            that.option5.xSize = 10;
                            that.option6.xSize = 10;
                            that.option7.xSize = 10;
                            that.option6.color = ['#F41818'];
                            that.option7.color = ['#E062AE'];
                            that.option3.formatter = '{c}';
                        }   
                    } else{
                        if(that.type==1 && that.status ==1){
                            that.option2.x = detail.weekDateShowStrList;
                            that.option3.x = detail.weekDateShowStrList;
                            that.option4.x = detail.weekDateShowStrList;
                            that.option.color = ['#CCCCCC'];
                            that.option.data1 = detail.orgTotalPerson;
                            that.option.data2 = 0;
                            that.option.data3 = 0;
                        }
                    }  
                    // 饼形图
                    var myChart = echarts.init(document.getElementById('pie'));
                    option = {
                        color : that.option.color,
                        tooltip: {
                            trigger: 'none',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {value: that.option.data1, name: '状态正常'},
                                    {value: that.option.data2, name: '重点关注'},
                                    {value: that.option.data3, name: '未打卡'},
                                ]
                            }
                        ]
                    };
                    myChart.setOption(option);

                    // 条形图
                    var myChart2 = echarts.init(document.getElementById('cross'));
                    option2 = {
                        color: that.option2.color,
                        xAxis: {
                            type: 'category',
                            data: that.option2.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option2.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option2.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option2.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option2.barWidth,
                        }],
                        
                    };
                    myChart2.setOption(option2);

                    var myChart3 = echarts.init(document.getElementById('cross2'));
                    option3 = {
                        color: that.option3.color,
                        xAxis: {
                            type: 'category',
                            data: that.option3.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option3.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option3.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option3.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option3.barWidth,
                        }],
                        
                    };
                    myChart3.setOption(option3);

                    var myChart4 = echarts.init(document.getElementById('cross3'));
                    option4 = {
                        color: that.option4.color,
                        xAxis: {
                            type: 'category',
                            data: that.option4.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option4.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option4.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option4.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option4.barWidth,
                        }],
                        
                    };
                    myChart4.setOption(option4);

                    var myChart5 = echarts.init(document.getElementById('cross4'));
                    option5 = {
                        color: that.option5.color,
                        xAxis: {
                            type: 'category',
                            data: that.option5.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option5.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option5.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option5.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option5.barWidth,
                        }],
                        
                    };
                    myChart5.setOption(option5);

                    var myChart6 = echarts.init(document.getElementById('cross5'));
                    option6 = {
                        color: that.option6.color,
                        xAxis: {
                            type: 'category',
                            data: that.option6.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option6.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option6.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option6.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option6.barWidth,
                        }],
                        
                    };
                    myChart6.setOption(option6);

                    var myChart7 = echarts.init(document.getElementById('cross6'));
                    option7 = {
                        color: that.option7.color,
                        xAxis: {
                            type: 'category',
                            data: that.option7.x,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: that.option7.xSize,//字体大小
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#333333',
                                },
                                fontSize: 25,//字体大小
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            minInterval:1,
                        },
                        series: [{
                            data: that.option7.data,
                            type: 'bar',
                            label:{
                                show: true,
                                formatter: that.option7.formatter,
                                position: 'top',
                                color:'#333333',
                                fontSize: 20,
                            },
                            barWidth:that.option7.barWidth,
                        }],
                        
                    };
                    myChart7.setOption(option7);
                        
                }).catch((error) => {
                    // console.log(error)
                })
            },
            getPercent(num, total) {
                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return "-";
               }
              return total <= 0 ? "0%" : (Math.round(num / total * 1000) / 10.0 + "%");
            },  
            jump(type,value){
                if(!value){
                    return
                }
                var phone = '';
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                    phone = 'ios';
                } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
                    phone = 'Android';
                } else { //pc
                };
                if(type == '1'){
                    if(phone == 'Android'){
                        return window.jump.card1();
                    }else if(phone == 'ios'){
                        return window.webkit.messageHandlers.card1.postMessage(null);
                    }
                }else if(type == '2'){
                    if(phone == 'Android'){
                        return window.jump.card2();
                    }else if(phone == 'ios'){
                        return window.webkit.messageHandlers.card2.postMessage(null);
                    }
                }else{
                    if(phone == 'Android'){
                        return window.jump.card3();
                    }else if(phone == 'ios'){
                        return window.webkit.messageHandlers.card3.postMessage(null);
                    }
                }
            },
            change(val){
                if(val == 1 && this.status ==1){
                    this.status = 2;
                }else if(val == 2 && this.status ==1){
                    this.status = 3;
                } else if(val == 1 && this.status ==2){
                    this.status = 1;
                } else if(val == 2 && this.status ==2){
                    this.status = 3;
                } else if(val == 1 && this.status ==3){
                    this.status = 1;
                } else if(val == 2 && this.status ==3){
                    this.status = 2;
                } 
                this.getDetail();
            },
            changeOrg(){
                this.typeSeve = !this.typeSeve;
                this.getDetail();
            }
        },
        created() {
            this.uid = getUrlParameter('uid');
            this.orgId = getUrlParameter('orgid');
            this.type = getUrlParameter('type');
            // orgId:"789b0074fa1311e9945200163e05ff66",
            // type:1,
            // this.uid = "3fa89f9abe7911e9864b00163e05ff66";
            this.getDetail();
        },
    })

}
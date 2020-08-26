window.onload = function(){  

		new Vue({
				el: "#index",
				data:{
						type:'',//  1:组织成员疫情，今日统计 2:最高级组织
						orgId:"",
						uid:"",
						status:1,
						detail:"",
						typeSeve:true,
						option:{
								color:[ '#41EE8B', '#F41818', '#CCCCCC'],
						},
						option2:{
								color:['#3F98DB'],
								data:[100,350],
								x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
								xSize:20,
								barWidth:60
						},
						option3:{
								color:['#E062AE'],
								data:[120, 200, 150, 80, 70, 110, 130],
								x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
								xSize:20,
								barWidth:60
						}
				},
				methods: {
						// 组织成员疫情，今日统计
						getDetail(){
								var that = this;
								var url="";
								if(this.type==1 ){
										if(this.status ==1){
												url = 'app/epidemic/myOrgTodayStats';
										}else if(this.status ==2){
												url = 'app/epidemic/myOrgThisWeekStats';
										}else if(this.status ==3){
												url = 'app/epidemic/myOrgThisMonthStats'
										}
								}else {
										url = "app/epidemic/parentOrgStats";
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
										if(res.data.code == 200){
												console.log(res.data);
												var detail = res.data.data;
												that.detail = detail;
												// 本日
												if(that.type==1 && that.status ==1){
														// that.option2.x = detail.weekDateStrList;
														that.option2.data = detail.weekTotalSignPerson;
														that.option3.data = detail.weekQuarantinePerson;
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
														that.option2.x = date;
														that.option3.x = date;
														that.option2.xSize = 20;
														that.option3.xSize = 20;
														that.option3.color = ['#E062AE'];
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
																						{value: detail.todayNomalPerson, name: '状态正常'},
																						{value: detail.todayFocusOnPerson, name: '重点关注'},
																						{value: detail.unsignPerson, name: '未打卡'},
																				]
																		}
																]
														};
														myChart.setOption(option);
												}
												// 本周
												if(that.type==1 && that.status ==2){
														if(detail.weekDateStrList && detail.lastWeekDateStrList){
																var time = detail.weekDateStrList[0].split("-");
																var time1 = detail.weekDateStrList[6].split("-");
																var start = parseFloat(time[1]) + "月" + parseFloat(time[2]) + '日-' +  parseFloat(time1[1]) + "月" + parseFloat(time1[2]) + '日';  
																var time2 = detail.lastWeekDateStrList[0].split("-");
																var time3 = detail.lastWeekDateStrList[6].split("-");
																var end = parseFloat(time2[1]) + "月" + parseFloat(time2[2]) + '日-' + parseFloat(time3[1]) + "月" + parseFloat(time3[2]) + '日'; 
																that.option2.x = [end,start];
																that.option3.x = [end,start];
														}
														that.option2.xSize = 25;
														that.option3.xSize = 25;
														that.option3.color = ['#F41818'];
														that.option2.data = detail.compareSingPersonTime;
														that.option3.data = detail.compareFocusOn;
												}
												// 本月
												if(that.type==1 && that.status ==3){
														if(detail.monthFirst && detail.lastMonthBegin){
																var end = parseFloat(detail.lastMonthBegin.split("-")[1]) + '月';
																var start = parseFloat(detail.monthFirst.split("-")[1]) + '月';
																that.option2.x = [end,start];
																that.option3.x = [end,start];
														}
														that.option2.xSize = 25;
														that.option3.xSize = 25;
														that.option3.color = ['#F0C610'];
														that.option2.data = detail.compareSingPersonTime;
														that.option3.data = detail.compareBackPerson;
												}
												if(that.type==2 && that.typeSeve){
														that.option2.data = detail.weekSignPerson;
														that.option3.data = detail.weekSignPersonTime;
														that.option2.xSize = 20;
														that.option3.xSize = 20;
														that.option3.color = ['#FF985A'];
														var date = [];
														var split = '';
														var time = '';
														for(var i in detail.weekDateStrList){
																split = detail.weekDateStrList[i].split('-');
																time = parseFloat(split[1]) + '月' + parseFloat(split[2]) + '日';
																date.push(time)
														}
														that.option2.x = date;
														that.option3.x = date;
														that.option2.barWidth = 60;
														that.option3.barWidth = 60;
												}else if(that.type==2 && !that.typeSeve){
														var date = [];
														var split = '';
														var time = '';
														for(var i in detail.foruteenDateStrList){
																split = detail.foruteenDateStrList[i].split('-');
																time = parseFloat(split[1]) + '月' + parseFloat(split[2]) + '日';
																date.push(time)
														}
														that.option2.x = date;
														that.option3.x = date;
														that.option2.data = detail.fourteenSignPerson;
														that.option3.data = detail.fourteenSignPersonTime;
														that.option2.xSize = 10;
														that.option3.xSize = 10;
														that.option2.barWidth = 40;
														that.option3.barWidth = 40;
												}
												
												// 条形图
												var myChart2 = echarts.init(document.getElementById('cross'));
												var myChart3 = echarts.init(document.getElementById('cross2'));
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
																		position: 'top',
																		color:'#333333',
																		fontSize: 20,
																},
																barWidth:that.option2.barWidth,
														}],
														
												};
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
																		position: 'top',
																		color:'#333333',
																		fontSize: 20,
																},
																barWidth:that.option3.barWidth,
														}],
														
												};
												// 使用刚指定的配置项和数据显示图表。
												myChart2.setOption(option2);
												myChart3.setOption(option3);

										}
								}).catch((error) => {
										// console.log(error)
								})
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
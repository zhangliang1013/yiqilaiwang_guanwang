window.onload = function(){ 
	
	function getSystemType() {
    // 判断 机型
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
      return 'ios';
    } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
      return 'Android';
    } else {
			//pc
			return "";
    }

	}
	window.phoneType = getSystemType();
	function getAppUserToken() {
    if (window.phoneType == 'Android' && window.jump && window.jump.getUserToken) {
			window.jump.getUserToken();
    } else if (window.phoneType == 'ios' && window.webkit &&
			window.webkit.messageHandlers && window.webkit.messageHandlers.getUserToken &&
			window.webkit.messageHandlers.getUserToken.postMessage) {
			window.webkit.messageHandlers.getUserToken.postMessage(null);
    }
	}
	getAppUserToken();

	// axios默认配置
	axios.defaults.baseURL=  BASE_URL + 'business/g/';
	axios.defaults.headers['api-version'] = VRESION;
	axios.defaults.headers['api-client'] = judgeApiClient('webSite');
	axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded";

	// vue
	new Vue({
		el: "#index",
		data(){
			return{
				height1:300,
				height2:280,
				// 第一个柱状图
				time:[],
				time1:[],
				option:[],
				dataX:["100","120","140","100","80","100","130","40"],
				data:[],
				// 第二个柱状图
				option1:[],
				dataX1:["100","120","140","100","80","100","130","40"],
				data1:[],
				// 左下个折线图
				option2:[],
				dataX2:["100","120","140","100","80","100","130","40"],
				data2:[],
				title:"已上线商会数量",
				title2:"已上线协会数量",
				title3:"申报企业的行业分布",
				title4:"政策的行业分布",
				title5:"申报企业数量",
				title51:"企业数量",
				title6:"政策的区域分布TOP",
				title71:"政策查看人次",
				title7:"查看人次",
				title8:"政策的区域分布TOP",
				title9:"申报企业区域分布TOP",
				"businessTypeAnalysis":{
					"orderNum":["39","77","96","41","24","17","0","10"],
					"avgTime":["100","120","140","100","80","100","130","40"],
				},
				type:'',
				area:['市南区','市北区','黄岛区','崂山区','李沧区','城阳区','即墨区','胶州市','平度市','莱西市',],
				data4Y:[],
				data4:[],
				data5:[
					{"value":55,"name":"教育"},
					{"value":60,"name":"化工"},
					{"value":58,"name":"互联网"},
					{"value":54,"name":"服装零售"},
					{"value":45,"name":"房地产"},
					{"value":56,"name":"应用软件服务"},
					{"value":40,"name":"金融"},
					{"value":58,"name":"卫生"}
				],
				dt:[
					{name: '市南区', value: [37,30]},
					{name: '市北区', value: [22,20],selected:true},
					{name: '黄岛区', value: [45,10]},
					{name: '崂山区', value: [40,30]},
					{name: '李沧区', value: [55,20]},
					{name: '城阳区', value: [44,30]},
					{name: '即墨区', value: [31,10]},
					{name: '胶州市', value: [69,30]},
					{name: '平度市', value: [15,15]},
					{name: '莱西市', value: [21,30]},
				],
				option7Label:[],
				option7Value:[],
				option8Label:[],
				option8Value:[],
				geoJson:"",
				defOrg:{digitalCommerce:''},
				token:"",
				layer:1,
			}
		},
		methods: {
			sortRule(a,b) {
				return a.dataX  > b.dataX ? 1:-1
			},
			getTime(){
				this.time = [];
				this.time.push(new Date().getTime());
				for(var t=1;t<7;t++){
					this.time[t] = new Date(this.time[t-1]-1000*60*60*24).getTime();
				}
				for(var i in this.time){
					this.time1.push(new Date(this.time[i]).Format('MM月dd'));
					this.time[i] = new Date(this.time[i]).Format('yyyy/MM/dd ') + '00:00:00';
					this.time[i] = new Date(this.time[i]).getTime();
				}
				this.time.reverse();
				this.time1.reverse();
			},
			randomNum(minNum,maxNum){ 
				switch(arguments.length){ 
					case 1: 
						return parseInt(Math.random()*minNum+1,10); 
					break; 
					case 2: 
						return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
					break; 
						default: 
							return 0; 
					break; 
				} 
			},
			echartsDate(){
				var that = this;
				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init(document.getElementById('main'));

				var myChart1 = echarts.init(document.getElementById('main1'));

				var myChart2 = echarts.init(document.getElementById('main2'));
				var myChart3 = echarts.init(document.getElementById('main3'));

				var myChart4 = echarts.init(document.getElementById('main4'));
				var myChart5 = echarts.init(document.getElementById('main5'));
				var myChart6 = echarts.init(document.getElementById('main6'));
				var myChart7 = echarts.init(document.getElementById('main7'));
				var myChart8 = echarts.init(document.getElementById('main8'));

				var option = {
					tooltip: {
						trigger: 'axis',
						textStyle: {fontSize: 25,color: '#fff'},
						formatter: '{b}<br/>数量：{c}',
					},
					// grid: {left:'4.5%',right: '0%',bottom:56,top:20},
					grid: {left:'4.5%',right: '0%',bottom:'8%',top:'16%'},
					title: {
						text: that.title,
						left: '20px',
						top: '20px',
						textStyle: {
							color: '#fff',
							fontSize:35,
							fontWeight: 'normal'
						}
					},
					// 头部设置
					legend: {
						// show:false,
						icon: 'circle',
						itemWidth: 20,itemHeight: 20,itemGap:10,
						right: '20px',top: '20px',
						textStyle: {fontSize: 35,color: '#fff'}
					},
					xAxis: [
						{
							type: 'category',
							axisLine: {lineStyle: {color: '#57617B'}},
							axisLabel: {interval:0,textStyle: {color:'rgba(255, 255, 255, 0.8)',fontSize:25}},
							// axisLabel:{margin:0,textStyle: {fontSize: 10},},
							data:this.dataX.length?this.dataX:this.time1
						}
					],
					yAxis: [{
						type: 'value',
						axisTick: {
							show: false
						},
						axisLine: {lineStyle: {color: '#57617B'}},
						axisLabel: {margin: 0,textStyle: {color:'rgba(255, 255, 255, 0.8)',fontSize: 25}},
						splitLine: {
							show: true,
							lineStyle:{
								type:'dashed',
								color: ['#25CEF3']
							}
						},
						minInterval:1,

					}],
					series: [
						{
							name:this.type ==1? '企业数量':'商会数量',
							type:'bar',
							barWidth:40,
							itemStyle : {
								normal: {
									barBorderRadius:[3, 3, 0, 0],
									color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
										offset: 0,
										color: "#2168EB"
									}, {
										offset: 0.8,
										color: "#13ADF7"
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
								}
							},
							data:this.data
						},
					]
				};
				var optionZ = {
					legend: {
						// icon: 'pin',
						itemWidth: 34,itemHeight: 18,itemGap:10,
						right: '10px',top: '26px',
						textStyle: {fontSize: 35,color: '#fff'}
					},
					title : {
						text:that.title5,subtext:'',top:'26px',left:'10',
						textStyle: {fontSize: 35,color: '#fff',fontWeight: 'normal'}
					},
					tooltip: {
						trigger: 'axis',
						textStyle: {fontSize: 25,color: '#fff'},
						formatter: '{b}<br/>数量：{c}',
					},
					grid: {left: '8%',right: '2%',bottom: '10%',top:'16%'},
					xAxis: {
						type: 'category',
						axisLine: {lineStyle: {color: '#57617B'}},
						axisLabel: {interval:0,textStyle: {color:'#fff',},fontSize:25,distance:2},
						data: this.dataX2.length?this.dataX2:this.time1},
					yAxis:[
						{
							type: 'value',name: '',
							axisLine: {lineStyle: {color: '#57617B'}},
							axisLabel: {margin: 10,textStyle: {color:'#fff',fontSize: 25},formatter:'{value}'},
							splitLine: {show: false},
							minInterval:1,
						},
					],
					series: [
						{
							name:that.title51,
							type:'line',
							yAxisIndex:0,
							smooth: false,
							symbolSize:14,
							lineStyle: { normal: {width: 2}},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(33, 104, 235, 1)'
									}, {
										offset: 0.7,
										color: 'rgba(19, 173, 247, 0.2)'
									},{
										offset: 1,
										color: 'rgba(19, 173, 247, 0.01)'
									}], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {normal: { color: 'rgba(33, 104, 235, 1)'}},
							data:this.data2,
						},
					]
				};
				var option4={
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						},
						textStyle: {fontSize: 25,color: '#fff'},
						formatter: '{b}<br/>数量：{c}',
					},
					legend: {
						// data: ['直接访问'],
						icon: 'none',
						itemWidth: 10,itemHeight: 15,itemGap:10,
						left: 'left',top: '30px',
						textStyle: {fontSize: 35,color: '#fff'},
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '2%',
						top: '10%',
						containLabel: true
					},
					xAxis: {
						show: false
					},
					yAxis: {
						type: 'category',
						axisLine: {show:false},
						axisTick:false,
						axisLabel: {margin: 10,textStyle: {color:'rgba(255, 255, 255, 0.8)',fontSize:25}},
						data: this.data4Y,
						minInterval:1,
					},
					series: [
						{
							name: that.title4,
							type: 'bar',
							barWidth:60,
							stack: '总量',
							label: {
								show: true,
								position: 'insideRight',
								distance : 5,
								color:"#ffffff",
								fontSize:25
							},
							data: this.data4,
							itemStyle: {
								normal: {
									//每根柱子颜色设置
									color: function(params) {
										let colorList = [
											"#DF7A7F",
											"#EECB63",
											"#02DEB9",
											"#02CCFE",
											"#2168EB",
											"#1D24B1",
											"#9468E0",
										];
										return colorList[params.dataIndex];
									},
									barBorderRadius:[5, 5, 5, 5],
								}
							},
						},
					]
				};
				var option5={
					color:['#02CCFE','#02DEB9','#EECB63','#DF7A7F','#9468E0','#373ED9','#2168EB','#02CCFE','#02DEB9','#EECB63','#DF7A7F','#9468E0','#373ED9','#2168EB',],
					// legend: {
					// 	icon: 'rect',
					// 	itemWidth: 14,itemHeight: 5,itemGap:10,
					// 	left: '6px',top: '16px',
					// 	textStyle: {fontSize: 12,color: '#fff'}
					// },
					title: {
						text:  this.title3,
						left: 10,
						top: 30,
						textStyle: {
							color: '#fff',
							fontSize:35,
							fontWeight: 'normal'
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)',
						textStyle: {fontSize: 25,color: '#fff'}
					},
					// legend: {
					//     orient: 'vertical',
					//     left: 10,
					//     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
					// },
					series: [
						{
							name: this.title3,
							type: 'pie',
							radius: ['25%', '50%'],
							avoidLabelOverlap: true,
							label: {
								show: true,
								position: 'center'
							},
							top:30,
							emphasis: {
								label: {
									show: true,
									fontSize: '25',
									// fontWeight: 'bold'
								}
							},
							label: {
								color: 'rgba(255, 255, 255, 0.8)',
								fontSize: '25',
							},
							labelLine: {
								lineStyle: {
									color: 'rgba(255, 255, 255, 0.8)',
									// fontSize: '25',
								},
								smooth: 0.3,
								length: 20,
								length2: 70
							},
							data:this.data5
						}
					]


				};
				var option6={
					// title: {
					//     text: '香港18区人口密度 （2011）',
					//     subtext: '人口密度数据来自Wikipedia',
					//     sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
					// },
					tooltip: {
						show:true,
						trigger: 'item',
						// formatter: '{b}<br/>{a0}{a1}',
						backgroundColor :'#243460',
						formatter: function(params) {
							// console.log(that.type)
							var color = "#FFB84D";
							var a = "<div style='padding: 4px 0px 4px 3px;color:white;font-size: 25px;font-weight:bold'>" + that.dt[params.dataIndex].name + "</div>";
							if(that.type ==1){
								a += "<div style='padding:3px;border-bottom:2px solid #2168EB;margin-bottom:7px;width:340px;display: flex;justify-content: space-between;'><span>政策数量</span>";
							}else{
								a += "<div style='padding:3px;border-bottom:2px solid #2168EB;margin-bottom:7px;width:340px;display: flex;justify-content: space-between;'><span>企业数量</span>";
							}
							a += that.dt[params.dataIndex].value[0] + "<br>";
							a += "</div>";
							if(that.type ==1){
								a += "<div style='padding:3px;border-bottom:2px solid #13ADF7;margin-bottom:4px;width:340px;display: flex;justify-content: space-between;';><span>申报企业数量</span>";
									a += that.dt[params.dataIndex].value[1] + "<br>";
								a += "</div>";
							}
							return a;
						},
						textStyle: {fontSize: 25,color: '#fff'}
					},
					series: [
						{
							roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
							zoom: 1.20,
							name:"地图",
							type: 'map',
							map:'qingdao',
							label: {
								show:true,
								normal: {
									show: false,
								},
								emphasis: { // 对应的鼠标悬浮效果
									show: true,
									textStyle: {
										color: "#fff",
										fontSize: 35,
									}
								}
							},
							itemStyle: {
								normal: {
									areaColor: '#042560',
									borderColor: '#2168EB',
									borderWidth:1,
									opacity:0.8
								},

								emphasis: {
									areaColor: "#2168EB",
									color:"#fff",
									fontSize: 35,
								}
							},
							data: that.dt,
							selectedMode:'single',
							markPoint:{
								symbol:"circle"
							}
						}
					],
				}
				echarts.registerMap('qingdao', this.geoJson);
				// 绘制图表
				myChart.setOption(option);

				option.series[0].name = that.title
				var option1 = option;
				option1.title.text = this.type==1?'政策触达商协会数量':'已上线协会数量'
				
				option1.series[0].name = this.type==1?'商协会数量':'协会数量'
				option1.xAxis.data = this.dataX1.length?this.dataX1:this.time1;
				option1.series[0].data = this.data1;
				myChart1.setOption(option1);

				myChart2.setOption(optionZ);

				var optionZ1 = optionZ;
				optionZ1.title.text = that.title71
				optionZ1.series[0].name = that.title7
				optionZ1.series[0].areaStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(134, 76, 185, 1)'
					}, {
						offset: 0.7,
						color: 'rgba(134, 76, 185, 0.2)'
					},{
						offset: 1,
						color: 'rgba(134, 76, 185, 0.01)'
					}], false),
					shadowColor: 'rgba(0, 0, 0, 0.1)',
					shadowBlur: 10
				}
				optionZ1.series[0].itemStyle.normal.color = 'rgba(134, 76, 185, 1)',
				optionZ1.series[0].data = ["100","120","140","100","80","100","130",]
				myChart3.setOption(optionZ1);

				myChart4.setOption(option4);

				myChart5.setOption(option5);
				myChart6.setOption(option6);

				var option7 = option4;
				// option7.tooltip.position=['0%', '92%'];
				option7.series[0].name = that.title8;
				option7.series[0].itemStyle = {
					normal: {
						//每根柱子颜色设置
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
							offset: 0.1,
							color: "rgba(33, 104, 235, 0.1)"
						}, {
							offset: 0.9,
							color: "rgba(33, 104, 235, 0.8)"
						}], false),
						// barBorderRadius:[0, 3, 3, 3],
					}
				};
				option7.series[0].barWidth=35;
				option7.series[0].barMaxHeight=30,  //最大柱高
				option7.grid= {
					left: '1%',
					right: '1%',
					bottom: '4%',
					top: '15%',
					containLabel: true
				};
				var option7Value = [];
				var option8Value = [];
				var option7Label = [];
				var option8Label = [];
				for(var item of this.dt){
					option7Value.push(item.value[0])
					option8Value.push(item.value[1])
					option7Label.push(item.name)
					option8Label.push(item.name)
				}
				option7.yAxis.data = this.option7Label?this.option7Label:option7Label;
				option7.yAxis.inverse = "true";
				option7.yAxis.minInterval = 1;
				option7.series[0].data = this.option7Value?this.option7Value:option7Value
				myChart7.setOption(option7);

				var option8 = option7;
				// option8.tooltip.position=function (pos, params, dom, rect, size) {
				// 	// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
				// 	var obj = {top: 60};
				// 	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
				// 	return obj;
				// };
				option8.yAxis.position = 'right';
				option8.yAxis.minInterval = 1;
				option8.series[0].name = that.title9;
				// option8.series[0].itemStyle.normal.label.position = "right";
				option8.yAxis.data = this.option8Label?this.option8Label:option8Label;
				option8.yAxis.inverse = "true";
				option8.series[0].data = this.option8Value.length?this.option8Value:option8Value

				myChart8.setOption(option8);

				setTimeout(function(){
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart1.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart2.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart3.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart4.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart5.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart5.dispatchAction({
						type: 'pieSelect',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart5.on('click',function(params){
						myChart5.dispatchAction({
							type: 'pieUnSelect',
							seriesIndex:0,  // 显示第几个series
							dataIndex: 2 // 显示第几个数据
						});
					})
					myChart6.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart7.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
					myChart8.dispatchAction({
						type: 'showTip',
						seriesIndex:0,  // 显示第几个series
						dataIndex: 2 // 显示第几个数据
					});
				})

			},
			// getUrlParameter(name){
			// 	name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
			// 	var regexS = "[\\?&]"+name+"=([^&#]*)";
			// 	var regex = new RegExp( regexS );
			// 	var results = regex.exec(window.parent.location.href );
			// 	if( results == null ) return ""; else {
			// 		return results[1];
			// 	}
			// },
			// 获取图表数据
			getData(){
				// if(!window.tokenVal){
				// 	return
				// }
				//1申报企业的行业分布 && 2企业人数规模分布
				axios({
					url:`statistics/${this.defOrg.digitalCommerce}/apply/industry`,
					method: "get",
          headers: {
            "Content-Type": " application/json"
					},
				}).then(res => {
					var data = res.data;
					this.data4Y =[];
					this.data4 =[];
					if(this.type ==1){
						if(Object.keys(data).length){
							for(var i in data){
								this.data4Y.push(i);
								this.data4.push(data[i]);
							}
						}else{
							this.data4Y = ['医疗','教育','金融','家电','互联网','化工', '房地产',];
							this.data4 = [this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100)];
						}
					}else{
						this.data4Y = ['1-59','60-99','100-499','500-999','1000-5000','5000以上',];
						this.data4 =  [this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100),this.randomNum(1,100)];
					}
					// 1政策的区域分布2无
					return axios({
						url:`statistics/${this.defOrg.digitalCommerce}/policy/region`,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res => {
					var data = res.data;
					if(Object.keys(res).length && this.type ==1){
						this.option7Label = [];
						this.option7Value = [];

						this.dt = [];
						var labelArr = [];
						var qingdao = "";
						for(var i in data){
							var a = "";
							switch (i) {
								case '370202':
									a='市南区'; 
									break;
								case '370203':
									a='市北区'; 
									break;
								case '370211':
									a='黄岛区'; 
									break;
								case '370212':
									a='崂山区'; 
									break;
								case '370213':
									a='李沧区'; 
									break;
								case '370214':
									a='城阳区'; 
									break;
								case '370282':
									a='即墨区'; 
									break;
								case '370281':
									a='胶州市'; 
									break;
								case '370283':
									a='平度市'; 
									break;
								case '370285':
									a='莱西市'; 
									break;
								case '370200':
									a='青岛市'; 
									qingdao = data[i]
									break;
								default:
									a = '';
									break;
							}
							if(a){
								this.dt.push({
									name:a,
									value:[data[i],]
								})
								labelArr.push(a);
							}
						}
						for(var i in this.area){
							if(labelArr.indexOf(this.area[i]) ==-1){
								this.dt.push({
									name:this.area[i],
									// value:[this.randomNum(1,100),this.randomNum(1,100)]
									value:[0]
								})
							}
						}
						if(labelArr.indexOf('青岛市') !=-1){
							for(var i in this.dt){
								if(this.dt[i].name != '青岛市'){
									this.dt[i].value[0]+= qingdao;
								}
							}
						}
						for(var i in this.dt){
							this.option7Value.push(this.dt[i].value[0]);
							this.option7Label.push(this.dt[i].name);
						}
					}
					// type1申报企业的区域分布；type2:企业的区域分布
					if(this.type == 1){
						var url = `statistics/${this.defOrg.digitalCommerce}/apply/region`
					}else{
						var url = 'statistics/company/region'
					}
					return axios({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
					res = res.data
					if(this.type == 1){
						if(Object.keys(res).length && this.option7Label.length){
							this.option8Label = [];
							this.option8Value = [];
							var labelArr = [];
							var dt8 = [];
							var qingdao = "";
							for(var i in res){
								var a = "";
								switch (i) {
									case '370202':
										a='市南区'; 
										break;
									case '370203':
										a='市北区'; 
										break;
									case '370211':
										a='黄岛区'; 
										break;
									case '370212':
										a='崂山区'; 
										break;
									case '370213':
										a='李沧区'; 
										break;
									case '370214':
										a='城阳区'; 
										break;
									case '370282':
										a='即墨区'; 
										break;
									case '370281':
										a='胶州市'; 
										break;
									case '370283':
										a='平度市'; 
										break;
									case '370285':
										a='莱西市'; 
										break;
									case '370201':
										a='青岛市'; 
										qingdao = res[i]
										break;
									default:
										a = '';
										break;
								}
								if(a){
									dt8.push({
										name:a,
										value:res[i]
									})
									labelArr.push(a);
								}
							}
							for(var i in this.area){
								if(labelArr.indexOf(this.area[i]) ==-1){
									dt8.push({
										name:this.area[i],
										// value:[this.randomNum(1,100),this.randomNum(1,100)]
										value:0
									})
								}
							}
							if(labelArr.indexOf('青岛市') !=-1){
								for(var i in dt8){
									if(dt8[i].name != '青岛市'){
										dt8[i].value+= qingdao;
									}
								}
							}
							for(var i in this.dt){
								for(var j in dt8){
									if(dt8[j].name == this.dt[i].name){
										this.dt[i].value[1] = dt8[j].value
										break
									}
								}
							}
							for(var i in this.dt){
								this.option8Label.push(this.dt[i].name);
								this.option8Value.push(this.dt[i].value[1]);	
							}
						}else if(!Object.keys(res).length && this.option7Label.length){
							this.option8Value = [];
							this.option8Label = this.option7Label;
						
							for( var i in this.option7Label){
								this.dt[i].value[1] = this.randomNum(1,100);
							}
						}
					}else{
						if(Object.keys(res).length){
							this.option8Label = [];
							this.option8Value = [];
							this.dt = [];
							var labelArr = [];
							var qingdao = "";
							for(var i in res){
								var a = "";
								switch (i) {
									case '370202':
										a='市南区'; 
										break;
									case '370203':
										a='市北区'; 
										break;
									case '370211':
										a='黄岛区'; 
										break;
									case '370212':
										a='崂山区'; 
										break;
									case '370213':
										a='李沧区'; 
										break;
									case '370214':
										a='城阳区'; 
										break;
									case '370282':
										a='即墨区'; 
										break;
									case '370281':
										a='胶州市'; 
										break;
									case '370283':
										a='平度市'; 
										break;
									case '370285':
										a='莱西市'; 
										break;
									case '370200':
										a='青岛市'; 
										qingdao = res[i]
										break;
									default:
										break;
								}
								this.dt.push({
									name:a,
									value:[res[i],]
								})
								labelArr.push(a);
							}
							for(var i in this.area){
								if(labelArr.indexOf(this.area[i]) ==-1){
									this.dt.push({
										name:this.area[i],
										// value:[this.randomNum(1,100),this.randomNum(1,100)]
										value:[0]
									})
								}
							}
							if(labelArr.indexOf('青岛市') !=-1){
								for(var i in this.dt){
									if(this.dt[i].name != '青岛市'){
										this.dt[i].value[0]+= qingdao;
									}
								}
							}
							for(var i in this.dt){
								this.option8Value.push(this.dt[i].value[0]);
								this.option8Label.push(this.dt[i].name);
							}
						}
					}
					// type1:政策的行业分布&& type2:企业的按行业分布
					if(this.type ==1 ){
						var url = `statistics/${this.defOrg.digitalCommerce}/policy/industry`
					}else{
						var url ='statistics/company/industry'
					}
					return axios({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})

				}).then(res=>{
					res = res.data
					if(Object.keys(res).length){
						this.data5 = [];
						for(var i in res){
							this.data5.push({
								value:res[i],
								name:i
							});
						}
					}
					// type1:企业数量&&type2：商会数量
					if(this.type == 1){
						var url = `statistics/company/count/${7}`
					}else{
						var url = `statistics/channel/${1}/count/${7}`
					}
					return axios({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})

				}).then(res =>{
					res = res.data
					// console.log(res,'dataX')
					if(Object.keys(res).length){
						this.option =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.option.push({
								dataX:a,
								data:res[i]
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								// console.log(this.time[i],this.option,'不存在')
								this.option.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.option.sort(this.sortRule);
						for(var item of this.option){
							item.dataX  = new Date(item.dataX).Format('MM月dd')
						}
						this.dataX = [];
						this.data = [];
						for(var i in this.option){
							this.dataX.push(this.option[i].dataX)
							this.data.push(this.option[i].data)
						}
					}

					// type1:商协会数量&&type2：协会数量
					if(this.type == 1){
						var url =`statistics/channel/${0}/count/${7}`
					}else{
						var url = `statistics/channel/${2}/count/${7}`
					}
					return axios({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
					res = res.data
					if(Object.keys(res).length){
						this.option1 =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.option1.push({
								dataX:a,
								data:res[i]
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								// console.log(this.time[i],this.option,'不存在')
								this.option1.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.option1.sort(this.sortRule);
						for(var item of this.option1){
							item.dataX  = new Date(item.dataX).Format('MM月dd')
						}
						this.dataX1 = [];
						this.data1 = [];
						for(var i in this.option1){
							this.dataX1.push(this.option1[i].dataX)
							this.data1.push(this.option1[i].data)
						}
					}
					return axios({
						url:`statistics/${this.defOrg.digitalCommerce}/apply/count/${7}`,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
					res = res.data
					if(Object.keys(res).length){
						this.option2 =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.option2.push({
								dataX:a,
								data:res[i]
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								this.option2.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.option2.sort(this.sortRule);
						for(var item of this.option2){
							item.dataX  = new Date(item.dataX).Format('MM月dd')
						}
						this.dataX2 = [];
						this.data2 = [];
						for(var i in this.option2){
							this.dataX2.push(this.option2[i].dataX)
							this.data2.push(this.option2[i].data)
						}
					}
					return axios({
						url:'./h5/lib/js/qingdao.json',
						// url:'./lib/js/qingdao.json',
						baseURL:'/',
						method: "get",
						headers: {
							"Content-Type": " application/json",
							'api-client':'',
							'api-version':'',
							'authorization':''
						},
						data:{}
					})
				}).then(res=>{
					this.geoJson = res.data;
					this.echartsDate();
				})
			},
			// 调用APP方法返回
			// toLayer(){
			// 	// 	document.body.removeAttribute('class')
			// 	var phone = '';
			// 	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
			// 			phone = 'ios';
			// 	} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
			// 			phone = 'Android';
			// 	} else { //pc
			// 	};
			// 	if(phone == 'Android'){
			// 		return window.jump.backHome();
			// 	}else if(phone == 'ios'){
			// 		return window.webkit.messageHandlers.backHome.postMessage(null);
			// 	}
			// }

		},
		created() {
			if(getUrlParameter('type')){
				if(getUrlParameter('type') ==4){
					this.type = 2
				}else if(getUrlParameter('type') ==5){
					this.type = 1
				}
			}else{
				this.type = 2
			}
			this.defOrg.digitalCommerce = getUrlParameter('digitalCommerce');
			document.title = this.type==1?'青岛市商务局':'青岛市工商业联合会';
			this.getTime();

		},
		mounted() {
			// if(getUrlParameter('isAuthor') == 0){
			// 	document.getElementsByTagName('body')[0].className = 'body';
			// }
			var that = this;
			if(this.type==1){
				this.title = '政策触达企业数量';
				this.title3 = '政策的行业分布';
				this.title4 = '申报企业的行业分布';
				this.data4Y = ['医疗','教育','金融','家电','互联网','化工', '房地产',]
				this.data4 =  [22,16,10,25,30,15,20];
				this.title9 = '申报企业区域分布TOP';
			}else{
				this.title3 = '企业的行业分布';
				this.title4 = '企业人数规模分布';
				this.data4Y = ['1-59','60-99','100-499','500-999','1000-5000','5000以上',];
				this.data4 =  [22,16,10,25,30,15];
				this.title9 = '企业区域分布TOP';
			}
			window.getUserToken = function(token) {
				axios.defaults.headers['Authorization'] ='Bearer '+ token;
				that.getData();
			}
			// pc显示
			// axios.defaults.headers['Authorization'] ='Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODU2Mzk1OTczNyIsImF1dGgiOiJST0xFX1VTRVIsUk9MRV9INSIsInRva2VuX3VzZXJfaWQiOiI2MjY4YmE0MTdkYzYxMWU5OWQzMTAwMTYzZTA1ZmY2NiIsInRva2VuX2VudGl0eV9pZHMiOiJ7XCI1ZTkzNWFjZmE1ZjA4ZTdhZTcxYjU1NTdcIjpcIjBAOVwiLFwiNWU4OGQxY2Y2YjAzNjZkZDljZjAxZTUwXCI6XCIwQDlcIixcIjVlODhkMWNmNmIwMzY2ZGQ5Y2YwMWU1MVwiOlwiMEA5XCIsXCI1ZThlY2RlYjNlNDM0NjNmZDQ2NjgyMDdcIjpcIjBAOVwiLFwiNWU5NDBkNDRhNWYwOGU3YWU3MWI4NjYyXCI6XCIwQDlcIixcIjVlYTZhNzFjYTVmMDhlN2FlNzFmYTMzNlwiOlwiMEA5XCJ9IiwiZXhwIjoxNTk0MTg2NjgyfQ.4G6X4Y0AFUbGqVH-BHQznk1Lh5K--Pyn7ZCPC02LLNI';
			// that.getData();
		}
	})

}
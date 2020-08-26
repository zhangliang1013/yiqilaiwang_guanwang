<template>
	<div>
		<div class="echart" style="min-height: 800px;width: 1080px;margin: 0 auto;">
			<div style="background:#0C0B34" class="container-fluid office-efficiency-index" >
				<!-- <div id="main" style="width:500px;height:500px"></div> -->
				<div class="row  office-header-content clear" style="padding:0 0 20px 0">
					<div class="col-md-4 pd clear">

						<div  class="col-info row" :style="{'height': type==1?'270':'400' + 'px'}">
							<!-- 头部标题 -->
							<ul class="clear title">
								<li class="fl clear">
									<p class="fl">{{defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"?'政策触达企业数量':'已上线商会数量'}}</p>
								</li>
								<li class="fr clear" style="cursor:pointer"> 
									<p class="fl circle"></p><p class="fl">{{defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"?'企业':'商会'}}数量</p>
									<div class="fl" @click="toPage('/memberList/1')" v-if="defOrg&&defOrg.digitalCommerce=='5e88d1cf6b0366dd9cf01e50'">
										<p class="fl title-left" style="color:#02CCFE">查看详情</p>
										<img class="fl icon"  src="./../assets/img/gslsjdp1@3x.png" alt="">
									</div>
								</li>
							</ul>
							<div class="content base-info col-md-12 pd" id="main" ></div>
						</div>

						<div  class="col-info row" :style="{'height': type==1?'270':'400' + 'px'}">
							<div class="content base-info  col-md-12 pd" id="main5" ></div>
						</div>

						<div  v-if="type==1" :class="type==1?'col-info row':'' ">
							<div class="content base-info col-md-12 pd" id="main2" ></div>
						</div>
					</div>
					<!-- 2列 -->
					<div class="col-md-4 pd row" v-if="type">
							<div class="select clear">
								<div class="fr">
									<Select 
										v-model="preArea"
										placeholder="选择区域"
										label-in-value
										class="fl"
										@on-change="areaChange">
										<Option value="全青岛" label='全青岛'>全青岛</Option>
										<Option
											:value="item"
											:label="item"
											v-for="(item,index) in area"
											:key="index"
										>{{item}}</Option>
									</Select>
								</div>
								<div class="fr text">区域选择</div>
							</div>
							<div class="height-map" :class="{'height-map1':type==2}" id="main6"></div>
							<div class="bar clear" :style="{'margin-left':type==2?'100':'6'+ 'px'}">
								<div class='height1' :class="{ 'height2' : type==2}">
									<div class="fl item" style="height:100%;width:49%;" id="main7" v-show="type==1"></div>
									<div class="fl item" style="height:100%;width:49%;" id="main8" ></div>
								</div>
							</div>
					</div>
					<!-- 3列 -->
					<div class="col-md-4 pd clear">

						<div  class="col-info row" :style="{'height': type==1?'27':'400' + 'px'}">
							<ul class="clear title">
								<li class="fl clear">
									<p class="fl">{{defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"?'政策触达商协会数量':'已上线协会数量'}}</p>
								</li>
								<li class="fr clear" style="cursor:pointer"> 
									<p class="fl circle"></p><p class="fl">{{defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"?'商协会数量':'协会数量'}} </p>
									<div class="fl" @click="toPage('/memberList/2')" v-if="defOrg&&defOrg.digitalCommerce=='5e88d1cf6b0366dd9cf01e50'">
										<p class="fl title-left" style="color:#02CCFE">查看详情</p>
										<img class="fl icon"  src="./../assets/img/gslsjdp1@3x.png" alt="">
									</div>
								</li>
							</ul>
							<div class="content base-info col-sm-12 col-md-12 pd" id="main1" ></div>
						</div>

						<div  class="col-info row" :style="{'height': type==1?'27':'400' + 'px'}">
							<div class="content base-info col-sm-12 col-md-12 pd" id="main4" ></div>
						</div>

						<div  :class="type==1?'col-info row':'' " style="height:270px" v-show="type==1">
						<!-- <div class="content base-info" id="main1" style="width:616px;height:340px"></div> -->
							<div class="content base-info col-sm-12 col-md-12 pd" id="main3" ></div>
						</div>
					</div>

					<div class="clear fl" style="width:100%;">
						<!-- 工商联商会活跃度9 -->
						<div v-if="type==2" class="col-info row fl" :style="{'height': type==1?'270':'400' + 'px','width':'49.5%','margin-right':'10px'}">
							<!-- 头部标题 -->
							<ul class="clear title">
								<li class="fl clear" style="cursor:pointer"> 
									<p class="fl circle"></p><p class="fl">商会活跃度</p>
								</li>
								<li class="fr clear" style="cursor:pointer" title="该数值基于组织对工商联通知、活动、调查问卷的反馈情况进行统计"> 
									<img src="./../assets/img/describe.png" alt="" style="width:26px;height:26px;margin:0px 20px 0 0">
								</li>
							</ul>
							<div class="content base-info col-md-12 pd" id="main9"></div>
						</div>
						<!-- 工商联协会活跃度10 -->
						<div  class="col-info row fr" :style="{'height': type==1?'27':'400' + 'px','width':'49%'}" v-show="type==2">
							<ul class="clear title">
								<li class="fl clear" style="cursor:pointer"> 
									<p class="fl circle"></p><p class="fl">协会活跃度</p>
								</li>
								<li class="fr clear" style="cursor:pointer" title="该数值基于组织对工商联通知、活动、调查问卷的反馈情况进行统计"> 
									<img src="./../assets/img/describe.png" alt="" style="width:26px;height:26px;margin:0px 20px 0 0">
								</li>
							</ul>
							<div class="content base-info col-sm-12 col-md-12 pd" id="main10" ></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	var echarts = require('echarts');
	import geoJson  from "./../assets/qingdao.json";
	export default {
		inject: ['reload'],
		name:"echarts",
		props: {
			personalInfo: null,
			defOrg: null,
			login:"",
		},
		data(){
			return{
				height1:300,
				height2:280,
				// 第一个柱状图
				time:[],
				time1:[],
				box:[],
				dataX:["100","120","140","100","80","100","130","40"],
				data:[],
				// 第二个柱状图
				box1:[],
				dataX1:["100","120","140","100","80","100","130","40"],
				data1:[],
				// 左下个折线图
				box2:[],
				dataX2:["100","120","140","100","80","100","130","40"],
				data2:[],
				title:"已上线商会数量",
				title11:"政策触达企业数量",
				title2:"已上线协会数量",
				title21:"政策触达商协会数量",
				title51:"申报企业数量",
				title5:"企业数量",
				title6:"政策的区域分布TOP",
				title71:"政策查看人次",
				title7:"查看人次",
				title8:"政策的区域分布TOP",
				title9:"申报企业区域分布TOP",
				title10:"商会活跃度",
				"businessTypeAnalysis":{
					"orderNum":["39","77","96","41","24","17","0","10"],
					"avgTime":["100","120","140","100","80","100","130","40"],
				},
				type:'',
				area:['市南区','市北区','黄岛区','崂山区','李沧区','城阳区','即墨区','胶州市','平度市','莱西市',],
				preArea:'全青岛',
				zoom:1.2,
				center:[120.28,36.4],
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
				// 地图
				dt:[
					{name: '市南区', value: [37,30]},
					{name: '市北区', value: [22,20]},
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
				data9X:[],
				data9Y:[],
				data10X:[],
				data10Y:[],
				myChart:null,
				myChart1:null,
				myChart2:null,
				myChart3:null,
				myChart4:null,
				myChart5:null,
				myChart6:null,
				myChart7:null,
				myChart8:null,
				myChart9:null,
				myChart10:null,
				option:{},
				option1:{},
				option2:{},
				option3:{},
				option4:{},
				option5:{},
				option6:{},
				option7:{},
				option8:{},
				option9:{},
				option10:{},
			}
		},
		watch: {
			$route:function() {
				this.reload();
			},
			defOrg(res){
				if(this.defOrg&&this.defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"){
					this.title3 = '政策的行业分布';
					this.title4 = '申报企业的行业分布';
					this.title9 = '申报企业区域分布TOP';
					
				}else{
					this.title3 = '企业的行业分布';
					this.title4 = '企业人数规模分布';	
					this.title9 = '企业区域分布TOP';
				}
				this.getData();
			},
			preArea(val,oldval){
				// console.log(val,oldval)
				this.myChart6.dispatchAction({
					type: 'hideTip',
					seriesIndex:0,  // 显示第几个series
					name: oldval // 显示第几个数据
				});
				this.myChart6.dispatchAction({
					type: 'downplay',
					seriesIndex:0,  // 显示第几个series
					name: oldval// 显示第几个数据
				});
				this.myChart6.dispatchAction({
					type: 'showTip',
					seriesIndex:0,  // 显示第几个series
					name: val // 显示第几个数据
				});
				this.myChart6.dispatchAction({
					type: 'highlight',
					seriesIndex:0,  // 显示第几个series
					name: val // 显示第几个数据
				});
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
					this.time1.push(new Date(this.time[i]).Format('MM月dd日'));
					this.time[i] = new Date(this.time[i]).Format('yyyy/MM/dd ') + '00:00:00';
					this.time[i] = new Date(this.time[i]).getTime();
				}
				this.time.reverse();
				this.time1.reverse();
			},
			toPage(url){
				this.$router.push({
					path: url,
				})
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
				if(this.type ==1){
					var myChart2 = echarts.init(document.getElementById('main2'));
				}else{
					var myChart9 = echarts.init(document.getElementById('main9'));
					var myChart10 = echarts.init(document.getElementById('main10'));
				}
				var myChart3 = echarts.init(document.getElementById('main3'));
				var myChart4 = echarts.init(document.getElementById('main4'));
				var myChart5 = echarts.init(document.getElementById('main5'));
				var myChart6 = echarts.init(document.getElementById('main6'));
				var myChart7 = echarts.init(document.getElementById('main7'));
				var myChart8 = echarts.init(document.getElementById('main8'));
				this.myChart = myChart;
				this.myChart1 = myChart1;
				this.myChart2 = myChart2;
				this.myChart3 = myChart3;
				this.myChart4 = myChart4;
				this.myChart5 = myChart5;
				this.myChart6 = myChart6;
				this.myChart7 = myChart7;
				this.myChart8 = myChart8;
				if(this.type ==2){
					this.myChart9 = myChart9;
					this.myChart10 = myChart10;
				}
				// 第一个柱状图
				var option = {
					tooltip: {
						trigger: 'axis',
						formatter: '{b}<br/>数量：{c}',
						// formatter: function (param) {
						// 	console.log(param)
						// 	param = param[0];
						// 	return [
						// 			' ' + param.name + '<br/>',
						// 			'数量 ' + param.data + '<br/>',
						// 	].join('');
						// }
						
					},
					grid: {
						left:4,right: 4,bottom:40,top:20,
						containLabel:true,
						width:'auto',height:'auto'
					},
					// title: {
						// text: that.title,
					// 	left: 10,
					// 	top: 20,
					// 	textStyle: {
					// 		color: '#fff',
					// 		fontSize:12
					// 	}
					// },
					// 头部设置
					legend: {
						show:false,
						icon: 'rect',
						itemWidth: 14,itemHeight: 5,itemGap:10,
						left: '6px',top: '16px',
						textStyle: {fontSize: 12,color: '#fff'}
					},
					xAxis: [
						{
							type: 'category',
							axisLine: {lineStyle: {color: '#57617B'}},axisLabel: {interval:0,textStyle: {color:'rgba(255, 255, 255, 0.8)',fontSize:10}},
							data:this.dataX.length?this.dataX:this.time1
						}
					],
					yAxis: [{
						type: 'value',
						axisTick: {
							show: false
						},
						axisLine: {lineStyle: {color: '#57617B'}},
						axisLabel: {margin: 0,textStyle: {fontSize: 12},textStyle: {color:'rgba(255, 255, 255, 0.8)'}},
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
							name:this.type==2? this.title:this.title11,
							type:'bar',
							barWidth:20,
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
				// 左边第一个折线图
				var optionZ = {
					legend: {
						// icon: 'rect',
						itemWidth: 14,itemHeight: 5,itemGap:10,
						right: '10px',top: '16px',
						textStyle: {fontSize: 12,color: '#fff'}
					},
					title : {
						text:that.title51,subtext:'',top:'16px',left:'10',
						textStyle: {fontSize: 12,color: '#fff'}
					},
					tooltip: {
						trigger: 'axis',
						formatter: '{b}<br/>数量：{c}',
					},
					grid: {left: '8%',right: '2%',bottom: '10%'},
					xAxis: {
						type: 'category',
						axisLine: {lineStyle: {color: '#57617B'}},
						axisLabel: {interval:0,textStyle: {color:'#fff',},fontSize:10,distance:2},
						data:this.dataX2.length?this.dataX2:this.time1},
					yAxis:[
						{
							type: 'value',name: '',
							axisLine: {lineStyle: {color: '#57617B'}},
							axisLabel: {margin: 10,textStyle: {fontSize: 12},textStyle: {color:'#fff'},formatter:'{value}'},
							splitLine: {show: false},
							minInterval:1,
						},
					],
					series: [
						{
							name:that.title5,
							type:'line',
							yAxisIndex:0,
							smooth: false,
							symbolSize:4,
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
				// 右边中间图
				var option4={
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter: '{b}<br/>数量：{c}',
					},
					legend: {
						// data: ['直接访问'],
						icon: 'none',
						itemWidth: 10,itemHeight: 5,itemGap:10,
						left: 'left',top: '20px',
						textStyle: {fontSize: 12,color: '#fff'},
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						show: false
					},
					yAxis: {
						type: 'category',
						axisLine: {show:false},
						axisTick:false,
						axisLabel: {margin: 10,textStyle: {fontSize: 12},textStyle: {color:'rgba(255, 255, 255, 0.8)'}},
						data: this.data4Y,
						minInterval:1,
					},
					series: [
						{
							name: that.title4,
							type: 'bar',
							barWidth:20,
							stack: '总量',
							label: {
								show: true,
								position: 'insideRight',
								distance : 5,
								color:"#ffffff"
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
											"#67C23A",
										];
										return colorList[params.dataIndex];
									},
									barBorderRadius:[3, 3, 3, 3],
								}
							},
						},
					]
				};
				// 左边中间图
				var option5={
					color:['#02CCFE','#02DEB9','#EECB63','#DF7A7F','#9468E0','#373ED9','#2168EB','#02CCFE','#02DEB9','#EECB63','#DF7A7F','#9468E0','#373ED9','#2168EB',],
					// legend: {
					// 	icon: 'circle',
					// 	itemWidth: 8,itemHeight: 8,itemGap:10,
					// 	right: '6px',top: '16px',
					// 	textStyle: {fontSize: 12,color: '#fff', borderRadius:'50%'},
					// 	orient:'vertical'
					// },

					title: {
						text:  this.title3,
						left: 10,
						top: 20,
						textStyle: {
							color: '#fff',
							fontSize:12
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					series: [
						{
							name: this.title3,
							type: 'pie',
							radius: ['25%', '60%'],
							avoidLabelOverlap: true,
							label: {
								show: true,
								position: 'center'
							},
							top:30,
							emphasis: {
								label: {
									show: true,
									fontSize: '12',
									fontWeight: 'bold'
								}
							},
							label: {
								color: 'rgba(255, 255, 255, 0.8)',
								// margin :'10',
								// position : 'outer',
								// alignTo : 'edge'
							},
							labelLine: {
								lineStyle: {
									color: 'rgba(255, 255, 255, 0.8)'
								},
								smooth: 0.3,
								length: 10,
								length2: 20,
							},
							data:this.data5
						}
					]


				};
				//青岛地图
				var option6={
					// title: {
					//     text: '香港18区人口密度 （2011）',
					//     subtext: '人口密度数据来自Wikipedia',
					//     sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
					// },
					tooltip: {
						show:true,
						trigger: 'item',
						formatter: '{b}<br/>{a0}{a1}',
						backgroundColor :'#243460',
						formatter: function(params) {
							var color = "#FFB84D";
							var a = "<div style='padding: 4px 0px 4px 3px;color:white;font-size: 14px;font-weight:bold'>" + that.dt[params.dataIndex].name + "</div>";
							if(that.type ==1){
								a += "<div style='padding:3px;border-bottom:2px solid #2168EB;margin-bottom:7px;width:140px;display: flex;justify-content: space-between;'><span>政策数量</span>";
							}else{
								a += "<div style='padding:3px;border-bottom:2px solid #2168EB;margin-bottom:7px;width:140px;display: flex;justify-content: space-between;'><span>企业数量</span>";
							}
							a += that.dt[params.dataIndex].value[0] + "<br>";
							a += "</div>";
							if(that.type ==1){
								a += "<div style='padding:3px;border-bottom:2px solid #13ADF7;margin-bottom:4px;width:140px;display: flex;justify-content: space-between;';><span>申报企业数量</span>";
									a += that.dt[params.dataIndex].value[1] + "<br>";
								a += "</div>";
							}
							return a;
						}
					},
					series: [
						{
							roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
							// zoom: 1.20,
							center: this.center,
							zoom: this.zoom,
							selectedMode:'single',
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
										color: "#fff"
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
									color:"#fff"
								}
							},
							data: that.dt,
							markPoint:{
								symbol:"circle"
							}
						}
					]
				}
				echarts.registerMap('qingdao', geoJson);
				// 绘制图表
				myChart.setOption(option);
				option.series[0].name = that.title
				var option1 = option;
				option1.series[0].name = this.type==1? this.title21:this.title2;
				option1.xAxis.data = this.dataX1.length?this.dataX1:this.time1;
				option1.series[0].data = this.data1;
				myChart1.setOption(option1);
				if(this.type ==1){
					myChart2.setOption(optionZ);
				}
				// 右边第三个折线图
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
				optionZ1.series[0].itemStyle.normal.color = 'rgba(134, 76, 185, 1)'
				optionZ1.series[0].data = ["100","120","140","100","80","100","130",]
				myChart3.setOption(optionZ1);

				myChart4.setOption(option4);

				myChart5.setOption(option5);
				myChart6.setOption(option6);


				// myChart6.dispatchAction({
				// 	type: 'showTip',
				// 	seriesIndex:0,  // 显示第几个series
				// 	dataIndex: 1 // 显示第几个数据
				// });
				// myChart6.dispatchAction({
				// 	type: 'highlight',
				// 	seriesIndex:0,  // 显示第几个series
				// 	dataIndex: 1 // 显示第几个数据
				// });

				// 中间第一个柱状图
				var option7 = option4;
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
				option7.series[0].barWidth=16;
				option7.series[0].barMaxHeight=30,  //最大柱高
				option7.grid= {
					left: '1%',
					right: '1%',
					bottom: '0%',
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
				option7.yAxis.data = this.option7Label.length?this.option7Label:option7Label;
				option7.yAxis.inverse = "true";
				option7.yAxis.minInterval = 1;
				option7.series[0].data = this.option7Value.length?this.option7Value:option7Value;
				myChart7.setOption(option7);

				// 中间第二个柱状图
				var option8 = option7;
				option8.yAxis.position = 'right';
				option8.yAxis.minInterval = 1;
				option8.series[0].name = that.title9;
				option8.grid= {
					left: '10%',
					right: '1%',
					bottom: '0%',
					containLabel: true
				};
				option8.yAxis.data = this.option8Label.length?this.option8Label:option8Label;
				option8.yAxis.inverse = "true";
				option8.series[0].data = this.option8Value.length?this.option8Value:option8Value
				myChart8.setOption(option8);

				// 工商联商协会活跃度
				var option9 = option;
				var option10 = option;
				option9.tooltip.formatter = '{b}<br/>活跃度：{c}';
				option9.grid.bottom = 50;
				option9.xAxis[0].data = this.data9X;
				option9.xAxis[0].axisLabel.lineHeight = 12;
				option9.xAxis[0].axisLabel.formatter = function(params){
					var newParamsName = "";// 最终拼接成的字符串
					var paramsNameNumber = params.length;// 实际标签的个数
					var provideNumber = 4;// 每行能显示的字的个数
					var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
					/**
					* 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
					*/
					// 条件等同于rowNumber>1
					if (paramsNameNumber > provideNumber) {
						/** 循环每一行,p表示行 */
						for (var p = 0; p < rowNumber; p++) {
								var tempStr = "";// 表示每一次截取的字符串
								var start = p * provideNumber;// 开始截取的位置
								var end = start + provideNumber;// 结束截取的位置
								// 此处特殊处理最后一行的索引值
								if (p == rowNumber - 1 && rowNumber < 3) {
										// 最后一次不换行
										tempStr = params.substring(start, paramsNameNumber);
								} else if(p < 2){
										// 每一次拼接字符串并换行
										tempStr = params.substring(start, end) + "\n";
								}else if(p ==2){
									if(start+3 >= paramsNameNumber){
										tempStr = params.substring(start, start+3);
									}else{
										tempStr = params.substring(start, start+3) + '...';
									}
								}
								newParamsName += tempStr;// 最终拼成的字符串
						}

					} else {
						// 将旧标签的值赋给新标签
						newParamsName = params;
					}
					//将最终的字符串返回
					return newParamsName
				}
				option10.tooltip.formatter = '{b}<br/>活跃度：{c}';
				option10.grid.bottom = 50;
				option10.xAxis[0].axisLabel.lineHeight = 12;
				option10.xAxis[0].axisLabel.formatter = function(params){
					var newParamsName = "";// 最终拼接成的字符串
					var paramsNameNumber = params.length;// 实际标签的个数
					var provideNumber = 4;// 每行能显示的字的个数
					var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
					/**
					* 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
					*/
					// 条件等同于rowNumber>1
					if (paramsNameNumber > provideNumber) {
						/** 循环每一行,p表示行 */
						for (var p = 0; p < rowNumber; p++) {
								var tempStr = "";// 表示每一次截取的字符串
								var start = p * provideNumber;// 开始截取的位置
								var end = start + provideNumber;// 结束截取的位置
								// 此处特殊处理最后一行的索引值
								if (p == rowNumber - 1 && rowNumber < 3) {
										// 最后一次不换行
										tempStr = params.substring(start, paramsNameNumber);
								} else if(p < 2){
										// 每一次拼接字符串并换行
										tempStr = params.substring(start, end) + "\n";
								}else if(p ==2){
									if(start+3 >= paramsNameNumber){
										tempStr = params.substring(start, start+3);
									}else{
										tempStr = params.substring(start, start+3) + '...';
									}
								}
								newParamsName += tempStr;// 最终拼成的字符串
						}

					} else {
						// 将旧标签的值赋给新标签
						newParamsName = params;
					}
					//将最终的字符串返回
					return newParamsName
				}
				
				option9.series[0].data = this.data9Y;
				myChart9.setOption(option9);

				option10.xAxis[0].data = this.data10X;
				option10.series[0].data = this.data10Y;
				myChart10.setOption(option10);
				this.option = option;
				this.option1 = option1;
				this.option2 = optionZ;
				this.option3 = optionZ1;
				this.option4 = option4;
				this.option5 = option5;
				this.option6 = option6;
				this.option7 = option7;
				this.option8 = option8;
				this.option9 = option9;
				this.option10 = option10;
			},
			// 获取图表数据
			getData(){
				//1申报企业的行业分布 && 2企业人数规模分布
				this.http.ajax({
					url:`statistics/${this.defOrg.digitalCommerce}/apply/industry`,
					method: "get",
          headers: {
						"Content-Type": "application/json",
					},
				}).then(res => {
					var data = res;
					this.data4Y =[];
					this.data4 =[];
					if(this.type ==1){
						if(Object.keys(res).length){
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
					return this.http.ajax({
						url:`statistics/${this.defOrg.digitalCommerce}/policy/region`,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res => {
					var data = res;
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
					return this.http.ajax({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
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
					return this.http.ajax({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})

				}).then(res=>{
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
					return this.http.ajax({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})

				}).then(res =>{
					// console.log(res)
					if(Object.keys(res).length){
						this.box =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.box.push({
								dataX:a,
								data:res[i],
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								// console.log(this.time[i],this.box,'不存在')
								this.box.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.box.sort(this.sortRule);
						for(var item of this.box){
							item.dataX  = new Date(item.dataX).Format('MM月dd日')
						}
						this.dataX = [];
						this.data = [];
						for(var i in this.box){
							this.dataX.push(this.box[i].dataX)
							this.data.push(this.box[i].data)
						}
					}

					// type1:商协会数量&&type2：协会数量
					if(this.type == 1){
						var url =`statistics/channel/${0}/count/${7}`
					}else{
						var url = `statistics/channel/${2}/count/${7}`
					}
					return this.http.ajax({
						url:url,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
					if(Object.keys(res).length){
						this.box1 =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.box1.push({
								dataX:a,
								data:res[i]
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								// console.log(this.time[i],this.box1,'不存在')
								this.box1.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.box1.sort(this.sortRule);
						for(var item of this.box1){
							item.dataX  = new Date(item.dataX).Format('MM月dd')
						}
						this.dataX1 = [];
						this.data1 = [];
						for(var i in this.box1){
							this.dataX1.push(this.box1[i].dataX)
							this.data1.push(this.box1[i].data)
						}
					}
					return this.http.ajax({
						url:`statistics/${this.defOrg.digitalCommerce}/apply/count/${7}`,
						method: "get",
						headers: {
							"Content-Type": " application/json"
						},
					})
				}).then(res=>{
					if(Object.keys(res).length){
						this.box2 =[];
						var time = [];
						for(var i in res){
							let a = i;
							a = a.replace('年','/');
							a = a.replace('月','/');
							a = a.replace('日',' ');
							a = a + '00:00:00';
							a = new Date(a).getTime();
							this.box2.push({
								dataX:a,
								data:res[i]
							})
							time.push(a)
						}
						for(var i in this.time){
							if(time.indexOf(this.time[i]) ==-1){
								// console.log(this.time[i],this.box2,'不存在')
								this.box2.push({
									dataX:this.time[i],
									data:0
								})
							}
						}
						this.box2.sort(this.sortRule);
						for(var item of this.box2){
							item.dataX  = new Date(item.dataX).Format('MM月dd')
						}
						this.dataX2 = [];
						this.data2 = [];
						for(var i in this.box2){
							this.dataX2.push(this.box2[i].dataX)
							this.data2.push(this.box2[i].data)
						}
					}
					return this.http.ajax({
						url:'../../webSite/businessGov/getBusinessAssociationActivity',
						method: "post",
						headers: {
							"Content-Type": " application/json"
						},
						data:{
							entityId:this.defOrg.digitalCommerce
						}
					})
				}).then(res=>{
					// console.log(res);
					if(Object.keys(res).length){
						if(res.data.business.length){

							var data9 = [];
							for(var i in res.data.business[0]){
								data9.push({
									data9X:i,
									data9Y:res.data.business[0][i]
								})
							}
							// console.log(data9)
							data9.sort(function(a,b){
								return b.data9Y-a.data9Y
							})
							this.data9X = [];
							this.data9Y = [];
							for(var item of data9){
								this.data9X.push(item.data9X)
								this.data9Y.push(item.data9Y)
							}

						}
						if(res.data.association.length){
							var data10 = [];
							for(var i in res.data.association[0]){
								data10.push({
									data10X:i,
									data10Y:res.data.association[0][i]
								})
							}
							data10.sort(function(a,b){
								return b.data10Y-a.data10Y
							})
							this.data10X = [];
							this.data10Y = [];
							for(var item of data10){
								this.data10X.push(item.data10X)
								this.data10Y.push(item.data10Y)
							}
						}
					}
					layer.closeAll('loading');
					this.echartsDate();
				}).catch(error=>{
					// console.log(error)
					layer.closeAll('loading');
				})
			},
			areaChange(e){
				// console.log(e)
				this.preArea = e.label;
				switch (e.label) {
					case "全青岛":
						this.zoom = 1.2;
						this.center = [120.28,36.4];
						break;
					case "市南区":
						this.zoom = 10;
						this.center = [120.36,36.05];
						break;
					case "市北区":
						this.zoom = 10;
						this.center = [120.36,36.1];
						break;
					case "黄岛区":
						this.zoom = 2.2;
						this.center = [119.9,35.86];
						break;
					case "崂山区":
						this.zoom = 4.5;
						this.center = [120.58,36.2];
						break;
					case "李沧区":
						this.zoom = 8;
						this.center = [120.4,36.2];
						break;
					case "城阳区":
						this.zoom = 3.5;
						this.center = [120.34,36.3];
						break;
					case "即墨区":
						this.zoom = 2;
						this.center = [120.6,36.4];
						break;
					case "胶州市":
						this.zoom = 2;
						this.center = [119.9,36.3];
						break;
					case "平度市":
						this.zoom = 2;
						this.center = [120.0,36.85];
						break;
					case "莱西市":
						this.zoom = 3;
						this.center = [120.4,36.85];
						break;
					default:
						this.zoom = 1.2;
						this.center = [120.28,36.4];
						break;
				}
				this.option6.series[0].center=this.center;
				this.option6.series[0].zoom=this.zoom;
				// console.log(this.option6)
				this.myChart6.setOption(this.option6);
			}
		},
		created() {
			this.type = this.$route.params.page;
			this.getTime()
			layer.load(1);
		},
		mounted() {
			if(this.defOrg&&this.defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"){
				this.title3 = '政策的行业分布';
				this.title4 = '申报企业的行业分布';
				this.title9 = '申报企业区域分布TOP';
			}else{
				this.title3 = '企业的行业分布';
				this.title4 = '企业人数规模分布';	
				this.title9 = '企业区域分布TOP';
			}
			this.getData();
		},
		beforeDestroy(){
			// console.log('清除加载')
			layer.closeAll('loading');
		}
	}
</script>

<style lang="less">

	.echart{
		.height-map{
			height:514px;
			width:360px
		}
		.height-map1{
			height:520px;
		}
		.height1{
			height:314px;
		}
		.height2{
			height:286px;
			display: flex;
			justify-content: center;
		}
		.col-md-4 {
			width: 33.33333333%;
			float: left;
		}
		.container-fluid {
			margin-right: auto;
			margin-left: auto;
		}
		.container-fluid:after, .container-fluid:before{
			display: table;
			content: " ";
		}
		.col-md-12,.col-md-4{
			position: relative;
			min-height: 1px;
		}
		.col-md-12 {
			width: 100%;
			float: left;
		}
		.office-efficiency-index{font-family:PingFangSC-Semibold,PingFang SC;background-color:#22284A;background-size:cover;}
		.office-efficiency-index .col-info{height:270px;margin:0px 0px 20px 0px;border-radius:8px; background-color:rgba(15, 14, 62, 1);}
		.office-efficiency-index .col-info .content{height:100%;line-height:4rem;vertical-align:middle;}
		
		.title{
			padding-top: 6px;
			margin-left: 6px;
			padding:6px 6px 0;
			li{
				color:#fff;
				p{
					height:22px;
					line-height:22px;
					font-size:13px;
					font-family:PingFangSC-Medium,PingFang SC;
					color:rgba(255,255,255,1);
				}
				.title-left{
					margin-left:70px;
				}
				.circle{
					width:9px;
					height:9px;
					border-radius:50%;
					background:#2168EB;
					margin-top: 7px;
					margin-right:4px;
				}
				.icon{
					width:auto;
					height:11px;
					margin-left:4px;
					margin-top:7px;
				}
			}
		}
		// 区域选择
		.select{
			.text{
				font-size:14px;
				font-family:MicrosoftYaHei;
				color:rgba(255,255,255,1);
				line-height:32px;
				margin-right:10px;
			}
			.ivu-select{
				font-size:14px;
				font-family:MicrosoftYaHei;
				color:rgba(255,255,255,1);
				line-height:19px;
				// margin-right: 2px;
			}
			.ivu-select-selection{
				border:none;
				height:auto;
				.ivu-select-selected-value{
					border:1px solid #3D588B;
				}
			}
			.ivu-select-placeholder{
				background:#243460;
				color:#02CCFE;
				height: 31px;
    		line-height: 31px;
			}
			.ivu-icon-ios-arrow-down:before {
				content: "\F116";
				color: #02CCFE;
			}
			.ivu-select .ivu-select-dropdown{
				max-height:400px;
				height:auto;
				background:#243460;
				width: 80px;
			}
			.ivu-select-item{
				color:#fff;
				padding: 5px 16px;
			}
			.ivu-select-item.ivu-select-item-selected{
				background:#243460;
				color:#02CCFE;
			}
			.ivu-select-item:hover {
				background: #243460;
				color: #02CCFE;
			}
			.ivu-select-selected-value{
				color: #02CCFE;
				background: #243460;
				height: 31px;
    		line-height: 31px;
			}
			.ivu-select-selection{
				width:80px;
			}
		}
	}
</style>
<template style="background: #fff;">
	<div>
		<div class="home_banner" style="background-size:1920px">

		</div>
		<!-- <div id="main" style="width:500px;height:500px"></div> -->
		<!-- <div class="home_cont1">
			<div class="w" style="background-size:508px"><span>活动、信息高效传达</span></div>
		</div>
		<div class="home_cont2">
			<div class="w" style="background-size:550px"><span>信息和任务发布体系便捷</span></div>
		</div>
		<div class="home_cont3">
			<div class="w" style="background-size:432px">
				<span>组织内成员无障碍交流，<br />轻松打理人情往来</span>
			</div>
		</div>
		<div style="background:#fff" >
		<div class=" w">

			<div class="home_title" style="padding-top: 30px;">
				<h1>新闻报道</h1>
			</div>
			<div class="new_list">
				<router-link :to="'/newsArticle?id='+item.id" class="item" v-for="(item,index) in list.rows" :key="index">
					<h3>{{item.newsDigest}}</h3>
					<p v-text="item.newsDigest"></p>
					<span class="time">{{item.createTime.split(' ')[0]}}</span>
					<img :src="item.imageUrl" alt="" class="pic">
				</router-link>
				<div class="tac">
					<div class="btn28 " @click="more" v-if="list.total>list.rows.length">
						查看更多
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>
<script>
	// var echarts = require('echarts');
	export default {
		name: 'index',
		props: {
			msg: String
		},
		data() {
			return {
				list: {
					rows: [],
					total: 0,
				},
				page: 1
			}
		},
		methods: {
			more() {
				var page = this.page;
				if (this.page == 0) {
					return;
				}
				this.http.ajax({
					url: 'webSite/home/newsList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"pageNumber": this.page,
						"pageSize": '4'
					}
				}).then(res => {
					if (res.code == 200) {
						page++
						this.page = page;
						this.list.total = res.data.total;
						if (this.list) {
							this.list.rows = this.list.rows.concat(res.data.rows)
						} else {
							this.list = res.data;
						}
						// console.log(this.list.total, this.list.rows.length, this.list.total > this.list.rows.length);
					}
				})
				this.page = 0;
			}
		},
		created() {
			// this.more();
			// console.log(this.list.total, this.list.rows.length, this.list.total > this.list.rows.lenght);
		},
		// mounted() {
		// 	// 基于准备好的dom，初始化echarts实例
		// 	var myChart = echarts.init(document.getElementById('main'));
		// 	// 绘制图表
		// 	myChart.setOption({
		// 		title: {
		// 			text: 'ECharts 入门示例'
		// 		},
		// 		tooltip: {},
		// 		xAxis: {
		// 			data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
		// 		},
		// 		yAxis: {},
		// 		series: [{
		// 			name: '销量',
		// 			type: 'bar',
		// 			data: [5, 20, 36, 10, 10, 20]
		// 		}]
		// 	});
		// },
	}
</script>

<style lang="less">
	.home_cont1,
	.home_cont2,
	.home_cont3 {
		height: 420px;
		line-height: 420px;
		background: #ffffff;
		width: 100%;

		.w {
			font-size: 40px;
			color: #333333;
			background: url("../assets/img/sy1@2x.png") no-repeat right;

			span {
				vertical-align: middle;
				line-height: 60px;
				display: inline-block;
			}
		}
	}

	.home_cont2 {
		text-align: right;
		background: #fbfbfb;

		.w {
			background: url("../assets/img/sy2@2x.png") no-repeat left;
		}
	}

	.home_cont3 {
		border-bottom: 1px #cccccc solid ;

		.w {
			background: url("../assets/img/sy3@2x.png") no-repeat right;
		}
	}

	.home_banner {
		height: 800px;
		// background:#2168eb;
		// margin:auto;
		// background: #2168eb url("../assets/img/banner1@2x.png") no-repeat center;
		background: #2168eb url("../assets/img/banner.png") no-repeat center;

	}

	.home_title {
		color: #333;
		font-size: 14px;
		text-align: center;
		display: block;
	}

	.new_list {
		padding-bottom: 53px;

		.btn28 {
			margin-top: 39px;
			cursor: pointer;
		}

		.item {
			padding-left: 0px;
			padding-right: 255px;
			position: relative;
			padding-bottom: 19px;
			margin-top: 33px;

			h3 {
				color: #333333;
				font-size: 22px;
				margin-bottom: 7px;
				text-align: left;
			}

			.pic {
				position: absolute;
				width: 101px;
				height: 76px;
				top: 0;
				right: 0;
			}

			p {
				font-size: 14px;
				color: #666666;
				margin-bottom: 3px;
				text-align: left;
			}

			.time {
				color: #999999;
			}

			display: block;
			border-bottom: 1.5px #cccccc dotted;
			// border-bottom: 1px solid #DDDDDD;
		}
	}
</style>

<template>
	<div>
		<div class="w">
			<div class="position">活动审核
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="activitydetails" v-if="detail">
				<div class="title">{{detail.topic}}
					<div class="btn">
						{{detail.status==-1?'草稿':detail.status==0?'报名中':detail.status==1?'进行中':detail.status==2?'已结束':detail.status==3?'已取消':detail.status==4?'未开始':''}}
					</div>
				</div>
				<div class="u">
					<img :src="detail.createUrl" alt="">
					<span class="name">{{detail.createName}}</span>
					<span class="time">{{detail.createTime.substr(0,10)}}发起了活动</span>
				</div>
				<div class="mc">
					<div class="item">
						<img src="../../assets/img/hd1@2x.png" alt="">
						<span>时间</span>
						{{startToEnd}}
					</div>
					<div class="item">
						<img src="../../assets/img/hd2@2x.png" alt="">
						<span>费用</span>
						<span v-if="detail.perCapita>0">{{detail.perCapita}}</span>
						{{detail.chooseConsume==1?'支付':detail.chooseConsume==2?detail.payer+'请客':detail.chooseConsume==3?'免费':detail.chooseConsume==4?'礼金':detail.chooseConsume==5?detail.payer+'慈善捐款自愿缴费':''}}
					</div>
					<div class="item">
						<img src="../../assets/img/hd3@2x.png" alt="">
						<span>地点</span>
						{{detail.actAddress}}
						<img src="../../assets/img/hd5@2x.png" alt="" v-if="detail.actAddress==null ||detail.actAddress==''">
					</div>
					<div class="item">
						<img src="../../assets/img/hd4@2x.png" alt="">
						<span>已报名</span>
						{{detail.applyCount}}人
					</div>
				</div>
				<div class="line"></div>
				<div class="continfo">
					<div class="t">活动主图</div>

					<div>
						<img :src="detail.actPoster" @click="imgtoBig(detail.actPoster)" style="width:400px" class="hand" alt="">
					</div>
				</div>
				<div class="line"></div>
				<div class="continfo">
					<div class="t">内容介绍</div>
					<div class="c" v-html="detail.activityProcess"></div>
					<div class="pic hand">
						<img :src="item" style="margin-left:10px;" @click="imgtoBig(item)" v-for="(item,index) in detail.posterUrl" :key="index" alt="">
					</div>
				</div>

				<!--//活动审核按钮-->
				<div class="bens">
					<div class="btn1 hand" @click="onorgCheckActivity(2)">拒绝</div>
					<div class="btn2 hand" @click="onorgCheckActivity(1)">同意</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'activityaudit',
		props: {
			defOrg: null
		},
		data() {
			return {
				detail: null,
				startToEnd: ''
			}
		},
		methods: {
			imgtoBig(url) {
				layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					shadeClose: true,
					area: [], //宽高
					content: "<img src=" + url + " style='max-width:700px;max-height:800px;overflow-y: scroll; ' />"
				});
			},
			onorgCheckActivity(isCheck) {
				this.http.ajax({
					url: 'webSite/orgCheckActivity',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						id: this.$route.query.id,
						isCheck: isCheck,
						orgId: this.defOrg.id
					}
				}).then(res => {
					if (res.code == 200) {
						layer.msg('审核成功')
						return this.$router.push('/manageactivitylist');
					} else {
						return layer.msg(res.msg);
					}
				})
			},
			// 解析时间格式字符串为 年月日
			parseStringToDate(str) {
				// 解析2019-11-11 00：00：00
				var list = str.split(" ");
				var date = list[0].split("-")
				var time = list[1].split(":")
				var temp = [date, time]
				return temp
			},
			// 判断日期显示格式
			datefomat() {
				var t1 = this.parseStringToDate(this.detail.actStartTime);
				var t2 = this.parseStringToDate(this.detail.actEndTime);
				var t3 = this.parseStringToDate(this.detail.createTime);
				this.detail.createTime = t3[0][0] + '年' + t3[0][1] + '月' + t3[0][2] + '日 '
				if (t1[0][0] != t2[0][0]) {
					// 跨年
					this.startToEnd = t1[0][0] + '年' + t1[0][1] + '月' + t1[0][2] + '日 ' + t1[1][0] + ":" + t1[1][1] + "—" + t2[0][0] +
						'年' + t2[0][1] + '月' + t2[0][2] + '日 ' + t2[1][0] + ":" + t2[1][1]
				} else if (t1[0][1] != t2[0][1]) {
					// 跨月
					this.startToEnd = t1[0][0] + '年' + t1[0][1] + '月' + t1[0][2] + '日 ' + t1[1][0] + ":" + t1[1][1] + "—" + t2[0][1] +
						'月' + t2[0][2] + '日 ' + t2[1][0] + ":" + t2[1][1]
				} else if (t1[0][2] != t2[0][2]) {
					// 跨天
					this.startToEnd = t1[0][0] + '年' + t1[0][1] + '月' + t1[0][2] + '日 ' + t1[1][0] + ":" + t1[1][1] + "—" + t2[0][2] +
						'日 ' + t2[1][0] + ":" + t2[1][1]

				} else {
					this.startToEnd = t1[0][0] + '年' + t1[0][1] + '月' + t1[0][2] + '日 ' + t1[1][0] + ":" + t1[1][1] + "—" + t2[1][0] +
						":" + t2[1][1]
				}

			}
		},
		watch: {

		},
		created() {
			this.http.ajax({
				url: 'webSite/activity/activityDetail',
				method: 'post',
				headers: {
					'Content-Type': ' application/json'
				},
				data: {
					"id": this.$route.query.actId
				}
			}).then(res => {
				if (res.code == 200) {
					this.detail = res.data
					this.datefomat()
					// console.log(res)
				}
			})
		}
	}
</script>

<style lang="less">
	.activitydetails {

		.bens {
			padding: 80px 0;
			text-align: center;

			.btn1 {

				border: 1px solid rgba(153, 153, 153, 1);

			}

			.btn2 {
				color: #ffffff;
				background: #2168eb;
			}

			.btn1,
			.btn2 {
				font-size: 14px;
				display: inline-block;
				width: 140px;
				height: 48px;
				border-radius: 27px;
				line-height: 48px;
				text-align: center;
				margin: 0 20px;
			}
		}

		.baoming {
			padding-top: 28px;
			padding-bottom: 28px;

			.t {
				font-size: 16px;
				font-weight: bold;
				margin-bottom: 18px;
			}

			.tips {
				color: #999999;
				padding-top: 30px;
				margin-bottom: 30px;
			}

			.list {

				.item {
					margin-bottom: 33px;

					.name {
						margin-right: 24px;
						color: #5071ad;
					}

					.z {
						color: #999999;
					}

					.num {
						font-size: 14px;
						color: #c62539;
						margin-right: 13px;
					}

					img {
						display: inline-block;
						vertical-align: middle;
						width: 32px;
						height: 32px;
						background: #eeeeee;
						-webkit-border-radius: 32px;
						-moz-border-radius: 32px;
						border-radius: 32px;
						margin-right: 14px;
					}
				}
			}
		}

		.guanli {
			padding-top: 28px;
			padding-bottom: 28px;

			.t {
				font-size: 16px;
				font-weight: bold;
				margin-bottom: 18px;
			}

			.m {
				margin-left: -15px;

				.item {
					p {
						margin-top: 5px;
						font-size: 14px;
					}

					.pic {
						width: 34px;
						height: 34px;
						position: relative;
						text-align: center;
						width: 62px;
						text-align: center;
						margin: 0 15px;

						span {
							position: absolute;
							width: 18px;
							height: 18px;
							background: rgba(220, 26, 0, 1);
							border-radius: 12px;
							text-align: center;
							line-height: 18px;
							color: #ffffff;
							right: -5px;
							top: -5px;
						}
					}

					display: inline-block;
					text-align: center;
				}
			}

		}

		.continfo {
			margin-top: 28px;
			margin-bottom: 28px;

			.t {
				font-size: 16px;
				font-weight: bold;
			}

			.c {
				margin-top: 5px;
				font-size: 14px;
				img{
					max-width:100%
				}
			}

			.pic {
				padding-top: 5px;

				img {
					width: 68px;
					height: 68px;
					background: #eee;
					display: inline-block;
					border-radius: 4px;
					margin-right: 5px;
				}
			}
		}

		.mc {
			margin-top: 27px;
			margin-bottom: 27px;

			.item {
				display: inline-block;
				font-size: 14px;
				margin-right: 15px;

				span {
					display: inline-block;
					margin-right: 7px;
				}

				img {
					vertical-align: middle;
					margin-right: 5px;
				}

			}
		}

		margin: 0 90px;
		padding-top: 48px;

		.line {
			border-bottom: 1px solid #eee;
		}

		.u {
			margin-top: 20px;

			img {
				width: 32px;
				height: 32px;
				-webkit-border-radius: 32px;
				-moz-border-radius: 32px;
				border-radius: 32px;
				background: #eeeeee;
				margin-right: 13px;
				display: inline-block;
				vertical-align: middle;
			}

			.name {
				font-size: 14px;
				color: #333333;
				margin-right: 13px;
			}

			.time {
				font-size: 14px;
				color: #999999;
			}
		}

		.title {
			font-size: 24px;

			.btn {
				width: 82px;
				height: 34px;
				background: rgba(37, 204, 157, 1);
				border-radius: 21px;
				line-height: 34px;
				text-align: center;
				color: #ffffff;
				font-size: 14px;
				float: right;
			}
		}
	}
</style>

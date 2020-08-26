<template>
	<div>
		<div class="w">
			<div class="position">活动管理
				<span ><router-link :to="'/activitylist?page='+page" >返回</router-link></span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="activitydetails" v-if="detail">
				<div class="title">{{detail.topic}}
					<div class="btn">
						{{detail.status==-1?'草稿':detail.status==0?'未开始':detail.status==1?'进行中':detail.status==2?'已结束':detail.status==3?'已取消':detail.status==4?'未开始':''}}
					</div>
					<!-- <router-link :to="'/activitylist'" class="link">返回</router-link> -->
				</div>
				<div class="u">
					<img :src="detail.createUrl" alt="">
					<span class="name">{{detail.createName}}</span>
					<span class="time">{{detail.createTime}}发起了活动</span>
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

						{{detail.chooseConsume==1?'支付'+detail.perCapita+'元':detail.chooseConsume==2?detail.payer+'请客':detail.chooseConsume==3?'免费':detail.chooseConsume==4?'礼金'+detail.perCapita+'元':detail.chooseConsume==5?detail.payer+'慈善捐款自愿缴费':''}}
					</div>
					<div class="item">
						<img src="../../assets/img/hd3@2x.png" alt="">
						<span>地点</span>
						{{detail.actAddress}}
						<img src="../../assets/img/hd5@2x.png" alt="">
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
						<img :src="detail.actPoster" preview style="width:400px" class="hand" alt="">
					</div>
				</div>
				<div class="line"></div>
				<div class="continfo">
					<div class="t">内容介绍</div>
					<div class="c" v-html="detail.activityProcess" ref='img'></div>
					<div class="pic hand">
						<img :src="item" preview v-for="(item,index) in detail.posterUrl" :key="index" alt="">
					</div>
				</div>
				<div class="line"></div>
				<div class="guanli">
					<div class="t">
						活动管理
					</div>
					
					<div class="m " v-if="detail.status !=-1" style="position:relative;" v-bind:class="nopointer">
						<router-link :to="'/activityrelease?id='+detail.id" class="item" v-if=" detail.status !=2 && detail.status !=3&& detail.status !=1 && personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd6@2x.png" alt="">
							</div>
							<p>修改活动</p>
						</router-link>
						<div class="item grayscale" v-if="(detail.status == 2 ||detail.status == 3||detail.status == 1 )&& personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd6@2x.png" alt="">
							</div>
							<p>修改活动</p>
						</div>
						<div class="item hand" @click="tolayer(1)" v-if="detail.status !=2 && detail.status !=3 && detail.status !=1 && personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd7@2x.png" alt="">
							</div>
							<p>
								<a>取消活动</a>
							</p>

						</div>
						<div class="item grayscale hand" v-if="(detail.status ==2 ||detail.status ==3 || detail.status ==1 ) && personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd7@2x.png" alt="">
							</div>
							<p>取消活动</p>
						</div>
						<router-link :to="'/activitymember?id='+detail.id" class="item" v-if="detail.status !=2 &&detail.status !=3 && personalInfo.id==detail.createUid">
							<div class="num"><span v-if="detail.noCheck>0">{{detail.noCheck}}</span></div>
							<div class="pic">
								<img src="../../assets/img/hd8@2x.png" alt="">
							</div>
							<p>活动审核</p>
						</router-link>
						<div class="item grayscale" v-if="(detail.status ==2 ||detail.status ==3 ) && personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd8@2x.png" alt="">
							</div>
							<p>活动审核</p>
						</div>
						<!-- <router-link :to="'/activitycost?id='+detail.id+'&status='+detail.status" class="item" v-if="detail.status ==2 "> -->
						<router-link :to="'/activitycost?id='+detail.id+'&status='+detail.status" class="item" v-if="personalInfo.id==detail.createUid">
							<div class="pic">
								<img src="../../assets/img/hd9@2x.png" alt="">
							</div>
							<p>费用管理</p>
						</router-link>

						<!-- 	<div class="item grayscale" v-if="detail.status !=2 ">
							<div class="pic">
								<img src="../../assets/img/hd9@2x.png" alt="">
							</div>
							<p>费用管理</p>
						</div> -->

						<router-link :to="'/activitysignup?id='+detail.id" class="item">
							<div class="pic">
								<img src="../../assets/img/hd10@2x.png" alt="">
							</div>
							<p>报名信息</p>
						</router-link>

						<router-link :to="{path: '/everywhere', query: {type:1,id:detail.id,path:'activitydetails?id='+detail.id}}" class="item">
							<div class="pic">
								<img src="../../assets/img/hd11@2x.png" alt="">
							</div>
							<p>导出数据</p>
						</router-link>
						<div class="vue-mask" @click="mask(1)" v-if="detail.recommendStatus ==2 || detail.recommendStatus == 0">
							<p v-if="detail.recommendStatus==2">平台审核不通过</p>
							<p v-if="detail.recommendStatus==0">平台审核中</p>
						</div>
						<div class="vue-mask" @click="mask(1)" v-if="detail.actStatus ==2 || detail.actStatus == 0">
							<p v-if="detail.actStatus==2">组织审核不通过</p>
							<p v-if="detail.actStatus==0">组织审核中</p>
						</div>
					</div>






				</div>


				<!-- 添加二次确认，取消活动确认 -->
				<div class="layer staffeit" v-if="layer==1">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="content">
						<div class="title">安全提示</div>
						<div class="tips">确定要取消该活动吗 </div>
						<div class="btns">
							<div class="btn1 hand" @click="oncancelActivity()">确定</div>
							<div class="btn2 hand" @click="tolayer(0)">我再想想</div>
						</div>
					</div>
				</div>

				<div class="line"></div>
				<div class="baoming" v-if="list&&list.rows">
					<div class="t">已报名
					</div>
					<div class="list">
						<div class="item" v-for="(item,i) in list.rows" :key="i">
							<span class="num">{{i+1}}</span>
							<img :src="item.avatarUrl" alt="">
							<span class="name">{{item.participantName}}</span>
							<span class="z">{{item.identityAuth}}</span>
						</div>
					</div>
					<Page v-if="total>10" :total="total" @on-change="getparticipantList" show-elevator :page-size="10" :show-total="true" />
					<div class="tips">邀请、评论功能请去一起来往手机客户端进一步操作</div>
				</div>
				<!--//活动审核按钮-->
				<!-- <div class="bens">
					<div class="btn1" @click="onorgCheckActivity(2)">拒绝</div>
					<div class="btn2" @click="onorgCheckActivity(1)">同意</div>
				</div> -->
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'activitydetails',
		props: {
			defOrg: null,
			personalInfo:null
		},
		data() {
			return {
				detail: null,
				list: null,
				total: 0,
				layer: 0,
				nopointer: "",
				startToEnd: "",
				page:1,//回退页面页数
			}
		},
		methods: {
			// imgtoBig(url) {
			// 	layer.open({
			// 		type: 1,
			// 		title: false,
			// 		closeBtn: 0,
			// 		shadeClose: true,
			// 		area: [], //宽高
			// 		content: "<img src=" + url + " style='max-width:700px;max-height:800px;overflow-y: scroll; ' />"
			// 	});
			// },
			tolayer(n) {
				this.layer = n
			},
			isnopointer() {
				// return true;

				if (this.detail.recommendStatus == 0 || this.detail.recommendStatus == 2 || this.detail.actStatus == 0) {
					return this.nopointer = 'nopointer';
				}
				return this.nopointer = '';
				// console.log(this.detail);
			},
			// 
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

					}
				})
			},
			oncancelActivity() { //取消活动
				this.http.ajax({
					url: 'webSite/activity/cancelActivity',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"id": this.$route.query.id
					}
				}).then(res => {
					if (res.code == 200) {
						this.flash()

						layer.msg(res.msg)
					}
				})
				this.layer = 0
			},
			getparticipantList(page) {
				this.http.ajax({
					url: 'webSite/act/participation/participantList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"activityId": this.$route.query.id,
						"pageNumber": page,
						"pageSize": 10,
						"type": 1
					}
				}).then(res => {
					if (res.code == 200) {
						this.list = res.data
						this.total = res.data.total;
					}
				})
			},
			// 刷新当前页面
			flash() {
				this.http.ajax({
					url: 'webSite/activity/activityDetail',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"id": this.$route.query.id
					}
				}).then(res => {
					if (res.code == 200) {
						this.detail = res.data
						this.datefomat();
						this.isnopointer()
						// this.detail.actStartTime = new Date(res.data.actStartTime.getTime()).Format(
						// 	"yyyy年MM月dd日 hh:mm:ss");
						// this.detail.actEndTime = new Date(res.data.actEndTime.getTime()).Format(
						// 	"yyyy年MM月dd日 hh:mm:ss");
						// this.detail.createTime = new Date(res.data.createTime.getTime()).Format(
						// 	"yyyy年MM月dd日 hh:mm:ss");


						// console.log(res)
						// console.log("res")
					}
				})
				this.getparticipantList(1);
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
			this.page=this.$route.query.page
			this.http.ajax({
				url: 'webSite/activity/activityDetail',
				method: 'post',
				headers: {
					'Content-Type': ' application/json'
				},
				data: {
					"id": this.$route.query.id,
				}
			}).then(res => {
				if (res.code == 200) {
					this.detail = res.data
					this.datefomat();
					this.isnopointer();
					// this.detail.actStartTime = res.data.actStartTime.Format(
					// 	"yyyy年MM月dd日 hh:mm:ss");
					// this.detail.actEndTime = res.data.actEndTime.Format(
					// 	"yyyy年MM月dd日 hh:mm:ss");
					// this.detail.createTime = new Date(res.data.createTime.getTime()).Format(
					// 	"yyyy年MM月dd日 hh:mm:ss");
					// console.log(res)
					setTimeout(()=>{
						var imgs = this.$refs.img.getElementsByTagName('img');
						for (var i = 0; i < imgs.length; i++) {
							imgs[i].setAttribute('preview','2');
							this.$previewRefresh();
						}
					},1000)
				}
			})
			this.getparticipantList(1);


		}
	}
</script>

<style lang="less">
	.num {
		font-size: 28px;
		position: relative;
		display: inline-block;
		color: #5071ad;

		span {
			width: 24px;
			height: 24px;
			display: block;
			position: absolute;
			background: #dc1a00;
			color: #ffffff;
			text-align: center;
			line-height: 24px;
			-webkit-border-radius: 24px;
			-moz-border-radius: 24px;
			border-radius: 24px;
			font-size: 16px;
			top: -10px;
			right: -28px;
		}
	}

	.staffeit {
		.tips {
			margin-top: 45px;
			text-align: center;
			font-size: 14px;
			color: #333333;
		}

		.btns {
			text-align: center;
			font-size: 0;
			padding-top: 30px;
			margin-bottom: 30px;

			.btn1 {
				border: 1px solid #999999;

			}

			.btn2 {
				border: 1px solid #2168EB;
				background: #2168eb;
				color: #ffffff;
			}

			.btn1,
			.btn2 {
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 22px;
				height: 28px;
				line-height: 28px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

		}

		.mc {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #eee;
			margin: 0 15px;
			display: flex;
			position: relative;

			.label {
				margin-left: 11px;
			}

			.right .label {
				float: left;
				margin-left: 0;
			}

			.ivu-checkbox-checked .ivu-checkbox-inner {
				background: #2d8cf0;
			}

			.ivu-checkbox-inner:after {
				transform: rotate(45deg) scale(1);
			}

			.ivu-checkbox-inner {
				-webkit-border-radius: 50%;
				-moz-border-radius: 50%;
				border-radius: 50%;
				background: #eeeeee;
				transform: scale(1.15);
			}

			.ivu-checkbox-wrapper {
				width: 100%;
			}

			.right .ivu-checkbox {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
			}

			.getcode {
				width: 30%;
				text-align: center;
				line-height: 40px;
				background: #2168eb;
				color: #fff;
			}
		}

		.mt {
			font-size: 16px;
			font-weight: bold;
			line-height: 16px;
			margin-top: 15px;
			margin-left: 15px;
			margin-bottom: 5px;
		}

		.username {
			width: 294px;
			height: 38px;
			background: #fafafa;
			display: block;
			margin: 0 auto;
			text-indent: 15px;
			line-height: 38px;
			margin-top: 11px;
		}

		.content {
			overflow: hidden;
		}

		.title {
			height: 70px;
			background: #2168eb;
			font-size: 20px;
			color: #ffffff;
			line-height: 70px;
			text-align: center;
		}
	}







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


			.vue-mask {
				background-color: rgba(0, 0, 0, 0.4);
				text-align: center;
				// pointer-events: none;
				z-index: 10;
				height: 100px;
				top: -10px;
				width: 100%;
				position: absolute;

				p {
					// z-index:90;
					// margin-top: 5px;
					line-height: 80px;
					font-size: 14px;
					color: #fff;
				}

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

			.link {
				width: 82px;
				height: 34px;
				background-color: blue;
				border-radius: 21px;
				line-height: 34px;
				text-align: center;
				color: #ffffff;
				font-size: 14px;
				float: right;
			}
		}

		.grayscale {
			-webkit-filter: grayscale(100%);
			-moz-filter: grayscale(100%);
			-ms-filter: grayscale(100%);
			-o-filter: grayscale(100%);
			filter: grayscale(100%);
			filter: gray;

		}

		.nopointer {
			pointer-events: none;
			-webkit-filter: grayscale(100%);
			-moz-filter: grayscale(100%);
			-ms-filter: grayscale(100%);
			-o-filter: grayscale(100%);
			filter: grayscale(100%);
			filter: gray;
		}
	}
</style>

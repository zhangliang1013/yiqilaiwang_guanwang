<template>
	<div class="w">
		<div class="position">统计工具
		<!-- <span @click="$router.back(-1)">返回</span> -->
		</div>
		
		<div class="tongji bg">
			<div class="content">
				<!-- <div class="item">
					<router-link to="/admissionreview">
						<div class="num">{{addOrgNumber}}<span v-if="unAddOrgNumber>0">{{unAddOrgNumber}}</span></div>
						<p>入会审核</p>
					</router-link>
				</div>
				<div class="item">
					<router-link to="/manageactivitylist">
						<div class="num">{{activityExamineNumber}}<span v-if="unActivityExamineNumber>0">{{unActivityExamineNumber}}</span></div>
						<p>活动审核</p>
					</router-link>
				</div>
				<div class="item">
					<router-link to="/managearticlelist">
						<div class="num">{{contentExamineNumber}}<span v-if="unContentExamineNumber>0">{{unContentExamineNumber}}</span></div>
						<p>内容审核</p>
					</router-link>
				</div> --> 
				<div @click="routerTo(9,'/managearticlelist?messageType=1')" class="item">
					<div class="num">{{information}}</div>
					<p>已发布资讯</p>
				</div>
				<div  @click="routerTo(8,'/managearticlelist?messageType=3')" class="item">
					<div class="num">{{notice}}</div>
					<p>已发布通知</p>
				</div>
				<div @click="routerTo(7,'/activitylists')" class="item">
					<div class="num">{{act}}</div>
					<p>已发布活动</p>
				</div>
				<div @click="routerTo(7,'/gslDraft?messageType=1')" class="item">
					<div class="num">{{draft}}</div>
					<p>草稿箱</p>
				</div>
				<div  @click="routerTo(8,'/managearticlelist?messageType=16')" class="item">
					<div class="num">{{question}}</div>
					<p>已发布调查问卷</p>
				</div>
				<div  @click="routerTo(8,'/managearticlelist?messageType=17')" class="item">
					<div class="num">{{question}}</div>
					<p>签到统计</p>
				</div>
				<!-- <div  @click="routerTo(10,'/managearticlelist?messageType=2')" class="item">
					<div class="num">{{resourcesNumber}}</div>
					<p>资源</p>
				</div> -->
				<!-- <div  @click="routerTo(7,'/activitylist?messageType=5')" class="item">
					<div class="num">{{houseNumber}}</div>
					<p>会员之家</p>
				</div>
				<div  @click="routerTo(11,'/managearticlelist?messageType=4')" v-if="defOrg.authStatus==2" class="item">
					<div class="num">{{partyBuildingNumber}}</div>
					<p>党建</p>
				</div>
				<div class="item">
					<router-link to="/heat">
						<div class="num">{{calorificValue}}</div>
						<p>热度</p>
					</router-link>
				</div> -->
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'tongji',
		props: {
			msg: String,
			defOrg: null,

		},
		data() {
			return {
				act:'',
				notice:'',
				information:'',
				question:'',
				draft:'',
				orgId: null,
				managerAuthList: [],
				addOrgNumber: '', //	//入会审核总数
				unAddOrgNumber: '', //	待审核入会总数
				activityExamineNumber: '', //待审核活动总数
				UnActivityExamineNumber: '', //	待审核活动总数
				contentExamineNumber: '', //	内容审核总数
				UnCentExamineNumber: '', //	待审核内容总数

				Unaudited: '', //审核人数
				examineNumber: '', //总人数
				announcementNumber: '', //通知数
				activityNumber: '', //活动数
				newsNumber: '', //要闻数
				houseNumber:'',//会员之家数
				peopleNumber: '', //成员数
				resourcesNumber: '', //资源数
				partyBuildingNumber: '', //党建数
				birthdayNumber: '', //本月生日人数
				unActivityExamineNumber: '',
				calorificValue: '', //热度，
				unContentExamineNumber: '',

			}
		},
		watch: {
			defOrg(res) {
				if (res) {
					// console.log(res);
					this.orgId = res.id;
					// this.getStatisticsOrgHome();
				}
			}
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
			}
			this.getStatisticsnum()
		},
		methods: {
			// 党建跳转
			routerTo(n, url) {
				// console.log(this.defOrg)
				// if (this.defOrg.isOrg == 5) {
				if (1) {
					this.$router.push({
						path: url
					})
					return
				} else {
					var t = true
					// console.log(this.managerAuthList.indexOf(n) == -1)
					// if (this.managerAuthList.indexOf(n) == -1) {
					if (0) {
						// console.log(this.managerAuthList.indexOf(n) == -1)
						// console.log("111111111111111212")
						layer.msg("您没有相关权限")
						
					} else {
						t = false
					}
					if(!t){
						this.$router.push({
							path: url
						})
					}
				}

			},
			getStatisticsnum(){
					this.http.ajax({
						url: '../../webSite/businessGov/getGovStatistics',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							entityId: this.defOrg.digitalCommerce,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.act = res.data.act
							this.notice = res.data.notice
							this.information = res.data.information
							this.question = res.data.question
							this.draft = res.data.draft
							// console.log(res.data);
						}
					})
			},
			getStatisticsOrgHome() {
				// console.log(222222);
				this.http.ajax({
						url: 'webSite/getStatisticsOrgHome',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.addOrgNumber = res.data.addOrgNumber; //	//入会审核总数
							this.unAddOrgNumber = res.data.unAddOrgNumber; //	待审核入会总数
							this.activityExamineNumber = res.data.activityExamineNumber; //待审核活动总数
							this.UnActivityExamineNumber = res.data.UnActivityExamineNumber; //	待审核活动总数
							this.contentExamineNumber = res.data.contentExamineNumber; //	内容审核总数
							this.UnCentExamineNumber = res.data.UnCentExamineNumber; //	待审核内容总数

							this.Unaudited = res.data.Unaudited; //审核人数
							this.examineNumber = res.data.examineNumber; //总人数
							this.announcementNumber = res.data.announcementNumber; //通知数
							this.activityNumber = res.data.activityNumber; //活动数
							this.newsNumber = res.data.newsNumber; //要闻数
							this.houseNumber = res.data.houseNumber; //会员之家数
							this.peopleNumber = res.data.peopleNumber; //成员数
							this.resourcesNumber = res.data.resourcesNumber; //资源数
							this.partyBuildingNumber = res.data.partyBuildingNumber; //党建数
							this.birthdayNumber = res.data.birthdayNumber; //本月生日人数

							this.calorificValue = res.data.calorificValue; //热度
							this.unActivityExamineNumber = res.data.unActivityExamineNumber;
							this.unContentExamineNumber = res.data.unContentExamineNumber;
							this.managerAuthList = res.data.managerAuthList
							// console.log(res.data);
						}
					})
			},
		}
	}
</script>

<style lang="less">
	.tongji {
		margin-bottom: 73px;

		.content {
			overflow: hidden;
			width: 1000px;
			display: block;
			margin: 0 auto;
			padding-top: 156px;
			padding-bottom: 156px;

			p {
				font-size: 16px;
			}

			.item {
				width: 160px;
				float: left;
				text-align: center;
				cursor: pointer;
				p{
					color:black;
				}

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

				margin:0 40px;
				margin-bottom: 80px;
			}
		}
	}
</style>

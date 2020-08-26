<template>
	<div class="w">
		<div class="position">
			管理工具
			<!-- <span @click="$router.back(-1)">返回</span> -->
		</div>
		<div class="tool bg">
			<div class="content">
				<router-link to="/admissionreview" class="item">
					<img src="../assets/img/glgj1@2x.png" alt="">
					<p>入会审核</p>
					<span v-if="unAddOrgNumber>0">{{unAddOrgNumber}}</span>
				</router-link>
				<router-link to="/manageactivitylist" class="item">
					<img src="../assets/img/glgj2@3x.png" alt="">
					<p>活动审核</p>
					<span v-if="unActivityExamineNumber>0">{{unActivityExamineNumber}}</span>
				</router-link>
				<router-link to="/managearticlelist" class="item">
					<img src="../assets/img/glgj3@3x.png" alt="">
					<p>内容审核</p>
					<span v-if="unContentExamineNumber>0">{{unContentExamineNumber}}</span>
				</router-link>
				<!-- <router-link to="/" class="item" v-if="managerAuthList.indexOf(2)!=-1">
					<img src="../assets/img/glgj7@3x.png" alt="">
					<p>生日管理</p>
				</router-link> -->
				<router-link to="/staff/0" class="item" v-if="isOrg==5 || managerAuthList.indexOf(4)!=-1">
					<img src="../assets/img/glgj4@3x.png" alt="">
					<p>组织架构</p>
				</router-link>
				<router-link to="/organizationset/3" class="item">
					<img src="../assets/img/glgj6@3x.png" alt="">
					<p>管理员</p>
				</router-link>
				<router-link to="/staff/2" class="item" v-if="isOrg==5 || managerAuthList.indexOf(3)!=-1">
					<img src="../assets/img/glgj8@3x.png" alt="">
					<p>邀请加入</p>
				</router-link>
				<!--     <router-link to="" class="item" v-if="managerAuthList.indexOf(5)!=-1">
					<img src="../assets/img/glgj5@3x.png" alt="">
					<p>小组管理</p>
				  </router-link>-->
				<router-link to="/activityrelease" class="item" >
					<img src="../assets/img/glgj9@3x.png" alt="">
					<p>发活动</p>
				</router-link>
				<router-link :to="{path: '/addarticle', query: {messageType:3}}" class="item" >
					<img src="../assets/img/glgj10@3x.png" alt="">
					<p>发通知</p>
				</router-link>
				<router-link :to="{path: '/addarticle', query: {messageType:1}}" class="item" >
					<img src="../assets/img/glgj11@3x.png" alt="">
					<p>发资讯</p>
				</router-link>
				<!-- <router-link :to="{path: '/addBusiness'}" class="item" v-if="managerAuthList.indexOf(10)!=-1"> -->
				<router-link :to="{path: '/addBusiness',query:{type:'business'} }" class="item">
					<img src="../assets/img/glgj14@3x.png" alt="">
					<p>发商机</p>
				</router-link>
				<router-link :to="{path: '/addHome'}" class="item">
					<img src="../assets/img/glgj15@3x.png" alt="">
					<p>发圈子</p>
				</router-link>
				<router-link :to="{path: '/addarticle', query: {messageType:6}}" class="item" v-if='defOrg && (defOrg.orgType ==1 && (defOrg.isOrg==1 || defOrg.isOrg==5))'>
					<img src="../assets/img/glgj17@3x.png" alt="">
					<p>发商会服务</p>
				</router-link>
				<router-link :to="{path: '/addarticle', query: {messageType:7}}" class="item" v-if='defOrg && (defOrg.orgType ==2 && (defOrg.isOrg==1 || defOrg.isOrg==5))'>
					<img src="../assets/img/glgj17@3x.png" alt="">
					<p>发协会服务</p>
				</router-link>
				<router-link :to="{path: '/addarticle', query: {messageType:8}}" class="item" v-if="defOrg && (defOrg.orgType ==2 && (defOrg.isOrg==1 || defOrg.isOrg==5))">
					<img src="../assets/img/glgj15@3x.png" alt="">
					<p>发法律标准</p>
				</router-link>
				<div  @click="routerTo(12)" class="item" v-if="defOrg&&defOrg.authStatus==2 && (defOrg.orgType == 1|| defOrg.orgType == 2)">
				<!-- <div  @click="routerTo(12)" class="item"> -->
					<router-link :to="{path: '/addarticle', query: {messageType:4}}" v-if="(isOrg==5 || managerAuthList.indexOf(11)!=-1) && defOrg && defOrg.authStatus==2"></router-link>
					<img src="../assets/img/glgj13@3x.png" alt="">	
					<p>发党建要闻</p>
				</div>
				<!-- <a href="https://fuxing1.boc.cn" target="_blank" class="item" v-if="(isOrg==5 || managerAuthList.indexOf(11)!=-1) ">
					<router-link :to="{path: '/addarticle', query: {messageType:4}}" class="item" v-if="(isOrg==5 || managerAuthList.indexOf(11)!=-1) && defOrg.authStatus==2"></router-link>
					<img src="../assets/img/glgj13@3x.png" alt="">
					<p>发党建要闻</p>
				</a> -->
				<router-link :to="{path: '/staff/1'}" class="item">
					<img src="../assets/img/glgj16@3x.png" alt="">
					<p>成员管理</p>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'tool',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.isOrg = this.defOrg.isOrg;
					this.managerAuthList = this.defOrg.managerAuthList;
					this.getStatisticsOrgHome();
				}
			}
		},
		data() {
			return {
				orgId: null,
				isOrg: 0,
				managerAuthList: [],
				addOrgNumber: 0, //	//入会审核总数
				unAddOrgNumber: 0, //	待审核入会总数
				activityExamineNumber: 0, //待审核活动总数
				UnActivityExamineNumber: 0, //	待审核活动总数
				contentExamineNumber: 0, //	内容审核总数
				UnCentExamineNumber: 0, //	待审核内容总数

				Unaudited: 0, //审核人数
				examineNumber: 0, //总人数
				announcementNumber: 0, //通知数
				activityNumber: 0, //活动数
				newsNumber: 0, //要闻数
				peopleNumber: 0, //成员数
				resourcesNumber: 0, //资源数
				partyBuildingNumber: 0, //党建数
				birthdayNumber: 0, //本月生日人数
				unActivityExamineNumber: 0,
				calorificValue: 0, //热度，
				unContentExamineNumber: 0,

			}
		},
		methods: {
			routerTo(){
				if(this.defOrg.authStatus==2){
					this.$router.push({path: '/addarticle', query: {messageType:4}})
				}else{
					layer.msg("您的组织未认证，暂无发党建权限")
				}
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
							this.peopleNumber = res.data.peopleNumber; //成员数
							this.resourcesNumber = res.data.resourcesNumber; //资源数
							this.partyBuildingNumber = res.data.partyBuildingNumber; //党建数
							this.birthdayNumber = res.data.birthdayNumber; //本月生日人数

							this.calorificValue = res.data.calorificValue; //热度
							this.unActivityExamineNumber = res.data.unActivityExamineNumber;
							this.unContentExamineNumber = res.data.unContentExamineNumber;
							// console.log(res.data);
						}
					})
			},
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.isOrg = this.defOrg.isOrg;
				this.managerAuthList = this.defOrg.managerAuthList;
				this.getStatisticsOrgHome();
			}
		}
	}
</script>

<style lang="less">
	.tool {
		margin-bottom: 73px;

		.content {
			overflow: hidden;
			margin: 0 200px;
			padding-top: 93px;

			.item {
				width: 170px;
				text-align: center;
				display: block;
				float: left;
				cursor: pointer;
				margin-bottom: 71px;
				position: relative;

				p {
					font-size: 16px;
					margin-top: 12px;
					color: #333333;
				}

				img {
					width: 52px;
					display: block;
					margin: 0 auto;
				}

				span {
					position: absolute;
					top: -5px;
					right: 20px;
					border-radius: 50px;
					/* padding: 5px 10px; */
					background: #ea0000;
					color: #fff;
					line-height: 2;
					font-size: 10px;
					width: 20px;
					height: 20px;
					text-align: center;
				}
			}

		}
	}
</style>

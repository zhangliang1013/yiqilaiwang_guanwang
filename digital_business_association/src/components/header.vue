<template>
	<div>
		<div class="top" :style="[{'background': menuactive=='echarts'?'#0C0B34':'',color:'#13ADF7'},]">
			<div class="w">
				<router-link v-if="menutype==1" to="/" class="logo clear">
					<img src="../assets/img/fx15@3x.png" style="width:52px" alt="" class="fl">
					<span class="title fl">数字商协会平台</span> 
				</router-link>
				<div class="org" v-if="menutype==2">
					<img class="pic" src="../assets/img/head@2x.png" v-if="!login" alt="">
					<span class="name" style="font-size: 16px" v-if="!login">未加入任何组织</span>

					<router-link  
						v-if="login" 
						:to="
							defOrg && defOrg.digitalCommerce=='5e88d1cf6b0366dd9cf01e50'? '/echarts/2': 
							defOrg && defOrg.digitalCommerce=='5e935acfa5f08e7ae71b5557'? '/echarts/1':
							defOrg && defOrg.digitalCommerce=='5ea6a71ca5f08e7ae71fa336'? '/dynamicList/0':
							'/managearticlelist?messageType=1'"
					>
						<img class="pic" :src="defOrg.orgUrl" alt="" v-if="defOrg" v-show="defOrg.orgName!='null'">
						<img class="pic" src="../assets/img/znfx@2x.png" v-if="defOrg" v-show="defOrg.orgName=='null'">
						<span class="name">
							<p :style="{'color': menuactive=='echarts'?'#ffffff':'#333333'}" :title="currentOrgName">{{currentOrgName}}</p>
						</span>
					</router-link>
					<span class="select" v-clickOutSide="onorgselect">
						<span class="n" @click="onorgselect('btn')" :class="[{'active':orgselect}, {'n1':menuactive=='echarts'}]">切换组织</span>
						<div class="list" v-if="orgselect">
							<div class="item" v-for="(item,index) in orgList" :key="index" @click="toorg(item)" :title="item.entityName">
								<img :src="item.orgUrl" alt="">
								<span>{{item.entityName}}</span>
							</div>
						</div>
					</span>
				</div>
				<div class="menu" v-if="menutype==2">
					<span v-if='defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"'>
						<router-link 
							to="/activitylist" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{
								active:menuactive=='tool'||
								menuactive=='activitycost'||
								menuactive=='contentaudit'||
								menuactive=='activityaudit'||
								menuactive== 'manageactivitylist'||
								menuactive=='activitylist' || 
								menuactive=='activityrelease' ||
								menuactive== 'activitydetails'|| 
								menuactive== 'addHome' || 
								menuactive== 'homeDetail' || 
								menuactive== 'addarticle' }">政策</router-link>
					</span>
					<!-- <span v-if='defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"'>
						<router-link to="/addarticle" :style="{'color': menuactive=='echarts'?'#13ADF7':''}" :class="{active:menuactive=='tongji' || menuactive=='addarticle' }">发政策</router-link>
					</span> -->

					<span v-if='defOrg&&defOrg.digitalCommerce=="5e88d1cf6b0366dd9cf01e50" || defOrg && defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"'>
						<router-link 
							to="/organizationset/1" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{
								active:menuactive== 'organizationset'|| 
								menuactive=='addLeader'}"
						>{{defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"?'关于我们':'本会概况'}}
						</router-link>
					</span>
					<!-- 市工商联 -->
					<span v-if='defOrg&&defOrg.digitalCommerce=="5e88d1cf6b0366dd9cf01e50"'>
						<router-link 
							to="/tool" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{
								active:menuactive== 'activityrelease'|| 
								menuactive=='tool'|| 
								menuactive=='editarticle'|| 
								menuactive =='activitymember' ||
								menuactive =='activitysignup' ||
								menuactive =='everywhere' ||
								menuactive =='activityorglist'|| 
								menuactive =='dcwj'|| 
								menuactive =='staff' }"
							>管理工具</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce=="5e88d1cf6b0366dd9cf01e50"'>
						<router-link 
							to="/tongji" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{
								active:menuactive== 'tongji'|| 
								menuactive== 'managearticlelist'|| 
								menuactive=='activitylists'|| 
								menuactive=='draftList'|| 
								menuactive=='gslDraft' || 
								menuactive=='wjStatistics'|| 
								menuactive=='wjFill'|| 
								menuactive=='wjSee' || 
								menuactive=='information'|| 
								menuactive=='activityDetails'||
								menuactive=='signList'
							}"
							>统计工具</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336"&&defOrg&&defOrg.digitalCommerce!="5e88d1cf6b0366dd9cf01e50"'>
						<router-link 
							to="/managearticlelist?messageType=1" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{
								active:menuactive== 'managearticlelist'|| 
								menuactive=='information' || 
								menuactive=='editarticle'}"
							>资讯</router-link>
					</span>
					<!-- <span v-if='defOrg&&defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336"&&defOrg.digitalCommerce!="5e88d1cf6b0366dd9cf01e50"'>
						<router-link to="/editarticle" :style="{'color': menuactive=='echarts'?'#13ADF7':''}" :class="{active:menuactive=='editarticle'}">发资讯</router-link>
					</span> -->
					<span v-if='defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"'>
						<router-link 
							to="/dynamicList/0" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive== 'dynamicList'&&topage=='0'}"
						>本会动态</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"'>
						<router-link 
							to="/dynamicList/1" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive== 'dynamicList'&&topage=='1'}"
						>办事指南</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"'>
						<router-link 
							to="/dynamicList/2" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive== 'dynamicList'&&topage=='2'}"
						>仲裁园地</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"'>
						<router-link 
							to="/draftList?messageType=1" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive=='draftList'}"
						>草稿箱</router-link>
					</span>
					<span v-if='defOrg&&defOrg.digitalCommerce=="5e935acfa5f08e7ae71b5557"'>
						<router-link 
							to="/draftList?messageType=0" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive=='draftList'}"
						>草稿箱</router-link>
					</span>
					<!-- <span v-if='defOrg&&defOrg.digitalCommerce=="5e88d1cf6b0366dd9cf01e50"'>
						<router-link to="/activitylists" :style="{'color': menuactive=='echarts'?'#13ADF7':''}" :class="{active:menuactive== 'activitylists' || menuactive =='activityrelease' || menuactive =='activitymember' ||menuactive =='activitysignup' ||menuactive =='everywhere' ||menuactive =='activityorglist' || menuactive =='activityDetails'}">活动</router-link>
					</span> -->
					<span v-if='defOrg&&defOrg.digitalCommerce=="5e8ecdeb3e43463fd4668207"'>
						<router-link 
							to="/productShow/1" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive=='productShow'|| menuactive=='submitDetails'}"
						>审批</router-link>
					</span>
					<span v-if='defOrg'>
						<router-link 
							to="/mailbox" 
							:style="{'color': menuactive=='echarts'?'#13ADF7':''}" 
							:class="{active:menuactive=='mailbox'|| menuactive=='questionDetail'}"
						>市民提问箱</router-link>
					</span>
				</div>

				<div class="userinfo">
					<router-link 
						:to="
							defOrg && defOrg.digitalCommerce=='5e88d1cf6b0366dd9cf01e50'?'/echarts/2': 
							defOrg && defOrg.digitalCommerce=='5e935acfa5f08e7ae71b5557'? '/echarts/1':
							defOrg && defOrg.digitalCommerce=='5ea6a71ca5f08e7ae71fa336'? '/dynamicList/0':
							'/managearticlelist?messageType=1'" 
						class="user" 
						style="margin-right:58px" 
						v-if="islogin"
					>
						<img :src="login.avatarUrl" alt="">
						<span :style="{'color': menuactive=='echarts'?'#fff':'#333333'}">{{login.realName}}</span>
					</router-link>
					<router-link 
						:to="
							defOrg && defOrg.digitalCommerce=='5e88d1cf6b0366dd9cf01e50'?'/echarts/2': 
							defOrg && defOrg.digitalCommerce=='5e935acfa5f08e7ae71b5557'? '/echarts/1':
							defOrg && defOrg.digitalCommerce=='5ea6a71ca5f08e7ae71fa336'? '/dynamicList/0':
							'/managearticlelist?messageType=1'" 
						v-if="!showImg&&islogin" 
						class="signout btn3" style="color:white;padding: 12px;border-radius: 30px;font-size: 16px;height: 45px;"
					>政策管理</router-link>
					<span class="signout" v-if="islogin" @click="signout" style="margin-left:2px">退出</span>

					<div @click="tokenDeal" v-if="!islogin">
						<span  class="btn">登录</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'top',
		props: {
			personalInfo: null,
			islogin: false,
			login: null, //登陆详情
			defOrg: {
				type: Object,
				default: null,
				orgUrl: '',
			} //默认组织详情
		},
		data() {
			return {
				toname: '',
				fromname: '',
				orgId: '',
				menuactive: '',
				topage:null,
				orgselect: false,
				userinfo: null,
				menutype: 2,
				orgList: null, //组织列表
				currentOrgName: '', //当前组织的名称
				isOrg: 0,
				orgUrl: '',
				// 权限
				powers: [],
				// 当前页面路径
				path: "",
				showImg: false,
				messageType:"",
			}
		},
		created() {
			//组织列表
			if (this.login) {
				this.getorgList();
			}


		},
		watch: {
			defOrg(res) {
				if (this.defOrg != null) {
					var login = this.local.fetch("loging")
					this.login.isOrg = 1
					this.login.orgId = this.defOrg.id;
					this.local.save('loging', this.login);
				}
				if (res) {
					this.currentOrgName = res.orgName;
					this.local.save("currentOrgNameg", this.currentOrgName)
					this.local.save("orgTypeg", res.orgType)
					this.isOrg = res.isOrg;
					this.orgUrl = res.orgUrl;
				}
			},
			islogin(res) {
				if (res) {
					this.$emit('loging');
				}
			},
			$route(to, form) {
				if(this.local.fetch("tokeng")==null&&to.name!="login"&&to.name!="organizeManage"&&to.name!="home"&&to.name!="organize"&&to.name!="down"&&to.name!="news"&&to.name!="about"&&to.name!="newsArticle"&&to.name!="reg"&&to.name!="pwd"){
					this.$emit('tokenTimeOut');
					layer.msg("登录信息过期，需要重新登陆")
				}
				this.toname = to.name
				this.local.save("tonameg", to.name)
				this.local.save("fromnameg", form.name)
				this.fromname = form.name
				this.path = to.name
				this.messageType = this.$route.query.messageType
				// 判断头部显示小房子与否
				if (this.islogin) {
					switch (to.name) {
						case null:
						case "":
						case "home":
							;
						case "news":
							;
						case "organize":
							;
						case "down":
							;
						case "about":
							this.showImg = false
							break;
						default:
							this.showImg = true
					}
				}

				this.menuactive = to.name;
				this.topage = to.params.page
				
				var name = to.name;
				if (name == 'home' || name == 'home' || name == 'organize' || name == 'down' || name == 'news' || name ==
					'newsArticle' || name == 'about' || name == 'login') {
					this.menutype = 1
				} else {
					if (!this.islogin) {
						this.$router.push('/login/index')
					} else {
						if (name == 'addorganize') {
							this.menutype = 1
							this.showImg = false
						} else {
							this.menutype = 2
							this.showImg = true

						}

					}
				}
			}
		},
		methods: {
			tokenDeal(){
				this.local.del("tokeng")
				this.local.del("mount")
				if(this.$route.name !="login"){
					this.$router.push("/login/index")
				}
			},
			getorgList() {
				this.orgList = this.login?this.login.relations:'';
			},
			onorgselect(type) {
				if (type == "btn") {
					this.orgselect = !this.orgselect;
					this.getorgList();
				} else {
					this.orgselect = false;
				}
			},
			toorg(item) {
				this.orgselect = false;
				this.$emit('toorg', item.entityId)
				var who = item.entityId;
				if((who == '5e935acfa5f08e7ae71b5557' || who == '5e88d1cf6b0366dd9cf01e50') && this.$route.name !='echarts'){
					if(who == '5e935acfa5f08e7ae71b5557'){
						this.$router.push('/echarts/1');
					}else if(who == '5e88d1cf6b0366dd9cf01e50'){
						this.$router.push('/echarts/2');
					}else{
						return
					}
				}else if((who == '5e935acfa5f08e7ae71b5557' || who == '5e88d1cf6b0366dd9cf01e50') && this.$route.name =='echarts'){
					if(who == '5e935acfa5f08e7ae71b5557' && this.$route.params.page !=1 ){
						this.$router.push('/echarts/1');
					}else if(who == '5e88d1cf6b0366dd9cf01e50' && this.$route.params.page !=2){
						this.$router.push('/echarts/2');
					}else{
						return
					}
				}else if(who == '5ea6a71ca5f08e7ae71fa336' && this.$route.name != "dynamicList"){
					this.$router.push('/dynamicList/0');
				}else if(who == '5ea6a71ca5f08e7ae71fa336' && this.$route.name == "dynamicList"){
					return
				}else if(this.$route.name != "managearticlelist" && !(who == '5e935acfa5f08e7ae71b5557' || who == '5e88d1cf6b0366dd9cf01e50' || who == '5ea6a71ca5f08e7ae71fa336')){
					this.$router.push('/managearticlelist?messageType=1');
				}
			},
			signout() {
				this.$emit('signout');
			}
		}
	}
</script>
<style lang="less">
	.leftlogo {
		position: absolute;
		left: 0;
		top: 15px;
		z-index: 9;
	}

	.rightlogo {
		position: absolute;
		top: 25px;
		z-index: 9;
		margin-left: 15px;
	}

	.top {
		height: 80px;
		width: 100%;
		background: #FFFFFF;

		.w {
			position: relative;
		}

		.toindex {
			border-left: 1px solid #ccc;
			margin-left: 12px;
			padding-left: 12px;
			// display: inline-block;

			img {
				width: 20px;
				height: 20px;
				// border-radius: 28px;
				margin-left: 17px;
				display: inline-block;
				vertical-align: middle;

			}
		}

		.org {
			margin-right: 20px;
			padding-top: 19px;
			display: block;
			float: left;

			.pic {
				height: 42px;
				width: 42px;
				-webkit-border-radius: 42px;
				-moz-border-radius: 42px;
				border-radius: 42px;
				vertical-align: middle;
				margin-right: 12px;
				display: inline-block;
			}

			.name {
				margin-right: 18px;
				max-width: 200px;
				overflow: hidden;
				display: inline-flex;
				font-weight: bold;

				p {
					max-width: 180px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					color: black;
				}
			}

			.select {
				position: relative;
				z-index: 99;


				.n {
					font-size: 12px;
					color: #999999;
					display: inline-block;
					background: url("../assets/img/zk6@2x.png") no-repeat right center;
					padding-right: 20px;
					cursor: pointer;

				}
				.n1{
					color:#A9A9A9;
				}
				.active {
					background: url("../assets/img/zk5@2x.png") no-repeat right center;
					color: #2168eb;
				}

				.list:before {
					position: absolute;
					content: '';
					border-bottom: 8px solid #fff;
					display: block;
					border-right: 8px solid transparent;
					border-left: 8px solid transparent;

					right: 10px;
					top: -8px;
				}

				.list {
					position: absolute;
					right: 0;
					width: 220px;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 2px 20px 5px rgba(0, 0, 0, 0.12);
					padding-bottom: 20px;
					-webkit-border-radius: 4px;
					-moz-border-radius: 4px;
					border-radius: 4px;
					max-height: 380px;
					overflow-x: hidden;
					overflow-y: scroll;
					text-overflow: ellipsis;

					.item {
						font-size: 13px;
						line-height: 16px;
						width: 200px;
						vertical-align: middle;
						padding-left: 14px;
						padding-top: 20px;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						cursor: pointer;

						img {
							width: 16px;
							height: 16px;
							margin-right: 5px;
							display: inline-block;
							vertical-align: middle;
							-webkit-border-radius: 16px;
							-moz-border-radius: 16px;
							border-radius: 16px;
							float: left;
						}
					}
				}
			}
		}



		.logo {

			display: inline-block;
			margin-right: 100px;
			// width: 165px;
			vertical-align: middle;
			float: left;
			margin-top: 15px;

			img {
				display: inline-block;
				margin-right:10px;
			}
			.title{
				font-size:26px;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(51,51,51,1);
				line-height:54px;
				display:inline-block;
			}

		}

		.menu {
			display: inline-block;
			padding-top: 21px;
			// width: 486px;
			overflow: hidden;
			// margin: 0 220px;

			span {
				height: 38px;
				line-height: 38px;
				display: inline-block;
				margin: 0 20px;
				font-size: 16px;
				color: #333333;
				float: left;
				font-weight: 540;

			}

			a {
				height: 38px;
				line-height: 38px;
				display: inline-block;
				font-size: 16px;
				color: #333333;
				float: left;
			}

			.active,
			a:hover {
				color: #2168eb;
				border-bottom: 4px solid #2168EB;
			}
		}

		.userinfo {
			width: auto;
			position: absolute;
			right: 0;
			top: 0;
			text-align: right;
			display: flex;
			height: 77px;
    		align-items: center;

			.user {
				// padding-top: 26px;
				line-height: 26px;
				display: inline-block;
				color: #666;
				display: flex;
				img {
					width: 28px;
					height: 28px;
					-webkit-border-radius: 28px;
					-moz-border-radius: 28px;
					border-radius: 28px;
					display: inline-block;
					vertical-align: middle;
				}

				span {
					padding-left: 10px;
					max-width: 108px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display:inline-block;
				}
			}

			.btn {
				background: #2168EB;
				border-radius: 20px;
				height: 40px;
				padding: 0 16px;
				line-height: 40px;
				color: #ffffff;
				font-size: 14px;
				display: inline-block;
				// margin-top: 19px;
				margin-left: 26px;
			}

			.btn3 {
				background: #2168EB;
				border-radius: 20px;
				height: 20px;
				padding: 0 8px;
				line-height: 20px;
				color: #ffffff;
				font-size: 14px;
				display: inline-block;
				margin-left: 26px;
			}

			.btn1 {
				background: #2168EB;
				border-radius: 10px;
				height: 30px;
				padding: 6px 10px;
				line-height: 20px;
				color: #ffffff;
				font-size: 14px;
				display: inline-block;
				margin-top: 20px;
				margin-left: 10px;
			}

			.signout {
				font-size: 14px;
				color: #2168eb;
				margin-left: 29px;
				margin-right: 17px;
				cursor: pointer;
				// margin-top: 28px;
			}
		}
	}
</style>

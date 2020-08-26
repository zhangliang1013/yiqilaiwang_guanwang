<template>
	<div>
		<!-- <div class="leftlogo" v-if="menutype==2">
			<router-link to="/"> <img src="../assets/img/logo@2x.png" alt=""></router-link>
		</div> -->
		<div class="top">
			<div class="w">
				<!-- <router-link v-if="menutype==1" to="/" class="logo"><img src="../assets/img/logo@2x.png" alt=""></router-link> -->
				<router-link v-if="menutype==1" to="/" class="logo"><img src="../assets/img/logo.png" style="width:162px" alt=""></router-link>
				<div class="org" v-if="menutype==2">
					<!-- {{login.isOrg}} -->
					<img class="pic" src="../assets/img/head@2x.png" v-if="!login.orgId" alt="">
					<span class="name" style="font-size: 16px" v-if="!login.orgId">未加入任何组织</span>

					<router-link :to="defOrg && defOrg.isOrg!=1&&defOrg.isOrg!=5&& (defOrg.orgType==1|| defOrg.orgType==2)?'/policyList?messageType=1':(defOrg &&(defOrg.orgType==9|| defOrg.orgType==10)?'':'/organizeManage')">
						<img class="pic" :src="defOrg.orgUrl" alt="" v-if="login.isOrg==1&&defOrg" v-show="defOrg.orgUrl!='null'">
						<img class="pic" src="../assets/img/znfx@2x.png" v-if="login.isOrg==1&&defOrg" v-show="defOrg.orgUrl=='null'">
						<span class="name">
							<p>{{currentOrgName}}</p>
						</span>
					</router-link>
					<span class="select" v-clickOutSide="onorgselect">
						<span class="n" @click="onorgselect('btn')" :class="{active:orgselect}">切换组织</span>
						<div class="list" v-if="orgselect">
							<div class="item" v-for="(item,index) in orgList" :key="index" @click="toorg(item)" :title="item.orgName">
								<img :src="item.orgUrl" alt="">
								<span>{{item.orgName}}</span>
							</div>
						</div>
					</span>
				</div>
				<div class="menu" v-if="menutype==1">
					<span>
						<router-link to="/" :class="{active:menuactive=='home'}">首页</router-link>
					</span>
					<span>
						<router-link to="/organize" :class="{active:menuactive=='organize'}">组织</router-link>
					</span>
					<span>
						<router-link to="/down" :class="{active:menuactive=='down'}">下载</router-link>
					</span>
					<span>
						<router-link to="/news" :class="{active:menuactive=='news'||menuactive=='newsArticle'}">新闻</router-link>
					</span>
					<span>
						<router-link to="/about" :class="{active:menuactive=='about'}">关于我们</router-link>
					</span>
				</div>
				
				<div class="menu hand" v-if="menutype==2&&!login.orgId" @click="powerWin(!login.orgId)">
					<!-- 商协会人可看 -->
					<span v-if="defOrg && (defOrg.orgType ==1 || defOrg.orgType ==2)">
						<div :class="{active:menuactive=='policyList'||menuactive== 'policyDetail'||menuactive== 'policyState'||menuactive== 'submitDetails'}">政府政策</div>
					</span>
					<span v-if="defOrg && (defOrg.orgType ==9||defOrg.orgType ==10 )">
						<router-link to="/union" :class="{active:menuactive=='union'}">联盟介绍</router-link>
					</span>
					<!-- 商会或企业管理员可看 -->
					<span v-if="defOrg && (defOrg.orgType ==1 || defOrg.orgType ==7 && (defOrg.isOrg==1 || defOrg.isOrg==5) || defOrg.orgType ==9||defOrg.orgType ==10)">
						<div  :class="{active:menuactive=='productShow'|| menuactive=='product'}">产品展厅</div>
					</span>
					<!-- 管理员可看 -->
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)">
						<div  :class="{active:menuactive=='tongji'|| menuactive=='heat'}">统计工具</div>
					</span>
					<!-- 管理员可看 -->
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)">
						<div  :class="{active:menuactive=='tool'||menuactive=='editarticle'||menuactive=='activitycost' ||menuactive=='managearticlelist' ||menuactive=='contentaudit'||menuactive=='activityaudit'||menuactive== 'manageactivitylist' ||menuactive== 'admissionreview'||menuactive=='activitylist' || menuactive=='activityrelease' ||  menuactive=='addarticle'||menuactive== 'activitydetails' || menuactive== 'addHome' || menuactive== 'homeDetail'|| menuactive=='staff'||menuactive== 'tolead'|| menuactive== 'everywhere'|| menuactive== 'addBusiness'&& $route.query.type=='business'}">管理工具</div>
					</span>
					<!-- 管理员可看 -->
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)">
						<div  :class="{active:menuactive=='organizationset'||menuactive=='newsArticle' ||menuactive== 'addBusiness'&& $route.query.type=='honor'}">组织设置</div>
					</span>
				</div>

				<div class="menu" v-if="menutype==2&&login.orgId">
					<span v-if="defOrg && (defOrg.orgType ==1 || defOrg.orgType ==2)">
						<router-link to="/policyList?messageType=1" :class="{active:menuactive=='policyList'||menuactive== 'policyDetail'||menuactive== 'policyState'||menuactive== 'submitDetails'}">政府政策</router-link>
					</span>
					<span v-if="defOrg && (defOrg.orgType ==9||defOrg.orgType ==10 )">
						<router-link to="/union" :class="{active:menuactive=='union'}">联盟介绍</router-link>
					</span>
					<span v-if="defOrg && (defOrg.orgType ==1 || defOrg.orgType ==7 && (defOrg.isOrg==1 || defOrg.isOrg==5) || defOrg.orgType ==9||defOrg.orgType ==10)">
						<router-link to="/productShow/1" :class="{active:menuactive=='productShow'|| menuactive=='product'}">产品展厅</router-link>
					</span>
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)&& defOrg && defOrg.orgType !=9 && defOrg.orgType !=10">
						<router-link to="/tongji" :class="{active:menuactive=='tongji' || menuactive=='heat' }">统计工具</router-link>
					</span>
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)&& defOrg && defOrg.orgType !=9 && defOrg.orgType !=10">
						<router-link to="/tool" :class="{active:menuactive=='tool'||menuactive=='activitycost'||menuactive=='editarticle'||menuactive=='contentaudit'||menuactive=='managearticlelist'|| menuactive=='activityaudit'||menuactive== 'manageactivitylist'||menuactive== 'admissionreview'||menuactive=='activitylist' || menuactive=='activityrelease' ||  menuactive=='addarticle'||menuactive== 'activitydetails'|| menuactive== 'addHome' || menuactive== 'homeDetail' ||menuactive=='staff'||menuactive== 'tolead'|| menuactive== 'everywhere'|| menuactive== 'addBusiness'&& $route.query.type=='business'}">管理工具</router-link>
					</span>
					<span v-if="!(defOrg && defOrg.isOrg !=1 && defOrg.isOrg!=5)&& defOrg && defOrg.orgType !=9 && defOrg.orgType !=10">
						<router-link to="/organizationset/0" :class="{active:menuactive=='organizationset'||menuactive=='newsArticle' || menuactive== 'addBusiness'&& $route.query.type=='honor'}">组织设置</router-link>
					</span>
				</div>

				<div class="userinfo">
					<router-link :to="defOrg && defOrg.isOrg!=1&&defOrg.isOrg!=5&& defOrg.orgType==1?'/policyList?messageType=1':(defOrg &&(defOrg.orgType==9|| defOrg.orgType==10)?'':'/organizeManage')" class="user" style="margin-right:15px" v-if="islogin">
						<img :src="personalInfo.avatarUrl" alt="">
						<span >{{personalInfo.realName}}</span>
					</router-link>
					<router-link :to="defOrg && defOrg.isOrg!=1&&defOrg.isOrg!=5 && defOrg.orgType==1?'/policyList?messageType=1':(defOrg &&(defOrg.orgType==9|| defOrg.orgType==10)?'/union':'/organizeManage')" target='_blank' v-if="!showImg&&islogin" class="signout btn3" style="color:white;padding: 12px;border-radius: 30px;font-size: 16px;height: 45px;">组织管理</router-link>
					<span class="signout" v-if="islogin" @click="signout" style="margin-left:2px">退出</span>

					<router-link to="/login/reg" v-if="!islogin" class="btn">注册</router-link>
					<router-link to="/login/index" v-if="!islogin" class="btn">登录</router-link>
					<router-link to="/" class="toindex" v-if="showImg&&islogin">
						<!-- <div> -->
						<img src="../assets/img/index.png" title="到一起来往首页">
						<!-- </div> -->
					</router-link>
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
				orgType:"",
			} //默认组织详情
		},
		data() {
			return {
				toname: '',
				fromname: '',
				orgId: '',
				menuactive: '',
				orgselect: false,
				userinfo: null,
				menutype: "",
				orgList: null, //组织列表
				currentOrgName: '', //当前组织的名称
				isOrg: 0,
				orgUrl: '',
				// 权限
				powers: [],
				// 当前页面路径
				path: "",

				showImg: false,
				// orgType:this.defOrg.orgType?this.defOrg.orgType:"",
				// personalInfo:null,
				// isSupervisor: 0, //是否是 主管理员
				// onerror:'this.src="../assets/img/head@2x.png"',
			}
		},
		created() {
			// console.log(this.islogin,this.$route)
			//组织列表
			if (this.personalInfo) {
				this.getorgList();
				// this.getPeople()
			}


		},
		watch: {
			defOrg(res) {
				// console.log('defOrg 监听!!!!!!!', res);
				// console.log(this.defOrg.orgUrl == null)
				// console.log(this.defOrg)
				if (this.defOrg != null) {
					var login = this.local.fetch("login")
					this.login.isOrg = 1
					this.login.orgId = this.defOrg.id;
					this.local.save('login', this.login);

					// console.log(login)
					// console.log(this.login)
				}
				if (res) {
					this.currentOrgName = res.orgName;
					this.local.save("currentOrgName", this.currentOrgName)
					this.local.save("orgType", res.orgType)
					this.isOrg = res.isOrg;
					this.orgUrl = res.orgUrl;
					this.orgId = res.id
					this.getPeople()
					// this.isSupervisor = 
				}
			},
			islogin(res) {
				if (res) {
					// this.$emit('login');
				}
			},
			personalInfo(res) {
				if (res) {
					this.getorgList();
					// this.getPeople()
				}
			},

			$route(to, form) {
				// console.log(to,"此處為to")
				if(this.local.fetch("token")==null&&to.name!="login"&&to.name!="organizeManage"&&to.name!="home"&&to.name!="organize"&&to.name!="down"&&to.name!="news"&&to.name!="about"&&to.name!="newsArticle"&&to.name!="reg"&&to.name!="pwd"){
					this.$emit('tokenTimeOut');
					layer.msg("登录信息过期，需要重新登陆")
				}
				this.toname = to.name
				this.local.save("toname", to.name)
				this.local.save("fromname", form.name)
				this.fromname = form.name
				this.path = to.name
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


				// this.$router.push('/organizeManage')
				// 				if (form.name == "tongji") {
				// 					if (this.isOrg != 5) {
				// 						// 确认权限，非主管理员
				// 						var t = true
				// 
				// 
				// 						switch (to.name) {
				// 							case "admissionreview":
				// 								// 入会审核 1
				// 								for (var i = 0; i < this.powers.length; i++) {
				// 
				// 									if (this.powers[i] == 1) {
				// 										t = false
				// 										break;
				// 									}
				// 
				// 								}
				// 								break;
				// 							case "manageactivitylist":
				// 								// 活动审核
				// 								for (var i = 0; i < this.powers.length; i++) {
				// 
				// 									if (this.powers[i] == 6) {
				// 										t = false
				// 										break;
				// 									}
				// 
				// 								}
				// 								break;
				// 							case "managearticlelist":
				// 								if (to.query == "" || to.query == null) {
				// 									// 内容审核
				// 									var a = 0
				// 									for (var i = 0; i < this.powers.length; i++) {
				// 
				// 										if (this.powers[i] == 2 || this.powers[i] == 3 || this.powers[i] == 4 || this.powers[i] == 12) {
				// 											a += this.powers[i]
				// 										}
				// 
				// 									}
				// 									if (a == 21) {
				// 										t = false
				// 									}
				// 
				// 								} else {
				// 									switch (to.query.messageType) {
				// 										case "1":
				// 										case 1:
				// 											// 资讯
				// 											for (var i = 0; i < this.powers.length; i++) {
				// 
				// 												if (this.powers[i] == 3) {
				// 													t = false
				// 													break;
				// 												}
				// 
				// 											}
				// 											break;
				// 										case "2":
				// 										case 2:
				// 											// 资源
				// 											for (var i = 0; i < this.powers.length; i++) {
				// 
				// 												if (this.powers[i] == 4) {
				// 													t = false
				// 													break;
				// 												}
				// 
				// 											}
				// 											break;
				// 										case "3":
				// 										case 3:
				// 											// 通知
				// 											for (var i = 0; i < this.powers.length; i++) {
				// 
				// 												if (this.powers[i] == 2) {
				// 													t = false
				// 													break;
				// 												}
				// 
				// 											}
				// 											break;
				// 										case "4":
				// 										case 4:
				// 											// 党建
				// 											for (var i = 0; i < this.powers.length; i++) {
				// 
				// 												if (this.powers[i] == 12) {
				// 													t = false
				// 													break;
				// 												}
				// 
				// 											}
				// 											break;
				// 									}
				// 								}
				// 
				// 								break;
				// 							case "activitylist":
				// 								// 活动
				// 								for (var i = 0; i < this.powers.length; i++) {
				// 
				// 									if (this.powers[i] == 6) {
				// 										t = false
				// 										break;
				// 									}
				// 
				// 								}
				// 								break;
				// 							case "heat":
				// 								// 热度
				// 								t = false
				// 
				// 
				// 								break;
				// 							default:
				// 								t = false
				// 
				// 
				// 						}
				// 
				// 						if (t) {
				// 							// layer.msg("您没有相关权限")
				// 							// this.$router.push('/tongji')
				// 						}
				// 					}
				// }
				this.menuactive = to.name;
				
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
						}

					}
				}
			}
		},
		methods: {
			powerWin(v) {
				var self = this
				if (v) {
					layer.confirm('抱歉，您没有组织管理权限 请更换账号重试或创建组织', {
						title: ['提示'],
						closeBtn: false,
						btnAlign: 'c',
						shadeClose: true,
						skin: 'yq-confirm',
						btn: ['更换账号', '创建组织'] //按钮
					}, function() {
						self.$emit('signout');
						layer.closeAll()
					}, function() {
						self.$router.push('/addorganize');
						layer.closeAll()
					});
				}
			},

			getorgList() {
				this.http.ajax({
					url: 'webSite/orgList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"uid": this.personalInfo.id
					}
				}).then(res => {
					if (res.code == 200) {
						this.orgList = res.data;
						//this.defOrg=res.data
					}
				})
			},

			getPeople() {
				this.http.ajax({
					url: 'webSite/getStatisticsOrgHome',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
					}
				}).then(res => {

					if (res.code == 200) {
						var list = []
						for (var i = 0; i < res.data.managerAuthList.length; i++) {
							var v = res.data.managerAuthList[i];
							list.push(v)
							this.powers = list
						}
					}


					// this.powers = list
				})
			},

			// 获取当前人员的权限
			getpower(value) {
				if (value == null || value == "") {
					value = this.personalInfo.id
				}

				this.http.ajax({
					url: 'webSite/orgStructure/orgManagerAuthList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"orgUserId": value
					}
				}).then(res => {

					if (res.code == 200) {
						var list = []
						for (var i = 0; i < res.data.length; i++) {
							var v = res.data[i].authVal;
							list.push(v)
						}
						this.powers = list
					}
					// this.powers = list
				})

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
				if(this.defOrg.id !=item.id){
					this.orgselect = false;
					this.$emit('toorg', item.id)
					// this.$emit('getdefOrg', orgId)
					// console.log('orgIdorgIdorgId', orgId);
					// console.log(this.defOrg.isOrg,"asdfg",(this.defOrg.isOrg!=1&&this.defOrg.isOrg!=5)&& this.defOrg.orgType==1);
					if(item.isSupervisor!=1 &&( item.orgType==1 || item.orgType==2)){
						this.$router.push('/policyList?messageType=1');
					}else if(item.orgType==9 || item.orgType==10){
						this.$router.push('/union');
					}else{
						this.$router.push('/organizeManage');
					}
				}

			},
			signout() {
				this.$emit('signout');
			},
			// tomenu(){
			// 	if(this.menuactive=='policyList'){
			// 		console.log(111111111)
			// 		this.$emit("toPolicyList",true);
			// 	}
			// }
		}
	}
</script>
<style lang="less">
	.leftlogo {
		// display: -moz-box;
		position: absolute;
		left: 0;
		top: 15px;
		z-index: 9;
	}

	.rightlogo {
		// display: -moz-box;
		position: absolute;
		// right: 0;
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
			// margin-top:28px;
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
				maxwidth: 200px;
				overflow: hidden;
				display: inline-flex;
				font-weight: bold;

				p {
					maxwidth: 180px;
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
					background: url("../assets/img/zk2@2x.png") no-repeat right center;
					padding-right: 20px;
					cursor: pointer;

				}

				.active {
					background: url("../assets/img/zk3@2x.png") no-repeat right center;
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
			width: 165px;
			vertical-align: middle;
			float: left;
			margin-top: 15px;

			img {

				display: block;
			}

		}

		.menu {
			display: inline-block;
			padding-top: 21px;
			// width: 486px;
			overflow: hidden;

			span {
				height: 38px;
				line-height: 38px;
				display: inline-block;
				margin: 0 25px;
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

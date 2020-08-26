<template>
	<div id="app">
		<headers :personalInfo.sync="personalInfo" :islogin.sync="islogin" :login="login" @signout="onsignout" :defOrg="defOrg"
		 @toorg="getdefOrg" @tokenTimeOut="tokenTimeOut"></headers>
		<router-view style="min-height:800px" :login="login" :personalInfo.sync="personalInfo" :defOrg="defOrg" @onlogin="onlogin"
		 @getdefOrg="getdefOrg" @tokenTimeOut="tokenTimeOut" @signout="onsignout" />

		<footers></footers>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				islogin: false,
				personalInfo: {
					avatarUrl: '',
					id: null,
				},
				login: null, //登陆详情
				orgId: 0, //
				defOrg: null //默认组织详情,
			}
		},
		components: {

		},
		watch: {
			'$route': function(to, from) {
				document.body.scrollTop = 0
				document.documentElement.scrollTop = 0
			},
		},
		methods: {
			getdefOrg(id) {
				// console.log('组件被调用!!!!!!!' + id, id);
				//组织详情
				this.http.ajax({
					url: 'webSite/getStatisticsOrgHome',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": id
					}
				}).then(res => {
					if (res.code == 200) {
						// console.log("typeof res.data.orgUrl", res);
						this.defOrg = res.data
				
				// console.log('type',this.defOrg.orgType,';','isOrg:1与5为管理员',this.defOrg.isOrg)
						let login = this.local.fetch('login');
						login.orgId = this.defOrg.id;
						// console.log("loginold", login);
						// this.local.save('login', login);
						// console.log("loginnew", login);
					}
				})
			},
			onsignout() {
				this.local.save('token', null);
				this.local.save('login', null);
				this.local.save('currentOrgName', null);
				this.personalInfo = {
					avatarUrl: '',
					id: null,
				}
				this.orgId = 0 //
				this.defOrg = null //默认组织详情
				this.islogin = false;

				// console.log(this.islogin);
				this.$router.push('/')
			},
			tokenTimeOut() {
				this.local.save('token', null);
				this.local.save('login', null);
				this.local.save('currentOrgName', null);
				this.personalInfo = {
					avatarUrl: '',
					id: null,
				}
				this.orgId = 0 //
				this.defOrg = null //默认组织详情
				this.islogin = false;
			
				// console.log(this.islogin);
				this.$router.push('/login/index')
			},
			onlogin(login) {
				this.login = login;
				if (this.login) {
					this.getdefOrg(this.login.orgId)
				}
				if (login && login.token && login.token != '') {
					this.islogin = true;
				}
				if (login) {
					// console.log(this.login,'@@@@@@@@@@@@')

					this.http.ajax({
						url: 'webSite/personalInfo',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						}
					}).then(res => {
						if (res.code == 200) {
							this.personalInfo = res.data;
							// this.local.save('personalInfo')
							// console.log("denglu时获取的数据");
							// console.log(this.personalInfo);
						}
					})
				}
			}
		},
		created() {
			this.onlogin(this.local.fetch('login'));
			// console.log('xxx',this.personalInfo);
		}
	}
</script>

<style lang="less">
	.staffeit .mc .ivu-select-dropdown {
	    will-change: unset !important;
	}
	.astar {
		.ivu-form-item-label:before {
			content: '*';
			display: inline-block;
			margin-right: 4px;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}

	}
	.new_list{
		min-height: 400px
	}

	.activitycost {
		min-height: 600px
	}

	.admissionreview {
		min-height: 600px
	}

	.activitylist {
		min-height: 600px
	}

	.docadmin {
		min-height: 600px
	}

	#app {
		background: #F7F7F7;
		min-width: 1080px;
	}

	.hand {
		cursor: pointer;
	}

	* {
		padding: 0;
		margin: 0;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	body {
		background: #fff;
		font-size: 14px;
		font-family: '微软雅黑';
		word-break: break-all;
	}

	.w {
		width: 1080px;
		margin: 0 auto;
	}

	a {
		color: #333333;
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

	.position {
		padding-top: 31px;
		font-size: 20px;
		margin-bottom: 10px;

		span {
			text-align: center;
			font-size: 15px;
			float: right;
			width: 42px;
			height: 28px;
			margin-top: 4px;
			padding-top: 2px;
			background: #ffffff;
			border-radius: 5px;
			border: 1px solid #cccccc;
			cursor: pointer;
		}
	}

	.btn28 {
		height: 28px;
		line-height: 28px;
		text-align: center;
		padding: 0 10px;
		background: #EBF2FF;
		border-radius: 14px;
		font-size: 13px;
		color: #2168EB;
		display: inline-block;

	}

	.btn54 {
		height: 54px;
		line-height: 54px;
		text-align: center;
		padding: 0 75px;
		background: #2168EB;
		border-radius: 54px;
		font-size: 14px;
		color: #fff;
		display: inline-block;

	}

	.btn48 {
		height: 48px;
		line-height: 48px;
		text-align: center;
		padding: 0 75px;
		background: #2168EB;
		border-radius: 54px;
		font-size: 14px;
		color: #fff;
		display: inline-block;

	}

	.m0a {
		margin: 0 auto;
	}

	.tac {
		text-align: center;
	}

	.bg {
		background: #ffffff;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
	}

	.mt17 {
		margin-top: 17px;
	}

	.mb44 {
		margin-bottom: 44px;
	}

	.page_suceess {
		padding-top: 155px;

		.p1 {
			display: block;
			margin: 0 auto;
		}

		.t1 {
			margin-top: 14px;
			font-size: 16px;
			text-align: center;
		}

		.t2 {
			margin-top: 8px;
			font-size: 13px;
			color: #999999;
			text-align: center;
		}

		.btn48 {
			margin-top: 114px;
			margin-bottom: 305px;
		}

		margin-bottom: 80px;
	}

	.cl {
		clear: both;
	}

	.table {
		.link {
			color: #2168eb;
			margin: 0 7px;
			font-size: 12px;
		}

		.btn {
			width: 56px;
			height: 22px;
			background: rgba(33, 104, 235, 1);
			border-radius: 14px;
			color: #ffffff;
			text-align: center;
			line-height: 22px;
			vertical-align: middle;
			margin-top: 9px;
		}

		.edit,
		.del {
			font-size: 0;
			width: 20px;
			margin: 0px 10px;
			position: relative;
			display: inline-block;
			height: 100%;
			cursor: pointer;

			img {
				vertical-align: middle;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.ivu-input-wrapper {
			width: 100%;

			input {
				border: none;
			}
		}

		.addbtn {
			height: 22px;
			line-height: 22px;
			vertical-align: middle;
			background: #2168eb;
			display: inline-block;
			text-align: center;
			-webkit-border-radius: 22px;
			-moz-border-radius: 22px;
			border-radius: 22px;
			color: #ffffff;
			font-size: 12px;
			padding: 0 10px;
			cursor: pointer;
		}

		.mc {
			border-bottom: 1px solid #eee;
		}

		.mt,
		.mc {

			padding-left: 20px;
			padding-right: 20px;
			text-align: left;

			.item {
				text-align: left;
				height: 60px;
				line-height: 60px;
				display: inline-block;
				min-width: 60px;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				vertical-align: middle;


			}

		}

		.mt {
			background: #f8f8f8;

			.item {
				height: 40px;
				line-height: 40px;
			}
		}
	}

	.layer {
		.mask {
			position: fixed;
			display: inline-block;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.0);
			z-index: 999;
		}

		.content {
			background: #ffffff;
			width: 326px;
			box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			-webkit-border-radius: 8px;
			-moz-border-radius: 8px;
			border-radius: 8px;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 999;
		}
	}

	.ivu-page {
		font-size: 14px;

		.ivu-page-item a {
			font-size: 14px;
			color: #007aff;
		}

		.ivu-page-prev,.ivu-page-item {
			margin-right: 0;
		}

		.ivu-page-item {
			margin-left: -1px;
			-webkit-border-radius: 0;
			-moz-border-radius: 0;
			border-radius: 0;
		}

		.ivu-page-item-active,.ivu-page-item:hover {
			border-color: #007aff;
			background: #007aff;

			a {
				color: #ffffff;
			}
		}

		.ivu-page-next {
			margin-left: -1px;
		}

		.ivu-page-options-elevator input {
			height: 32px;
			line-height: 32px;
		}
	}

	.btn {
		height: 35px;
		line-height: 35px;
		vertical-align: middle;
		background: #2168eb;
		display: inline-block;
		text-align: center;
		border-radius: 22px;
		color: #ffffff;
		font-size: 12px;
		padding: 0 15px;
		cursor: pointer;
	}
	.clear:after{
		content:"";
		clear:both;
		display:block;
		height:0;
		overflow:hidden;
		visibility:hidden;
	}
	.fl{
		float:left;
	}
	.fr{
		float:right;
	}
	.w-e-toolbar{
		.w-e-menu:nth-child(9){
			.w-e-item:last-child{
				.w-e-icon-paint-brush{
					display: none
				}
			}
			.w-e-item:last-child:before{
				content:"还原";
				font-size: 10px;
			}
		}
	}
</style>

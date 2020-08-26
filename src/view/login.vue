<template>
	<div class="w">
		<div class="position">{{page=="reg"?'注册':page=="index"?'登录':page=="pwd"?'重置密码':''}}</div>
		<div class="reg">
			<div class="item" v-if="page=='reg'||page=='index'||page=='pwd'">
				<div class="label">手机号</div>
				<Input v-model="telPhone" placeholder="请输入手机号码" :maxlength="11">
					<Select v-model="country" slot="prepend" style="width: 74px">
						<Option value="+86">+86</Option>
					</Select>
				</Input>
			</div>
			<div class="item" v-if="page=='reg'||page=='pwd'||(page=='index'&&loginType==1)" @keyup.enter="form">
				<div class="label">验证码</div>
				<Input type="text" v-model="verificationCode" placeholder="请输入验证码" style="width: 229px;" :maxlength="6" />
				<div class="getcode" @click="getCode">{{isGetting?time+'s':'发送验证码'}}</div>
			</div>
			<div class="item" v-if="page=='reg'||page=='pwd'||(page=='index'&&loginType==2)" @keyup.enter="form">
				<div class="label">{{page=='pwd'?'新':''}}密码</div>
				<Input type="password" v-model="password" placeholder="请输入密码"/>
			</div>
			<div class="item" v-if="page=='reg'||page=='pwd'" @keyup.enter="form">
				<div class="label">确认密码</div>
				<Input type="password" v-model="confirmPassword" placeholder="请确认密码"/>
			</div>
			
			<div class="bnts" v-if="page=='index'">
				<span class="fl" @click="onloginType(2)" v-if="loginType==1">密码登录</span>
				<span class="fl" @click="onloginType(1)" v-if="loginType==2">短信登录</span>
				<span class="fr" @click="topwd">忘记密码?</span>
			</div>
		
			<div class="tips"  v-if="page!='index'">
				<Checkbox v-model="checkeds" style="font-size:15px;color:#999">
					已阅读并同意<span @click="pop('https://www.yiqilaiwang.com//law/serviceagree.html','一起来往服务使用协议')">《一起来往服务使用协议》</span>和<span @click="pop('https://www.yiqilaiwang.com/law/privacy.html','一起来往隐私政策')">《一起来往隐私政策》</span>
				</Checkbox>
				<!-- <input type="checkbox" v-model="checkeds">已阅读并同意<span  @click="pop('https://www.yiqilaiwang.com/law/privacy.html','一起来往隐私政策协议')">《一起来往隐私政策协议》</span>和<span
				 @click="pop('https://www.yiqilaiwang.com//law/serviceagree.html','一起来往服务使用协议')">《一起来往服务使用协议》</span> -->
			</div>
			<div class="item">
				<div class="btn" @click="form">{{page=='reg'?'注册':'确定'}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import aes from '../assets/js/aes/aes-jia'
	export default {
		name: 'login',
		props: {
			onsignout: null,
		},
		data() {
			return {
				// 是否同意协议
				checkeds: true,
				select1: 'http',
				select2: 'com',
				page: 'login',
				telPhone: '',
				// telPhone: '17864212178',
				country: '+86',
				password: '',
				confirmPassword: '',
				verificationCode: '',
				type: '20',
				loginType: 1,
				isGetting: false,
				time: 60
			}
		},
		created() {
			this.page = this.$route.params.page;
			// console.log('xxxxxxxxx')
			// this.$emit('onsignout');
			// if (this.onsignout) {
			// this.onsignout();
			// }
		},
		watch: {
			$route(to, form) {
				this.page = to.params.page
			},
			page: function(n, o) {
				this.isGetting = false,
					this.telPhone = '',
					this.verificationCode = '',
					this.password= '',
					this.confirmPassword=''
			},
			checkeds: function(n, o) {
				// console.log(this.checkeds)
			}
		},
		methods: {
			pop(url, tit) {
				layer.open({
					type: 2,
					title: tit,
					shadeClose: true,
					shade: 0.8,
					maxmin: true,
					area: ['1000px', '80%'],
					content: url, //iframe的url
				});
			},
			topwd() {
				this.password= '',
				this.confirmPassword='',
				this.$router.push({
					path: 'pwd'
				})
			},
			onloginType(type) {

				this.loginType = type
			},
			form() {
				if (this.telPhone == '') {
					layer.msg('手机号码不能为空');
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(this.telPhone)) {
					layer.msg('手机号码格式不正确');
					return
				}
				this[this.page]();
			},
			getCode() {
				if (this.telPhone == '') {
					layer.msg('手机号码不能为空');
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(this.telPhone)) {
					layer.msg('手机号码格式不正确');
					return
				}
				// console.log("thispage",this.page)
				if (this.page == 'reg') {
					this.type = 8
				} else if (this.page == 'index') {
					this.type = 12
				}

				if (this.isGetting) return
				this.http.ajax({
					url: 'webSite/verificationCode',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						type: this.type,
						telPhone: this.telPhone
					}

				}).then(res => {

				})
				this.isGetting = true
				//请求验证码

				//调用定时器 d
				var timer = setInterval(() => {
					if (this.time <= 0) {
						clearInterval(timer)
						timer = null
						this.time = 60
						this.isGetting = false
					} else {
						this.time--
					}
				}, 1000)
			},
			reg() {
				if (this.verificationCode == '') {
					layer.msg('验证码不能为空！');
					return;
				}
				if (this.verificationCode == '') {
					layer.msg('验证码不能为空！');
					return;
				}
				if (this.password == '') {
					layer.msg('密码不能为空！');
					return;
				}
				if (this.confirmPassword == '') {
					layer.msg('确认密码不能为空！');
					return;
				}
				if (this.confirmPassword != this.password) {
					layer.msg('密码和确认密码不一致');
					return;
				}
				// console.log(this.page)
				if (this.page != "index") {
					if (!this.checkeds) {
						layer.msg('请勾选用户协议和用户隐私政策');
						return
					}
				}
				this.http.ajax({
					url: 'webSite/register',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						telPhone: this.telPhone,
						password: aes(new Date().getTime() + '|' + this.password),
						confirmPassword: aes(new Date().getTime() + '|' + this.confirmPassword),
						country: this.country,
						verificationCode: this.verificationCode
					}
				}).then(res => {

					if (res.code == 200) {
						layer.msg(res.msg)
						this.$router.push('/login/index');
					}else{
						layer.msg(res.msg);
					}

					
				})
			},
			index() {
				if (this.loginType == 1 && this.verificationCode == '') {
					layer.msg('验证码不能为空！');
					return;
				}
				if (this.loginType == 2 && this.password == '') {
					layer.msg('密码不能为空！');
					return;
				}
				if (!this.checkeds) {
					layer.msg('请勾选用户协议和用户隐私政策');
					return
				}
				if (this.loginType == 1) {
					var data = {
						loginType: this.loginType,
						telPhone: this.telPhone,
						country: this.country,
						verificationCode: this.verificationCode
					}
				} else {
					var data = {
						loginType: this.loginType,
						telPhone: this.telPhone,
						password: aes(new Date().getTime() + '|' + this.password),
					}
				}

				this.http.ajax({
					url: 'webSite/login',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: data
				}).then(res => {
					if (res.code == 200) {
						this.local.save('token', res.data.token);
						this.local.save('login', res.data);
						this.$emit('onlogin', res.data)

						// console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111")
						// console.log(this.local.fetch("toname")=="login"&&this.local.fetch("fromname")=="organize")
						// console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111")
						if(res.data.orgType == 1 && res.data.isAdmin != 1){
							this.$router.push('/policyList?messageType=1');
						}else if(res.data.orgType == 9 || res.data.orgType == 10){
								this.$router.push('/union');
	
						}else{
							if (this.local.fetch("toname") == "login" && this.local.fetch("fromname") == "organize") {
								this.$router.push('/organize');
							}else{
								this.$router.push('/organizeManage');
	
							}
						}
					}
				})
			},
			pwd() {
				if (this.verificationCode == '') {
					layer.msg('验证码不能为空！');
					return;
				}
				if (this.password == '') {
					layer.msg('密码不能为空！');
					return;
				}
				if (this.confirmPassword == '') {
					layer.msg('确认密码不能为空！');
					return;
				}
				if (this.confirmPassword != this.password) {
					layer.msg('密码和确认密码不一致');
					return;
				}
				var date = new Date().getTime();
				this.http.ajax({
					url: 'webSite/modifyPwd',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						telPhone: this.telPhone,
						password: aes(date + '|' + this.password),
						confirmPassword: aes(date + '|' + this.confirmPassword),
						country: this.country,
						verificationCode: this.verificationCode
					}
				}).then(res => {
					// console.log(res)
					// console.log(this.password)
					// console.log(this.confirmPassword)
					if (res.code == 200) {
						
						this.$router.push("/login/index")
						layer.msg(res.msg);
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.reg {
		background: #ffffff;
		padding-left: 310px;
		padding-top: 109px;
		padding-bottom: 300px;
		margin-bottom: 63px;

		.bnts {
			padding-left: 96px;
			width: 423px;
			font-size: 12px;
			margin-bottom: 23px;
			overflow: hidden;
			cursor: pointer;
		}

		.tips {
			font-size: 12px;
			color: #999999;
			padding-left: 96px;

			span {
				color: #2168eb;
				cursor: pointer;
			}

		}

		.item {
			position: relative;
			height: 42px;
			padding-left: 96px;
			margin-bottom: 18px;

			.getcode {
				position: absolute;
				left: 334px;
				width: 94px;
				background: #EBF2FF;
				border-radius: 2px;
				top: 0;
				height: 42px;
				line-height: 42px;
				text-align: center;
				font-size: 13px;
				color: #2168eb;
				cursor: pointer;
			}

			.label {
				position: absolute;
				left: 0;
				height: 42px;
				line-height: 42px;
				text-align: right;
				width: 60px;
				font-size: 14px;
			}

			.inputbox {
				position: relative;
				border: 1px solid #C7C7C7;
				border-radius: 2px;
				width: 255px;
				padding-left: 74px;

				.i {
					position: absolute;
					width: 74px;
					border-right: 1px solid #C7C7C7;
					height: 42px;
					left: 0;
					top: 0;
					font-size: 14px;
					text-align: center;
					line-height: 42px;

				}

				.i:after {
					content: '';
					display: inline-block;
					border-right: 5px solid transparent;
					border-left: 5px solid transparent;
					border-top: 5px solid #D8D8D8;
					vertical-align: middle;
					margin-left: 8px;

				}

				input {
					border: none;
					width: 255px;
				}
			}

			input::placeholder {
				color: #999999;
			}

			.ivu-input-wrapper {
				width: 329px
			}

			.btn {
				width: 329px;
				height: 42px;
				border-radius: 21px;
				text-align: center;
				line-height: 42px;
				background: #2168eb;
				font-size: 13px;
				color: #ffffff;
				margin-top: 28px;
				cursor: pointer;
			}
		}

	}
</style>

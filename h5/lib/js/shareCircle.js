window.onload = function(){  

	axios.defaults.headers['api-version'] = VRESION;
	axios.defaults.headers['api-client'] = judgeApiClient('webSite');
	axios.defaults.headers['Content-Type'] = "application/json";



	new Vue({
		el: "#index",
		data:{
			upload:true,
			nothingImg:"./lib/image/zy.png",
			code:'',
      detail:"",
      recommend:[],
			type:"0",//0活动 1资讯
			orgId:"0712c430bcd711ea92f000163e05ff66",
			appId:"",
			formdate:  {
				"name":"",
				"telphone":"",
				"webchatNum":"",
			},
			openId:"",
			isGetting: false,
			accessToken:"",
			istxt:false,
			layer:0,
			time: 60,
			token:'',
			isLogin:"",
		},
		methods: {
			login(appId) {
				let url = encodeURIComponent(window.location.href);  // 注意一定要encodeURIComponent
				window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
			},
			toApp(){
				window.location.href = `https://www.yiqilaiwang.com/h5openapp2/app.html`;
			},
			getDetail(){
				// alert('详情token:'+ this.token)
				var that = this;
				var url = "h5/org/h5FriendsHomeInfo";
				axios({
					url: BASE_URL + url,
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:{
						"orgId":that.orgId,
					}
				}).then((res) => {
					if(res.data.code == 200){
            var detail = res.data.data;
            // 成员数最多显示6个
            if(detail.userUrlList && detail.userUrlList.length > 6){
              detail.userUrlList = detail.userUrlList.slice(0,6);
            }
            detail.userUrlList.reverse();

            // 圈子介绍字数限制
            if(detail.orgIntroduce.length > 80){
              detail.orgIntroduce = detail.orgIntroduce.slice(0, 80)+"..."
            }
            this.detail = detail;
						this.getWxCode();
					}else{
						this.detail = '';
					}
				}).catch((error) => {
					// console.log(error)
				})
	  },
      getRecommend(){
        axios({
					url: BASE_URL + 'h5/org/h5RecommendFriends',
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:{
						"orgId":this.orgId,
					}
				}).then((res) => {
					if(res.data.code == 200){
            this.recommend = res.data.data;
					}
				}).catch((error) => {
				})
      },
			// 获取微信参数
			getWxCode(){
				var title = this.detail.orgName;
				var imgUrl = this.detail.orgUrl;
				var desc = this.detail.orgIntroduce;
				setWxShare(title, imgUrl, desc);
				setQYWxShare(title, imgUrl, desc);
			},

			tolayer(n){
				this.layer = n;
			},
			// 获取验证码
			getCode() {
				if (this.formdate.telphone.trim() == '') {
					// layer.msg('手机号不能为空');
					layer.open({
						content: '手机号不能为空',
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(this.formdate.telphone)) {
					layer.open({
						content: '手机号格式不正确',
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
					return
				}
				if (this.isGetting) return
				axios({
					url: BASE_URL +'h5/login/verificationCode',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: {
						type: '12',
						telPhone: this.formdate.telphone
					}
				}).then(res => {
					if(res.data.code == 200){
						layer.open({
							content: '发送成功',
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
						this.uid = res.data.data.uid;
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
						this.isGetting = true;
					}else if(res.data.msg.indexOf('验证码次数已达上限') != -1){
						layer.open({
							content: '今日获取验证码次数已达上限',
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
					}
				})
			},
			// 获取openid
			getOpenId(){
				// alert(getUrlParameter('code'))
				var that = this;
				axios({
					url: BASE_URL +'h5/login/getOpenId',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: {
						code:getUrlParameter('code')
					}
				}).then(res => {
					if(res.data.code == 200){
						this.openId = res.data.data.openId;
						this.accessToken = res.data.data.accessToken;
						this.isLogin = res.data.data.isLogin;
						if(res.data.data.isLogin){
							this.formdate.telphone = res.data.data.telephone;
							this.token = res.data.data.token;
							this.getDetail();
							save('token',res.data.data.token);
							this.formdate.name = res.data.data.realName;
							setTimeout(()=>{
								that.submit();
							},200)
						}else{
							// alert('绑定手机号')
							//弹窗绑定手机号
							this.layer = 3;
						}
					}
				}).catch((error) => {
					// console.log(error)
				})
			},
				// 点击/取消
			apply(){
				// 判断浏览器
				// alert(typeof WeixinJSBridge)
				if (typeof WeixinJSBridge == "undefined"){
					layer.open({
						content: '当前版本仅支持在微信浏览器内报名活动',
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
					return
				}
				if(appId){
					if(!getUrlParameter('code')){
					// if(!getUrlParameter('code') ){
						this.login(appId);
					}else if(!this.accessToken){
						this.getOpenId();
					}else if(!this.isLogin){
						this.layer = 3;
					}else if(this.isLogin){
						this.submit();
					} else{
						window.location.href = window.location.href.split('&code')[0];
					}
					
				}else{
					layer.open({	
						type:2,
						title: ['加载中', 'color: #eee;font-size:20px']
					});
				}

			},
			// 验证token
			checkToken(){
				axios({
					url: BASE_URL +'h5/actManage/h5CheckToken',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':this.token,
					},
					data: {}
				}).then(res => {
					if(res.data.code == 200){
						// alert('有token详情：'+ JSON.stringify(res.data))
						this.getDetail();
					}else{
						// alert('token删除')
						this.token = "";
						del('token');
					}
				}).catch((error) => {
					// console.log(error)
				})
			},
			//加入接口
			submit(){
				var that =this;
				axios({
					url: BASE_URL + 'h5/org/joinFriends',
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION
					},
					data:{
						'orgId':that.orgId,
						'token':that.token
					},
				}).then(res => {
					if(res.data.code == 200){
						that.istxt=true
						that.tolayer(4)
						that.getDetail();
					}else{
						layer.open({
							content: res.data.msg,
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
					}
				}).catch((error) => {
					console.log(error)
				})
			},
			// 绑定手机号
			bindTel(){
				var that = this;
				if (this.formdate.telphone.trim() == '') {
					layer.open({
						content: '手机号不能为空',
						skin: 'msg',
						time: 3
					});
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(this.formdate.telphone)) {
					layer.open({
						content: '手机号格式不正确',
						skin: 'msg',
						time: 3
					});
					return
				}
				if (this.formdate.verificationCode.trim() == '') {
					layer.open({
						content: '验证码不能为空',
						skin: 'msg',
						time: 3
					});
					return;
				}
				this.layer = 0;
				axios({
					url: BASE_URL +'h5/login/bindTel',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: {
						"openId": that.openId,
						"telephone":that.formdate.telphone,
						"accessToken":that.accessToken
					},
				}).then(res => {
					if(res.data.code == 200){
						// layer.open({
						// 	content: '登录成功',
						// 	skin: 'msg',
						// 	time: 4 //2秒后自动关闭
						// });
						this.token = res.data.data.token;
						this.submit();
						save('token',res.data.data.token);
						this.formdate.name = res.data.data.realName;
						this.isLogin = res.data.data.isLogin;

						if(!res.data.data.isLogin){
							that.isLogin = false;
							layer.open({
								content: '绑定失败',
								skin: 'msg',
								time: 3 //2秒后自动关闭
							});
						}
					}
				}).catch((error) => {
					// alert('绑定失败：'+JSON.stringify(error))
				})
			},
		},
		created() {
			this.orgId = getUrlParameter('orgid')? getUrlParameter('orgid'): this.orgId;
			this.getRecommend();
			if(fetch('token') && !getUrlParameter('code')){
				this.token  = fetch('token');
				// 验证是否失效
				this.checkToken();
			}else{
				this.getDetail();
			}
			if(getUrlParameter('code')){
				this.getOpenId();
			}
		},
	})

}
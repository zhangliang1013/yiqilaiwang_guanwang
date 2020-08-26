window.onload = function(){  

	axios.defaults.headers['api-version'] = VRESION;
	axios.defaults.headers['api-client'] = judgeApiClient('webSite');
	axios.defaults.headers['Content-Type'] = "application/json";



	new Vue({
		el: "#index",
		data:{
			upload:true,
			nothingImg:"./lib/image/shareActivity/zy.png",
			code:'',
			detail:"",
			type:"0",//0活动 1资讯
			layer:0,
			id:"",
			isexamineorg:false,
			isexamineorg1:false,
			isexaminept:false,
			isexaminept1:false,
			formdate:  {
				"activityId":"",
				"name":"",
				"telphone":"",
				"webchatNum":"",
				"idcard":"",
				"cusromize":"",
				"transportation":"",
				"enrollment":'',
				"remark":"",
				"company":"",
				"address":"",
				"email":"",
				"participationFields":[],
				"actAccompanying":[],
				'verificationCode':'',
				'perCapita':'',
			},
			isGetting: false,
			time: 60,
			wxConfig:"",
			openId:"",
			accessToken:"",
			money:0.01,
			parameter:'',
			appId:"",
			isLogin:"",
			isNext:false,
			isShow:false,
			isMore:false,
		},
		methods: {
			login(appId) {
				let url = encodeURIComponent(window.location.href);  // 注意一定要encodeURIComponent
				window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
			},
			toApp(){
				window.location.href = `https://www.yiqilaiwang.com/h5openapp2/app.html`;
			},
			 // 监听error 函数
			//  handleErrorFn (e) {
			// 	// 跳转失败
			// 	alert(e+ '跳转失败')
			//   },
			//   // 监听launch 函数
			//   handleLaunchFn (e) {
			// 	// 跳转成功
			// 	// alert(JSON.stringify(e)+'跳转成功')
			//   },
			getDetail(){
				// alert('详情token:'+ this.token)
				var that = this;
				var url = "h5/actManage/shareActManager";
				axios({
					url: BASE_URL + url,
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:{
						"actId":that.id,
						'token':that.token
					}
				}).then((res) => {
					if(res.data.code == 200){
						// alert('活动详情:'+ JSON.stringify(res.data))
						var detail = res.data.data;

						let reg = new RegExp('<p></p>', 'g')
						detail.activityProcess = detail.activityProcess.replace(reg, '');
						setTimeout(()=>{
							if(this.$refs.intro && this.$refs.intro.offsetHeight >= 200){
								this.isMore = true;
							}
						},300);

						if (detail.createTime) {
							detail.createTime = detail.createTime.substring(0, 16);
						}
						if (detail.actStartTime) {
							detail.actStartTime = detail.actStartTime.substring(0, 4) + '年' + detail.actStartTime.substring(5, 7) + '月' + detail.actStartTime.substring(8, 10) + '日 ' + detail.actStartTime.substring(11, 16);
						}
						if (detail.actEndTime) {
							detail.actEndTime = detail.actEndTime.substring(0, 4) + '年' + detail.actEndTime.substring(5, 7) + '月' + detail.actEndTime.substring(8, 10) + '日 ' + detail.actEndTime.substring(11, 16);
						}
						if (detail.applyEndTime) {
							detail.applyEndTime = detail.applyEndTime.substring(0, 4) + '年' + detail.applyEndTime.substring(5, 7) + '月' + detail.applyEndTime.substring(8, 10) + '日 ' + detail.applyEndTime.substring(11, 16);
						}
						if (res.data.data.actClass==2 && !that.type){
							if (res.data.data.isRecommend==0){
								if (res.data.data.actStatus==0){
									that.isexamineorg = true;
								} else if (res.data.data.actStatus == 2){
									that.isexamineorg1 = true;
								}
							} else if (res.data.data.isRecommend == 1){
								if (res.data.data.actStatus == 0) {
									that.isexamineorg = true;
								} else if (res.data.data.actStatus == 1 || res.data.data.actStatus == -1){
									if (res.data.data.recommendStatus==0){
										that.isexaminept = true;
									} else if (res.data.data.recommendStatus == 2){
										that.isexaminept1 = true;
									}
								}else if (res.data.data.actStatus == 2) {
									that.isexamineorg1 = true;
								}
							}
						}
						if(detail.contents){
							for(var item of detail.contents){
								if(item.contentType==0){
									item.content = item.content.trim().replace(/\n/g,"<br>");
								}
							}
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
			// 获取微信参数
			getWxCode(){
				if(this.type == 0){
					var title = this.detail.topic
					var imgUrl = this.detail.actPoster
				}else if(this.type.length == 4){
					var title = this.detail.title
					if(this.type == 1600){
						var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvdqfu1fv218sk132l6d41h221a.png"
					}else{
						var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvb2hm14volaf1atj1vn1da915.png"
					}
				}else{
					var title = this.detail.newsDigest
					var imgUrl = this.detail.imageUrl
				}
				var desc = '一起来往，常来常往';
				setWxShare(title, imgUrl, desc);
				setQYWxShare(title, imgUrl, desc);

				
				// var that = this;
				// axios({
				// 	url: BASE_URL + "wechat/portal/jsapiSignature/",
				// 	method: "post",
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		'api-client': judgeApiClient('wechat'),
				// 		'api-version': VRESION,
				// 	},
				// 	data: {
				// 		url: window.location.href,
				// 	}
				// }).then((res) => {
				// 	this.appId = res.data.appId;
				// 	layer.closeAll()

				// 	// setWxShare(title, imgUrl, desc,desc);
					

				// 	if(res.status == 200){
				// 		if(that.type == 0){
				// 			var title = that.detail.topic
				// 			var imgUrl = that.detail.actPoster
				// 		}else if(that.type.length == 4){
				// 			var title = that.detail.title
				// 			if(that.type == 1600){
				// 				var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvdqfu1fv218sk132l6d41h221a.png"
				// 			}else{
				// 				var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvb2hm14volaf1atj1vn1da915.png"
				// 			}
				// 		}else{
				// 			var title = that.detail.newsDigest
				// 			var imgUrl = that.detail.imageUrl
				// 		}
				// 		wx.config({
				// 			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				// 			appId:res.data.appId, // 必填，公众号的唯一标识
				// 			timestamp:res.data.timestamp, // 必填，生成签名的时间戳
				// 			nonceStr:res.data.nonceStr, // 必填，生成签名的随机串
				// 			signature:res.data.signature,// 必填，签名
				// 			jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
				// 		});
				// 		wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
				// 			wx.updateAppMessageShareData({ 
				// 				title: title, // 分享标题
				// 				desc: '一起来往，常来常往', // 分享描述
				// 				link: window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// 				imgUrl: imgUrl, // 分享图标
				// 				success: function () {
				// 					// 设置成功
				// 				}
				// 			})
			
				// 			wx.updateTimelineShareData({ 
				// 				title: title, // 分享标题
				// 				link: window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				// 				imgUrl: imgUrl, // 分享图标
				// 				success: function () {
				// 					// 设置成功
				// 				}
				// 			})
				// 		}); 
						
				// 		wx.error(function(res){
				// 			// wx信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开wx的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// 		});
				// 	}
				// });
			},
			getUrlParameter(name){
				name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
				var regexS = "[\\?&]"+name+"=([^&#]*)";
				var regex = new RegExp( regexS );
				var results = regex.exec(window.parent.location.href);
				if( results == null ) return ""; else {
					return results[1];
				}
			},
			// 报名
			submit(){
				var forFree = '';
				// 发起人
				// alert('报名:'+ JSON.stringify(this.detail))

				if(this.detail.creatorFlag==1){
					// 活动类型
					if(this.detail.actClass==1 || this.detail.actClass==2 && this.detail.orgActType == 1){
						forFree = true;
					}else{
						forFree = false;
					}
				}else{
					forFree = false;
				}
				// alert(forFree);
				if(this.detail.chooseConsume ==1 && !forFree){
					this.toPay();
					return 
					// toApp
					// layer.open({
					// 	type:0,
					// 	title: '提示',
					// 	content: '缴费',
					// 	className: 'toApp',
					// 	btn: ['缴费', '返回'],
					// 	yes: function(index){
					// 		alert('缴费')
					// 		layer.close(index);
					// 		// window.location.href = "https://www.yiqilaiwang.com/h5openapp2/app.html"
					// 	},
					// 	no: function(index){
					// 		layer.close(index);
					// 	},
					// });
				}
				if(this.detail.chooseConsume ==7 && !forFree && !this.isNext){
					this.layer = 1;
					return 
				}
				var that =this;
				axios({
					url: BASE_URL + 'h5/actManage/participation/save',
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:that.formdate
				}).then((res) => {
					// alert('报名'+JSON.stringify(res.data))
					if(res.data.code == 200){
						that.layer = 2;
						this.getDetail();
					}else{
						layer.open({
							content: res.data.msg,
							skin: 'msg',
							time: 3 //2秒后自动关闭
						});
						if(res.data.msg != '验证码不正确'){
							that.layer = 0;
						}
					}
				}).catch((error) => {
					// console.log(error)
				})
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
			pay(){
				layer.closeAll();
				this.layer = 0;
				if(this.wxConfig){
					if (typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
						}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady()); 
								document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
						}
					}else{
						this.onBridgeReady();
					}
				}
			},
			onBridgeReady(){
				var that = this;
				WeixinJSBridge.invoke(
					 'getBrandWCPayRequest', {
							"appId":this.wxConfig.appId,     //公众号名称，由商户传入 
							"timeStamp":this.wxConfig.timeStamp,         //时间戳，自1970年以来的秒数     
							"nonceStr":this.wxConfig.nonceStr, //随机串     
							"package":`prepay_id=${this.wxConfig.prepay_id}`,     
							"signType":"MD5",         //微信签名方式：     
							"paySign":this.wxConfig.paySign//微信签名 
					 },
					 function(res){
						 // alert('res.err_msg'+ JSON.stringify(res.err_msg))
						 if(res.err_msg == "get_brand_wcpay_request:ok" ){
							that.getDetail();
							that.layer = 2;
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						} 
				}); 
			},
			// 点击报名
			apply(){
				// 判断浏览器
				if (typeof WeixinJSBridge == "undefined"){
					layer.open({
						content: '当前版本仅支持在微信浏览器内报名活动',
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
					return
				}

				// 活动审核中
				if(this.detail.checkStatus !=1){	
					layer.open({
						content: '活动内容正在修改中，请稍后再试'
						,skin: 'msg'
						,time: 3 //2秒后自动关闭
					});
					return
				}
				//已报名
				if(this.detail.isJoin ==1){
					layer.open({
						content: '该活动您已报名，无需重复参加'
						,skin: 'msg'
						,time: 3 //2秒后自动关闭
					});
					return
				}
				//过期
				if(this.detail.status !=0 && this.detail.status !=1){
					layer.open({
						content: '该活动已过期，无法报名成功'
						,skin: 'msg'
						,time: 3 //2秒后自动关闭
					});
					return
				}
				// alert('code'+ !getUrlParameter('code') +' accessToken:'+!this.accessToken+ ' isLogin：'+this.isLogin)
				if(appId){
					if(!getUrlParameter('code') ){
					// if(!getUrlParameter('code') ){
						this.login(appId);
					}else if(!this.accessToken){
						this.getOpenId();
					}else if(!this.isLogin){
						this.layer = 3;
					}else if(this.isLogin){
						this.submit();
					}else{
						window.location.href = window.location.href.split('&code')[0];
					}
				}else{
					layer.open({	
						type:2,
						title: ['加载中', 'color: #eee;font-size:28px']
					});
				}
			},
			// 获取openid
			getOpenId(){
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
					// alert(JSON.stringify(res.data))
					// alert(JSON.stringify(res))
					if(res.data.code == 200){
						// alert(JSON.stringify(res.data.data)+ '获取openid信息')
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
							//弹窗绑定手机号
							this.layer = 3;
						}
					}
				}).catch((error) => {
					alert('getOpenId：'+JSON.stringify(error))
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
						"openId": this.openId,
						"telephone":this.formdate.telphone,
						"accessToken":this.accessToken
						}
				}).then(res => {
					// alert('绑定手机号参数'+JSON.stringify(res.data))
					if(res.data.code == 200){
						// layer.open({
						// 	type:2,
						// 	title: ['请稍后', 'color: #eee;font-size:28px']
						// });
						this.token = res.data.data.token;
						this.getDetail();
						save('token',res.data.data.token);
						this.formdate.name = res.data.data.realName;
						this.isLogin = res.data.data.isLogin;
						// alert('res.data.data.isLogin：'+res.data.data.isLogin)
						if(res.data.data.isLogin){
							setTimeout(()=>{
								// alert('this:'+JSON.stringify(this))
								that.layer = 0;
								that.isAllow();
							},200)
						}else{
							// console.log('登录失败')
							layer.open({
								content: '绑定失败',
								skin: 'msg',
								time: 3 //2秒后自动关闭
							});
						}
					}

				})
			},
			// 支付
			toPay(){

				if(this.detail.chooseConsume ==7 && !this.formdate.perCapita){
					layer.open({
						content: '请输入缴纳金额',
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
					return
				}
				if(this.detail.chooseConsume ==1){
					this.formdate.perCapita = this.detail.perCapita
				}
				// this.formdate.telphone = '17554158983';
				// this.formdate.name = 'Yuweilll';
				// this.token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI3ODliMDA3NGZhMTMxMWU5OTQ1MjAwMTYzZTA1ZmY2NiIsImlhdCI6MTU5NDg2OTI1Nywic3ViIjoiMTc1NTQxNTg5ODMifQ.lXi4QyNWNEGeTCs0EySbKdetaXSlDy540M6myjGta9U'
				axios({
					url: BASE_URL + 'h5/actManage/wxpay/pay',
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':this.token,
					},
					data:{
						"activityId":getUrlParameter('id'),
						"payWay": 2,
						"name":this.formdate.name,
						"telphone":this.formdate.telphone,
						"perCapita":this.formdate.perCapita,
						"paymentAmount":this.formdate.perCapita,
					}
				}).then((res) => {
					// alert(JSON.stringify(res.data))
					if(res.data.code == 200){
						this.wxConfig = res.data.data.prepayDate;
						this.pay()
					}else{
						layer.open({
							content: res.data.msg
							,skin: 'msg'
							,time: 3 //2秒后自动关闭
						});
					}
				}).catch((error) => {
					// console.log(error)
				})
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
			// 验证报名权限
			isAllow(){
				var that = this;
				axios({
					url: BASE_URL +'h5/actManage/checkAuth',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':that.token
					},
					data: {
						"activityId":that.id,
						}
				}).then(res => {
					// alert('权限判定'+JSON.stringify(res.data))
					if(res.data.code == 200){
						if(res.data.data){
							// 请求报名
							this.submit();
						}else{
							layer.closeAll()
							layer.open({
								content: '您暂无报名权限，请联系活动发起人',
								skin: 'msg',
								time: 3 //2秒后自动关闭
							});
						}
					}
				})
			},
		},
		created() {
			this.id = getUrlParameter('id')? getUrlParameter('id'): this.id;
			this.formdate.activityId = this.id;
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

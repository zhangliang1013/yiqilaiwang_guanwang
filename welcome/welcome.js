window.onload = function(){  

	axios.defaults.headers['api-version'] = VRESION;
	axios.defaults.headers['api-client'] = judgeApiClient('webSite');
	axios.defaults.headers['Content-Type'] = "application/json";



	new Vue({
		el: "#index",
		data:{
			upload:true,
			nothingImg:"./zy.png",
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
			// 弹幕
            dmData: [],
    },
    watch:{
      layer(val){
        if(val == 2){
          setTimeout(()=>{
            this.layer = 4
          },3000)
        }
        if(val == 4){
          setTimeout(()=>{
            window.location.href = BASE_URL + 'h5/share_pages/shareAssociation.html?orgId=ebc55097d16c11eaa31200163e05ff66&type=9'
          },10000)
        }
      }
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
				var url = "h5/login/queryWelcome";
				axios({
					url: BASE_URL + url,
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:{}
				}).then((res) => {
					if(res.data.code == 200){
						// alert('活动详情:'+ JSON.stringify(res.data))
						var detail = res.data.data;
						this.detail = detail;

						// this.getWxCode();
					}else{
						this.detail = null;
					}
				}).catch((error) => {
					// console.log(error)
				})
			},
			// 获取微信参数
			getWxCode(){
				var desc = '一起来往，常来常往';
				if(this.type == 0){
					var title = this.detail.topic;
					var imgUrl = this.detail.actPoster;
				}else if(this.type.length == 4){
					var title = this.detail.title
					// 政策
					if(this.type == 1600){
						var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvdqfu1fv218sk132l6d41h221a.png"
						desc = '';
					}else{
						// 1201：商务资讯
						var imgUrl = "https://img.yiqilaiwang.com/o_1e6kvb2hm14volaf1atj1vn1da915.png"
						desc = '精彩内容，不容错过';
					}
				}else{
					if(this.detail.messageType ==1){
						desc = '精彩内容，不容错过';
					}else if(this.detail.messageType ==3 || this.detail.messageType ==15){
						desc = '重要通知请查收';
					}
					var title = this.detail.newsDigest
					var imgUrl = this.detail.imageUrl
				}
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
        
        // 判断时间
        console.log(new Date().getTime(),new Date('2020/08/07 17:00:00').getTime());
        if(new Date().getTime() < new Date('2020/08/07 17:00:00').getTime()){
          this.toJoin();
          return 
        }
				if(appId){
					if(!getUrlParameter('code') ){
						this.login(appId);
					}else if(!this.openId){
						this.getOpenId();
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
					url: BASE_URL +'h5/login/welcomeOpenId',
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
					if(res.data.code == 300){
            save('info',JSON.stringify(res.data.data));
            this.openId = res.data.data.openId;
            // 烟花
            this.layer = 2;
          }else{
            this.toJoin();
          }
					
				}).catch((error) => {
					// console.log(error)
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
						save('token',res.data.data.token);
						this.formdate.name = res.data.data.realName;
						// alert('res.data.data.isLogin：'+res.data.data.isLogin)
						if(res.data.data.isLogin){
              this.getDetail();
              // 展示烟花

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
            // 展示弹幕
					}else{
						this.token = "";
						del('token');
					}
				}).catch((error) => {
					// console.log(error)
				})
			},
      toJoin(){
        var index='';
        index = layer.open({
          type:0,
          content:'活动尚未开始，请稍后再试！',
          btn: ['确定'],
          yes: function(index){
            layer.close(index);
            // window.location.href = "https://www.yiqilaiwang.com/h5openapp2/app.html"
          },
        })
      },
			//获取弹幕列表
			getdm(){
				var that = this;
				axios({
					url: BASE_URL +'h5/login/queryWelcome',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':that.token
					},
				}).then(res => {
					that.dmData=res.data.data
					console.log('弹幕',that.dmData)
					that.parameters(that.dmData)
				})
			},
			//处理弹幕参数
			parameters(e) {
				const dmArr = [];
				const _b = e;
				for (let i = 0; i < _b.length; i++) {
					const time = Math.floor(Math.random() * 10);
					const second = Math.floor(Math.random() * 60);
					const _time = time < 6 ? 6 + i : time + i;
					const top = Math.floor(Math.random() * 80) + 2;
					const _p = {
						openId: _b[i].openId,
						nickName: _b[i].nickName,
						avatarUrl: _b[i].avatarUrl,
						top,
						second,
						time: _time,
					};
					dmArr.push(_p);
				}
				this.dmData = dmArr
			}
		},
	created() {
      this.getWxCode();

      // 弹幕
      this.getdm()
      if(fetch('info')&&JSON.parse(fetch('info')).openId){
        if(new Date().getTime() < new Date('2020/08/07 17:00:00').getTime()){
          this.toJoin();
          return 
        }
        this.layer = 4;
      }

			if(getUrlParameter('code')){
				this.getOpenId();
      }
		},
	})

}

window.onload = function(){  

	new Vue({
		el: "#index",
		data:{
			detail:"",
			upload:true,
			type:"",//0活动 1资讯
			isexamineorg:false,
			isexamineorg1:false,
			isexaminept:false,
			isexaminept1:false,
			pageNumber:1,
			participantList:[],
			participantListnum:"",
			participantListpages:"",
			nothingImg:"./lib/image/shareDetails/zy.png",
		},
		methods: {
			getDetail(){
				var that = this;
				var url = "";
				if(that.type==1){
					url = "webSite/orgMessage/newInfo";
				}else if(that.type.length == 4){
					url = "app/businessGov/govInfoDetails"
				}else{
					url = "webSite/activity/newActivityDetail";
				}
				axios({
					url: BASE_URL + url + "?time="+ new Date().getTime() + "&uid=",
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						// 'api-client': that.type.length == 4?'583f20e7172411ea995200163e05ff66':'7b4c5037b6a411e98e5b00163e063254',
						'api-client': judgeApiClient(url),
						'api-version': VRESION,
					},
					data:{"id":that.id}
				}).then((res) => {
					if(res.data.code == 200){
						var detail = res.data.data;
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
					}
				}).catch((error) => {
					// console.log(error)
				})
			},
			//已报名名单
			getParticipantList(a){
				var that = this;
				axios({
					url: BASE_URL + "webSite/act/participation/newParticipantList?time=" + new Date().getTime() + "&uid=",
					method: "post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: {
						activityId: that.id,
						type:1,
						pageNumber:that.pageNumber,
						pageSize:10,
					}
				}).then((res) => {
					if (200 == res.data.code) {
						that.participantListnum = res.data.data.total;
						that.participantListpages = res.data.data.totalPages;
						if(a==1){
							that.participantList = res.data.data.rows;
						}else{
							that.participantList = that.participantList.concat(res.data.data.rows);
						}
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
						desc = ' ';
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
			getUrlParameter(name){
				name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
				var regexS = "[\\?&]"+name+"=([^&#]*)";
				var regex = new RegExp( regexS );
				var results = regex.exec(window.parent.location.href );
				if( results == null ) return ""; else {
					return results[1];
				}
			},
			copy(){
				console.log('copy')
				var text = document.getElementById("text").innerText;
				var input = document.getElementById("input");
				input.value = text; // 修改文本框的内容
				input.select(); // 选中文本
				document.execCommand("copy"); // 执行浏览器复制命令
				// alert("复制成功");
			},
		},
		created() {
			this.id = getUrlParameter('id');
			this.orgId = getUrlParameter('orgid');
			this.type = getUrlParameter('type');
			this.getDetail();
			if(!(this.type *1)){
				this.getParticipantList();
			}
		},
	})

}
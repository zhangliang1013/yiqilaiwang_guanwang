$(function(){
	var load = layer.open({
		type:2,
		title: ['加载中', 'color: #eee;font-size:20px;']
	});
	var videoUrl = '';
	var article_id = -1;
	var params = getQueryParams(), postId = params["id"];
	var verInfo = detectVersion();

	// 阻止滑动时误触
	function stopTouchendPropagationAfterScroll(){
		var locked = false;

			window.addEventListener('touchmove', function(ev){
					locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
			}, true);
			function stopTouchendPropagation(ev){
					ev.stopPropagation();
					window.removeEventListener('touchend', stopTouchendPropagation, true);
					locked = false;
			}
	}
	stopTouchendPropagationAfterScroll();

	// var html = `<video style="margin-top:5px; background:black" width="100%" height="214px" webkit-playsinline="true" playsinline="true" controls="" controlslist="nodownload" poster="https://img.yiqilaiwang.com/FvCK9R8pKyZ-mEw6e4whKatPpno3?vframe/jpg/offset/0/imageView2/1/q/30/format/jpg/ignore-error/1"> <source src="https://img.yiqilaiwang.com/FvCK9R8pKyZ-mEw6e4whKatPpno3" type="video/mp4"></video>`
	// $("#index").html(html);


	function fillArticle(rsp){//填充文章数据
		if (rsp.code==200){
			var postMsg = rsp.data;
			$(".body").removeClass("hide");
			$(".article").attr("aid", postId);
			$(".author img").attr("src", postMsg.avatarUrl);
			$(".author .author-name").children().eq(0).text(postMsg.userName);
			$(".author .author-name").children().eq(1).text(postMsg.company);
			$(".author .pub-time").text(postMsg.createTime);
			$(".read-cnt").text("（已有"+postMsg.browseCount+"人阅读）");

			if(postMsg.content){
				// postMsg.content = '我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教我的手工作品，多多指教1';
				var content = postMsg.content.replace(/\n/g, "<br />");
				var content1 = postMsg.content.replace(/\n/g, "<br />");
				if(content.length > 138){
					content = content.substring(0,138) + '... <span style="color:#2168EB" class="to-read">阅读全文</span>'
				}
				$(".article section").html(content+"<br>");
				//点阅读全文
				$(".to-read").on("click", function(){
					// window.location.href = `https://www.yiqilaiwang.com/h5openapp2/app.html`;
					$(".article section").html(content1+"<br>");
				});
			}else{
				$(".article section").html(" ");
			}
			$(".org img").attr("src", postMsg.orgUrl);
			$(".org .org-name").text(postMsg.orgName);
			$(".org .mem-info").text("成员 "+postMsg.userCount+"   帖子 "+postMsg.postCount);
			// 帖子图片列表
// 			postMsg.imgCollection=[{fileExtension: "jpg",
// 			fileName: "wx_camera_1596699559829.jpg",
// 			fileSize: 0,
// 			fileType: 1,
// 			fileUrl: "https://img.yiqilaiwang.com/Fht6t3sqjdeMM50bdl7t4kT16Dvc",
// 			firstUrl: "",
// 			height: 960,
// 			id: "1288bbbfe29411ea813300163e063254",
// 			messageId: "",
// 			sort: 1,
// 			videoTime: 0,
// 			width: 1920},
// 			{
// 				fileExtension: "jpg",
// 				fileName: "P00806-154145.jpg",
// 				fileSize: 0,
// 				fileType: 1,
// 				fileUrl: "https://img.yiqilaiwang.com/lgdbSkiT1MM7q89IMFXVo17um0iZ",
// 				firstUrl: "",
// 				height: 3024,
// 				id: "1288e1d2e29411ea813300163e063254",
// 				messageId: "",
// 				sort: 2,
// 				videoTime: 0,
// 				width: 4032},
// {
// 				fileExtension: "",
// fileName: "",
// fileSize: 0,
// fileType: 1,
// fileUrl: "https://img.yiqilaiwang.com/FuNopTTlszrx9rXCEiUofWgLya_h",
// firstUrl: "",
// height: 1980,
// id: "f81e1db1dc4111ea813300163e063254",
// messageId: "",
// sort: 3,
// videoTime: 0,
// width: 3520,
// 			},
// {
// 				fileExtension: "",
// fileName: "",
// fileSize: 0,
// fileType: 1,
// fileUrl: "https://img.yiqilaiwang.com/FiPjQfVoVlwo_wKk-aNTbvFiXLOD",
// firstUrl: "",
// height: 3024,
// id: "f81e4890dc4111ea813300163e063254",
// messageId: "",
// sort: 4,
// videoTime: 0,
// width: 4032,
// 			},
// {
// 				fileExtension: "",
// fileName: "",
// fileSize: 0,
// fileType: 1,
// fileUrl: "https://img.yiqilaiwang.com/Fu7UzI_CNLGVrRh79tK1-1PxskZt",
// firstUrl: "",
// height: 3024,
// id: "f81e70ccdc4111ea813300163e063254",
// messageId: "",
// sort: 5,
// videoTime: 0,
// width: 4032,},
// 			{	fileExtension: "",
// 				fileName: "",
// 				fileSize: 0,
// 				fileType: 1,
// 				fileUrl: "https://img.yiqilaiwang.com/FvpN0HC2SQGmBmh-rtMOZueRd0N_",
// 				firstUrl: "",
// 				height: 3024,
// 				id: "f81e9959dc4111ea813300163e063254",
// 				messageId: "",
// 				sort: 6,
// 				videoTime: 0,
// 				width: 4032,},
// 				{	fileExtension: "",
// 				fileName: "",
// 				fileSize: 0,
// 				fileType: 1,
// 				fileUrl: "https://img.yiqilaiwang.com/FvpN0HC2SQGmBmh-rtMOZueRd0N_",
// 				firstUrl: "",
// 				height: 3024,
// 				id: "f81e9959dc4111ea813300163e063254",
// 				messageId: "",
// 				sort: 6,
// 				videoTime: 0,
// 				width: 4032,}
// ]
			var posterImg = '';
			if (postMsg.imgCollection.length>0){
				$(".article .img-list").removeClass("hide");
				var imgList = $(".article .img-list");
				var imgBox = $(".article .img-list .img-box");
				var imgBoxHide = $(".article .img-list .img-box.hide");
				var itemsImg = $(".article .img-list .img-box img");
				var index = 0;
				for(var i=0; i<postMsg.imgCollection.length; i++){
					let imgCollectionLength = i;
					if(postMsg.imgCollection[i].fileType != 3){
						index++;
						posterImg = postMsg.imgCollection[0].fileUrl;
						var url = postMsg.imgCollection[i].fileUrl;
						imgBox.eq(imgCollectionLength).removeClass("hide");

						itemsImg.eq(imgCollectionLength).attr("src", url + '?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png');
						// console.log('height:',$(".article .img-list .img-box"))
						
						if(itemsImg.eq(imgCollectionLength)[0] && itemsImg.eq(imgCollectionLength)[0].offsetWidth){
							setTimeout(()=>{
								if(itemsImg.eq(imgCollectionLength)[0].offsetWidth >= itemsImg.eq(imgCollectionLength)[0].offsetHeight && postMsg.imgCollection[imgCollectionLength].fileType != 3){
									itemsImg.eq(imgCollectionLength).addClass("width-long");
								}else if(postMsg.imgCollection[imgCollectionLength].fileType != 3){
									itemsImg.eq(imgCollectionLength).addClass("height-long");
								}
								imgBox.eq(imgCollectionLength)[0].style.height = $(".article .img-list .img-box")[0].clientWidth + 'px'; 
								imgClick();
							},300)
						}else{
							setTimeout(()=>{
								// console.log(imgCollectionLength,itemsImg.eq(imgCollectionLength)[0].offsetWidth)
								if(itemsImg.eq(imgCollectionLength)[0].offsetWidth >= itemsImg.eq(imgCollectionLength)[0].offsetHeight && postMsg.imgCollection[imgCollectionLength].fileType != 3){
									itemsImg.eq(imgCollectionLength).addClass("width-long");
								}else if(postMsg.imgCollection[imgCollectionLength].fileType != 3){
									itemsImg.eq(imgCollectionLength).addClass("height-long");
								}
								imgBox.eq(imgCollectionLength)[0].style.height = $(".article .img-list .img-box")[0].clientWidth + 'px'; 
								imgClick();
							},1000)
						}


					// 处理视频
					}else{
						videoUrl = postMsg.imgCollection[i].fileUrl;
						$(".article .img-list .video-box").removeClass("hide");
						$(".article .img-list .video-box .img").attr("src",postMsg.imgCollection[i].firstUrl)
						setTimeout(()=>{
							if($(".article .img-list .video-box .img")[0].offsetHeight < 200){
								$(".article .img-list .video-box .img").css('transform','translateY(0)')
							}
						},500)
					}
					// console.log('imgCollectionLength:'+imgCollectionLength)
				}
				// console.log('index'+index)
				if(index ==1){
					imgBox.eq(0)[0].style.width = '100%'; 
					imgBox.eq(0)[0].style.height = $(".article .img-list .img-box")[0].clientWidth + 'px'; 
				}
				if(index==4 || index==2){
					imgBox.eq(1).css("margin-right","30px");
					imgBox.eq(3).css("margin-right","30px");
				}


			}
			//点赞者列表
			if (postMsg.thumbsList.length>0){
				var items = $(".fans-list .fans-pic");
				items.addClass("hide");
				for(var i=0; i<postMsg.thumbsList.length && i<6; i++){
					var url = postMsg.thumbsList[i];
					items.eq(i).removeClass("hide").attr("src", url);
				}
			}
			if(postMsg.commentsCount != 0){
				$(".comments").removeClass("hide");
			}
			$(".fans-list .agree").text(postMsg.thumbsCount);
			$(".fans-list .cmt").text(postMsg.commentsCount);
			//评论列表
			if (postMsg.comments.length>0){
				var items = $(".comments .cmt-item");

				for(var i=0; i<postMsg.comments.length && i<3; i++){
					var cmt = postMsg.comments[i];
					var it = items.eq(i).removeClass("hide");
					it.children(".cmt-user").text(cmt.realName);
					it.children(".cmt-text").text(cmt.content);
					if(cmt.picturesUrl.length){
						it.children(".cmt-img").removeClass("hide");
						it.children(".cmt-text").css('max-width','calc(70% - 79px)')
					}	
				}
				imgClickRemark(postMsg.comments);
			}
			if(postMsg.comments.length > 3){
				$(".more").removeClass("hide");
				$(".more .cmt-user").text("查看全部" + postMsg.comments.length + "条评论及回复");
			}

			//设置微信分享
			var title = '一起来往 . 圈子 . 帖子';
			if (postMsg.imgCollection.length==0 || !posterImg){
				imgUrl = "https://img.yiqilaiwang.com/o_1ea3olf5j1qqdhan1aq113cv16lrg.png?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png";
			}else{
				imgUrl = posterImg
			}
			var desc = postMsg.content;
			setWxShare(title, imgUrl, desc,desc);
			setQYWxShare(title, imgUrl, desc,desc);
			
			//取推荐列表
			$.ajax({
				url:  BASE_URL + "/h5/org/h5EssencesPost",
				headers: {"api-version":VRESION,"api-client":judgeApiClient('webSite')},
				contentType: "application/json; charset=utf-8",
				type: "POST",
				data: JSON.stringify({"orgId":postMsg.orgId}),
				dataType: "json",
				success: function(rsp){
					fillRecomments(rsp);
				},
				error: function(xhr, msg){
					alert("错误："+msg);
				}
			});
		
		}
	}

	//填充推荐列表
	function fillRecomments(rsp){
		if (rsp.code==200){
			var list = rsp.data;
			if (list.length>0){
				var items = $(".article-list .list-item");
				var it = null;

				for(var i=0; i<list.length; i++){
					var ar = list[i];

					if (i==0) it = items.eq(0);
					else{
						it = items.eq(0).clone();
						$(".article-list").append(it);
					}

					it.removeClass("hide").attr("aid", ar.id);
					if(ar.content){
						it.children(".item-title").text(ar.content);
					}else{
						it.children(".item-title").text('更多精彩内容，尽在一起来往');
					}
					if(ar.imageUrl){
						it.children(".item-pic").css({
							"background":"url("+ar.imageUrl+") no-repeat",
							"background-size":"100% 100%"
						});
					}else{
						it.children(".item-pic").css({
							"background":"url(https://img.yiqilaiwang.com/o_1ecrnaf5rvchoe5eav1o5a11fdg.png?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png) no-repeat",
							"background-size":"100% 100%"
						});
					}
				}
			}
		}
	}
	//推荐文章列表项
	$(".article-list").on("click", ".list-item", function(){
		$(".modal-layer").removeClass("hide");

		article_id = $(this).attr("aid");//点击的文章id
	});
	//关闭对话框按钮
	$(".modal-layer .close-dlg").on("click", function(){
		$(".modal-layer").addClass("hide");
	});

	var loadImg = '';
	let tem = "";
	let imgArr= [];
	let tems = '<div class="modelTost swiper-no-swiping">' +
					'<div class="modelTostChile">' +
						'<div class="img-close"><div class="modelCloseBox" style="padding:10px"><img class="modelClose" style="width:30px;height:30px" src="./images/xxtz2@2x.png" alt=""></div></div>' +
						'<div class="swiper-container">' +
							'<div class="swiper-wrapper"></div>' +
							'<div class="swiper-button-next"></div>' +
							'<div class="swiper-button-prev"></div>' +
						'</div>' +
					'</div>'+
				'</div>'
	function imgClick() {
		$(".article .img-list .img-box img").on('touchend',function(ev) {
			ev.stopPropagation(); 
			loadImg = layer.open({
				type:2,
			});
			tem=''//初始化防止多追加；
			imgArr= [];
			let slideIndex = 0;
			let attrs = $(this).attr('src');
			//	点击在body中追加弹框
			$('body').append(tems);
			//	找到当前图片的最外层父元素下的所有图片
			let imgArrList = $(this).parents('.img-list').find('.img-box img');
			console.log(imgArrList)
			let imgHide = $(this).parents('.img-list').find('.img-box.hide');
			//	追加图片数组
			for(var i = 0 ;i < imgArrList.length;i++){
				imgArr.push(imgArrList.eq(i).attr('src'))
			}
			//	图片数组与点击src做匹配,获取对应index
			imgArr.forEach((item,index) => {
				if(attrs === item){
					slideIndex = index
				}
			})
			//	弹框中追加对应数组swiper
			for(var i = 0; i < imgArrList.length - imgHide.length ; i++) {
				tem += "<div class='swiper-slide'><img src='" + imgArr[i] + "'></div>"
			}
			layer.close(loadImg)
			$(".swiper-wrapper").append(tem);
			$('.modelTost').fadeIn(500);
			
			var mySwiper = new Swiper('.swiper-container', {
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				observer: true,
				observeParents: true,
				initialSlide: slideIndex
			});
			$('.swiper-container').children('.swiper-notification').eq(0).siblings('.swiper-notification').remove()
		})
	}
	function imgClickRemark(arr) {
		$(".comments .cmt-item .cmt-img").each(function(a){
			$(this).on('touchend',function(ev) {

				// console.log(a)
				// return
				ev.stopPropagation(); 
				loadImg = layer.open({
					type:2,
				});
				tem=''//初始化防止多追加；
				imgArr= [];
				let slideIndex = 0;
				// let attrs = $(this).attr('src');
				// // console.log(attrs)
				// //	点击在body中追加弹框
				$('body').append(tems);
				imgArr = arr[a].picturesUrl;
				// //	弹框中追加对应数组swiper
				for(var i = 0; i < imgArr.length; i++) {
					tem += "<div class='swiper-slide'><img src='" + imgArr[i] + "'></div>"
				}
				layer.close(loadImg)
				$(".swiper-wrapper").append(tem);
				$('.modelTost').fadeIn(500);
				
				var mySwiper = new Swiper('.swiper-container', {
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
					observer: true,
					observeParents: true,
					initialSlide: slideIndex
				});
				$('.swiper-container').children('.swiper-notification').eq(0).siblings('.swiper-notification').remove()
			})
		})
	}
	$('body').on('touchend','.modelCloseBox',function(){
		$('.modelTost').remove();
	})


	// vue
	new Vue({
		el:'#index',
		data:{
			token:'',
			openId:'',
			accessToken:'',
			isLogin:'',
			formdate:{
				telphone:'',
				name:'',
				verificationCode:'',
			},
			layer:0,
			isThumbs:0,
			isGetting: false,
			time: 60,
			uid:"",
			orgName:'',
			orgId:'',
			isJoin:'',
			detail:null,
		},
		methods:{
			login(appId) {
				// alert(appId);
				let url = encodeURIComponent(window.location.href);  // 注意一定要encodeURIComponent
				window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
			},
			toApp(){
				window.location.href = `https://www.yiqilaiwang.com/h5openapp2/app.html`;
			},
			toActivity(){
				window.location.href = BASE_URL+ `h5/shareActivity.html?id=` + this.detail.act.id;
			},
			// 验证token
			checkToken(){
				var that = this;
				$.ajax({
					url: BASE_URL +'h5/actManage/h5CheckToken',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':that.token,
					},
					data: {},
					success: function(res){
						if(res.code == 200){
							// alert('有token详情：'+ JSON.stringify(res.data))
							that.getDetail();
						}else{
							// alert('token删除')
							that.token = "";
							del('token');
						}
					},
					error: function(xhr, msg){
						// alert("验证token错误："+msg);
					}
				});
			},
			getDetail(){
				var that = this;
				var url = "/h5/org/h5EssencesPost";
				//加载资讯数据
				$.ajax({
					url: BASE_URL +"/h5/org/h5PostInfo",
					headers: {
						"api-version":VRESION,
						"api-client":judgeApiClient('webSite'),
					},
					contentType: "application/json; charset=utf-8",
					type: "POST",
					data: JSON.stringify({
						"id":postId,
						token:that.token,
					}),
					dataType: "json",
					success: function(rsp){
						layer.close(load)
						that.orgName = rsp.data.orgName;
						that.orgId = rsp.data.orgId;
						that.isJoin = rsp.data.isJoin;
						that.isThumbs = rsp.data.isThumbs;
						that.detail = rsp.data;
						// that.detail.act={
						// 	actAddress: "地址",
						// 	actPoster: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596705628607&di=d43513762e82ed14701090f421e9be0d&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F22%2F59%2F19300001325156131228593878903.jpg',
						// 	actStartTime: "2020.08.06",
						// 	id: "41014a14cc0311eaa31200163e05ff66",
						// 	topic: "美食节门票团购活动",
						// }
						// console.log(that.detail)
						// alert(JSON.stringify('token:'+Boolean(that.token) +'详情点赞'+rsp.data.isThumbs))
						fillArticle(rsp);
					},
					error: function(xhr, msg){
						// alert("错误："+msg);
					}
				});
			},
			// 获取openid
			getOpenId(){
				var that = this;
				$.ajax({
					url: BASE_URL +'h5/login/getOpenId',
					method: 'post',
					headers: {
						'Content-Type': "application/json;charset=utf-8",
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data:JSON.stringify({"code":getUrlParameter('code')}),
				
					dataType: "json",
					success: function(res){
						if(res.code == 200){
							that.openId = res.data.openId;
							that.accessToken = res.data.accessToken;
							that.isLogin = res.data.isLogin;
							if(res.data.isLogin){
								that.formdate.telphone = res.data.telephone;
								that.formdate.name = res.data.realName;
								that.token = res.data.token;
								save('token',res.data.token);
								if(fetch('clickType') ==1){
									layer.open({
										content: '登录成功',
										skin: 'msg',
										time: 4 //2秒后自动关闭
									});
									that.getDetail();
									
								}else{
									that.submit2();
								}
							}else{
								//弹窗绑定手机号
								that.layer = 3;
							}
						}
					},
					error: function(xhr, msg){
						// alert('openid:'+ xhr, msg)
					}
				})
			},
			//点赞接口
			submit(n){
				var that =this;
				// alert('点赞：'+ that.isThumbs)
				if(n==1){
					var url = 'h5/org/thumbs';
					var data = JSON.stringify({
						"thumbsId":postId,
						"type":13,
						"status":that.isThumbs,
					})
				}else{
					var url = 'h5/org/joinFriends';
					var data = JSON.stringify({
						"orgId": that.orgId,
						"token":that.token,
					})
				}
				$.ajax({
					url: BASE_URL + url,
					method:"post",
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
						'token':that.token
					},
					data:data,
					success: function(res){
						if(res.code == 200){
							if(n ==1){
								layer.open({
									content:'操作成功',
									skin: 'msg',
									time: 3 //2秒后自动关闭
								});
								that.getDetail();
							}else{
								that.layer = 4
							}
						}
					},
					error: function(xhr, msg){
						// alert('点赞'+ xhr+1+ msg)
					}
				})
			},
			//点赞接口
			submit2(){
				var that = this;
				var url = "/h5/org/h5EssencesPost";
				//加载资讯数据
				$.ajax({
					url: BASE_URL +"/h5/org/h5PostInfo",
					headers: {
						"api-version":VRESION,
						"api-client":judgeApiClient('webSite'),
					},
					contentType: "application/json; charset=utf-8",
					type: "POST",
					data: JSON.stringify({
						"id":postId,
						token:that.token,
					}),
					dataType: "json",
					success: function(rsp){
						that.orgName = rsp.data.orgName;
						that.orgId = rsp.data.orgId;
						that.isJoin = rsp.data.isJoin;
						that.isThumbs = rsp.data.isThumbs;
						// alert(JSON.stringify('token:'+Boolean(that.token) +'详情点赞'+rsp.data.isThumbs))
						fillArticle(rsp);
						if(rsp.data.isJoin !=1){
							that.submit(2);
						}else{
							that.layer = 4
						}
					},
					error: function(xhr, msg){
						// alert("错误："+msg);
					}
				});
			},
			// 点赞/取消
			apply(n){
				save('clickType',n);
				if(this.token && this.isJoin ==1 && n == 2){
					this.toApp();
					return
				}
				// 判断浏览器
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
					}else if(this.token){
						this.submit(n);
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
			// 获取验证码
			getCode() {
				var that = this;
				if (this.formdate.telphone.trim() == '') {
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
				if (that.isGetting) return
				$.ajax({
					url: BASE_URL +'h5/login/verificationCode',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: JSON.stringify({
						type: '12',
						telPhone: that.formdate.telphone
					}),
					success: function(res){
						res.data = res
						if(res.data.code == 200){
							layer.open({
								content: '发送成功',
								skin: 'msg',
								time: 3 //2秒后自动关闭
							});
							that.uid = res.data.data.uid;
							//调用定时器 d
							var timer = setInterval(() => {
								if (that.time <= 0) {
									clearInterval(timer)
									timer = null
									that.time = 60
									that.isGetting = false
								} else {
									that.time--
								}
							}, 1000)
							that.isGetting = true;
						}else if(res.data.msg.indexOf('验证码次数已达上限') != -1){
							layer.open({
								content: '今日获取验证码次数已达上限',
								skin: 'msg',
								time: 3 //2秒后自动关闭
							});
						}
					},
					error: function(xhr, msg){
						// alert("错误getCode："+msg);
					}
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
				$.ajax({
					url: BASE_URL +'h5/login/bindTel',
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						'api-client': judgeApiClient('webSite'),
						'api-version': VRESION,
					},
					data: JSON.stringify({
						"openId": that.openId,
						"telephone":that.formdate.telphone,
						"accessToken":that.accessToken
					}),
					success: function(res){
						// alert(JSON.stringify(res))
						if(res.code == 200){
							that.token = res.data.token;
							save('token',res.data.token);
							that.formdate.name = res.data.realName;
							if(fetch('clickType') ==1){
								layer.open({
									content: '登录成功',
									skin: 'msg',
									time: 4 //2秒后自动关闭
								});
								that.getDetail();
							}else{
								that.submit2();
							}
							if(!res.data.isLogin){
								that.isLogin = false;
								layer.open({
									content: '绑定失败',
									skin: 'msg',
									time: 3 //2秒后自动关闭
								});
							}
						}
					},
					error: function(xhr, msg){
					}
				})
			},
			tolayer(n){
				this.layer = n;
			},
			openVideo(){
				if(videoUrl){
					$('.layer-video').removeClass('hide');
					$(".layer-video .info #video").attr("src", videoUrl);

				}else{
					layer.open({
						type:2,
						title: ['加载中', 'color: #eee;font-size:20px;']
					});
				}
			},
			close(){
				$('.layer-video').addClass('hide');
				$(".layer-video .info #video").attr("src", '');
			},

		},
		created(){
			// this.token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI3ODliMDA3NGZhMTMxMWU5OTQ1MjAwMTYzZTA1ZmY2NiIsImlhdCI6MTU5NTU3NjgyOCwic3ViIjoiMTc1NTQxNTg5ODMifQ.GYts4bLJs0lOq1n4ExoNEsT4TDYWKXQkwK2qRu8i9yQ"
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
		}

	})
	
});
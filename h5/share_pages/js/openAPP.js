//检测手机系统版本
function detectVersion() {
	var isAndroid = false, isIOS = false, isIOS9 = false, version = "";
	var u = navigator.userAgent, ua = u.toLowerCase();

	if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//android终端或者uc浏览器
		isAndroid = true
	} else {
		if (ua.indexOf("like mac os x") > 0) {//ios
			var regStr_saf = /os [\d._]*/gi;
			var verinfo = ua.match(regStr_saf);
			version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
		}

		var version_str = version + "";
		if (version_str != "undefined" && version_str.length > 0) {
			version = parseInt(version)
			if (version >= 8) {// ios9以上
				isIOS9 = true
			}
			else {
				isIOS = true
			}
		}
	}

	return { isAndroid, isIOS, isIOS9 }
}
// 判断手机上是否安装了app，如果安装直接打开url，如果没安装，跳到下载页面
function openApp(url, vi) {
	if (vi.isAndroid || vi.isIOS) {//安卓手机，或苹果手机9以下版
		var t1 = Date.now();
		var hasApp = true;

		var ifr = document.createElement("iframe");
		ifr.setAttribute('src', url);
		ifr.setAttribute('style', 'display:none');//使用隐藏的iframe来启动外部APP
		document.body.appendChild(ifr);

		setTimeout(function () {//3秒后检查是否启动成功，否则打开下载APP页面
			if (hasApp == false) {
				window.location.href = vi.isIOS ? "https://apps.apple.com/cn/app/id1473793767" : "http://app.mi.com/details?id=com.yiqilaiwang";
			}
		}, 3000);

		setTimeout(function () {//2秒后检查是否启动了APP
			var t2 = Date.now();
			if (t2 - t1 < 2100) {//如果成功启动外部APP，会消耗系统时间，让这个定时器不能准时触发，t2-t1会大于2100
				hasApp = false;
			}
		}, 2000);
	} else if (vi.isIOS9) {//苹果手机9版
		window.location.href = url;

		setTimeout(function () {//没有安装app，跳到下载APP页面
			window.location.href = "https://apps.apple.com/cn/app/id1473793767";
		}, 250);

		setTimeout(function () {//启动APP成功，重载本页
			window.location.reload();
		}, 1000);
	}
}

function getQueryParams(){
	var url = window.location.search; //获取url中"?"符后的字串
	var params = {};

	if (url.indexOf("?") != -1) {
		var queryStr = url.substr(1);

		var strs = queryStr.split("&");
		for (var i = 0; i < strs.length; i++) {
			var kv = strs[i].split("=");
			params[kv[0]] = unescape(kv[1]);
		}
	}

	return params;
}
var appId = '';
function setWxShare(title, imgUrl, desc,title2){
	$.ajax({
		url: BASE_URL + "/wechat/portal/jsapiSignature/",
		type: "POST",
		headers: {"api-version":VRESION,"api-client":judgeApiClient('wechat')},
		contentType: "application/json; charset=utf-8",
		dataType: "JSON",
		data: JSON.stringify({"url": window.location.href}),
		success: function(rsp){
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: rsp.appId, // 必填，公众号的唯一标识
				timestamp: rsp.timestamp, // 必填，生成签名的时间戳
				nonceStr: rsp.nonceStr, // 必填，生成签名的随机串
				signature: rsp.signature,// 必填，签名
				jsApiList: [
					"onMenuShareAppMessage",
					"onMenuShareTimeline",
					"updateAppMessageShareData",
					"updateTimelineShareData"
				] // 必填，需要使用的JS接口列表
			});
			wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
				var obj = {
					title: title, // 分享标题
					desc: desc, // 分享描述
					link:window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function () {
						// 设置成功
					}
				};
				var obj2 = {
					title: title2? title2: title, // 分享标题
					link:window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function () {
						// 设置成功
					}
				};
				if (wx.updateAppMessageShareData){//新版
					wx.updateAppMessageShareData(obj);
					wx.updateTimelineShareData(obj2);
				}else{
					wx.onMenuShareAppMessage(obj);
					wx.onMenuShareTimeline(obj2);
				}
			});
		},
		error: function(xhr, msg){
			alert("错误："+msg);
		}
	});
}
function setQYWxShare(title, imgUrl, desc,title2){
	$.ajax({
		url: BASE_URL + "/wechat/portal/jsapiSignature/",
		type: "POST",
		headers: {"api-version":VRESION,"api-client":judgeApiClient('wechat')},
		contentType: "application/json; charset=utf-8",
		dataType: "JSON",
		data: JSON.stringify({"url": window.location.href}),
		success: function(rsp){
			appId = rsp.appId;
			wx.config({
				beta: true,
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: 'ww37d1a26f3da75b20', // 必填，公众号的唯一标识
				timestamp: rsp.timestamp, // 必填，生成签名的时间戳
				nonceStr: rsp.nonceStr, // 必填，生成签名的随机串
				signature: rsp.signature,// 必填，签名
				jsApiList: [
					"onMenuShareAppMessage",
					"onMenuShareTimeline",
					"updateAppMessageShareData",
					"updateTimelineShareData",
					'onMenuShareWechat',
					'shareAppMessage',
					'shareWechatMessage',
					'shareToExternalContact',
					'shareToExternalChat'

				] // 必填，需要使用的JS接口列表
			});
			wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
				var obj = {
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function () {
						// 设置成功
					}
				};
				var obj2 = {
					title: title2? title2: title, // 分享标题
					link: window.location.href.split('&code')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function () {
						// 设置成功
					}
				};
				// 自定义转发到会话
				wx.invoke("shareAppMessage", obj, (function(res) {
					// "shareAppMessage:ok" == res.err_msg && alert("已转发到会话"),
					// "shareAppMessage:cancel" == res.err_msg && alert("已取消")
				}
				));
				//自定义转发到微信
				wx.invoke("shareWechatMessage", obj, (function(res) {
						// "shareWechatMessage:ok" == res.err_msg && alert("已转发到微信"),
						// "shareWechatMessage:cancel" == res.err_msg && alert("已取消")
					}
				));
				// 将H5页面通过个人群发发送给客户
				wx.invoke("shareToExternalContact", obj,(function(res) {
					if (res.err_msg == "shareToExternalContact:ok") {
					// alert('发送给客户')
					}
				}
				));
				// 将H5页面通过群发助手发送给客户群
				wx.invoke("shareToExternalChat", obj,(function(res) {
					if (res.err_msg == "shareToExternalChat:ok") {
						// alert('发送给客户群')
					}
				}
				));
				wx.onMenuShareAppMessage(obj);
				wx.onMenuShareTimeline(obj2);
				wx.onMenuShareWechat(obj);
				
			});
		},
		error: function(xhr, msg){
			alert("错误："+msg);
		}
	});
}


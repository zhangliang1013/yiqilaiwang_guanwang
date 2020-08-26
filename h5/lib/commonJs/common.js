// axios请求配置
// 测试
const BASE_URL = 'https://test.yiqilaiwang.com/';
// const VRESION = '1.2.4';
// 正式
// const BASE_URL = 'https://www.yiqilaiwang.com/';
const VRESION = '1.2.6';


// apiClient动态设置
function judgeApiClient(url){
  if(url.indexOf('webSite') != -1){
    return 'f07684ed4d4411e9ac1ffa163e4d6ba1'
  }else if(url.indexOf('app') != -1){
    return '583f20e7172411ea995200163e05ff66'
  }else if(url.indexOf('wechat') != -1){
    return '8693ece21a2711ea995200163e05ff66'
  }else{
    return 'error'
  }
}

// 获取链接中参数
function getUrlParameter(name){
  name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec(window.parent.location.href );
  if( results == null ) return ""; else {
    return results[1];
  }
}

// 移动端适配
document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5+"px";
window.onresize = function(){
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";
}




// 时间格式化
window.Date.prototype.Format = function(fmt){ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

// 本地存储
function save(key,value){
  return window.localStorage.setItem(key,value)
}
function fetch(key){
  return window.localStorage.getItem(key)
}
function del(key){
  return window.localStorage.removeItem(key);
}


// 分享相关
var appId = '';
function setWxShare(title, imgUrl, desc,title2){

  axios({
    url: BASE_URL + "/wechat/portal/jsapiSignature/",
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'api-client': judgeApiClient('wechat'),
      'api-version': VRESION,
    },
    data: {
      url: window.location.href,
    }
  }).then((res) => {
      if(res.status == 200){
        rsp = res.data;
        appId = rsp.appId;
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
            ], // 必填，需要使用的JS接口列表
            openTagList: ['wx-open-launch-app']// 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
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
      }
  });
}
function setQYWxShare(title, imgUrl, desc,title2){
  axios({
    url: BASE_URL + "/wechat/portal/jsapiSignature/",
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'api-client': judgeApiClient('wechat'),
      'api-version': VRESION,
    },
    data: {
      url: window.location.href,
    }
  }).then((res) => {
      if(res.status == 200){
        rsp = res.data;
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
      }
  });
}

function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {

  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  return s;
}

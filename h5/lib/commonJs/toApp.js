let ua = window.navigator.userAgent.toLowerCase();
var iswx = ''
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    iswx = 'wx'
}
var phone = '';
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
  phone = 'ios';
} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
  phone = 'Android';
} else { //pc
};
if(iswx =='wx' && phone == 'Android'){
    var dom = document.getElementById('wxOpenInAPP') 
  dom.innerHTML = '<wx-open-launch-app id="launch-btn" extinfo="" appid="wx8737e94836340f56"><script type="text/wxtag-template"><style>.btn {width:200px;height: 45px;}</style><div class="btn">App内查看</div></script></wx-open-launch-app>'
}
function geturl(jumpType,serviceId,type,orgId,content){
    let url = `pushscheme://com.yilaiwang.huaweipush/deeplink?jumpType=${jumpType}&serviceId=${serviceId}&type=${type}&orgId=${orgId}&content=${content}`
      if(iswx=='wx'){
        var launchBtn = document.getElementById('launch-btn')
        launchBtn.setAttribute('extinfo', url)
      }
}
function toApp(jumpType,serviceId,type,orgId,content){
    type = type || 0;
    if(phone == 'ios'){
      alert(`https://app.yiqilaiwang.com/pageJump?jumpType=${jumpType}&serviceId=${serviceId}&type=${type}&orgId=${jumpType==16?'309d548ccdf611e98e5b00163e063254':''}&content=${jumpType==9?'siid':''}`)
      window.location.href = `https://app.yiqilaiwang.com/pageJump?jumpType=${jumpType}&serviceId=${serviceId}&type=${type}&orgId=${orgId}&content=${content}`
    }else if(phone == 'Android'){
      alert('安卓')
      if(iswx!='wx'){
        window.location.href = `pushscheme://com.yilaiwang.huaweipush/deeplink?jumpType=${jumpType}&serviceId=${serviceId}&type=${type}&orgId=${orgId}&content=${content}` 
      }
        
    }
 
  }
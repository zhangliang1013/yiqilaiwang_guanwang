import axios from 'axios'
import local from './local'
import router from '@/router'
//import store from '@/store'//vuex state状态
//import md5 from 'js-md5';
var key='47c3710c8560d4df6f723077ea669b4e';
var ver='v5.0.0';//默认版本号
var appid='50';
var deviceid='50f713f0795c7f27ffe6515911467477';
var channel='MI0215';
//ajax封装
let http={
	axios:axios.create({
		url:'',
		baseURL: 'https://test.yiqilaiwang.com/business/g/',
		// baseURL: 'https://www.yiqilaiwang.com/business/g/',
		
	}),

	ajax(data){
		return new Promise((resolve,reject) => {
			data.headers={
				'Authorization':local.fetch('tokeng'),
				'token':local.fetch('mount'),
				'api-client': 'f07684ed4d4411e9ac1ffa163e4d6ba1',
				'api-version': '1.2.6',
        'Content-Type': 'application/x-www-form-urlencoded',
				...data.headers
			}

      data.params={
				...data.params
			}
			this.axios(data).then((response) => {
				// console.log(response,'response1')
				if(response.data.code==401 || response.status==401){
					local.del('tokeng')
					local.del('loging')
					// layer.msg('您还未登录,请先登陆')
          // router.push('/login/index')
				}else if(response.status!=200 && response.data.msg){
					layer.msg(response.data.msg)
				}
				resolve(response.data)
	       }, (response) => {	
					//  console.log('response2',response)
	          reject(response)
	        })
	    });
	}
}


// 添加响应拦截器
http.axios.interceptors.request.use(function (config) {
   //console.log(config)
   // config.headers['Access-Token'] = store.state.token.key;
    // 在发送请求之前做些什么
    return config;
}, function (error) {
	console.log('error拦截器:',error)
    // 对请求错误做些什么
    return Promise.reject(error);
});
http.axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
//alert('拦截成功')
	if(response.data.Status&&response.data.Status!=200){
		layer.open({
			content: response.data.Result.ErrorMsg,
			skin: 'msg',
			time: 2
		});
		return response;
	}else{
		return response;
	}    
}, function (error) {
	console.log('error拦截器返回:',error.response)
	if(error.response.status==401){
		layer.msg('登录过期,请重新登陆')
		local.del('tokeng')
		local.del('loging')
	}
    // 对响应错误做点什么
    return Promise.reject(error);
});

//扩展到vue
export default {
	install:function(Vue){
		Vue.prototype.http=http;
	},
	$http:http
}
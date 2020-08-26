window.onload = function(){  

	new Vue({
		el: "#index",
		data:{
			upload:true,
      nothingImg:"./lib/image/notFound/zy.png",
      detail:'',
		},
		methods: {
			// 获取微信参数
			getWxCode(){
				var title = '一起来往'
				var imgUrl = 'https://img.yiqilaiwang.com/o_1ea3olf5j1qqdhan1aq113cv16lrg.png?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png'
				var desc = '一起来往，常来常往';
				setWxShare(title, imgUrl, desc);
				setQYWxShare(title, imgUrl, desc);
			},
		},
		created() {
      this.getWxCode();
		},
	})

}
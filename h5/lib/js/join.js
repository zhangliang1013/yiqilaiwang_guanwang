window.onload = function () {

  new Vue({
      el: "#index",
      data: {
        name: "", // 请求过来的组织或个人
        calName:"",
        avatarUrl: "", // 头像
        relationUrl: '',
        upload: true,
        nothingImg:  "./lib/image/zy.png",
        tableData: {},
      },
      methods: {
        // 获取微信参数
        getWxCode () {
          var title = '把握现在机遇，共赢美好未来！青岛浙商控股公司招贤纳聘';
          var imgUrl = 'https://img.yiqilaiwang.com/o_1ed3lejh41hmu18cr1rrkn80kba17.png?imageslim&imageView2/1/interlace/1/ignore-error/1/format/png';
          var desc = '广纳人才 共创未来';
          setWxShare(title, imgUrl, desc);
          setQYWxShare(title, imgUrl, desc);
        },
      },
      created () {
        this.getWxCode();
      },
  })
}
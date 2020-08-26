<template>
  <div>

    <div class="w">
      <div class="cont bg mt17 mb44 down">
        <div class="t1">立即下载</div>
        <div class="t2">让组织进入高效数字化时代</div>
        <div class="code">
          <span>
            <img src="../assets/img/xz1@2x.png" class="i" alt="">
			<img src="../assets/img/xz2@2x.png" class="i" alt="">
                <img src="../assets/img/app_qrcode.png" alt="" style="width: 144px;height: 144px;">
            <h4>APP</h4>
            <p>扫描二维码下载</p>
          </span>
          <span>
             <img src="../assets/img/xz3@2x.png" class="i" alt="">
                <img src="../assets/img/wx_qrcode.jpg" alt="" style="width: 144px;height: 144px;">
            <h4>微信公众号</h4>
            <p>扫码关注我们</p>
          </span>
          <span>
             <img src="../assets/img/xz3@2x.png" class="i" alt="">
			<img src="../assets/img/wxapp_qrcode.jpg" alt="" style="width: 144px;height: 144px;">
            <h4>微信小程序</h4>
            <p>扫描二维码下载</p>
          </span>
        </div>
        <div class="line"></div>
        <div class="list">
          <div class="t">更新日志:</div>
          <div class="item">
            <div class="mt">一起来往手机版1.01 <span>2019-08-05</span></div>
            <p>
              1.连接微信功能升级<br/>
               可以把常用的应用页面配置到聊天侧边栏，例如客户资料、订单库、素材库、知识库等，当成员与客户聊天时，辅助成员为客户提供更好的服务、提高服务效率。
            </p>
            <p>
              1.连接微信功能升级<br/>
              可以把常用的应用页面配置到聊天侧边栏，例如客户资料、订单库、素材库、知识库等，当成员与客户聊天时，辅助成员为客户提供更好的服务、提高服务效率。
            </p>
          </div>

          <div class="item">
            <div class="mt">一起来往手机版1.01 <span>2019-08-05</span></div>
            <p>
              1.连接微信功能升级<br/>
              可以把常用的应用页面配置到聊天侧边栏，例如客户资料、订单库、素材库、知识库等，当成员与客户聊天时，辅助成员为客户提供更好的服务、提高服务效率。
            </p>
            <p>
              1.连接微信功能升级<br/>
              可以把常用的应用页面配置到聊天侧边栏，例如客户资料、订单库、素材库、知识库等，当成员与客户聊天时，辅助成员为客户提供更好的服务、提高服务效率。
            </p>
          </div>
					<!-- 暂时去掉 -->
          <!-- <div class="tac"><a class="btn28">查看更多</a></div> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'down',
  props: {
    msg: String
  },
  created() {

  }
}
</script>

<style lang="less">
  .down{
    .list{
      padding-bottom: 82px;
      padding-left: 94px;
      padding-right: 203px;
      text-align: left;
      .t{
        font-size: 20px;
        margin-bottom: 27px;
				font-weight: bold;
				color: #333333;
      }
      .item{
        margin-bottom: 32px;
        .mt{
          font-size: 20px;
					font-weight: bold;
					color: #333333;
          span{
            font-size: 13px;
            color: #999999;
          }

          margin-bottom: 10px;
        }
        p{
          font-size: 14px;
          color: #666666;
          line-height: 22px;
          margin-bottom: 5px;}
      }
    }
    .line{
      width: 1000px;
      margin: 47px auto 38px auto;
      border-bottom: 1px solid #eee;
    }
    text-align: center;
    overflow: hidden;
    span{
      width: 140px;
      display: inline-block;
      margin: 0 40px;
      h4{
        font-size: 20px;
        display: block;
        margin-top: 16px;
        font-weight: normal;
      }
      p{
        display: block;
        font-size: 13px;
        color: #999999;
        margin-top: 9px;
      }
    }
    .t1{
      font-size: 26px;
      line-height: 37px;
      margin-top: 57px;
      margin-bottom: 5px;
			font-weight: bold;
			color: #333333;

    }
    .t2{
      font-size: 20px;
      margin-bottom: 41px;
			color: #333333;

    }
  }
</style>

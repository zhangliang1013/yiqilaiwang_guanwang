<template>
	<div class="footer">
		<div class="w">
			<div class="left">
				<p>客服电话：400-618-0123</p>
				<p>Copyright © 2019-2022 青岛一起来往网络科技有限公司<br/><a href="http://www.beian.miit.gov.cn" style="color:#ffffff;display:inline-block;margin-left:-4px;" target="_blank"> 鲁ICP备19021129号-1</a><br />
					地址：青岛市山东路22号金孚大厦<br />
				</p>		
			</div>
			
			
			<div class="right">

				<span>
					<img src="../assets/img/app_qrcode.png" alt="" style="width: 92px;height: 92px;">
					<p>APP下载</p>
				</span>
				<span>
					<img src="../assets/img/wx_qrcode.png" alt="" style="width: 92px;height: 92px;">
					<p>微信公众号</p>
				</span>
				<span>
					<img src="../assets/img/wxapp_qrcode.png" alt="" style="width: 92px;height: 92px;">
					<p>微信小程序</p>
				</span>
			</div>
			<div style="width:300px;margin:0 auto; padding:20px 0;">
				<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37020302371662" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
					<img src="../assets/img/beian.png" style="float:left;" />
					<p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px;color: #ffffff;">鲁公网安备 37020302371662号</p>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'foot',
		props: {
			msg: String
		}
	}
</script>
<style lang="less">
	.footer {
		.right {
			width: 40%;
			float: right;
			text-align: right;
			padding-top: 48px;

			span {
				display: inline-block;
				width: 92px;
				text-align: center;
				margin-left: 32px;
				font-size: 13px;
				color: #ffffff;
			}
		}

		height: 211px;
		width: 100%;
		// background: #a4a4a4;
		background: #666666;

		.left {
			float: left;
			padding-top: 50px;
			width: 40%;

			p {
				font-size: 13px;
				color: #ffffff;
				line-height: 22px;
				margin-bottom: 10px;
			}
		}
	}
</style>

<template>
	<div style="background:#fff">
		<div class="page_about_banner" style="background-size:1920px"></div>
		<div class="w" >
			<div class="about_title">
				公司简介
			</div>
			<div class="about_content">
				<p>青岛一起来往网络科技有限公司，面向近百万全国社会组织，致力于开发社会团体管理高效率运作机制。作为行业细分的开创者，一起来往帮助个人更好地融入组织，实现组织高效赋能，提升组织生命力，实现组织与成员共赢。</p>
				<p>“一起来往”是我们推出的面向组织的活动管理工具。其中，您可以线上管理组织内成员，发布活动、通知…实现组织内信息高效沟通，为实现数字化信息共享提供便利。同时，我们也有活动组织的功能，您可以轻松创建宴请、聚会、团建等团体活动，增加组织凝聚力，让组织为个人更好的赋能。</p>
				<p>诸多功能批量上线中，我们也在不断开发新功能。您在使用我们小程序的同时，也希望您为我们提出宝贵的意见和建议，我们会不断探索、不断改进，为组织提供更优质的服务。</p>
			</div>
			<div class="about_content_img">
				<img src="../assets/img/gsjs1@2x.png" alt="">
				<img src="../assets/img/gsjs2@2x.png" alt="">
				<img src="../assets/img/gsjs3@2x.png" alt="">
			</div>
			<div class="about_title">
				合作伙伴
			</div>
			<div class="about_hzhb">
				<img src="../assets/img/hzhb1@3x.png" alt="">
				<img src="../assets/img/hzhb2@3x.png" alt="">
				<img src="../assets/img/hzhb3@3x.png" alt="">
				<!-- <img src="" alt=""> -->
			</div>
			<div class="about_title">
				联系我们
			</div>
			<div class="about_lxwm">
				<div class="item">
					<div class="mt">联系地址</div>
					<div class="mc">青岛市八大关帝国大厦10楼</div>
				</div>
				<div class="item">
					<div class="mt">媒体合作</div>
					<div class="mc">PR@yiqilaiwang.com</div>
				</div>
				<div class="item">
					<div class="mt">加入我们</div>
					<div class="mc">HR@yiqilaiwang.com</div>
				</div>
				<div class="item">
					<div class="mt">投诉邮箱</div>
					<div class="mc">REPORT@yiqilaiwang.com</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'news',
		props: {
			msg: String
		},
		created() {

		}
	}
</script>

<style lang="less">
	.about_lxwm {
		display: flex;
		padding-top: 52px;
		padding-bottom: 124px;
		justify-content: space-between;

		.item {
			width: 25%;
		}

		.mt {
			font-size: 18px;
			font-weight: 550;
			font-family: PingFangSC-Medium, PingFang SC;
			color: rgba(51, 51, 51, 1);
			line-height: 13px;
		}

		.mc {
			font-size: 13px;
			margin-top: 5px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 25px;
		}
	}

	.about_hzhb {
		display: flex;
		justify-content: space-between;
		padding-top: 36px;
		margin: 0 80px;
		padding-bottom: 20px;

		img {
			width: 132px;
			height: 132px;
			margin: 0 46px;
			-webkit-border-radius: 132px;
			-moz-border-radius: 132px;
			border-radius: 132px;
			background: #eeeeee;
		}
	}

	.about_content_img {
		padding-top: 30px;
		display: flex;
		justify-content: space-between;

		img {
			width: 301px;
			height: 168px;
			background: #eeeeee;
		}
	}

	.about_title {
		padding-top: 74px;
		font-size: 22px;
		text-align: center;
		font-weight: 650;
		color: #333;
		line-height: 32px;
		// paragraph: 10px;
	}

	.about_content {
		font-size: 16px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 24px;
		margin-top: 20px;

		p {
			// text-indent: 2em;
			text-align: justify;
			margin-bottom: 20px;

		}
	}

	.page_about_banner {

		background: #2168EB url("../assets/img/banner4@2x.png") no-repeat center;
		width: 100%;
		height: 200px;


	}

	.page_about {
		padding-left: 95px;
		padding-right: 82px;
		padding-top: 55px;
		margin-top: 44px;
	}
</style>

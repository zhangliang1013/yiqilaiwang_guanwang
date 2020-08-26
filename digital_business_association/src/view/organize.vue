<template>
	<div>
		<div class="organize" >
			<div @click="to('addorganize')">
				<div class="banner" ></div>
			</div>
			<div class="w">
				<div class="title">如何创建组织</div>
				<img src="../assets/img/zzbanner1@2x.png" alt="" style="width:1000px">
				<div class="title">如何认证组织</div>
				<img src="../assets/img/zzbanner2@2x.png" alt="" style="width:1000px">
				<div class="tac">
					<!-- <router-link to="/addorganize"  class="btn54" >创建组织</router-link> -->
					<div class="btn54" @click="to('addorganize')"> 创建组织</div>
					<router-link to="/organizeManage" target='_blank' class="btn54">管理组织</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'organize',
		props: {
			msg: String,
			defOrg: null,
			personalInfo: null
		},
		created() {

		},
		methods: {
			to(e) {
				if (this.local.fetch("tokeng") == null) {
					this.$router.push('/login/index')
				} else {
					this.$router.push(e)
				}

			}
		}
	}
</script>

<style lang="less">
	.organize {
		 background:#ffffff;
		.banner {
			height: 200px;
			width: 100%;
			background: url('../assets/img/banner2@2x.png') no-repeat center;
			cursor: pointer;
			background-size:100%
		}

		.title {
			font-size: 32px;
			text-align: center;
			color: #2168eb;
			margin-top: 83px;
			margin-bottom: 24px;
			font-weight: bold;
		}

		.btn54 {
			margin-top: 54px;
			margin-left: 20px;
			margin-right: 20px;
			margin-bottom: 114px;
			cursor: pointer;
		}
		.btn54:hover{
			color:blue
		}
	}
</style>

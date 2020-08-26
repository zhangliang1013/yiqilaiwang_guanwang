<template>
	<div>
		<div class="w">
			<div class="position">辖属组织管理
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>

		<div class="w bg staff" style="margin-top:1px;">
			<div class="warp staff" style="margin-top:1px;">
				<div class="leftcont">
					<Input placeholder="搜索" class="search" v-model="name">
						<img src="../assets/img/zzgl6@2x.png" slot="prefix" alt="" style="16px">
					</Input>
					<div class="menu">
						<!-- <div class="item" @click="tomenu(1)" :class="{active:show}">
							辖属组织列表
						</div> -->
					</div>
				</div>

				<!--人员管理-->
				<div class="rightcont" v-if="menuactive==1">
					<div v-if="layer!=1">
						<div class="rightcont-top clear">
							<div class="tit fl">辖属组织列表</div>
							<div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
								<div class="btnD">
									<router-link :to="{path: '/tolead', query: {path:'/staff/1'}}" style="color: #333333;display:inline-block;">
										<span class="link">批量导入</span>
									</router-link>
								</div>
								<div class="btnD">
									<router-link :to="{path: '/everywhere', query: {path:'/staff/1'}}" style="color: #333333;display:inline-block;">
										<span class="link">批量导出</span>
									</router-link>
								</div>
								<div class="addbtn" @click="tolayer(8)">添加</div>
							</div>
						</div>
						<div class="table">
							<div class="mt" style="padding-right:0px">
								<div class="item">序号</div>
								<div class="item" style="width: 330px">组织名称</div>
							</div>

							<div class="mc" v-if="allusers.rows.length==0">
								<div class="item" style="width:100%;text-align:center;">
									暂无数据
								</div>
							</div>
							<div class="mc hand" v-for="(value,index) in allusers.rows" style="overflow: hidden;padding-right: 0px; " :key="value.id">
								<div class="item hand" :title="index+1">{{index+1 + (pageNumber <= 1? 0:(pageNumber-1)*10)}}</div>
								<div class="item" :style="[{ 'color': value.authStatus ==1?'#1268EB':'#9A9A9A'}, {'width':'330px'}]" :title="value.orgName">
									<span class="item-span">{{ value.orgName }}</span>
									<img v-if="value.authStatus ==1" style="width:18px;height:18px;display: inline-block;vertical-align: middle;margin-left:5px" src="./../assets/img/zzbz1.2@2x.png"/>
								</div>
							</div>
							<div class="clear" style="margin:20px 0;">
								<div style="text-align: left;font-size:10px;font-family:PingFang SC;font-weight:500;color:rgba(154,154,154,1);line-height:14px;margin-top:10px" class="fl">备注: <br/>蓝色组织代表已经建立关联 <br/>灰色组织代表尚未建立关联</div>
								<Page class="fr" v-if="allusers.rows.length" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="allusers.total"
								@on-change="getOrgUserPage()" show-elevator :page-size="pageSize" :show-total="true" />
							</div>
						</div>
					</div>

				</div>
				<div class="cl"></div>
			</div>


			<!-- 添加用户  弹窗 -->
			<div class="layer staffeit" v-if="layer==8">
				<div class="content" style="height: auto;min-height: 60px; width:300px">
					<div class="title">添加</div>
					<div class="mc1">
						<h3 class="text-label" style="margin-bottom:12px">
							组织名称
						</h3>
						<Input placeholder="请填写组织名称" v-model="adduser.applyName"/>
					</div>
					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="makeadduser()">确认</div>

					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: 'staff',
		data() {
			return {
				menuactive: 0,
				layer: 0,
				//添加用户
				adduser: {
					"applyName": "",
				},
				//组织id
				orgId: null,
				//组织用户
				allusers: {
					total: 1,
					"rows": []
				},
				name: "",
				//分页
				pageNumber: 1,
				pageSize: 10,
			}
		},
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.digitalCommerce;
					this.getOrgUserPage();
				}
			},
			name: function(val, oldval) {
				// 如果搜索框发生变化，调用人员
				this.getOrgUserPage()
			},
		},
		created() {
			this.menuactive = this.$route.params.page
			if (this.defOrg) {
				this.orgId = this.defOrg.digitalCommerce;
				this.getOrgUserPage();
			}
		},
		methods: {
			//获取人员列表
			getOrgUserPage() {
				this.http.ajax({
					url: '../../webSite/gov/orgList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"govId": this.orgId,
						// "govId": '5ed8cbb8a5f08e7ae72813f6',
						"pageNumber": this.pageNumber,
						"pageSize": this.pageSize,
						"searchName": this.name
					}
				}).then(res => {
					if (res.code == 200) {
						this.allusers = res.data
					}
				})
			},

			// 确认添加用户
			makeadduser() {
				if (this.adduser.applyName == null || this.adduser.applyName == "") {
					layer.msg("请输入组织名称")
					return
				}
				// 部门内添加用户
				this.http.ajax({
					url: '../../webSite/gov/orgBatchAdd',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"govId": this.orgId,
						// "govId": '5ed8cbb8a5f08e7ae72813f6',
						"orgNameList": [this.adduser.applyName],
					}

				}).then(res => {
					layer.msg(res.msg)
					this.layer = 0
					this.getOrgUserPage();
				})
			},		
			// 弹窗弹出
			tolayer(n) {
				this.adduser = {
					"applyName": "",
				}
				this.layer = n
			},
		}
	}
</script>

<style lang="less">
	.ivu-poptip-rel{
		height:38px;
	}
	.staffeit .mc .ivu-select-dropdown {
		will-change: unset !important;
	}
	.right .ivu-select-placeholder{
		text-align: right;
	}

	.sortnum {
		display: inline-block;
		width: 100%;
		// height: 40px;
		line-height: 1.5;
		padding: 4px 7px;
		font-size: 14px;
		border: 1px solid #C7C7C7;
		border-radius: 2px;
		color: #515a6e;
		background-color: #fff;
		background-image: none;
		position: relative;
		cursor: text;
	}


	.staffeit {
		.tips {
			margin-top: 45px;
			text-align: center;
			font-size: 14px;
			color: #333333;
		}

		.btns {
			text-align: center;
			font-size: 0;
			// padding-top: 37px;
			margin-bottom: 21px;

			.btn1 {
				border: 1px solid #999999;
			}

			.btn2 {
				border: 1px solid #2168EB;
				background: #2168eb;
				color: #ffffff;
			}

			.btn1,
			.btn2 {
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 22px;
				height: 26px;
				line-height: 26px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
				box-sizing:content-box;
			}

		}
		.mc1{
			padding:26px 17px;
		}
		.mc {
			height: 40px;
			line-height: 40px;
			// border-bottom: 1px solid #eee;
			margin: 15px;
			// padding:0 15px 0 10px;
			display: flex;
			position: relative;
			font-family: 'PingFangSC-Regular,PingFang SC';

			// float:left;
			// width:75%;
			.text-label {
				width: 100px;
				display: flex;
				line-height: 40px;
				p {
					color: #DC1A00;
				}

				// 
			}
			
			.label {
				margin-left: 11px;
			}

			input.ivu-input {
				text-align: right;
			}

			.ivu-select-selection {
				min-height: 40px;
				padding: 4px 24px 4px 4px;
			}

			.ivu-select-dropdown {
				max-height: 164px;
				will-change: auto;
			}

			.ivu-select-placeholder {
				height: 26px;
				line-height: 26px;
			}

			.right .label {
				float: left;
				margin-left: 0;
			}

			.ivu-checkbox {
				margin-left: 15px;
				margin-right: 15px;
			}

			.ivu-checkbox-checked .ivu-checkbox-inner {
				background: #2d8cf0;
			}

			.ivu-checkbox-inner:after {
				transform: rotate(45deg) scale(1);
			}

			.ivu-checkbox-inner {
				-webkit-border-radius: 50%;
				-moz-border-radius: 50%;
				border-radius: 50%;
				background: #eeeeee;
				transform: scale(1.15);
			}

			.ivu-checkbox-wrapper {
				width: 100%;
			}

			.right .ivu-checkbox {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
			}

			.getcode {
				width: 30%;
				text-align: center;
				line-height: 40px;
				background: #2168eb;
				color: #fff;
			}
		}

		.mt {
			font-size: 16px;
			font-weight: bold;
			line-height: 16px;
			margin-top: 15px;
			margin-left: 15px;
			margin-bottom: 5px;

			p {
				color: red;
				display: contents;
			}
			.mt-left{
				margin-right:182px;
			}
			.ivu-switch-small{
				width:32px; 
			}
			.ivu-switch-small.ivu-switch-checked:after {
				left: 16px;
			}
		}

		.mc-phone{
			margin:0 16px 7px;
			.text{
				font-size:12px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(136,136,136,1);
				line-height:17px;
			}
		}
		.username {
			width: 294px;
			height: 38px;
			background: #fafafa;
			display: block;
			margin: 0 auto;
			text-indent: 15px;
			line-height: 38px;
			margin-top: 11px;
		}

		.content {
			overflow: hidden;
		}

		.title {
			height: 70px;
			background: #2168eb;
			font-size: 20px;
			color: #ffffff;
			line-height: 70px;
			text-align: center;
		}
		.layer-top{
			margin:13px 16px;
			width:294px;
			height:38px;
			background:rgba(250,250,250,1);
			padding-left:15px;
			line-height:38px;
		}
		.layer-cont{
			margin:0 17px 14px;
			.layer-cont-l{
				width:68px;
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:32px;
			}
			.layer-cont-r{
				width:222px;
				min-height:32px;
				border:1px solid rgba(221,221,221,1);
				padding:7px 11px;
				text-align: right;
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:17px;
			}
			.height{
				line-height:16px;
			}
		}
		.new{
			padding-top:14px;
			margin-bottom: 27px;
			.btn2{
				width:104px;
				height:28px;
				background:rgba(33,104,235,1);
				border-radius:14px;
			}
		}

	}

	.staff {
		margin-top: 69px;
		margin-bottom: 63px;

		.warp {
			.rightcont {
				.share_tips {
					position: absolute;
					width: 160px;
					right: 71px;
					top: 110px;

					.t {
						font-size: 14px;
						margin-bottom: 26px;

					}

					.btn {
						cursor: pointer;
					}

				}

				.form {
					margin-right: 288px;
					margin-top: 24px;



					.btn {
						width: 205px;
						height: 48px;
						line-height: 48px;
						text-align: center;
						color: #ffffff;
						background: #2168eb;
						font-size: 14px;
						-webkit-border-radius: 48px;
						-moz-border-radius: 48px;
						border-radius: 48px;
						cursor: pointer;
					}
				}

				.share_t2 {
					font-size: 14px;
					color: #999999;
					border-bottom: 1px solid #eee;
					padding-bottom: 19px;
					line-height: 14px;
				}

				width: 815px;
				float: right;
				padding-left: 40px;
				padding-right: 46px;
				padding-top: 10px;
				position: relative;
				min-height: 660px;

				.tit {
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					font-weight: bold;
					color: #333333;
				}
				.btnD {
					// height:22px;
					background:rgba(255,255,255,1);
					border-radius:14px;
					border:1px solid rgba(151,151,151,1);
					color: #333333;
					padding: 0px 15px;
					text-align: center;
					line-height: 20px;
					display: inline-block;
					font-size: 12px;
					margin-right: 5px;
				}
				.addbtn {
					height:22px;
					border-radius:14px;
					line-height: 22px;
					background: #2168eb;
					display: inline-block;
					text-align: center;
					-webkit-border-radius: 22px;
					-moz-border-radius: 22px;
					color: #ffffff;
					font-size: 12px;
					padding: 0 16px;
					cursor: pointer;
				}
				.table {
					.link {
						cursor: pointer;
						color: #2168eb;
						margin: 0 4px;
						font-size: 10px;
					}

					.item-span{
						display:inline-block;
						vertical-align: middle;
						max-width: 300px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.btn {
						padding: 0 10px;
						text-align: center;
						line-height: 22px;
						display: inline-block;
						font-size: 12px;
						margin: 0 5px;
						height: 22px;
						border-radius: 14px;
						border: 1px solid rgba(151, 151, 151, 1);

						span {
							font-size: 1px;
						}
					}

					.edit,
					.del {
						font-size: 0;
						width: 20px;
						margin: 0px 10px;
						position: relative;
						display: inline-block;
						height: 100%;
						cursor: pointer;

						img {
							vertical-align: middle;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}

					.ivu-input-wrapper {
						width: 100%;

						input {
							border: none;
						}
					}

					.saveBtn {
						height: 40px;
						line-height: 40px;
						padding: 0 15px;
						cursor: pointer;
					}

					.mc {
						border-bottom: 1px solid #eee;
					}

					.mt,
					.mc {
						display: flex;
						justify-content: space-between;
						padding-left: 20px;
						// padding-right: 20px;
						text-align: left;
						font-family: "PingFangSC-Regular,PingFang SC";


						.item {
							text-align: left;
							height: 60px;
							line-height: 60px;
							display: inline-block;
							min-width: 60px;
							-webkit-box-sizing: border-box;
							-moz-box-sizing: border-box;
							box-sizing: border-box;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.mt {
						background: #f8f8f8;

						.item {
							height: 40px;
							line-height: 40px;
						}
					}
				}
			}

			.leftcont {
				float: left;
				width: 265px;
				border-right: 1px solid #eee;
				padding: 35px 0;

				.search {
					width: 168px;
					display: block;
					margin: 0 auto;

					img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.menu {
					width: 168px;
					display: block;
					margin: 0 auto;

					.item {
						cursor: pointer;
						height: 59px;
						line-height: 59px;
						border-bottom: 1px solid #eee;
					}

					.active {
						color: #2168eb;
						font-weight: 500;
					}

					.child {
						span {
							line-height: 40px;
							padding-left: 15px;
							cursor: pointer;
						}
					}

					.n {
						background: url("../assets/img/zk2@2x.png") no-repeat right center;
					}

					.n.active {
						color: #515a6e;
						background: url("../assets/img/zk3@2x.png") no-repeat right center;
					}
				}
			}
		}
	}

	.staff .warp .rightcont .table .edit,
	.staff .warp .rightcont .table .del {
		display: none;
	}

	.staff .warp .rightcont .table .hand:hover .edit,
	.staff .warp .rightcont .table .hand:hover .del {
		display: inline-block;
	}

	.staff .warp .rightcont .table .mc .item .link {
		display: none;
	}

	.staff .warp .rightcont .table .mc:hover .item .link {
		display: inline-block !important;
	}
	.useredit-box{
		margin-bottom: 12px;
		color: #333333;
		.useredit-title{
			width: 100px;
			line-height: 34px;
		}
		.useredit{
			width: 350px;
		}
	}
	.usereditmc {
		height: 40px;
		line-height: 40px;
		margin: 15px;
		display: flex;
		position: relative;
		font-family: 'PingFangSC-Regular,PingFang SC';
		.ivu-select-selection {
			min-height: 40px;
			padding: 4px 24px 4px 4px;
		}

		.ivu-select-dropdown {
			max-height: 164px;
			will-change: auto;
		}

		.ivu-select-placeholder {
			height: 26px;
			line-height: 26px;
		}
		.right .label {
			float: left;
			margin-left: 0;
		}
		.ivu-checkbox {
			margin-left: 15px;
			margin-right: 15px;
		}

		.ivu-checkbox-checked .ivu-checkbox-inner {
			background: #2d8cf0;
		}
		.ivu-checkbox-inner:after {
			transform: rotate(45deg) scale(1);
		}
		.ivu-checkbox-inner {
			-webkit-border-radius: 50%;
			-moz-border-radius: 50%;
			border-radius: 50%;
			background: #eeeeee;
			transform: scale(1.15);
		}

		.ivu-checkbox-wrapper {
			width: 100%;
			color: #333333;
		}

		.right .ivu-checkbox {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translate(0, -50%);
		}
	}
	.mc-phone{
		margin:10px 0 7px;
			.text{
				font-size:12px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(136,136,136,1);
				line-height:17px;
			}
	}
	.usereditbtns {
			text-align: center;
			font-size: 0;
			padding-top: 37px;
			margin-bottom: 21px;

			.usereditbtn1 {
				border: 1px solid #999999;
			}

			.usereditbtn2 {
				border: 1px solid #2168EB;
				background: #2168eb;
				color: #ffffff;
			}

			.usereditbtn1,
			.usereditbtn2 {
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 22px;
				width: 140px;
				height: 48px;
				line-height: 48px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

		}
	.useredit .ivu-input{
		height: 34px;
	}
	 .line {
        border-bottom: 1px dashed #dddddd;
        margin: 20px 0;
      }
</style>

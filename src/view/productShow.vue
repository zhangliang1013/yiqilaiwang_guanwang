<template>
	<div>
		<div class="w">
			<div class="position">
				<!-- <span @click="$router.back(-1)"></span> -->
			</div>

		</div>
		<div class="w bg staff" style="margin-top:1px;">
			<div class="warp staff" style="margin-top:1px;">
				<div class="leftcont">
					<div class="menu">
						<div class="item " @click="tomenu(1)" :class="{active:menuactive==1}" >
							已上架产品
						</div>
						<div class="item " @click="tomenu(2)" :class="{active:menuactive==2}" >
							未上架产品
						</div>
					</div>
				</div>
				<!--上架产品-->
				<div class="rightcont" >
					<div class="rightcont-top clear">
						<div class="tit fl">{{menuactive==1?'已':'未'}}上架产品列表</div>
						<div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
							<div class="addbtn" @click="toPage" v-if="defOrg&&defOrg.orgType !=3">发布产品</div>
						</div>
					</div>
					<div class="table">
						<div class="mt" style="padding-right:0px">
							<div class="item" style="min-width: 52px" v-if="menuactive==1&&defOrg&&(defOrg.isOrg==1||defOrg.isOrg==5)">序号</div>
							<div class="item" :style="{'width':(menuactive==1&&defOrg&&(defOrg.isOrg==1||defOrg.isOrg==5) ?'303':'303') + 'px'}">产品名称</div>
							<div v-if="defOrg&&defOrg.orgType!=7" class="item" :style="{'width':(menuactive==1&&defOrg&&(defOrg.isOrg==1||defOrg.isOrg==5)?'168':'164') + 'px'}">发布企业</div>
							<div class="item" style="width: 143px">发布时间</div>
							<div class="item" style="min-width: 44px;text-align:left" v-if="defOrg&&defOrg.isOrg==1|| defOrg&&defOrg.isOrg==5">操作</div>
						</div>
						<div class="mc" v-if="!allusers.data || !allusers.data.length">
							<div class="item" style="text-align: center; width:800px">暂无数据</div>
						</div>
						<div v-if="allusers.data">
							<!-- <div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " v-dragging="{ item: value, list: allusers.data,group:'alluserslist'}" :key="index"> -->
							<div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " :key="index">
								<div class="item hand" @dblclick="test(index,value)" title="双击修改序号" style="min-width: 52px" v-if="menuactive==1&&(defOrg.isOrg==1||defOrg.isOrg==5)"><div class="sort-num">{{index+1}}</div></div>
								<template v-for="extra in value.extraProperties">
									<div class="item" style="width: 303px;padding-right:10px" :key="extra.fieldName" v-if="extra.fieldName =='productName'" :title="extra.fieldValue">{{extra.fieldValue?extra.fieldValue:' '}}</div>
								</template>
								<template v-if="defOrg&&defOrg.orgType!=7" v-for="extra in value.extraProperties">
									<div class="item" style="width: 168px;padding-right:10px;color:#999999;" :key="extra.fieldName" v-if="extra.fieldName =='companyName'" :title="extra.fieldValue">{{extra.fieldValue?extra.fieldValue:' '}}</div>
								</template>
								<!-- <div class="item" style="width: 168px" :title="value.idCard">{{ value.extraProperties[0].fieldValue }}</div> -->
								<div class="item" style="width: 143px;color:#999999;">{{  value.createdDate?new Date(value.createdDate).Format("yyyy-MM-dd hh:mm"):'' }}</div>
								<div class="item" style="min-width: 44px" v-if="defOrg&&defOrg.isOrg==1|| defOrg&&defOrg.isOrg==5">
									<span class="link" @click="getDetail(value)">{{menuactive==1?'下架':'上架'}}</span>
								</div>
							</div>
							<Page v-if="allusers.data" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="allusers.totalElements"
								@on-change="getOrgUserPage()" show-elevator :page-size="pageSize" :show-total="true" />
						</div>
					</div>
				</div>
				<div class="cl"></div>
			</div>
			<!-- 弹窗 -->
			<div class="layer staffeit" v-if="layer==5">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">无法访问</div>
					<div class="tips" style="width: 154px;margin: 0 auto;margin-top: 33px;">您的组织身份已被冻结，
						请联系组织管理员处理。</div>
					<div class="btns">
						<div class="btn2" @click="tolayer(0)">我已知晓</div>
					</div>
				</div>
			</div>
			<!-- 编辑序号 -->
			<div class="layer staffeit" v-if="layer==1">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">修改序号</div>
					<div class="tips">要修改<span style="color:#2168eb;">{{ sortsetObj.name }}</span>的序号由<span style="color:#2168eb;">{{ sortsetObj.index}}</span>改为
						<div class="mc">
							<input class="sortnum" step="0.1" required="" v-model="newsort"/>
						</div>

					</div>
					<div class="btns">

						<div class="btn1" @click="tolayer(0)">我再想想</div>
						<div class="btn2" @click="save()">确认修改</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'productShow',
		data() {
			return {
				menuactive: 1,
				layer: 0,
				//组织id
				orgId: null,
				//组织用户
				allusers: {
					total: 1,
				},
				//分页
				pageNumber: 1,
				pageSize: 10,
				orgUserList: [],
				sortsetObj:{},
				newsort:"",
			}
		},
		props: {
			msg: String,
			defOrg: null,
			personalInfo: null
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getOrgUserPage();
				}
			},
			menuactive: function(val, oldval) {
				if (this.orgId != null) {
					this.getOrgUserPage();
				}
			}

		},
		created() {
			// console.log(this.menuactive)
			this.menuactive = this.$route.params.page
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getOrgUserPage();
			}
		},
		mounted() {
			// 页面table的拖拽
			this.$dragging.$on('dragend', (value) => {
				// this.flash(1)
				if(value.group == 'alluserslist'){
					var arr = []
					for (var i = 0; i < this.allusers.rows.length; i++) {
						// 新的id
						// 原来的序号
						var a = new Object()
						a.id = this.allusers.rows[i].id
						a.sort = this.orgUserList[i].sort
						arr.push(a)
					}
					// 循环新的列表,发送给后台
					this.orgUserList = arr
				}else if(value.group == 'orgStructureListDtos'){
					var arr = [];
					for( var item of this.orgStructureListDtos){
						arr.push(item.id)
					}
					this.http.ajax({
						url: 'webSite/orgStructure/orgStructureMove',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"structureList": arr
						}
 
					}).then(res => {
						layer.msg(res.msg)
						this.flash()
					})
				}
			})
		},
		methods: {
			toPage(){
				this.$router.push({
					path: "/product",
				});
			},

			test(index,val) {
				// this.allusers.rows[e].makesort = true
				// console.log(this.allusers.rows[e])
				for(var item of val.extraProperties){
					if(item.fieldName == "productName"){
						this.sortsetObj.name= item.fieldValue
						break
					}else{
						this.sortsetObj.name = ""
					}
				}
				this.sortsetObj.id = val.id
				this.sortsetObj.index = index +1
				// console.log(index,val,this.sortsetObj)

				// this.sortsetObj.newsort = ""
				// // console.log(this.sortsetObj.newsort)
				this.layer = 1
			},
			save(e) {
				// this.allusers.rows[e].makesort = false
				if (/^[1-9]\d*$|^$/.test(this.newsort)) {
					if (this.newsort > 99999) {
						layer.msg("输入数字不能超过5位")
						return
					}
					this.setSort(this.sortsetObj.id, this.newsort)
					return
				}
				layer.msg("请输入大于0的数字")
			},
			// 单独排序--序号修改
			setSort(id, newSort) {
				if (newSort == "") {
					layer.msg("序号不能为空")
					return
				}
				this.http.ajax({
					url: 'webSite/businessGov/updateProductSort',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"id": id,
						"inx": newSort,
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
					this.newsort = null
					// console.log("xuhao",this.newsort)
					// this.sortsetObj.newsort=null
					this.flash()
				})
			},

			// 刷新页面
			flash() {
				this.getOrgUserPage();
					
			},
			//获取产品列表
			getOrgUserPage() {
				this.http.ajax({
					url: 'webSite/businessGov/searchBusinessActivity?pageNumber=' + this.pageNumber + "&size=" + this.pageSize,
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						type:1500,
						orgId:this.orgId,
						pageNumber: this.pageNumber,
						pageSize: this.pageSize,
						status:this.menuactive==2?'0':'1'
					}
				}).then(res => {
					//展示组织用户的分頁數據
					if (res.code == 200) {
						this.allusers = res.data;
					}
				})
			},

			tomenu(n) {
				// this.$route.push()
				// this.$router.push('/staff/' + n);
				this.menuactive = n;
				this.pageNumber = 1;
				// this.allusers = [];
				// this.getOrgUserPage(n);
				//获取组织用户
				

			},
			// 弹窗弹出
			tolayer(n) {
				this.layer = n
			},
			// 下架
			getDetail(value){
				// console.log(this.menuactive==2?'1':'0')

				// return
				this.http.ajax({
					url: 'webSite/businessGov/updateChannelActivityStatus',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data:{
						id:value.id,
						status:this.menuactive==2?'1':'0'
					}
				}).then(res => {
					//展示组织用户的分頁數據
					if (res.code == 200) {
						layer.msg(res.msg)
						this.getOrgUserPage()
					}
				})
			
			},
		}



	}
</script>

<style lang="less">
	// .ivu-poptip-popper{
	// 	top:130px !important;
	// }
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
			padding-top: 37px;
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
				height: 28px;
				line-height: 28px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

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
				width: 815px;
				float: right;
				padding-left: 40px;
				padding-right: 46px;
				padding-top: 10px;
				position: relative;
				min-height: 660px;
				padding-bottom: 20px;
				.sort-num{
					width:32px;
					height:28px;
					border-radius:4px;
					border:1px solid #cccccc;
					text-align: center;
					line-height: 28px;
				}
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

				.tit {
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					font-weight: 540;
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
					padding: 0 14px;
					cursor: pointer;
				}
				.table {
					.link {
						cursor: pointer;
						color: #2168eb;
						margin: 0 0 0 2px;
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
						padding-left: 12px;
						// padding-right: 20px;
						text-align: left;
						font-family: "PingFangSC-Regular,PingFang SC";
						height:60px;


						.item {
							text-align: left;
							height: auto;
							// line-height: 60px;
							display: inline-block;
							min-width: 60px;
							-webkit-box-sizing: border-box;
							-moz-box-sizing: border-box;
							box-sizing: border-box;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							margin:auto 0;
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
						font-weight: 500;
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
		// display: none;
	}

	.staff .warp .rightcont .table .mc:hover .item .link {
		display: inline-block !important;
	}
</style>

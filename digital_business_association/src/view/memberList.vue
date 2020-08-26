<template>
	<div>
		<div class="w">
			<div class="position">
				<!-- <span @click="$router.back(-1)">返回</span> -->
			</div>
		</div>
		<div class="w bg staff" style="margin-top:1px;">
			<div class="warp staff" style="margin-top:1px;">
				<div class="leftcont">
					<div class="menu">
						<!-- 商协会列表 -->
						<div v-if="menuactive==1|| menuactive==2">
							<div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">商会列表</div>
							<div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">协会列表</div>
						</div>
						
						<!-- 商协会详情 -->
						<div v-if="menuactive==3|| menuactive==4">
							<div class="item n" @click="synopsisbtn(1)" v-if="menuactive==3" :class="{active:synopsis==1 || synopsis==2}">商会介绍</div>
							<div class="item n" @click="synopsisbtn(1)" v-if="menuactive==4" :class="{active:synopsis==1 || synopsis==2}">协会介绍</div>
							<dl class="child" v-show="synopsis==1 || synopsis==2">
								<dd :class="{active:synopsis==1}" @click="synopsisbtn(1)">
									<span>{{menuactive==3?'商':'协'}}会简介</span>
								</dd>
								<dd :class="{active:synopsis==2}" @click="synopsisbtn(2)">
									<span>会长</span>
								</dd>
							</dl>
							<div class="item" @click="synopsisbtn(3)" :class="{active:synopsis==3|| synopsis==4}">辖属企业</div>
						</div>
					</div>
				</div>
				<!-- 商协会列表 -->
				<div class="rightcont" v-show="menuactive==1 || menuactive==2">	
					<div class="rightcont-top clear">
						<div class="tit fl">青岛市{{menuactive==1?'商会':'协会'}}列表</div>
					</div>
					<div class="table">
						<div class="mt" style="padding-right:0px">
							<div class="item" style="width:645px">名称</div>
							<div class="item" style="text-align:left;min-width:60px">操作</div>
						</div>
						<div class="mc" v-if="!arrList.data.length">
							<div class="item" style="text-align: center; width:800px">暂无数据</div>
						</div>
						<div v-if="arrList.data">
							<!-- <div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " v-dragging="{ item: value, list: allusers.data,group:'alluserslist'}" :key="index"> -->
							<div class="mc hand" v-for="(value,index) in arrList.data" style="overflow: hidden;padding-right: 0px; " :key="index">
								<div class="item" style="width:626px">{{value.entityName}}</div>
								<div class="item" style="width:80px">
									<span @click="tomenu(3,value)" v-if="menuactive ==1" class="edit">查看更多</span>
									<span @click="tomenu(4,value)" v-if="menuactive ==2" class="edit">查看更多</span>
								</div>
							</div>
							<Page v-if="arrList.data && arrList.data.length" :current.sync="page" style="text-align: right;margin-top: 20px;" :total="arrList.totalCount"
								@on-change="getList()" show-elevator :page-size="size" :show-total="true" />
						</div>
					</div>
				</div>
				<!-- 商协会介绍 -->
				<div class="rightcont" v-show="menuactive==3 || menuactive==4">	
					<div class="rightcont-top clear">
						<div class="tit fl">{{menuactive==3&& synopsis==1?'商会简介':menuactive==4&& synopsis==1?'协会简介':synopsis==3?'辖属企业列表':synopsis==4?'辖属企业详情':'会长'}}</div>
					</div>
					<!--  商协会介绍-简介 -->
					<div v-show="synopsis==1">
						<Form :label-width="100" :model="pre"> 
							<FormItem label="内容">
								<div style="min-height:200px;border:1px solid #dddddd;padding:14px 10px;" v-html="pre.baseIntro"></div>
							</FormItem>
							<div class="line"></div>
							<FormItem label="联系资料"></FormItem>
							<FormItem label="电话">
								<Input  :disabled='disabled' style="width:350px;" v-model="pre.telephone" />
							</FormItem>
							<FormItem label="传真" >
								<Input  :disabled='disabled' style="width:350px;" v-model="pre.fax" />
							</FormItem>
							<FormItem label="电子邮箱" >
								<Input  :disabled='disabled' style="width:350px;" v-model="pre.mail" />
							</FormItem>
							<FormItem label="地址" >
								<Input  :disabled='disabled' style="width:350px;" v-model="pre.address" />
							</FormItem>
						</Form>
						<div class="line"></div>
						<div class="member clear" v-if='pre.member.length'>
							<p class="fl">现有活跃会员
								<span style="font-size:16px;color:#2168eb;">{{pre.member.length}}</span>
								人
							</p>
							<div class="fr clear">
								<img class="member-img" v-for='(value,index) in pre.member' :key='index' v-if='index<5' :src="value.photo">
							</div>
						</div>
					</div>
					<!--  商协会介绍-会长 -->
					<div v-show="synopsis==2">
						<Form :label-width="100" :model="pre"> 
							<FormItem label="姓名" >
								<Input  :disabled='disabled' style="width:350px;" :maxlength="20" v-model="president.name" />
							</FormItem>
							<FormItem label="电话" >
								<Input  :disabled='disabled' style="width:350px;" :maxlength="20" v-model="president.mobile" />
							</FormItem>
						</Form>
						<div class="line"></div>
						<div class="president">
							<div class="clear">
								<img src="../assets/img/szsxh3.1@3x.png" class="president-icon fl">
								<span>现任职务</span>
							</div>
							<div class="president-content">
								<p v-for='(value,index) in president.position' :key='index'>{{value}}</p>
							</div>
						</div>
						<div class="line"></div>
						<div class="president">
							<div class="clear">
								<img src="../assets/img/szsxh3.2@3x.png" class="president-icon fl">
								<span>历任职务</span>
							</div>
							<div class="president-content">
								<p v-for='(value,index) in president.prevPosition' :key='index'>{{value}}</p>
							</div>
						</div>
						<div class="line"></div>
						<div class="president">
							<div class="clear">
								<img src="../assets/img/szsxh3.3@3x.png" class="president-icon fl">
								<span>主要成就</span>
							</div>
							<div class="president-content" v-html="president.achievement">
							</div>
						</div>
					</div>
					<!-- 辖属企业列表 -->
					<div v-show="synopsis==3">
						<div class="table">
							<div class="mt" style="padding-right:0px">
								<div class="item" style="width:645px">名称</div>
								<div class="item" style="text-align:left;min-width:60px">操作</div>
							</div>
							<div class="mc" v-if="!arrList.data">
								<div class="item" style="text-align: center; width:800px">暂无数据</div>
							</div>
							<div v-if="arrList.data">
								<!-- <div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " v-dragging="{ item: value, list: allusers.data,group:'alluserslist'}" :key="index"> -->
								<div class="mc hand" v-for="(value,index) in arrList.data" style="overflow: hidden;padding-right: 0px; " :key="index">
									<div class="item" style="width:626px">{{value.entityName}}</div>
									<div class="item" style="width:80px">
										<span @click="synopsisbtn(4,value)" class="edit">查看详情</span>
									</div>
								</div>
								<Page v-if="arrList.data && arrList.data.length" :current.sync="page" style="text-align: right;margin-top: 20px;" :total="arrList.totalCount"
									@on-change="getList()" show-elevator :page-size="size" :show-total="true" />
							</div>
						</div>
					</div>
					<!-- 辖属企业详情 -->
					<div v-show="synopsis==4">
						<Form :label-width="100" :model="pre"> 
							<FormItem label="企业法人">
								<Input style="width:350px;" :maxlength="20" v-model="prePre.legalPersonName" disabled/>
							</FormItem>
							<FormItem label="电话" >
								<Input style="width:350px;" :maxlength="20" v-model="prePre.legalPersonMobile" disabled/>
							</FormItem>
							<div class="line"></div>
							<FormItem label="企业简介">
								<Input 
									v-model="prePre.description" 
									type="textarea"
									:maxlength="40"
									:autosize="{minRows: 5,maxRows: 8}"
									disabled/>
							</FormItem>
						</Form>
					</div>
				</div>
				<div class="cl"></div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	inject: ['reload'],
	name: "memberList",
	data() {
		return {
			menuactive: 1,
			layer: 0,
			pre:{
				name:"",
				telephone:"",
				address:"",
				website:"",
				function:"",
				member:[]
			},
			prePre:{}, 
			index:0,
			synopsis:1,
			arrList:{
				data:[]
			},
			page:1,
			size:10,
			preItem:null,
			preItem1:null,
			president:[],
			disabled:true,
		};
	},
	props: {
		msg: String,
		defOrg: null,
		personalInfo: null,
		login: null
	},
	watch: {
		$route:function() {
			this.reload();
		},
		defOrg(res,old) {
			if (res) {
				this.orgId = res.digitalCommerce;
				this.getList();
			}
		},
		synopsis(n){
			if(n == 3|| n == 4){
				this.getList();
			}
		}
	},
	created() {
		this.menuactive = this.$route.params.page?this.$route.params.page:1;
		this.preItem = this.$route.query.preItem? JSON.parse(this.$route.query.preItem):null;
		if(this.defOrg){
			this.getList();
		}
		if(this.preItem){
			this.getPresident()
		}
	},
	methods: {
		check(row) {
			if (row) {
				let result = JSON.stringify(row);
				this.$router.push({
					path: "/addLeader",
					query: {
						row: result,
						m: 1
					}
				});
			} else {
				this.$router.push({
					path: "/addLeader",
					query: {
						m: 0
					}
				});
			}
		},
		// 删除
		del(value) {
			this.http
				.ajax({
					url: "person/" + value.id,
					method: "DELETE",
					headers: {
						"Content-Type": " application/json"
					}
				})
				.then(res => {
					// console.log(res)
					if(res.code ==1){
						layer.msg("删除成功");
						this.layer = 0;
						this.flash(0);
					}
				});
		},
		tomenu(n,val) {
			this.menuactive = n;
			if(this.$route.params.page !=n && !val){
				this.$router.push("/memberList/" + n);
			}else if(this.$route.params.page !=n && val){
				this.$router.push("/memberList/" + n + '?preItem=' + JSON.stringify(val));
			}
		},
		synopsisbtn(n,val){
			this.synopsis = n;
			if(val){
				this.preItem1 = val
			}
		},
		// 获取列表信息
		getList(){
			if(this.menuactive ==1 || this.menuactive ==2){
				var id = this.defOrg.digitalCommerce;
				var url = "underling/" +  id + '?page=' + `${this.page-1}` + '&size=' + this.size;
				var method = 'post';
				var data = {
					entityType:0,
					subType:this.menuactive ==1?2:3,
				}
			}else if((this.menuactive ==3 || this.menuactive ==4)&& this.synopsis==3){
				var id = this.preItem.entityId;
				var url = "underling/" +  id + '?page=' + `${this.page-1}` + '&size=' + this.size;
				var method = 'post';
				var data = {
					entityType:1,
				}
			}else{
				var id = this.synopsis==1|| this.synopsis==2?this.preItem.entityId:this.preItem1.entityId;
				var url = `${this.synopsis == 4 && this.preItem1.entityType ==0 || 	
				this.synopsis == 1&& this.preItem.entityType ==0
					?'info/':'companies/'}` + id;
				var method = 'get';
				var data = {}
			}
			this.http.ajax({
				url:url,
				method:method,
				headers:{
					"Content-Type": " application/json"
				},
				data:data
			}).then(res =>{
				if(res.data){
					this.arrList = res;
				}else if(this.synopsis==1 || this.synopsis==2){
					// this.pre = res
					for(var item of res.properties){
						if(item.fieldName=='telephone'){
							this.pre.telephone=item.fieldValue
						}
						if(item.fieldName=='mail'){
							this.pre.mail=item.fieldValue
						}
						if(item.fieldName=='address'){
							this.pre.address=item.fieldValue
						}
						if(item.fieldName=='fax'){
							this.pre.fax=item.fieldValue
						}
						if(item.fieldName=='baseIntro'){
							this.pre.baseIntro=item.fieldValue
						}
					}
				}else if(this.synopsis==4){
					this.prePre = res
				}
			})
		},
		getPresident(){
			this.http.ajax({
				url:"person/" + this.preItem.entityId,
				method:"get",
				headers:{
					"Content-Type": " application/json"
				},
				data:{}
			}).then(res =>{
					this.president = res.filter(item=>(item.inx==0))[0]
					this.pre.member = res.filter(item=>(item.inx==1))
			})
		}
	}
};
</script>

<style lang="less">
// .ivu-poptip-popper{
// 	top:130px !important;
// }
.ivu-poptip-rel {
	height: 38px;
}
.staffeit .mc .ivu-select-dropdown {
	will-change: unset !important;
}
.right .ivu-select-placeholder {
	text-align: right;
}

.sortnum {
	display: inline-block;
	width: 100%;
	// height: 40px;
	line-height: 1.5;
	padding: 4px 7px;
	font-size: 14px;
	border: 1px solid #c7c7c7;
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
			border: 1px solid #2168eb;
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
		font-family: "PingFangSC-Regular,PingFang SC";

		// float:left;
		// width:75%;
		.text-label {
			width: 100px;
			display: flex;
			line-height: 40px;

			p {
				color: #dc1a00;
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
		.mt-left {
			margin-right: 182px;
		}
		.ivu-switch-small {
			width: 32px;
		}
		.ivu-switch-small.ivu-switch-checked:after {
			left: 16px;
		}
	}

	.mc-phone {
		margin: 0 16px 7px;
		.text {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(136, 136, 136, 1);
			line-height: 17px;
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
	.layer-top {
		margin: 13px 16px;
		width: 294px;
		height: 38px;
		background: rgba(250, 250, 250, 1);
		padding-left: 15px;
		line-height: 38px;
	}
	.layer-cont {
		margin: 0 17px 14px;
		.layer-cont-l {
			width: 68px;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 32px;
		}
		.layer-cont-r {
			width: 222px;
			min-height: 32px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 7px 11px;
			text-align: right;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 17px;
		}
		.height {
			line-height: 16px;
		}
	}
	.new {
		padding-top: 14px;
		margin-bottom: 27px;
		.btn2 {
			width: 104px;
			height: 28px;
			background: rgba(33, 104, 235, 1);
			border-radius: 14px;
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
			.btn{
				padding:5px 89px;
				height:auto;
				font-size:14px;
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
				font-weight: 500;
				color: #333333;
				margin-bottom: 10px;
			}
			.btnD {
				height: 22px;
				background: rgba(255, 255, 255, 1);
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);
				color: #333333;
				padding: 0px 15px;
				text-align: center;
				line-height: 22px;
				display: inline-block;
				font-size: 12px;
				margin-right: 5px;
			}
			.addbtn {
				height: 22px;
				border-radius: 14px;
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
					margin: 0 7px;
					font-size: 10px;
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
					font-size: 11px;
					margin: 0px 10px;
					position: relative;
					display: inline-block;
					height: 100%;
					cursor: pointer;
					color: #2168eb;
					width:auto;
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
			.line{
				width:100%;
				border-bottom:1px dashed #DDDDDD;
				margin-bottom:24px;
			}
			.ivu-input[disabled], fieldset[disabled] .ivu-input {
				background-color: #ffffff;
				opacity: 1;
				cursor: not-allowed;
				color: #333333;
			}
			.member{
				font-size: 14px;
				color: #333333;
				width: 448px;
				padding: 16px 14px;
				background: #f8f8f8;
				.member-img{
					height: 34px;
					width: 34px;
					border: 1px solid #ffffff;
					border-radius: 50%;
					margin-left: -15px;
				}
			}
			.president{
				font-size: 14px;
				line-height: 20px;
				.president-icon{
					width: 20px;
					height: 20px;
					display: block;
					margin-right: 5px;
				}
				.president-content{
					width: 448px;
					margin: 12px 0 22px;
					padding: 12px 14px;
					background: #f8f8f8;
					border-radius: 8px;
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
					background: url("../assets/img/zk3@2x.png") no-repeat right center;
				}
			}
		}
	}
}
.editorHint {
	font-size: 12px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(33, 104, 235, 1);
	line-height: 17px;
	min-width: 400px;
	margin-top: 9px;
}
.ivu-form .ivu-form-item-label {
	text-align: left;
}

.staff .warp .rightcont .table .mc .item .link {
	display: none;
}
.staff .warp .rightcont .ivu-input[disabled] {
	cursor:default;
}
.staff .warp .rightcont .ivu-input{
	height:30px;
	margin-bottom:12px;
}

.staff .warp .rightcont .table .mc:hover .item .link {
	display: inline-block !important;
}
</style>

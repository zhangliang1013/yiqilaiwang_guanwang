<template>
	<div>
		<div class="w">
			<div class="position">{{getTitleInfo()}}
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">

			<div class="admissionreview">
				<div class="title2" v-if="messageType>0">
					<router-link class="add" :to="'/addarticle?messageType='+this.messageType">发{{getMessageType(messageType)}}</router-link>
					<!-- {{getMessageType(messageType)}}列表 -->

					<div class="searchBox" v-if="messageType!=null&&messageType!=''">
						<span>类型</span>
						<Select v-model="selectMessageType" style="width: 160px;">
							<Option value="1">资讯</Option>
							<Option value="2">资源</Option>
							<Option value="3">通知</Option>
							<Option value="4" v-if="defOrg&&defOrg.authStatus==2">党建</Option>
						</Select>

						<span>主题</span>
						<Input type="text" v-model="newsDigest" placeholder="" class="search" :maxlength="6"/>
						<div class="btn1" @click="flash()">搜索</div>
					</div>

				</div>


				<div class="table">

					<div class="mt">
						<div class="item" style="width: 90px;">用户</div>
						<div class="item" style="width: 100px;">类型</div>
						<div class="item" style="width: 320px;">主题</div>
						<div class="item" style="width: 270px;">时间</div>
						<div class="item" style=" width: 80px;text-align: center;">操作</div>
					</div>
					<div class="mc" v-if="list.length==0">
						<div class="item" style="text-align: center; width:800px">暂无数据</div>
					</div>
					<div class="mc hand" v-for="(v,i) in list" :key="i">
						<div class="item" style="width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="messageType =='' ||messageType ==null" v-on:click="check(v)">{{v.userName}}</div>
						<div class="item" style="width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="messageType !='' &&messageType !=null" v-on:click="check(v)">{{v.createName}}</div>
						<div class="item" style="width: 100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-on:click="check(v)">{{getMessageType(v.messageType)}}</div>
						<div class="item" style="width: 320px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-on:click="check(v)">{{v.newsDigest}}</div>
						<div class="item" style="width: 270px;" v-on:click="check(v)">{{v.createTime.substr(0,16)}}</div>
						<div class="item" style="width: 80px;text-align: center;">
							<span v-on:click="check(v)" :style="{color:(v.status==0?conFontColor0:v.status==1?conFontColor1:v.status==2?conFontColor2:v.status)}" v-if="messageType !='' &&messageType !=null">
								{{v.status==0?'未审核':v.status==1?'':v.status==2?'不通过':v.status}}
							</span>
							<span v-on:click="check(v)" :style="{color:(v.status==0?conFontColor0:v.status==1?conFontColor1:v.status==2?conFontColor2:v.status)}" v-if="messageType =='' ||messageType ==null">
								{{v.status==0?'未审核':v.status==1?'通过':v.status==2?'不通过':v.status}}
							</span>
							<span :style="{color:conFontColor2}" @click="del(v)" v-if="messageType !='' &&messageType !=null">删除</span>
						</div>
					</div>
					<Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;" @on-change="getOrgMessageList"
					 show-elevator :page-size="10" :show-total="true" :total="total" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'managearticlelist',
		props: {
			msg: String,
			defOrg: null,
			personalInfo: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getOrgMessageList(this.page);
				}
			}
		},
		data() {
			return {
				list: [],
				orgId: null,
				page: 1,
				total: 0,
				conFontColor0: '#2168eb',
				conFontColor1: '#5AA20C',
				conFontColor2: '#DC1A00',
				messageType: null,
				// 查询框的跳转与主题
				selectMessageType: this.messageType,
				newsDigest: null

			}
		},
		methods: {
			// 删除通知等
			del(v) {
				// console.log(v)
				
				var _t=this
				layer.confirm('您确认要将该记录删除吗？删除将无法恢复！', {
					title: ['安全警告'],
					closeBtn: false,
					btnAlign: 'c',
					shadeClose: true,
					skin: 'yq-confirm',
					btn: ['取消', '确认'] //按钮
				}, function() {
					layer.closeAll()
				}, function() {
					_t.http.ajax({
							url: 'webSite/orgMessage/remove?uid=' + _t.personalInfo.id,
							method: 'post',
							headers: {
								'Content-Type': ' application/json'
							},
							data: {
								id: v.id
							}

						})
						.then(res => {
			
							layer.msg(res.msg)
							if (res.code == 200) {
								_t.flash()
								this.total = res.data.total;
							}
						})
				});
			},
			getTitleInfo() {
				// console.log(this.messageType)
				switch (this.messageType) {
					case '1':
						return '资讯管理';
					case '2':
						return '资源管理';
					case '3':
						return '通知管理';
					case '4':
						return '党建管理';
					default:
						return '内容审核';
				}
			},
			getMessageType(type) {
				switch (Number(type)) {
					case 1:
						return '资讯';
					case 2:
						return '资源';
					case 3:
						return '通知';
					case 4:
						return '党建';
				}
			},
			getOrgMessageList(page) {
				let data = {
					"orgId": this.orgId,
					"pageNumber": page,
					"pageSize": 10,
					"newsDigest": this.newsDigest
					// "messageType":this.messageType,
				}
				if (this.messageType > 0) {
					data['messageType'] = this.messageType
					this.http.ajax({
							url: 'webSite/orgMessage/list',
							method: 'post',
							headers: {
								'Content-Type': ' application/json'
							},
							data: data
						})
						.then(res => {
			
							if (res.code == 200) {
								res.data.rows = res.data.rows.filter((item)=>{
									return (item.messageType != 14 && item.messageType !=16)
								})
								this.list = res.data.rows;
								this.total = res.data.total;
							}
						})
				} else {
					this.http.ajax({
							url: 'webSite/getTaskAuditList',
							method: 'post',
							headers: {
								'Content-Type': ' application/json'
							},
							data: data
						})
						.then(res => {
		
							if (res.code == 200) {
								this.list = res.data.userList.rows;
								this.total = res.data.userList.total;
							}
						})
				}
			},
			check(row) {
					var m=0
					if(this.messageType>0){
						m=this.messageType
					}
				this.$router.push({
					path: '/contentaudit',
					query: {
						'id': row.id,
						'm':m
					}
				});
				// this.$router.push({name:'admissionreviews',params:row});
				// } else {
				// 	return layer.msg('此信息已审核!');
				// }
			},
			// 刷新当前页
			flash() {
				if (this.selectMessageType != null) {
					this.messageType = this.selectMessageType
				}

				this.getOrgMessageList(1);
			}
		},
		created() {
			this.messageType = this.$route.query.messageType;
			if (this.$route.query.newsDigest != null) {
				this.newsDigest = this.$route.query.newsDigest;
			}

			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getOrgMessageList(this.page);
			}
		}
	}
</script>

<style lang="less">
	.yq-confirm .layui-layer-content {
		padding: 35px 40px;
	}
	
	.hand {
		cursor: pointer;
	}

	.search {
		width: 168px;

		margin: 0 auto;
	}

	.btn1 {
		padding: 0 10px;
		text-align: center;
		line-height: 22px;
		display: inline-block;
		font-size: 12px;
		margin: 0 5px;
		height: 22px;
		border-radius: 14px;
		border: 1px solid rgba(151, 151, 151, 1);
		cursor: pointer;
	}


	.admissionreview {
		overflow: hidden;
		padding-top: 16px;

		.table {
			margin: 30px 90px 46px 90px;
		}

		.searchBox {

			span,
			.ivu-select,
			.ivu-input-type {
				margin-right: 10px;
			}

			.ivu-select-selected-value,
			.ivu-select-item {
				text-align: center;
			}

			.btn1 {
				width: 60px;
				height: 22px;
				background: #2168eb;
				border-radius: 14px;
				line-height: 22px;
				text-align: center;
				color: #ffffff;
				font-size: 12px;
			}
		}

		.title2 {
			font-size: 16px;
			margin: 0 90px;
			padding: 15px 0 0 0;

			.add {
				float: right;
				width: 60px;
				height: 22px;
				background: rgba(33, 104, 235, 1);
				border-radius: 14px;
				line-height: 22px;
				text-align: center;
				color: #ffffff;
				font-size: 12px;
				margin-top: 10px;
			}
		}
	}
</style>

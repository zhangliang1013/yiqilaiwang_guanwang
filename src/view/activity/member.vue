<template>
	<div>
		<div class="w">
			<div class="position">活动审核
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;" v-if="list">
			<div class="activitymember">
				<div class="tablemt">
					<div class="item ">
						<div class="n">{{noCheck}}</div>
						<p>待审核</p>
					</div>
					<div class="item ">
						<div class="n">{{check}}</div>
						<p>已通过</p>
					</div>
					<div class="item">
						<div class="n">{{noAdopt}}</div>
						<p>未通过</p>
					</div>
				</div>
				<div class="table">
					<div class="mt">
						<div class="item" style="width: 502px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">用户</div>
						<div class="item" style="width: 290px;">时间</div>
						<div class="item" style="text-align: right;min-width: 53px;">操作</div>
					</div>
					<div class="mc" v-for="(item,index) in list" :key="index">
						<div class="item" style="width: 502px;">
							<span v-if="item.nickName!=''">{{item.nickName}}</span>
							<span style="color: #dc1a00;" v-if="item.nickName==''">暂无</span>
						</div>
						<div class="item" style="width: 290px;">
							<span>{{item.joinTime.substr(0,16)}}</span>
							<!-- {{item.telphone}} -->
						</div>
						<div class="item hand" style="text-align: right;" >
							<span style="color: #2168eb;" v-if="item.isCheck==0 && item.exitStatus == 0" @click="audit(item)">待审核</span>
							<span style="color: #5AA20C;" v-if="item.isCheck == 1 && item.exitStatus == 0" @click="message()">已通过</span>
							<span style="color: #DC1A00;" v-if="item.isCheck==2 && item.exitStatus == 0" @click="message()">不通过</span>
							<span style="color: #2168eb;" v-if="item.exitStatus == 1" @click="audit(item)">待审核</span>
						</div>
					</div>
					<Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;" :total="total" @on-change="getParticipant"
					 show-elevator :page-size="10" :show-total="true" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'activitymember',
		props: {
			defOrg: null
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getParticipant(this.page);
				}
			}
		},
		data() {
			return {
				list: [],
				orgId: null,
				routerId:null,
				page: 1,
				total: 0,
				noCheck: 0,
				check: 0,
				noAdopt: 0,
			}
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.routerId=this.$route.query.id,
				this.getParticipant(this.page);
			}
		},
		methods: {
			message(){
				layer.msg("该成员已审核完毕")
			},
			// 未审核人员审核
			audit(value) {
				
			let _t = this;
				layer.confirm(`您确认要允许<span style="color:red;">` + value.groupNickname + `</span>${value.exitStatus == 1?'退出':'参与'}该活动吗?`, {
					title: ['活动审核'],
					closeBtn: false,
					btnAlign: 'c',
					shadeClose: true,
					skin: 'yq-confirm',
					btn: ['允许', '不允许'] //按钮
				},function() {
					_t.auditMethod(value,1)			
				}, function() {
					
				_t.auditMethod(value,2)
				});	
			},
			auditMethod(value,type){
				if(value.exitStatus == 1){
					var url = 'webSite/act/participation/exit'
				}else{
					var url = 'webSite/act/participation/review'
				}
				this.http.ajax({
					url: url,
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"activityId": value.activityId,
						"type": type,
						"participantId": value.participantId
					}
				}).then(res => {
					this.getParticipant(this.page);
					layer.msg(res.msg)
				})
			},
			getParticipant(page) {
				this.http.ajax({
					url: 'webSite/act/participation/participantListDetail',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"activityId": this.routerId,
						"pageNumber": this.page,
						"pageSize": 10,
						type: 1,
					}
				}).then(res => {
					if (res.code == 200) {
						this.list = res.data.list.rows
						this.total = res.data.list.total
						this.noAdopt = res.data.noAdopt;
						this.check = res.data.check;
						this.noCheck = res.data.noCheck;

						// console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.activitymember {
		overflow: hidden;

		.table {
			margin: 46px 90px;
		}

		.tablemt {
			text-align: center;
			padding-top: 55px;

			.item {
				display: inline-block;
				width: 200px;


			}

			.n {
				font-size: 36px;
				font-weight: bold;

			}

			p {
				margin-top: 10px;
				font-size: 14px;
			}
		}

	}
</style>

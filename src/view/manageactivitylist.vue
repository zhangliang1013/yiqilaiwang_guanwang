<template>
	<div>
		<div class="w">
			<div class="position">活动审核
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<!-- <div class="tit">
				<div class="col">
					<span class="p1">99</span>
					<span class="p2">待审核</span>
				</div>
				<div class="col">
					<span class="p1">99</span>
					<span class="p2">通过</span>
				</div>
				<div class="col">
					<span class="p1">99</span>
					<span class="p2">未通过</span>
				</div>
			</div> -->
			<div class="admissionreview">
				<div class="table">
					<div class="mt">
						<div class="item" style="width: 100px;">用户</div>
						<div class="item" style="width: 402px;">主题</div>
						<div class="item" style="width: 290px;">时间</div>
						<div class="item" style="text-align: right;">操作</div>
					</div>
					<div  class="mc" v-if=" list.length ==0">
						<div class="item" style="width: 792px; text-align: center;">暂无数据</div>
					</div>
					<div class="mc hand" v-for="(v,i) in list" :key="i" v-on:click="check(v)">
						<div class="item" style="width: 100px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="v.nickName">{{v.nickName}}</div>
						<div class="item" style="width: 402px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="v.topic">{{v.topic}}</div>
						<div class="item" style="width: 290px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="v.createTime.substr(0,16)">{{v.createTime.substr(0,16)}}</div>
						<div class="item" style="text-align: right;">
							<!-- <span style="color: #2168eb;">待审核</span>
                             <span style="color: #5AA20C;">已通过</span>-->
							<span  :style="{color:(v.status==0?conFontColor0:v.status==1?conFontColor1:v.status==2?conFontColor2:v.status)}">
							{{v.status==0?'未审核':v.status==1?'通过':v.status==2?'不通过':v.status}}
							</span>
						</div>
					</div>
					<Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;"  @on-change="getActivityOrgList"
					 show-elevator :page-size="10" :show-total="true" :total="total"/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'manageactivitylist',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getActivityOrgList(this.page);
				}
			}
		},
		data() {
			return {
				list: [],
				orgId: null,
				page: 1,
				total:0,
				conFontColor0:'#2168eb',
				conFontColor1:'#5AA20C',
				conFontColor2:'#DC1A00',
			}
		},
		methods: {
			getActivityOrgList(page) {
				this.http.ajax({
						url: 'webSite/getActivityOrgList',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"pageNumber": page,
							"pageSize": 10
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.list = res.data.actList.rows;
							this.total = res.data.actList.total;
							// this.total = res.data.total;
							// console.log(this.list,'xxxxxxxxxxxx');
						}
					})
			},
			check(row) {
				// console.log(row, 'xxxxxx');
				if (row.status == 0) {
					this.$router.push({
						path: '/activityaudit',
						query: {'actId':row.actId,'id':row.id}
					});
					// this.$router.push({name:'admissionreviews',params:row});
				}else{
					return layer.msg('此信息已审核!');
				}
			}
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getActivityOrgList(this.page);
			}
		}
	}
</script>

<style lang="less">
	.admissionreview {
		overflow: hidden;
		.table {
			margin: 46px 90px;
		}
		.tit{
			width: 80%;
			display: flex;
			margin: 0 auto;
			.col{
				width: 100px;
				overflow: hidden;
				margin: 45px auto 0 auto;
				span{
					display: block;
					text-align: center;
				}
				.p1{
					font-size: 22px;
				}
			}
			
		}
	}
	
	
</style>

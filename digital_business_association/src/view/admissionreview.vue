<template>
	<div>
		<div class="w">
			<div class="position">入会审核
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="admissionreview">
				<div class="table">
					<div class="mt">
						<div class="item" style="width: 120px;padding-left: 5px;">头像</div>
						<div class="item" style="width: 120px;">姓名</div>
						<div class="item" style="width: 140px;">手机号</div>
						<div class="item" style="width: 410px;">备注</div>
						<div class="item" style="text-align: right;">状态</div>
					</div>
					<div class="mc" v-if="list.length==0">
						<div class="item" style="text-align: center; width:800px">暂无数据</div>
					</div>
					<div class="mc" v-for="(v,i) in list" :key="i" v-on:click="check(v)">
						<div class="item" style="width: 120px;">
							<img v-bind:src="v.avatarUrl" class="pic" width="40" height="40" alt="">
						</div>
						<div class="item" style="width: 120px;">{{v.applyName==null?v.applyName:v.userName}}</div>
						<div class="item" style="width: 140px;">{{v.telphone}}</div>
						<div class="item" style="width: 410px;">{{v.remake == undefined ? '无':v.remake}}</div>
						<!-- {{v.status}} -->
						<div class="item" style="text-align: right;">
							<!-- style="color: #2168eb;" -->
							<span :style="{color:(v.status==0?conFontColor0:v.status==1?conFontColor1:v.status==2?conFontColor2:v.status)}">
								{{v.status==0?'未审核':v.status==1?'通过':v.status==2?'不通过':v.status}}
								<!-- {{v.status == 0  ? '未审核' : (v.status ==1 ? '通过' : '不通过')}} -->
							</span>
						</div>
					</div>
					<Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;" @on-change="getOrgMembership"
					 show-elevator :page-size="10" :show-total="true" :total="total" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'admissionreview',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getOrgMembership(this.page);
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

			}
		},
		created() {
			// console.log(this.orgId);
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getOrgMembership(this.page);
			}
		},
		methods: {
			getOrgMembership(page) {
				this.http.ajax({
						url: 'webSite/getOrgMembership',
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
							this.list = res.data.userList.rows;
							this.total = res.data.userList.total;
							// this.total = res.data.total;
							// console.log(this.list,res.data.userList.rows);

						}
					})
			},

			check(row) {
				// console.log(row, 'xxxxxx');
				if (row.status == 0) {
					this.$router.push({
						path: '/admissionreviews',
						query: row
					});
					// this.$router.push({name:'admissionreviews',params:row});
				} else {
					return layer.msg('此信息已审核!');
				}
			}
		}
	}
</script>

<style lang="less">
	.admissionreview {
		overflow: hidden;

		.table {
			margin: 46px 90px;
			.item{
				cursor: pointer;
			}

			.pic {
				width: 40px;
				height: 40px;
				display: inline-block;
				vertical-align: middle;
				-webkit-border-radius: 40px;
				-moz-border-radius: 40px;
				border-radius: 40px;
				background: #eeeeee;
			}
		}


	}
</style>

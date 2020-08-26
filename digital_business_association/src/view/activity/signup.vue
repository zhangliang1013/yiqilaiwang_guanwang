<template>
	<div>
		<div class="w">
			<div class="position">用户信息
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;" v-if="detail">
			<div class="signup">
				<div class="tablemt">
					<div class="item hand" :class="{active:type==3}" @click="getparticipantListDetail(1,3)">
						<div class="n ">{{detail.applyCount}}</div>
						<p>已报名</p>
					</div>
					<div class="item hand" :class="{active:type==4}" @click="getparticipantListDetail(1,4)">
						<div class="n">{{detail.browseNum}}</div>
						<p>未报名</p>
					</div>
					<!-- <div class="item">
						<div class="n">{{detail.signInNum}}</div>
						<p>已签到</p>
					</div> -->
				</div>
				<!-- 已报名 -->
				<div class="table" v-if="type==3">
					<div class="mt">
						<div class="item" style="width: 120px;">用户</div>
						<div class="item" style="width: 120px;">姓名</div>
						<div class="item" style="width: 140px;">电话</div>
						<div class="item" style="width: 410px;">地址</div>
						<div class="item">状态</div>
					</div>
					<div class="mc" v-if="detail.list.rows.length==0">
						<div class="item" style="width: 790px;">暂无数据</div>
					</div>
					<div class="mc" v-for="(item,index) in detail.list.rows" :key="index">
						<div class="item" style="width: 120px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="item.nickName">{{item.nickName}}</div>
						<div class="item" style="width: 120px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="item.name">{{item.name}}</div>
						<div class="item" style="width: 140px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="item.telphone">{{item.telphone}}</div>
						<div class="item" style="width: 410px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="item.address">{{item.address}}</div>
						<div class="item">
							<span style="color: #999;" v-if="item.signType==0">未签到</span>
							<span style="color: #2168eb;" v-if="item.signType>0">已签到</span>
						</div>
					</div>
					<Page v-if="detail" :current.sync="page" style="text-align: right;margin-top: 20px;" @on-change="getparticipantListDetail"
					 show-elevator :page-size="10" :show-total="true" :total="detail.list.total" />
				</div>
				<!-- 未报名 -->
				<div class="table"  v-if="type==4">
					<div class="mt">
						<div class="item" style="width:780px;">用户</div>

						<div class="item"></div>
					</div>
					<div class="mc" v-if="detail.list.rows.length==0">
						<div class="item" style="width: 790px;">暂无数据</div>
					</div>
					<div class="mc" v-for="(item,index) in detail.list.rows" :key="index">
						<div class="item" style="width: 780px;">{{item.nickName}}</div>
						<div class="item">
							<span style="color: #999;">未报名</span>
						</div>
					</div>
					<Page v-if="detail" :current.sync="page" style="text-align: right;margin-top: 20px;" @on-change="getparticipantListDetail"
					 show-elevator :page-size="10" :show-total="true" :total="detail.list.total" />
				</div>

			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'signup',
		props: {
			personalInfo: null, //登陆后 的用户信息
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					//this.getparticipantListDetail(this.page);
				}
			}
		},
		data() {
			return {
				page: 1,
				detail: null,
				type: 3
			}
		},
		methods: {
			getparticipantListDetail(page, type) {

				// console.log(type)
				if (type == null || type == "") {
					type = 3
				}
				this.http.ajax({
						url: '../../webSite/act/participation/participantListDetail',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"activityId": this.$route.query.id,
							"pageNumber": page,
							"pageSize": 10,
							"type": type //1：审核列表 2：费用列表已收款 3：用户信息 4： 未报名 5: 费用详情已退款 
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.detail = res.data
							this.type = type
						}
					})
			},
		},
		created() {
			this.getparticipantListDetail(this.page, this.type);
		}
	}
</script>

<style lang="less">
	.hand {
		cursor: pointer;
	}
	.active {
		color: #2168eb;
		font-weight: 500;
	}

	.signup {
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

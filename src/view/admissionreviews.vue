<template>
	<div>
		<div class="w">
			<div class="position">入会审核
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="admissionreviews">
				<div class="box">
					<div class="box1">
						<div class="mt">
							<img alt="" class="pic" v-bind:src="userInfo.avatarUrl">
							<div class="title">{{userInfo.realName}}</div>
							<div class="g">{{userInfo.company}}</div>
							<div class="z">{{userInfo.post}}</div>
						</div>
						<p style="color: #2168eb;"><img src="../assets/img/rhsh3@2x.png" alt="">{{userInfo.telphone}}</p>
						<p><img src="../assets/img/rhsh2@2x.png" alt="">{{userInfo.mail}}</p>
						<p><img src="../assets/img/rhsh4@2x.png" alt="">{{userInfo.address}}</p>
					</div>
					<!-- <img src="" alt="" class="code"> -->
				</div>
				
				<div class="tips">
					<img src="../assets/img/rhsh5@2x.png" alt="" class="p1">
					{{ remake }}
					<img src="../assets/img/rhsh6@2x.png" alt="" class="p2">
				</div>
				<div class="btns">
					<div class="btn1" v-on:click="btn(2)">拒绝</div>
					<div class="btn2" v-on:click="btn(1)">同意</div>
				</div>

				<div class="layer set" v-if="layer==1">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="content">
						<div class="title">身份设置</div>
						<div class="form">
							<div class="mt">设置部门</div>
							<Select class="mc" placeholder="设置部门" v-model="orgStructureListIndexId">
								<Option value="0">暂不设置</Option>
								　　　　 <Option v-for="(item,index) in orgStructureList" :key="index" v-bind:value="item.id">{{item.structure}}</Option>
								<!-- <option v-for="orgStructureList" v-html=""></option> -->
							</Select>
							<div class="mt">设置职务</div>
							<div class="mc">
								<!-- <Input style="display: inline-block;width: 100%;height: 40px;line-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff;background-image: none;position: relative;cursor: text;" -->
								<!-- v-bind:value="orgPositions" placeholder="设置职务"> -->
								<Input v-bind:value="orgPositions" :maxlength="14" v-model="orgPositions" placeholder="设置职务"></Input>
							</div>
							<!-- <Select class="mc" placeholder="设置职务"> -->
							<!-- <Option value="费用">暂不设置</Option> -->
							<!-- </Select> -->
						</div>
						<div class="btns">
							<div class="btn1" v-on:click="skip()">跳过</div>
							<div class="btn2" v-on:click="confirm()">确认</div>
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>
<script>
	export default {
		name: 'admissionreviews',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					// console.log(res);
					this.orgId = res.id;
					// this.identityAuth = res.identityAuth;
					// this.getOrgMembershipDetail();
					this.getUserInfo();
					this.getOrgStructureList();
				}
			}
		},
		data() {
			return {
				layer: 0,
				orgDetail: null,
				listId: null,
				shipDetail: null, //申请的内容
				identityAuth: null,
				userId: null,
				orgId: null,
				userInfo: {
					"id": "",
					"realName": "",
					"avatarUrl": "",
					"company": "",
					"post": "",
					"address": "",
					"telphone": "",
					"mail": ""
				},
				remake: '',
				id: null,
				orgStructureList: [],
				orgPositions: '', //要设置的职务名称
				orgStructureListIndexId: null,
			}
		},
		methods: {
			tolayer(n) {
				this.layer = n
			},
			confirm() {
				this.http.ajax({
					url: 'webSite/orgCheckMembership',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"id": this.id,
						'userId': this.userId,
						// "identityAuth": this.identityAuth,
						'status': 1,
						'orgPositions': this.orgPositions,
						'structureList': [
							this.orgStructureListIndexId
						]
					}
				}).then(res => {

					if (res.code == 200) {
						layer.msg('审核成功')
						return this.$router.push('/admissionreview');
					} else {
						return layer.msg(res.msg);
					}
					// console.log(res);
				})
			},
			skip() {
				this.tolayer(0);
				this.orgCheckMembership(1);
				
			},
			btn(status) {
				if (status == 2) {
					this.orgCheckMembership(2);
					
					return;
				}

				return this.tolayer(1);
			},
			orgCheckMembership(status) {
				// return console.log(status)
				this.http.ajax({
					url: 'webSite/orgCheckMembership',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"id": this.id,
						'userId': this.userId,
						// "identityAuth": this.identityAuth,
						'status': status,
						'orgPositions': '',
						'structureList': []
					}
				}).then(res => {
					layer.msg(res.msg)
					this.$router.push('/admissionreview');
					// console.log(res);
				})
			},
			getOrgMembershipDetail() {
				this.http.ajax({
						url: 'webSite/getOrgMembership',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"id": this.id,
							"pageNumber": 1,
							"pageSize": 10,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.shipDetail = res.data.userList.rows[0];
						}
					})
			},
			getOrgStructureList() {
				this.http.ajax({
						url: 'webSite/orgStructure/list',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.orgStructureList = res.data.orgStructureListDtos;
							// console.log(this.orgStructureList)
						}
					})
			},
			getUserInfo() {
				this.http.ajax({
						url: 'webSite/otherInfo',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"userId": this.userId,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.userInfo = res.data;
							if(res.data.address==""||res.data.address==null){
								this.userInfo.address=res.data.workArea
							}
							// console.log(this.userInfo)
						}
					})
			},
		},
		created() {
			// this.getOrgDetailed();
			// console.log(this.defOrg);

			this.userId = this.$route.query.userId;
			this.id = this.$route.query.id;
			this.remake = this.$route.query.remake;

			if (this.defOrg) {
				// console.log(this.defOrg);
				this.orgId = this.defOrg.id;
				// this.getOrgMembershipDetail();
				this.getUserInfo();
				this.getOrgStructureList();
			}

			// console.log(this.$route.params);
		}
	}
</script>

<style lang="less">
	.admissionreviews {
		.set {
			.btns {
				margin-top: 55px;
				text-align: center;
				padding: 0;
				padding-top: 55px;
				padding-bottom: 60px;
				margin: 0;

				.btn1 {
					border: 1px solid rgba(153, 153, 153, 1);
				}

				.btn2 {
					background: #2168eb;
					color: #ffffff;
				}

				.btn1,
				.btn2 {
					border-radius: 14px;
					width: 90px;
					height: 28px;
					line-height: 28px;
					margin: 0 6px;
				}
			}

			.content {
				width: 370px;
			}

			.form {
				width: 100%;
				padding-top: 14px;
				font-weight: 500;

				.mt {
					font-size: 16px;
					margin-top: 22px;
					margin-bottom: 11px;
				}


				padding: 0 15px;
			}

			border-radius:8px;

			.title {

				height: 70px;
				background: rgba(33, 104, 235, 1);
				text-align: center;
				color: #ffffff;
				font-size: 16px;
				line-height: 70px;
				border-radius: 8px 8px 0 0;
			}
		}

		.btns {
			padding-top: 65px;
			padding-bottom: 73px;
			

			.btn1 {
				width: 140px;
				height: 48px;
				background: rgba(255, 255, 255, 1);
				border-radius: 27px;
				border: 1px solid rgba(153, 153, 153, 1);
				text-align: center;
				line-height: 48px;
				color: #999999;
				display: inline-block;
				margin: 0 20px;
				cursor: pointer;
			}

			.btn2 {
				width: 140px;
				color: #ffffff;
				height: 48px;
				background: rgba(33, 104, 235, 1);
				border-radius: 27px;
				text-align: center;
				line-height: 48px;
				display: inline-block;
				margin: 0 20px;
				cursor: pointer;

			}
		}

		.tips {
			text-align: center;
			margin-top: 50px;

			.p1 {
				margin-right: 6px;
			}

			.p2 {
				margin-left: 6px;
			}
		}

		.box1 {
			p {
				padding-left: 25px;

				img {
					vertical-align: middle;
					margin-right: 5px;
				}

				margin-bottom: 6px;
			}

			.mt {
				padding-left: 120px;
				position: relative;
				height: 136px;
				padding-top: 25px;

				.g {
					margin-top: 6px;
					font-size: 14px;
					color: #999999;
				}

				.z {
					margin-top: 9px;
					font-size: 14px;
					color: #999999;
				}

				.title {


					font-size: 20px;
					color: #222222;
				}

				.pic {
					top: 25px;
					left: 24px;
					background: #eeeeee;
					width: 85px;
					height: 85px;
					border-radius: 4px;
					display: inline-block;
					position: absolute;
				}
			}

			height: 225px;
			box-shadow:0px 1px 7px 0px rgba(0, 0, 0, 0.13);
			background:url("../assets/img/rhsh1@2x.png") no-repeat;
		}

		.box {
			position: relative;

			.code {
				display: inline-block;
				width: 160px;
				height: 160px;
				background: #eeeeee;
				position: absolute;
				bottom: 23px;
				left: 103px;
			}

			box-shadow:0px 1px 7px 0px rgba(0, 0, 0, 0.13);
			border-radius:9px;
			// padding-bottom: 201px;
		}

		width: 365px;
		display: block;
		margin: 0 auto;
		padding-top: 50px;



	}
</style>

<template>
	<div class="w bg organizeManage">
		<div class="have" v-if="login.isOrg==1&&defOrg">
			<div class="info">
				<div class="head">
					<img :src="defOrg.orgUrl" alt="" class="pic">
					<div class="name">{{defOrg.orgName}}</div>
					<div class="v">
					<span style="position: relative;top: 2px;">{{defOrg.authStatus==2?'已认证':defOrg.authStatus==1?'审核中':'未认证'}}</span>
					<img style="margin-left: 6px;" src="../assets/img/zzgl1@2x@3x.png"
						 v-if="defOrg.authStatus==2" alt=""></div>
					<div class="tac">
						<router-link to="/staff/1" class="item">
							组织成员<span>{{defOrg.peopleNumber}}</span>
						</router-link>
						<router-link to="/activitylist" class="item">
							活动<span>{{defOrg.activityNumber}}</span>
						</router-link>
						<router-link to="/heat" class="item">
							热度<span>{{defOrg.calorificValue}}</span>
						</router-link>
					</div>
				</div>
			</div>
			<div class="nav">
				<router-link to="/down">
					<span>
						<img src="../assets/img/zzgl2@2x.png" alt="">
						<p>下载手机版</p>
						<b>立即下载</b>
					</span>
				</router-link>
				<router-link to="/staff/1">
					<span>
						<img src="../assets/img/zzgl3@2x.png" alt="">
						<p>完善人员信息</p>
						<b>批量导入</b>
					</span>
				</router-link>
				<router-link to="/activityrelease">
					<span>
						<img src="../assets/img/zzgl4@2x.png" alt="">
						<p>发活动</p>
						<b>多场景</b>
					</span>
				</router-link>
				<router-link to="/staff/2" v-if="defOrg.isOrg==5">
					<span>
						<img src="../assets/img/zzgl5@2x.png" alt="">
						<p>邀请加入</p>
						<b>快捷高效</b>
					</span>
				</router-link>

			</div>
		</div>
		<!--未加入组织-->
		<div class="not" v-if="login.isOrg==0">
			<div class="title">您还未加入任何组织</div>
			<div class="cont">
				<router-link to="/addorganize">
					<span>
						<img src="../assets/img/zzgl3@2x.png" alt="">
						<p>创建组织</p>
					</span>
				</router-link>
				<router-link to="/activityrelease?actClass=1">
					<span>
						<img src="../assets/img/zzgl4@2x.png" alt="">
						<p>发活动</p>
					</span>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'organizeManage',
		props: {
			login: {},
			defOrg: null
		},

		data() {
			return {

			}
		},
		created() {
			

		}
	}
</script>

<style lang="less">
	.organizeManage {
		margin-top: 69px;
		margin-bottom: 63px;

		.have {
			.tac {
				font-size: 13px;
				margin-top: 33px;

				.item {
					line-height: 30px;
					margin: 0 38px;
					display: inline-block;
					color: #333333;

					span {
						margin-left: 8px;
						font-size: 22px;
						font-weight: bold;
					}
				}
			}

			.nav {
				padding-top: 43px;
				font-size: 0;
				text-align: center;
				padding-bottom: 226px;

				img {
					width: 70px
				}

				span {
					display: inline-block;
					margin: 0 59px;

					p {
						font-size: 16px;
						margin-top: 5px;
						color: #333333;
					}

					b {
						font-size: 13px;
						color: #2168eb;
						font-weight: normal;
						margin-top: 5px;
					}
				}
			}

			.info {
				.head {
					font-size: 0;

					.v {
						font-size: 13px;
						margin-top: 6px;

						img {
							 width: 24px;;
							// height: 19px;
							vertical-align: middle;
						}
					}

					.name {
						font-size: 20px;
						margin-top: 9px;
						font-weight: bold;
						color: #333333;
					}

					.pic {
						width: 80px;
						height: 80px;
						-webkit-border-radius: 80px;
						-moz-border-radius: 80px;
						border-radius: 80px;

					}
				}

				text-align: center;
				padding-top: 122px;
				margin: 0 51px;
				border-bottom: 1px dotted #eee;
				padding-bottom: 44px;
			}
		}

		.not {
			padding-top: 188px;
			text-align: center;

			.title {
				font-size: 20px;
			}

			.cont {
				padding-top: 62px;
				font-size: 0;
				padding-bottom: 337px;

				span {
					display: inline-block;
					margin: 0 80px;

					img {
						width: 72px;
					}

					p {
						padding-top: 10px;
						font-size: 16px;
						color: #333333;
					}
				}
			}
		}
	}
</style>

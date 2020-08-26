<template>
	<div>
		<div class="w">
			<div class="position">活动费用
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="activitycost">
				<div class="tablemt" v-if="detail">
					<div class="item hand" style="margin-right: 145px;" @click="switchType(2)">
						<div class="n">{{detail.totalMoney}}元</div>
						<p>已收款</p>
					</div>
					<div class="item hand" @click="switchType(5)">
						<div class="n">{{detail.refundMoney*-1}}元</div>
						<p>已退款</p>
					</div>
				</div>
				<div class="pay">

					<p class="hand" @click="switchType(2)" :class="{active:type==2}">已收款</p>
					<p class="hand" @click="switchType(5)" :class="{active:type==5}">已退款</p>

				</div>
				<div class="table">
					<div class="mt">
						<div class="item" style="min-width:25px;width: 25px;overflow: hidden;"></div>
						<div class="item" style="width:112px;">用户</div>
						<div class="item" style="width: 244px;">时间</div>
						<div class="item" style="width: 124px;">缴费状态</div>
						<div class="item" style="width: 250px;">金额</div>
						<div class="item" style="">操作</div>
					</div>
					<div v-if="detail">
						<div class="mc" v-for="(v,i) in list" :key="i">
							<div class="item" style="min-width: 25px;width: 25px;overflow: hidden;">
								<Checkbox v-if="isshow&&type!=5" v-model="v.active" class="Checkbox"></Checkbox>
							</div>

							<div class="item" style="width: 112px;overflow: hidden;">
								{{v.nickName}}
							</div>
							<div class="item" style="width: 244px;">{{v.paymentTime}}</div>
							<div class="item" style="width: 124px;">
								<span v-if="v.paymentAmount>0">已缴费</span>
								<span style="color: #dc1a00;" v-if="v.paymentAmount==0||v.paymentAmount==null||v.paymentAmount==''">未缴费</span>
								<span v-if="v.paymentAmount<0">已退款</span>
							</div>
							<div class="item" style="width: 250px;">
								<span v-if="v.paymentAmount>0">{{v.paymentAmount}}元 </span>
								<span style="color: #dc1a00;" v-if="v.paymentAmount==0||v.paymentAmount==null||v.paymentAmount==''">—</span>
								<span v-if="v.paymentAmount<0">{{v.paymentAmount*-1}}</span>
							</div>
							<div class="item " style=""><span class="hand" style="color: #2168eb;" v-if="type==2&&status==2" @click="popPayPassword(v.participantId)">退款</span></div>
						</div>
					</div>

					<div class="mb hand" v-if="type==2&&status==2">
						<div class="btn1" v-if="isshow" @click="onisshow(0)">取消</div>
						<div class="btn1" v-if="isshow" @click="oncheckbox">全选</div>
						<div class="btn1" @click="onisshow(1)" v-if="!isshow">选择</div>
						<div class="btn2" @click="popPayPassword(false)" v-if="isshow">一键退款</div>
					</div>
					<Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;" @on-change="getReceivableList"
					 show-elevator :page-size="10" :show-total="true" :total="total" />
					<div class="layer staffeit" v-if="layer==1">
						<div class="mask" @click="tolayer(0)"></div>
						<div class="content">
							<div class="title">退款</div>
							<div class="mc">
								<div class="text-label">
									<p>*</p>退款金额
								</div>
								<input  class="aa" step="0.1" required="" v-model="amount" style=""/>
								
							</div>
							<div class="mc">
								<div class="text-label">
									<p>*</p>请输入钱包密码
								</div>
								<input type="password" class="aa" v-model="payPassword" />
							</div>
							<div class="btns">
								<div class="btn1 hand" @click="tolayer(0)">取消</div>
								<div class="btn2 hand" @click="savePayPassword()">确定</div>
							</div>
						</div>
					</div>

				</div>

			</div>
		</div>
	</div>
</template>
<script>
	import EncryptBASE64 from '../../assets/js/aes/aes-jia';
	export default {
		name: 'activitycost',
		props: {
			personalInfo: null, //登陆后 的用户信息
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
				status: 0,
				activityId: null, //活动id,
				detail: {
					totalMoney: 0,
					refundMoney: 0,
				},
				amount: 0,
				isshow: false,
				layer: 0,
				payPassword: null,
				userList: [],
				prepaymentRecordId: null,
				type: 2, //默认显示退款列表
			}
		},
		watch: {
			// aa人均检测
			amount: function(newVal, oldVal) {
				// newVal=parseInt(newVal)
				// if()
				// oldVal=parseInt(oldVal)
				if (newVal == "" || newVal == null) {
					return
				}
				if (oldVal == 0) {
					if (newVal >= 1) {
						this.amount = parseInt(newVal)
					}
				}
				// 解决数字键盘可以输入输入多个小数点问题
				// console.log('newVal', newVal)
				// console.log('oldVal', oldVal)
				if (!/^-?\d+\.?\d{0,2}$/.test(newVal)) {
					this.amount = oldVal;
					return
				}

				// if (oldVal.toString().indexOf('.') > 0) {
				// 	this.amount = 0;
				// 	return;
				// }
				// 保留两位小数
				if (newVal) {
					newVal = newVal.toString();
					var pointIndex = newVal.indexOf('.');
					if (pointIndex > 0 && (newVal.length - pointIndex) > 3) {
						this.amount = oldVal;
						return;
					}
				}
				// 最大值
				if (newVal > 999999) {
					this.amount = oldVal;
					return;
				}




			},
		},
		created() {
			this.activityId = this.$route.query.id;
			this.status = this.$route.query.status;
			// console.log(this.orgId,);
			this.getReceivableList(this.page)
			// console.log(this.personalInfo,'xxxxxxxxxxxxx222222222');
		},
		methods: {
			tolayer(n) {
				this.layer = n;
			},
			switchType(n) {
				this.type = n;
				this.getReceivableList(this.page);
			},
			oncheckbox() {
				for (var item in this.list) {
					this.list[item].active = true;
				}
			},
			popPayPassword(id) {


				// console.log(id)
				var userList = []
				if (id) {
					userList[0] = id
				} else {
					for (var item in this.list) {
						if (this.list[item].active) {
							// console.log(this.list[item].participantId)
							userList.push(this.list[item].participantId)
						}
					}
				}

				// console.log(userList)
				if (userList.length == 0) {
					layer.msg("请选择退款人")
					return

				} else {
					// if (userList[0]) {
					// 	layer.msg("请选择退款人")
					// 	return
					// }
					this.userList = userList;
				}
				this.layer = 1;

			},
			savePayPassword() {
				// let payPwd = EncryptBASE64(this.payPassword);

				this.http.ajax({
					url: 'webSite/act/participation/operationRecord',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"payPwd": EncryptBASE64(new Date().getTime() + "|" + this.payPassword),
						"amount": EncryptBASE64(new Date().getTime() + "|" + this.amount),
					}
				}).then(res => {
					// console.log(res,this.amount,this.payPassword,EncryptBASE64(this.payPassword));
					if (res.code == 200) {
						this.prepaymentRecordId = res.msg;
						// console.log(this.prepaymentRecordId);
						return this.onrefund()
					} else {
						return layer.msg(res.msg);
					}
				})
			},
			onrefund() {

				this.http.ajax({
					url: 'webSite/act/participation/refund?prepaymentRecordId=' + this.prepaymentRecordId,
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"activityId": this.activityId,
						"amount": this.amount,
						"refundWay": 0, //perCapita,
						"userList": this.userList
					}
				}).then(res => {
					this.layer = 0;
					layer.msg(res.msg);
					if (res.code == 200) {
						this.getReceivableList(this.page);
					}
					return;
				})
			},
			onisshow(e) {
				this.isshow = e
			},
			getReceivableList(page) {
				this.http.ajax({
						url: 'webSite/act/participation/participantListDetail',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							uid: this.personalInfo.id,
							"activityId": this.activityId,
							"pageNumber": page,
							"pageSize": 10,
							"type": this.type,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							res.data.list.rows.forEach((item) => {
								item.active = false;
							})
							this.detail = res.data;
							this.list = res.data.list.rows;
							this.total = res.data.list.total;

							if (res.data.list.rows.length > 0) {
								this.amount = res.data.list.rows[0].paymentAmount;
							}
							// this.total = res.data.total;
							// console.log(this.list,res.data.userList.rows);

						}
					})
			},
		},

	}
</script>

<style lang="less">
	.aa {
		display: inline-block;
		width: 100%;
		height: 40px;
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
		-webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
		transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
		transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
	}

	.activitycost {
		.active {
			color: #2168eb;
			font-weight: 500;

			border-bottom: 4px solid #2168EB;
		}

		overflow: hidden;

		.pay {

			width: 900px;
			border-bottom: solid 1px #cccccc;
			margin: 10px 90px;

			p {
				margin-right: 24px;
				height: 26px;
				font-size: 18px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				/* color: rgba(51,51,51,1); */
				line-height: 13px;
				display: inline-block;
			}
		}

		.table {
			.mb {
				margin-top: 43px;
				height: 22px;

				.btn1 {
					width: 56px;
					height: 22px;
					background: rgba(255, 255, 255, 1);
					border-radius: 14px;
					border: 1px solid rgba(151, 151, 151, 1);
					text-align: center;
					line-height: 22px;
					float: left;

				}

				.btn2 {
					width: 82px;
					height: 22px;
					background: rgba(33, 104, 235, 1);
					border-radius: 14px;
					line-height: 22px;
					text-align: center;
					color: #ffffff;
					float: right;
				}
			}

			margin: 11px 90px;
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
				padding-top: 30px;
				margin-bottom: 30px;

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
				font-family: '微软雅黑';

				// float:left;
				// width:75%;
				.text-label {
					width: 190px;
					display: flex;
					line-height: 40px;

					p {
						color: red;
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


			.title {
				height: 70px;
				background: #2168eb;
				font-size: 20px;
				color: #ffffff;
				line-height: 70px;
				text-align: center;
			}
		}


	}
</style>

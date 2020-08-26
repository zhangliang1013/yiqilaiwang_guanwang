<template>
	<div>
		<div class="w">
			<div class="position">热度
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="docadmin">
				<div class="tablemt">
					<div class="item">
						<div class="n">{{calorificValue}}</div>
						<p>热度</p>
					</div>
				</div>
				<div class="table">
					<div style="font-size: 20px;padding-bottom: 11px;">变更明细</div>
					
					<div  v-if="list==null">
						暂无数据
					</div>
					<div v-for="(item,index) in list" :key="index">
						<div class="mt">
							<div class="item" style="width: 405px;">{{item[0]}}</div>
						</div>
						<div class="mc" v-for="(v,i) in item[1]" :key="i">
							<div class="item" style="width: 405px;">{{v.calorificDetail}}</div>
							<div class="item" style="float: right;text-align: right;color: #2168eb;">+{{v.calorificValue}}</div>
						</div>
					</div>
					<div class="tac">
						
						<div class="btn28 hand " @click="getHeat()" v-if="(total/10+1)>=page?true:false">
							查看更多
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'heat',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getHeat();
				}
			}
		},
		data() {
			return {
				orgId: null,
				page: 1,
				list: [],
				calorificValue: null, //组织热度
				// page: null,
				total:null
			}
		},
		methods: {
			getHeat() {
				
					
				
				this.http.ajax({
						url: 'webSite/calorificDetail',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"pageNumber": this.page,
							"pageSize": 10
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.page++
							this.calorificValue = res.data.calorificValue;
							let list = {};
							for (let i = 0; i < res.data.page.rows.length; i++) {
								this.total=res.data.page.total
								let v = res.data.page.rows[i];
								
									

								if(this.list.length==0){
									var vart=[v.timeStr,[v]]
									this.list.push(vart)
								}else{
									var t=true
									for(var j=0;j<this.list.length;j++){
										// 判断对象的日期是否在数组里
										if(this.list[j][0]==v.timeStr){
											// 说明日期已存在
											this.list[j][1].push(v)
											t=false
											break;
										}
									}
									if(t){
										var vart2=[v.timeStr,[v]]
										this.list.push(vart2)
									}
								}
								
								// if (this.list[v.timeStr] != undefined && this.list[v.timeStr].length > 0) {
								// 	this.list[v.timeStr].push(v);
								// } else {
								// 	this.list[v.timeStr] = [];
								// 	this.list[v.timeStr].push(v);
								// }
							}
							// this.list = list;
							// console.log(list, this.list);
							if(this.page!=1){
								// this.page++
							}
							
						}
					})
			},
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getHeat();
			}
		}
	}
</script>

<style lang="less">
	.docadmin {
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

<template>
	<div>
		<div class="w">
			<div class="position">批量导出
			<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg everywhere">
			<div v-if="fileName!=''">
				<img class="icon" src="../assets/img/zzgl9@2x.png" alt="" style="width:70px">
				<div class="title">{{ fileName }}</div>
				<div class="size"><span>大小</span>{{ fileSize }}</div>
				<div class="btn" @click="exportOrgUser2()" v-if="type==0">导出</div>
				<div class="btn" @click="exportParticipationTwo()" v-if="type==1">导出</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'everywhere',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.digitalCommerce;
					if (this.$route.query.type == 1) {
						this.type = 1;
						this.activityId = this.$route.query.id;
						this.exportParticipation();
					} else {
						this.exportOrgUser1();
					}
				}
			}
		},
		created() {
			this.path=this.$route.query.path
			if (this.defOrg) {
				this.orgId = this.defOrg.digitalCommerce;
				if (this.$route.query.type == 1) {
					this.type = 1;
					this.activityId = this.$route.query.id;
					this.exportParticipation();
				} else {
					this.exportOrgUser1();
				}
			}
		},
		data() {
			return {
				orgId: null,
				fileName: "",
				fileSize: "",
				type: 0,
				activityId: null,
				tomsg: '',
				path:''
			}
		},
		methods: {
			//导出人员第一步
			exportOrgUser1() {
				this.http.ajax({
					url: '../../webSite/gov/exportBatch',
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"govId": this.orgId,
						// searchName:	this.defOrg.orgName,
						// pageNumber:1,
						// pageSize:10,
					}

				}).then(res => {
					// console.log(res)
					this.fileName = res.data.fileName
					this.fileSize = res.data.fileSize
				})
			},
			//导出文件
			exportOrgUser2() {
				if (this.fileName == '' || this.fileSize == '') {
					this.$router.push({
						path: this.path
					})
						layer.msg('没有相关文件！');
					return 
				}
				// console.log(this.fileName)
				this.http.ajax({
					url: '../../webSite/gov/exportDown',
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"fileName": this.fileName,
						"govId": this.orgId,
						// pageNumber:1,
						// pageSize:10,
					},
					responseType: 'blob'
				}).then(res => {
					const content = res
					const blob = new Blob([content], {
						type: 'application/vnd.ms-excel'
					}) // 构造一个blob对象来处理数据
					const fileName = this.fileName + ".xls" // 导出文件名
					// 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
					// IE10以上支持blob但是依然不支持download
					if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
						const link = document.createElement('a') // 创建a标签
						link.download = fileName // a标签添加属性
						link.style.display = 'none'
						link.href = URL.createObjectURL(blob)
						document.body.appendChild(link)
						link.click() // 执行下载
						URL.revokeObjectURL(link.href) // 释放url
						document.body.removeChild(link) // 释放标签
					} else { // 其他浏览器
						navigator.msSaveBlob(blob, fileName)
					}
					this.$router.push({
						path: this.path
					})
					layer.msg("下载成功")
				}).catch(err => {
					// 失败处理,此时后端会返回Json格式错误
					this.$router.push({
						path: this.path
					})
					layer.msg(res.msg)
				})
			},
			exportParticipation() {
				this.http.ajax({
					url: '../../webSite/activity/exportParticipation',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"activityId": this.activityId,
					}
				}).then(res => {
					
					if (res.code == 200) {
						this.fileName = res.data.fileName
						this.fileSize = res.data.fileSize
					} else {
						this.tomsg = res.msg;
						layer.msg(this.tomsg)
					}
					
				})
			},
			exportParticipationTwo() {

				if (this.fileName == '' || this.fileSize == '') {
					layer.msg(this.tomsg)
					return ;
				}

				this.http.ajax({
					url: '../../webSite/activity/exportParticipationTwo',
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"activityId": this.activityId,
					},
					responseType: 'blob'
				}).then(res => {
					
					// res = ''
					const content = res
					const blob = new Blob([content], {
						type: 'application/vnd.ms-excel'
					}) // 构造一个blob对象来处理数据
					const fileName = this.fileName + ".xls" // 导出文件名
					// 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
					// IE10以上支持blob但是依然不支持download
					if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
						const link = document.createElement('a') // 创建a标签
						link.download = fileName // a标签添加属性
						link.style.display = 'none'
						link.href = URL.createObjectURL(blob)
						document.body.appendChild(link)
						link.click() // 执行下载
						URL.revokeObjectURL(link.href) // 释放url
						document.body.removeChild(link) // 释放标签
					} else { // 其他浏览器
						navigator.msSaveBlob(blob, fileName)
					}
					this.$router.push({
						path: this.path
					})
					
					layer.msg("下载成功")
				}).catch(err => {
					// 失败处理,此时后端会返回Json格式错误
					this.$router.push({
						path: this.path
					})
					layer.msg(res.msg)
				})
			}
		},
	}
</script>

<style lang="less">
	.everywhere {
		padding-top: 156px;
		padding-bottom: 349px;
		margin-bottom: 63px;

		.icon {
			display: block;
			margin: 0 auto;

		}

		.title {
			text-align: center;
			padding-top: 27px;
			font-size: 18px;
		}

		.size {
			margin-top: 22px;
			font-size: 14px;
			text-align: center;

			span {
				color: #999999;
			}
		}

		.btn {
			width: 205px;
			height: 48px;
			text-align: center;
			line-height: 48px;
			color: #ffffff;
			background: #2168eb;
			-webkit-border-radius: 48px;
			-moz-border-radius: 48px;
			border-radius: 48px;
			display: block;
			margin: 0 auto;
			margin-top: 48px;
		}
	}
</style>

<template>
	<div>
		<div class="w">
			<div class="position">内容审核
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="contentaudit">
				<div class="title"><span>{{getMessageType()}}● </span>{{newsDigest}}
					<!-- 			<router-link v-if="m!=0" :to="'/managearticlelist?messageType='+messageType" class="btn  link " style="float: right;margin-top: 0;right: 200;top: 192px;">返回</router-link>
					<router-link v-if="m==0" to="/managearticlelist" class="btn  link " style="float: right;margin-top: 0;right: 200;top: 192px;">返回</router-link> -->
				</div>
				<div class="u">


					<img class="uimg" :src="orgUrl" alt="">
					<span class="name">{{orgName}}</span>
					<span class="time">{{createTime.split(' ')[0]}}</span>
					<span class="btn1" @click="editOne()" v-if="messageType != 15">编辑</span>
					<div style="display: inline-block; float:right;font-family:PingFangSC-Regular,PingFang SC;font-size:7px;font-weight:400;line-height:10px;"
					 v-if="isRecommend">
						<img src="../assets/img/tjdpt@2x.png" style="border-radius: 0px;"><span class="name" style="color:rgba(33,104,235,1);">已推荐</span>
					</div>
					
				</div>


				<div class="line"></div>
				<h3>主图</h3>
				<div class="acontent hand">
					<!-- <img :src='imageUrl' @click="imgtoBig(imageUrl)" style="width: 350px ;border-radius:3px;"> -->
					<img :src='imageUrl' preview style="width: 400px ;border-radius:3px;">
				</div>
				<h3>正文</h3>
				<!-- <div class="acontent" v-html="content" @click="clickfun($event)"> -->
				<div class="acontent" v-html="content" ref="img">

				</div>
				<div class="p" style="height:300px">
					<ul v-for="(item,index) in imgCollection" :key="index">
						<li style="list-style:none; padding:0; margin:0;float: left;display: block;">
							<img :src="item" style="width:101px; max-height:101px;margin-right:10px;" preview alt="" class="pic hand"></li>
					</ul>
				</div>

				<div class="table" v-if="fileCollection.length>0">
					<div class="mt">
						<div class="item" style="height:60px">附件 ({{ fileCollection.length }})个</div>

					</div>
					<div class="mc" v-for="(value,index) in fileCollection" :key="index">
						<div class="item" style="display:flex;">
							<div style="display: inline-block;padding:10px; margin: 10px;">
								<img src='../assets/img/fjxqyl1@3x.png' style="width: 60px;height:60px;float: left;">
							</div>

							<div style="padding:20px 15px; margin:0px;display:inline-block;width: 860px;height:90px;">
								<p style="line-height:30px;margin:  0;">{{ value.file }} </p>
								<!-- 	<p style="line-height:30px;margin:  0;"><a :href="value.fileUrl+'?response-content-type=application/octet-stream;'"
									 :download="value.file">下载</a></p> -->
								<p style="line-height:30px;margin:  0;"><a href="javascript:void(0)" @click="download(value.fileUrl,value.file)">下载</a></p>
								<!-- <p style="line-height:30px;margin:  0;" @click="download(value.fileUrl,value.file)">下2载</p> -->

							</div>
						</div>
					</div>
				</div>
				<div class="line"></div>

				<!--//活动审核按钮-->
				<div class="bens " v-if="isAudit">
					<div class="btn1 hand" v-on:click="save(2)">拒绝</div>
					<div class="btn2 hand" v-on:click="save(1)">同意</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'
	export default {
		name: 'contentaudit',
		props: {
			msg: String,
			defOrg: null,
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getOrgMessageListDeatil();
				}
			}
		},
		data() {
			return {
				m: 0,
				"id": "",
				"imageUrl": "",
				"newsDigest": "",
				"content": "",
				"messageType": 1,
				"createTime": "",
				"updateTime": "",
				"status": 1,
				"orgName": "",
				"orgUrl": "",
				"userName": "",
				'messageTypeInfo': '',
				"isAudit": true,
				// 图片
				imgCollection: [],
				// 附件
				fileCollection: [],
				isRecommend: 0
			}
		},
		methods: {
			// 添加编辑
			editOne() {
				this.$router.push({
					path: '/editarticle',
					query: {
						'id': this.$route.query.id,
						'm': this.messageType
					}
				});
			},
			// // 点击放大
			// clickfun(v) {
			// 	if (v.path[0].src != "" && v.path[0].src != null) {
			// 		this.imgtoBig(v.path[0].src)
			// 	}
			// 	// this.imgtoBig()
			// },

			// imgtoBig(url) {
			// 	this.$imagePreview({
			// 		images: [url],
			// 		index: 0,
			// 	})
			// },
			// 文件下载
			download(url, filename) { // 下载表格    

				axios.get(url, {
				// this.http.ajax({
				// 	url:url,
					headers: {
						// 'Content-Type': 'application/json',
						'api-client': '79763480276e11e98a8900163e04de97',
						// 'api-version': '',
						'Content-Type': 'application/octet-stream'
					},
					responseType: 'blob',
				}).then(res => {
					// res = ''
					// console.log(res)
					const content = res
					const blob = new Blob([content.data], {
						// type: 'application/vnd.ms-excel'
						// 'Accept': 'application/vnd.openxmlformats-officedocument'
						//            + '.spreadsheetml.sheet',

					}) // 构造一个blob对象来处理数据
					const fileName = filename // 导出文件名
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


				}).catch(err => {
					// 失败处理,此时后端会返回Json格式错误

					// layer.msg(res.msg)
					layer.msg("shiba")
				})
			},
			getMessageType() {
				switch (this.messageType) {
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
			save(status) {
				this.http.ajax({
						url: 'webSite/orgCheckTask',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"id": this.$route.query.id,
							'status': status,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							layer.msg(res.msg)
							this.$router.push('/managearticlelist');
							// this.deayil = res.data.rows[0];
							// this.total = res.data.total;
							// this.total = res.data.total;
							// console.log(this.list);
						}
					})
			},
			// 			AddImgClickEvent() {
			// 				var objs = document.getElementsByTagName("img");
			// 				for (var i = 0; i < objs.length; i++) {
			// 					objs[i].οnclick = this.imgtoBig(objs[i].src)
			// 					objs[i].style.cursor = "pointer";
			// 				}
			// 			},
			// 

			getOrgMessageListDeatil() {
				this.http.ajax({
						url: 'webSite/orgMessage/info',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"id": this.$route.query.id,
							"sourceType":6,
						}
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							this.imageUrl = res.data.imageUrl
							this.newsDigest = res.data.newsDigest
							this.content = res.data.content;
							this.orgName = res.data.orgName;
							this.messageType = res.data.messageType;
							// this.messageTypeInfo = this.messageType();
							this.isAudit = res.data.status == 0;
							this.orgUrl = res.data.orgUrl;
							this.createTime = res.data.createTime;
							this.imgCollection = res.data.imgCollection
							this.fileCollection = res.data.fileCollection
							this.isRecommend = res.data.isRecommend
							// console.log(this.messageTypeInfo);
							// this.deayil = res.data.rows[0];
							// this.total = res.data.total;
							// this.total = res.data.total;
							// console.log(this.list);
							// this.AddImgClickEvent()
							setTimeout(()=>{
								var imgs = this.$refs.img.getElementsByTagName('img');
								for (var i = 0; i < imgs.length; i++) {
									imgs[i].setAttribute('preview','2');
									this.$previewRefresh()
								}
							},1000)
						}
					})
			},
		},
		created() {
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.m = this.$route.query.m
				this.getOrgMessageListDeatil();

			}
			
			// console.log(this.$route.query.isAudit);
		}
	}
</script>

<style lang="less">
	.contentaudit {
		.table {
			.link {
				cursor: pointer;
				color: #2168eb;
				margin: 0 7px;
				font-size: 10px;
			}

			.btnD {
				color: white;
				padding: 0px;
				text-align: center;
				line-height: 22px;
				display: inline-block;
				font-size: 12px;
				margin: 0 5px;
				height: 22px;
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);
			}

			.btn {
				padding: 0 10px;
				text-align: center;
				line-height: 22px;
				display: inline-block;
				font-size: 12px;
				margin: 0 5px;
				height: 22px;
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);

				span {
					font-size: 1px;
				}
			}

			.edit,
			.del {
				font-size: 0;
				width: 20px;
				margin: 0px 10px;
				position: relative;
				display: inline-block;
				height: 100%;
				cursor: pointer;

				img {
					vertical-align: middle;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}

			.ivu-input-wrapper {
				width: 100%;

				input {
					border: none;
				}
			}

			.addbtn {
				height: 22px;
				line-height: 22px;
				vertical-align: middle;
				background: #2168eb;
				display: inline-block;
				text-align: center;
				-webkit-border-radius: 22px;
				-moz-border-radius: 22px;
				border-radius: 22px;
				color: #ffffff;
				font-size: 12px;
				padding: 0 10px;
				cursor: pointer;
			}

			.saveBtn {
				height: 40px;
				line-height: 40px;
				padding: 0 15px;
				cursor: pointer;
			}

			.mc {
				border-bottom: 1px solid #eee;
			}

			.mt,
			.mc {
				display: flex;
				justify-content: space-between;
				padding-left: 20px;
				padding-right: 20px;
				text-align: left;

				.item {
					text-align: left;
					height: 100px;
					line-height: 60px;
					display: inline-block;
					min-width: 60px;
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.mt {
				background: #f8f8f8;

				.item {
					height: 100px;
					line-height: 60px;
				}
			}
		}








		.acontent {
			padding: 19px 0;
			line-height: 26px;
			min-height: 50px;
			word-break: break-all;
			img{
				max-width:100%;
			}
		}

		.p {
			.pic {
				// position: absolute;
				width: 101px;
				// height: 76px;
				top: 0;
				right: 0;
				float: left;
				list-style: none;
			}

			// border-bottom: 1px solid #eee;

		}

		.bens {
			padding: 80px 0;
			text-align: center;

			.btn1 {
				border: 1px solid rgba(153, 153, 153, 1);
			}

			.btn2 {
				color: #ffffff;
				background: #2168eb;
			}

			.btn1,
			.btn2 {
				font-size: 14px;
				display: inline-block;
				width: 140px;
				height: 48px;
				border-radius: 27px;
				line-height: 48px;
				text-align: center;
				margin: 0 20px;
			}
		}

		margin: 0 90px;
		padding-top: 48px;

		.line {
			border-bottom: 1px solid #f8f8f8;

		}

		.u {
			margin-top: 20px;
			margin-bottom: 20px;

			.uimg {
				width: 32px;
				height: 32px;
				-webkit-border-radius: 32px;
				-moz-border-radius: 32px;
				border-radius: 32px;
				background: #eeeeee;
				margin-right: 13px;
				display: inline-block;
				vertical-align: middle;
			}

			.name {
				font-size: 14px;
				color: #333333;
				margin-right: 13px;
			}

			.btn1 {
				padding: 0 10px;
				text-align: center;
				line-height: 22px;
				display: block;
				font-size: 12px;
				margin: 0 5px;
				height: 22px;
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);
				cursor: pointer;
				background: rgba(33, 104, 235, 1);
				color:white;
				float:right;
			}

			.time {
				font-size: 14px;
				color: #999999;
			}
		}

		.title {
			font-size: 24px;

			span {
				color: #2168eb;
			}

			.link {
				display: flex;
				justify-content: right;
			}
		}
	}
</style>

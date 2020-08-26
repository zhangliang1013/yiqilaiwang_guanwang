<template>
	<div>
		<div class="w">
			<div class="position">{{getMessageType()}}{{preview?'预览':''}}
				<!-- <span ><router-link :to="'/activitylist?page='+page" >返回</router-link></span> -->
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 64px;">
			<div class="contentaudit" >
				<div class="title"><span>{{getMessageType()}}• </span>{{newsDigest}}
				</div>
				<div class="u">
					<img class="uimg" :src="orgUrl" alt="">
					<span class="name">{{orgName}}</span>
					<span class="time">{{ createTime?new Date(createTime).Format("yyyy-MM-dd"):''}}</span>				
				</div>

				<div class="line"></div>
				<!-- <h3>主图</h3>
				<div class="acontent hand">
					<img :src='imageUrl' preview style="width: 350px ;border-radius:3px;">
				</div>
				<h3>正文</h3> -->
				<!-- <div class="acontent" v-html="content" @click="clickfun($event)"> -->
				<div class="acontent" v-html="content" ref="img">

				</div>
				<!-- <div class="p" style="height:300px">
					<ul v-for="(item,index) in imgCollection" :key="index">
						<li style="list-style:none; padding:0; margin:0;float: left;display: block;">
							<img :src="item" style="width:101px; max-height:101px;margin-right:10px;" preview alt="" class="pic hand"></li>
					</ul>
				</div> -->

				<div class="table file" v-if="fileCollection.length>0">
					<div class="mt">
						<div class="item" style="height:60px">附件&nbsp;&nbsp;({{ fileCollection.length }}个)</div>
						<div class="option clear" @click="downloadAll()">
							<img src="./../assets/img/fjxqyl2@3x.png" alt="" class="fl">
							<p class="fl">全部下载</p>
						</div>
					</div>
					<div class="mc" v-for="(value,index) in fileCollection" :key="index" style="padding:0;flex-direction:column;">
						<div class="item" style="display:flex;height:93px;border-bottom:1px solid #EEEEEE;padding-left:20px">
							<div style="display: inline-block;padding:10px; margin: 10px;">
								<img src='../assets/img/fjxqyl1@3x.png' style="width: 60px;height:60px;float: left;">
							</div>

							<div style="padding:18px 15px 0 0; margin:0px;display:inline-block;width: 860px;font-size:16px">
								<p style="line-height:30px;margin:  0;margin-bottom:7px">{{ value.name}} <span style="color:#ccc">&nbsp;（{{value.size}}k）</span></p>
								<!-- 	<p style="line-height:30px;margin:  0;"><a :href="value.fileUrl+'?response-content-type=application/octet-stream;'"
									 :download="value.file">下载</a></p> -->
								<!-- <p style="line-height:30px;margin:  0;" @click="download(value.fileUrl,value.file)">下2载</p> -->
								<p style="line-height:30px;margin:  0;">
									<a href="javascript:void(0)" @click="download(value.url,value.name)">下载</a>
									 &nbsp;&nbsp;&nbsp;
									<a target='_black' v-if="value.name.indexOf('pdf') == -1&& value.name.indexOf('txt') == -1 && value.type ==2" :href="'https://view.officeapps.live.com/op/view.aspx?src='+value.url">预览</a>
									<span v-else @click="tolayer(1,value)" style="color: #2D8cF0;;cursor: pointer;">预览</span>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="line"></div>

				<!--//活动审核按钮-->
				<div class="bens " v-if="isAudit">
					<div class="btn1 hand" v-on:click="back1()">编辑</div>
					<div class="btn2 hand" v-on:click="save(1)">发布</div>
				</div>
				<div class="bens " v-else>
					<div class="btn1 hand" v-on:click="back" style="width:140px;border: 1px solid #999999;color:#999999;">返回</div>
					<!-- <div class="btn2 hand" v-on:click="save(1)">发布</div> -->
				</div>
			</div>
		</div>
		<!-- 文件预览 -->
		<div class="layer staffeit-p1" v-if="layer==1">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content" :class="{height:pre.type==1}">
				<iframe v-if="pre.type==2" :src="pre.url" width='100%' height='600' style="border:none" frameborder='1' ></iframe>
				<img v-else :src="pre.url" alt="" style="width:100%">
			</div>
		</div>
	</div>
</template>
<script>
	import axios from 'axios'
	export default {
		name: 'arbitration',
		props: {
			msg: String,
			defOrg: null,
			login:null,
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
				title:'资讯详情',
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
				isRecommend: 0,
				page:1,//回退页面页数
				type:null,
				// draft:true,s:''
				id:'',
				preview:false,
				res:'',
				layer:0,
				pre:""
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
			getMessageType() {
                if(this.type==2001){
                    switch (this.tags[0].name) {
                        case '20011':
                            return '新闻动态';
                        case '20012':
                            return '通知公告';
                        case '20013':
                            return '网络问政';
                        case '20014':
                            return '国内快讯';
                    }
                }else{
                    switch (this.type) {
                        case 2001:
                            return '本会动态';
                        case 2002:
                            return '办事指南';
                        case 2003:
                            return '仲裁园地';
                    }
                }
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
					// headers: {
					// 	// 'Content-Type': 'application/json',
					// 	'api-client': '79763480276e11e98a8900163e04de97',
					// 	// 'api-version': '',
					// 	'Content-Type': 'application/octet-stream'
					// },
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
					// layer.msg("shiba")
				})
			},
			downloadAll(){
				for(var index in this.fileCollection){
					this.download(this.fileCollection[index].url,this.fileCollection[index].name)
				}
			},
			save(status) {
				let data = this.res
				data.status=status
				this.http.ajax({
						url: 'activities',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data:data
					})
					.then(res => {
						// console.log(res)
							// layer.msg(res.msg)
							if(status==1){
							 if(this.type==2001){
                                    layer.msg("发布成功");
                                    this.$router.push("/dynamicList/0");
                                }else if(this.type==2002){
                                    layer.msg("发布成功");
                                    this.$router.push("/dynamicList/1");
                                }else if(this.type==2003){
                                    layer.msg("发布成功");
                                    this.$router.push("/dynamicList/2");
                                }
							}else if(status==0){
							this.$router.push('/draftList?messageType=1');
							}
					})
			},
			back(){
                if(this.type==2001){
                this.$router.push("/dynamicList/0");
              }else if(this.type==2002){
                this.$router.push("/dynamicList/1");
              }else if(this.type==2003){
                this.$router.push("/dynamicList/2");
              }
			},
			back1(){
				this.$router.push({
					path: '/releaseDynamic',
					query: {
						'id':this.id,
					}
				});
			},
			getdefOrg(id) {
				//组织详情
				this.http.ajax({
					url: '../../webSite/businessGov/getOrg',
					method: 'post',
					headers: {
						'Content-Type': ' application/json',
						// 'api-client': 'f07684ed4d4411e9ac1ffa163e4d6ba1',
						// 'api-version': '1.2.2',
						},
					data: {
						entityId: id
					}
				}).then(res => {
					if (res.code == 200) {
						this.orgName = res.data.orgName;
						this.orgUrl = res.data.orgUrl
					}
				})
			},
			getOrgMessageListDeatil() {
				let data =this.$route.query.id
				// console.log('详情',data)
				this.http.ajax({
						url: 'activities/'+data,
						method: 'get',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							entityId:this.defOrg.digitalCommerce,
						}
					})
					.then(res => {
						// console.log('详情eeee',res)
							this.res=res
							// this.imageUrl = res.data.imageUrl
							this.id = res.id
							this.newsDigest = res.title
							this.content = res.content
							// this.orgName = res.entity.name
							this.type = res.type
							this.tags = res.tags
							// this.orgUrl = res.orgUrl
							this.createTime = res.createdDate
							this.fileCollection = res.attachments
							this.getdefOrg(res.entityId)
					})
			},
			tolayer(n,value){
				this.layer = n;
				if(value){
					this.pre = value;
					this.pre.url = this.pre.url.split('?')[0];
				}
			}
		},
		created() {
			this.page=this.$route.query.page
			// if (this.defOrg) {
			// 	this.orgId = this.defOrg.id;
			// 	this.m = this.$route.query.m
				this.getOrgMessageListDeatil();

			// }
			// this.draft=this.$route.query.draft
			this.isAudit=this.$route.query.isAudit
			if(this.$route.query.preview){
				this.preview = true
			}
			// console.log('fgdgy',this.$route.query.isAudit);
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
				justify-content: flex-start;
				.item {
					height: 100px;
					line-height: 60px;
				}
				.option{
					margin-left:48px;
					line-height: 60px;
					cursor: pointer;
					img{
						width:16px;
						height:16px;
						margin-right:5px;
						margin-top: 21px;
					}
				}
			}
		}
		.file .mc .item:last-child{
			border:none;
		}







		.acontent {
			padding: 22px 0;
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
			padding: 43px 0 63px;
			text-align: center;

			.btn1 {
				color: #2168eb;
				border: 1px solid #2168eb;
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
			margin-bottom: 22px;

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
	.staffeit-p1 {
		.content{
			padding:10px;
			width:80%;
			overflow-x: hidden;
			overflow-y: auto;
		}
		.height{
			height:80%;
		}
	}
</style>

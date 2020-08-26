<template>
	<div>
		<div class="w">
			<div class="position">发布会员之家
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 74px;">
			<div class="addarticle">
				<Form ref="formValidate" :label-width="100" :model="formValue">
					<FormItem label="内容">
						<!-- <Input placeholder="标题" :maxlength="35" v-model="formValue.newsDigest"/> -->
						<Input type="textarea" v-model="formValue.content" :maxlength="500" :autosize="{minRows: 9,maxRows: 9}" placeholder="在这里输入内容"/>
						<!-- <div class="uploadpic_tips">建议上传750*400px尺寸图片</div> -->
						<div class="count">（{{formValue.content}}/500）</div>
					</FormItem>

					<FormItem label="图片" class="clear">
						<Upload @success="upImagesSuccess" @error="upImagesError" :personalInfo="personalInfo" v-if="imglist.length<9" :mimeType="mimeType" class="fl">
							<div style="width: 68px;height: 68px;padding: 22px;border:1px solid #ccc;border-radius: 5px;margin-right:22px;margin-bottom:18px;">
								<img src="../assets/img/pz@3x.png" alt="" style="width: 100%;height: auto;">
							</div>
						</Upload>
						<!-- <div class="imglist fl clear"> -->
							<div class="imgbox fl" v-for="(v,i) in imglist" :key="i" v-dragging="{ item: v, list: imglist, group:'imglist'}">
								<div class="img">
									<img :src="v.fileUrl" preview ="0">
								</div>
								<img src="../assets/img/gwhyzjsc@3x.png" alt="" class="del" @click="removeArray(imglist,v.fileUrl)">
							</div>
						<!-- </div> -->
					</FormItem>
					<div class="line"></div>
					<FormItem label="所在位置" class="address">
						<span :class="[{ 'inputCopy1': location }, 'inputCopys','fl']" @click="tolayer(2)">{{location==null||location=='' ? '例如:杭州市滨江区滨盛路12号': location}}</span>
						<!-- <Input v-model="location" placeholder="例如:杭州市滨江区滨盛路12号" v-if="location!=null&&location!=''"/> -->
						<img src="./../assets/img/dddw.png" class="dddwicon fl" alt="" @click="tolayer(2)">
						<div class="local-right clear fr" @click="clearPosition">
							<img src="./../assets/img/hyzjj1213@3x.png" alt="" class="icon fl">
							<p class="fl">清除定位</p>
						</div>
					</FormItem>
					<div class="line"></div>
                            
					<div style="margin-bottom: 24px">
						<span style="margin-right: 8px" class="btn-title">允许组织外部人员查看</span>
						<Switchs v-model="isOnlyOrg" :disabled="defOrg && !defOrg.orgSearch"/>
					</div>
					<div class="line line1"></div>
					<div class="editorHint" v-if="defOrg && !defOrg.orgSearch">
						提示：由于您的组织设置了不可被搜索，所以您发布的内容，只能被组织内成员查看
					</div>
					<div class="btn" @click="issue()">发布</div>
					<div>&nbsp;</div>
				</Form>
				<!-- 修改部门名称  弹窗 -->
				<div class="layer staffeit" v-if="layer==2">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="map">
						<!-- <iframe :src="'https://m.amap.com/picker/?key=12399ff0812339527e25693f6e3130ec'" style="width: 800px;height: 500px;"></iframe> -->
						<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResults"></el-amap-search-box>
						<span @click="makesure(mark[0])" class="btn-m" style="float: right;">确定</span>
						<el-amap ref="map" vid="amapDemo" :center="center" :zoom="12" :events="events" class="amap-demo" style="width: 800px;height: 500px;">
							<el-amap-marker v-for="(marker,index) in mark" :key="index" :position="marker"></el-amap-marker>
						</el-amap>
					</div>

					<!-- <el-amap vid="amapDemo" :zoom="zoom" :center="center"></el-amap> -->
				</div>

			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'addHome',
		props: {
			msg: String,
			personalInfo: null, //登陆后 的用户信息
			defOrg: null
		},
		data() {
			let self = this;
			return {
				center: [120.477396, 36.305191],
				events: {
					click(e) {
						self.center = [e.lnglat.lng, e.lnglat.lat]

						// return self.geocoder(self.center);
						// return console.log('geocoder',AMap);

						// 这里通过高德 SDK 完成。
						var geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all"
						});

						geocoder.getAddress(self.center, function(status, result) {
							if (status === 'complete' && result.info === 'OK') {
								// console.log("result", result,e)
								if (result && result.regeocode) {
									if (result.regeocode.aois.length == 0) {
										self.latitude = e.lnglat.lat
										self.longitude = e.lnglat.lng
										self.location = result.regeocode.addressComponent.city + " • " + result.regeocode.pois[0].name;
									} else {
										self.latitude = result.regeocode.pois[0].location.lat
										self.longitude = result.regeocode.pois[0].location.lng
										self.location = result.regeocode.addressComponent.city + " • " + result.regeocode.pois[0].name;

									}
									// console.log(self.location)
									self.mark = [self.center]
									// self.layer = 0
									// self.$nextTick();
								}
							}
						});
					}
				},
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				location:"",
				latitude:"",
				longitude:"",
				searchOption: {
					city: '青岛',
					citylimit: false
				},
				mark: [],
				formValue: {
					content: null,
				},
				// title: "会员之家",
				orgId:"",
				messageType: 5,
				isOnlyOrg: true,

				// 附件的上传地址与名字
				fileFname: "",
				fileCollection: [],
				fileCollection_old: [],
				fileFurl: "",
				// 弹窗
				layer: 0,
				imglist: [],
				id:"",
			}
		},
		watch: {
			defOrg:{
				handler:function(val){
					if(val && !val.orgSearch){
						this.isOnlyOrg = false;
					}
				},
				immediate: true
			} 
		},
		methods: {
			//移除数组
			removeArray(_arr, _obj) {
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i].fileUrl == _obj) {
						if (i == 0) {
							_arr.shift(); //删除并返回数组的第一个元素
							return _arr
						}
						else if (i == length - 1) {
							_arr.pop();  //删除并返回数组的最后一个元素
							return _arr
						}
						else {
							_arr.splice(i, 1); //删除下标为i的元素
							return _arr
						}
					}
				}
			},
			clearPosition(){
				this.location = "";
				this.latitude = "";
				this.longitude = "";
			},
			// 地图搜索
			onSearchResults(pois) {
				let latSum = 0;
				let lngSum = 0;
				// console.log(pois)
				this.center = [pois[0].lng, pois[0].lat];
				this.mark = [this.center]
			},
			getLocation() {
				const self = this

				AMap.plugin('AMap.Geolocation', function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: 10000,
					})
					geolocation.getCurrentPosition();
					AMap.event.addListener(geolocation, 'complete', onComplete);
					AMap.event.addListener(geolocation, 'error', onError);

					function onComplete(data) {
						// data是具体的定位信息
						// console.log('定位成功信息：', data);
						self.center = [data.position.lng, data.position.lat]
						self.mark = [self.center]

					}

					function onError(data) {
						// 定位出错
						// console.log('定位失败错误：', data);
						// 调用ip定位
						self.getLngLatLocation();
					}
				})
			},
			getLngLatLocation() {
				var that = this;
				AMap.plugin('AMap.CitySearch', function() {
					var citySearch = new AMap.CitySearch();
					citySearch.getLocalCity(function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							// 查询成功，result即为当前所在城市信息
							// console.log('通过ip获取当前城市：', result)
							that.center = result.rectangle.split(';')[0].split(',');
							that.mark = [that.center];
							//逆向地理编码
							AMap.plugin('AMap.Geocoder', function() {
								var geocoder = new AMap.Geocoder({
									// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
									city: result.adcode
								})

								var lnglat = result.rectangle.split(';')[0].split(',');
								geocoder.getAddress(lnglat, function(status, data) {
									if (status === 'complete' && data.info === 'OK') {
										// result为对应的地理位置详细信息
										// console.log(data,"111111111111",result)
									}
								})
							})
						}
					})
				})
			},
			// 地图确定
			makesure(e) {
				if (e == "" || e == null) {
					e = this.center
				}
				var center = e

				// return self.geocoder(self.center);
				// return console.log('geocoder',AMap);

				// 这里通过高德 SDK 完成。
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				var self = this	
				geocoder.getAddress(center, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						if (result && result.regeocode) {
							// if (result.regeocode.aois.length == 0) {
							// 	self.latitude = e[1]
							// 	self.longitude = e[0]
							// 	self.location = result.regeocode.formattedAddress;
							// } else {
							// 	self.latitude = result.regeocode.aois[0].location.lat
							// 	self.longitude = result.regeocode.aois[0].location.lng
							// 	self.location = result.regeocode.formattedAddress;
							// }
							if (result.regeocode.aois.length == 0) {
								self.latitude = e[1];
								self.longitude = e[0];
								self.location = result.regeocode.addressComponent.city + " • " + result.regeocode.pois[0].name;
							} else {
								self.latitude = result.regeocode.pois[0].location.lat
								self.longitude = result.regeocode.pois[0].location.lng
								self.location = result.regeocode.addressComponent.city + " • " + result.regeocode.pois[0].name;

							}
							// console.log(result,e)
							self.layer = 0
							// self.$nextTick();
						}
					}
				});
			},
			geocoder(pos) {

				const geocoder = new AMap.Geocoder({
					radius: options.radius || 1000,
					extensions: options.extensions || "all"
				})
				// return console.log('xxx', geocoder)
				geocoder.getAddress(pos, function(status, result) {
					// console.log(status, result);
					// if (status === 'complete' && result.info === 'OK') {
					// 	options.success && options.success(result);
					// }else{
					// 	options.error && options.error(status,result);
					// }
				});
				// return console.log('pospos',new AMap.Geocoder());
				// var geocoder = new this.AMap.Geocoder();
				// return console.log(geocoder);
			},
			// 发布
			issue() {

				if (this.formValue.content.trim() == "" && !this.imglist.length) {
					layer.msg("请输入内容")
					return
				}
				this.http.ajax({
					url: 'webSite/orgMessage/saveMemberHouse',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.defOrg.id,
						"content": this.formValue.content,
						"messageType": this.messageType,
						"isComments": 0,
						// "fileCollection": this.fileCollection,
						"imgCollection": this.imglist,
						"isOnlyOrg": this.isOnlyOrg? "0":"1",
						'sourceType':6,
						'location':	this.location,
						'latitude':	this.latitude,
						'longitude':this.longitude,
					}
				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					if (res.code == 200) {
						return this.$router.push('/activitylist?messageType=' + this.messageType);
					}
					this.orgStructureListDtos = res.data.orgStructureListDtos
				})
			},
			// beforeAvatarUpload(file) {

			// 	const isLt20M = file.size / 1024 / 1024 < 0.1
			// 	if (!isLt20M) {
			// 		this.$message.error('上传图片的大小不能超过 20M!');
			// 	}
			// 	return isLt20M
			// },
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			upImagesSuccess(e) {
				// console.log(e);
				this.imglist.push({
					fileUrl:e.url,
					fileName:e.name,
					fileExtension:e.type.split("/")[1],
					fileSize:parseFloat(e.size / 1024).toFixed(2)
				});
				this.$previewRefresh();

			},
			upImagesError(e) {
				// console.log('图片上传失败',e)
			},
			// 弹窗弹出
			tolayer(n) {
				this.layer = n
				if (n == 1) {

				}
			},
			// 附件上传
			// upcoverUrl(e) {
			// 	this.fileFname = e.name
			// 	this.fileFurl = e.url
			// 	// console.log(e)
			// 	// this.fileCollection.push(e.url);

			// 	if (this.fileCollection_old.indexOf(e.url) == -1) {
			// 		this.fileCollection_old.push(e.url)
			// 		this.fileCollection.push([this.fileFname, this.fileFurl])
			// 	}
			// },
			
			
		},
		created() {
			this.mark = [this.center]
			setTimeout(this.getLocation(),300)
			// this.id = this.$route.query.id;
			// this.messageType = Number(this.$route.query.messageType)
			// switch (this.messageType) {
			// 	case 1:
			// 		this.title = "资讯";
			// 		// this.imageUrl = "https://img.yiqilaiwang.com/fgg144@3x.png";
			// 		break;
			// 	case 2:
			// 		this.title = "资源";
			// 		// this.imageUrl = "https://img.yiqilaiwang.com/fgg133@3x.png";
			// 		break;
			// 	case 3:
			// 		this.title = "通知";
			// 		// this.imageUrl = "https://img.yiqilaiwang.com/fgg111@3x.png";
			// 		break;
			// 	case 4:
			// 		this.title = "党建要闻";
			// 		// this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
			// 		break;
			// 	case 5:
			// 		this.title = "会员之家";
			// 		// this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
			// 		break;
			// }

		},

	}
</script>

<style lang="less">
	.hand {
		cursor: pointer;
	}

	.addarticle {
		padding-top: 64px;
		padding-right: 76px;
		padding-left: 183px;
		// 地图
		.map {
			background: #ffffff;
			width: 800px;
			-webkit-box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			border-radius: 15px;
			position: fixed;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			z-index: 999;
			overflow: hidden;
			border: 5px solid #2168EB;
			.search-box {
				display: inline-block;
				border-style: solid
			}
			.btn-m {
				height: 35px;
				line-height: 35px;
				vertical-align: middle;
				background: #2168eb;
				display: inline-block;
				text-align: center;
				border-radius: 22px;
				color: #ffffff;
				font-size: 12px;
				padding: 0 15px;
				cursor: pointer;
			}
		}
		.icon {
			vertical-align: middle;
			margin-right: 3px;
		}
		.ivu-form .ivu-form-item{
			.ivu-form-item-content{
				margin-right: 100px;
			}
		}
		.ivu-form .ivu-form-item-label {
			text-align: left;
			color:#333333;
		}
		.ivu-form .ivu-form-item:nth-child(1){
			.ivu-form-item-content{
				position:relative;
				.count{
					position:absolute;
					bottom:15px;
					right:20px;
					height:17px;
					font-size:12px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:17px;
				}
				.ivu-input{
					padding:14px 13px 32px;
					background:#FAFAFA;
					border:1px solid rgba(221,221,221,1);
				}
			}

		}
		.ivu-form .ivu-form-item:nth-child(2){
			margin-bottom: 10px;
			.ivu-form-item-content{
				margin-right: 60px;
			}
			
		}
		.address{
			.inputCopys {
				display: inline-block;
				min-width: 350px;
				height: 40px;
				line-height: 40px;
				padding: 0 7px;
				font-size: 14px;
				border: 1px solid #C7C7C7;
				border-radius: 2px;
				color: #c5c8ce;
				background-color: #fff;
				background-image: none;
				position: relative;
				cursor: text;
			}
			.inputCopy1{
				color:#333333;
			}
			.dddwicon {
				margin:10px 10px;
				cursor: pointer;
			}
			.local-right{
				margin:0 3px;
				cursor: pointer;
				.icon{
					width:18px;
					height:17px;
					margin-right:6px;
					margin:9px 3px;
				}
				p{
					font-size:14px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:20px;
					margin:7px 0;
				}
			}
		}
		.btn-title{
			font-size:14px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:20px;
		}
		.ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
			color:#515a6e
		}

		.line {
			border-bottom: 1px dotted #DDDDDD;
			margin-bottom: 24px;
			margin-right: 100px;
		}
		.line1 {
			margin-bottom: 10px;
		}
		.editorHint{
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(33,104,235,1);
			line-height:17px;
			min-width:400px;
			margin-top:9px;
		}
	

		// .editor {
		// 	.ivu-form-item-content {
		// 		margin-right: 0;
		// 	}

		// 	.ivu-form-item-label:before {
		// 		content: '*';
		// 		display: inline-block;
		// 		margin-right: 4px;
		// 		line-height: 1;
		// 		font-family: SimSun;
		// 		font-size: 12px;
		// 		color: #ed4014;
		// 	}
		// 	.w-e-text p, .w-e-text h1, .w-e-text h2, .w-e-text h3, .w-e-text h4, .w-e-text h5, .w-e-text table, .w-e-text pre{
		// 		word-break: break-all;
		// 	}

		// }

		.w-e-text {
			font-size: 20px
		}

		.ivu-form-item-content {
			margin-right: 100px;
		}

		.uploadpic {
			width: 350px;
			height: 153px;

			img {
				width: 350px;
				height: 153px;
				-webkit-border-radius: 5px;
				-moz-border-radius: 5px;
				border-radius: 5px;
				cursor: pointer;
			}

			background:#FAFAFA url("../assets/img/pz@2x.png") no-repeat center center;
			border-radius:5px;
			border:1px solid #ddd;
		}

		.uploadpic_tips {
			font-size: 12px;
			color: #999999;
		}
		.btn {
			width: 205px;
			height: 48px;
			background: rgba(33, 104, 235, 1);
			border-radius: 27px;
			text-align: center;
			line-height: 48px;
			display: block;
			margin: 56px auto 45px;
			color: #ffffff;
			font-size: 14px;
			margin-bottom: 44px;
			cursor: pointer;
			margin-top: 44px;
		}

		.imgbox {
			margin-right:22px;
			margin-bottom:18px;
			width:68px;
			height:68px;
			position:relative;
			.img {
				width:68px;
				height:68px;
				border-radius: 5px;
				overflow: hidden;
				img{
					width:100%;
					min-height:100%;
				}
			}
			.del{
				width: 14px;
				height: 14px;
				position: absolute;
				top: -12px;
				right: -12px;
				padding: 5px;
				box-sizing: content-box;
			}
		}

	}

	.addarticle .staffeit {
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
			border-bottom: 1px solid #eee;
			margin: 0 15px;

			position: relative;

			.label {
				margin-left: 11px;
			}

			.right .label {
				float: left;
				margin-left: 0;
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
		}

		.mt {
			font-size: 16px;
			font-weight: bold;
			line-height: 16px;
			margin-top: 15px;
			margin-left: 15px;
			margin-bottom: 5px;
		}

		.username {
			width: 294px;
			height: 38px;
			background: #fafafa;
			display: block;
			margin: 0 auto;
			text-indent: 15px;
			line-height: 38px;
			margin-top: 11px;
		}

		.content {
			overflow: hidden;
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

	.imgFileList {
		li {
			span {
				padding-left: 15px;
				font-size: 13px;
				color: #1E9FFF;
				// line-height: 40px;
			}
		}
	}
</style>

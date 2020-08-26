<template>
	<div>
		<div class="w">
			<div class="position">发产品
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 74px;">
			<div class="product">
				<Form ref="formValidate" :label-width="100" :model="formValue">
					<FormItem label="头图" class="clear img"><span class="label">（{{imglist.length?imglist.length:0}}/3）</span>
						<div class="clear">
							<Upload @success="upImagesSuccess" @error="upImagesError" :personalInfo="personalInfo" v-if="imglist.length<3" :mimeType="mimeType" class="fl">
									<div style="width: 68px;height: 68px;padding: 22px;border:1px solid #ccc;border-radius: 5px;margin-right:22px;margin-bottom:7px;">
											<img src="../assets/img/pz@3x.png" alt="" style="width: 100%;height: auto;">
									</div>
							</Upload>
							<div class="imgbox fl" v-for="(v,i) in imglist" :key="i" v-dragging="{ item: v, list: imglist, group:'imglist'}">
									<div class="img">
											<img :src="v.url" preview ="0">
									</div>
									<img src="../assets/img/gwhyzjsc@3x.png" alt="" class="del" @click="removeArray(imglist,v.url)">
							</div>
						</div>
						<div class="remark">建议上传750*750px尺寸图片</div>
					</FormItem>
						<div class="line"></div>
					<FormItem label="公司名称" class="input">
						<Input v-model="formValue.companyName" placeholder="请输入公司名称" :maxlength="30"/>
					</FormItem>
										<FormItem label="产品名称" class="input">
						<Input v-model="formValue.productName" placeholder="请输入产品名称" :maxlength="40"/>
					</FormItem>
					<div class="line1"></div>
					<FormItem label="产品卖点" class="tag">
						<div class="mc">
							<div class="define" style="margin-left:-6px">
								<span class="active" v-for="(item,index) in Fields" :key="index">
									{{item.name}} 
									<img src="./../assets/img/xzdh@2x.png" alt="">
									<img src="./../assets/img/hd7@2x.png" alt="" v-if="isfieldsedit" @click="deleteFieldslist(index)" class="close">
								</span>
								<span class="btn" :class="{active:isfields}" @click="onisfields(1)"><input ref="fields" @blur="onisfields(0)" type="text"><b>+增加产品卖点</b></span>
							</div>
						</div>
					</FormItem>
					<div class="line2"></div>
					<FormItem label="产品说明">
						<div ref="editor" style="width:100%;text-align:left;position: relative;z-index: 0;word-break: break-all;" v-model="content" @click="getToken($event)"></div>
						<div class="editorHint">
							提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况
						</div>
					</FormItem>
					
					<div class="btn-save" @click="issue()">发布</div>
					<div>&nbsp;</div>
				</Form>

			</div>
		</div>
	</div>
</template>
<script>
		import E from 'wangeditor'
	export default {
		name: 'product',
		props: {
			msg: String,
			personalInfo: null, //登陆后 的用户信息
			defOrg: null
		},
		data() {
			let self = this;
			return {
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				formValue: {
					companyName:"",
					productName:"",
				},
				Fields: [],
				isfields: false,
				isfieldsedit: true,
				// 弹窗
				layer: 0,
				imglist: [],
				id:"",
				content:"",
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
			deleteFieldslist(index) {
				this.Fields.splice(index,1);
			},
			// 自定义标签
			onisfields(e) {
				this.isfields = e;
				// console.log(this.$refs.fields.value)
				// console.log("getFields", this.Fields.length)
				for (var i = 0; i < this.Fields.length; i++) {
					if (this.Fields[i].name == this.$refs.fields.value) {
						layer.msg("该标签已存在")
						return
					}
				}
				if (e) {
					setTimeout(() => {
						this.$refs.fields.focus()
					})
				} else {
					if (this.$refs.fields.value != '') {
						this.Fields.push({
							name:this.$refs.fields.value
						})
						this.isfieldsedit = 1;
						this.$refs.fields.value = '';
					}
				}
			},
			//移除数组
			removeArray(_arr, _obj) {
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i].url == _obj) {
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
						// 获取七牛云token
			getToken(e){
				var that = this;
				if(e.target.type == 'file'){
					that.http.ajax({
						url: 'webSite/home/uploadApplication',
						method: 'post',
						data: {
							uid: that.personalInfo.uid
						}
					}).then( res =>{
						that.QNtoken = res.data.upToken;
					})
				}
						},
						uploadInit(editor) {
				// 获取相关 DOM 节点的 ID
				var btnId = editor.imgMenuId
				var containerId = editor.toolbarElemId
				var textElemId = editor.textElemId
				var index='';
				var that = this;
				// 创建上传对象
				this.http.ajax({
					url: 'webSite/home/uploadApplication',
					method: 'post',
					data: {
						uid: this.personalInfo.uid
					}
				}).then(res => {
					// console.log('此处为七牛云获取参数',res)
					this.QNtoken = res.data.upToken;
					var uploader = window.Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
							 var uptoken = that.QNtoken
							 return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: 'https://img.yiqilaiwang.com/',
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '100mb', //最大文件体积限制
						region: "z1",
						filters: {
							mime_types: [
								//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
								{
									title: "图片文件",
									extensions: "jpg,gif,png,bmp,jpeg"
								}
							]
						},
						max_retries: 3, //上传失败最大重试次数
						dragdrop: true, //开启可拖曳上传
						drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
						chunk_size: '4mb', //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							'UploadProgress': function(up, file) {
								// 显示进度条
								index = layer.load(0, {shade: false});
							},
							 'UploadComplete': function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							'FileUploaded': function(up, file, info) {
								var domain = up.getOption('domain')
								var res = window.$.parseJSON(info)
								var sourceLink = domain + res.key //获取上传成功后的文件的Url

								// 插入图片到editor
								editor.cmd.do('insertHtml', '<img  src="' + sourceLink +
									'?imageView2/1/q/30/format/jpg/ignore-error/1' + '" style="max-width:100%;" />')
							},
							'Error': function(up,err,errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601  && err.file.type.indexOf('video') ==-1){
                  layer.msg("请选择jpg，gif，png，bmp，jpeg格式的图片上传")
                }else if(err.code != -601){
                  layer.msg(errTip)
                }
							},
						}
					})
				})
			},
			uploadInitVideo(editor) {
				// 获取相关 DOM 节点的 ID
				var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[15]
				// var btnId = editor.imgMenuId;
				// console.log(editor.$toolbarElem[0],btnId)
				var containerId = editor.toolbarElemId
				var textElemId = editor.textElemId
				var that = this;
				var index='';
				// 创建上传对象
				this.http.ajax({
					url: 'webSite/home/uploadApplication',
					method: 'post',
					data: {
						uid: this.personalInfo.uid
					}
				}).then(res => {
					this.QNtoken = res.data.upToken;
					// console.log('上传时',this.QNtoken);
					var uploader = window.Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
							 var uptoken = that.QNtoken
							 return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: 'https://img.yiqilaiwang.com/',
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '100mb', //最大文件体积限制
						region: "z1",
						filters: {
							mime_types: [
								//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
								{
									title: "视频文件",
									// extensions: "jpg,gif,png,bmp,jpeg"
									// extensions: "avi,asf,wmv,mov,mp4,FLV"
									extensions: "mp4"
								}
							]
						},
						max_retries: 3, //上传失败最大重试次数
						dragdrop: true, //开启可拖曳上传
						drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
						chunk_size: '20mb', //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							'UploadProgress': function(up, file) {
								// 显示进度条
								index = layer.load(0, {shade: false});
							},
							 'UploadComplete': function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							'FileUploaded': function(up, file, info) {
								var domain = up.getOption('domain')
								var res = window.$.parseJSON(info)
								var sourceLink = domain + res.key //获取上传成功后的文件的Url
								// 插入图片到editor
								editor.cmd.do('insertHtml', "<video style='margin-top:5px;background:black' width='100%' height='214px' webkit-playsinline = 'true' playsinline = 'true' controls controlslist='nodownload' poster=" + sourceLink + "?vframe/jpg/offset/0/imageslim/imageView2/1/interlace/1/ignore-error/1 ><source src='" + sourceLink + "' type='video/mp4'></video>")
							},
							'Error': function(up,err,errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601 && err.file.type.indexOf('image') ==-1){
                  layer.msg("上传视频仅支持mp4格式")
                }else if(err.code != -601){
                  layer.msg(errTip)
                }
							},
						}
					})
				})
						},
						WangEditMethod() {
				var editor = new E(this.$refs.editor)
				editor.customConfig.onchange = (html) => {
					let reg = new RegExp('<p></p>', 'g')
					html = html.replace(reg, '');
					this.content = html
				}
				editor.customConfig.menus = [
						'head', // 标题
						'bold', // 粗体
						'fontSize', // 字号
						'fontName', // 字体
						'italic', // 斜体
						'underline', // 下划线
						'strikeThrough', // 删除线
						'foreColor', // 文字颜色
						'backColor', // 背景颜色
						'link', // 插入链接
						'list', // 列表
						'justify', // 对齐方式
						'quote', // 引用
						'emoticon', // 表情
						'image', // 插入图片
						// 'table',  // 表格
						'video',  // 插入视频
						// 'music',  // 插入音频
						// 'code',  // 插入代码
						'undo', // 撤销
						'redo' // 重复
					],
					// 使用 base64 保存图片
					editor.customConfig.uploadImgShowBase64 = false
				// editor.customConfig.fontSize='normal'
				// editor.customConfig.pasteFilterStyle = true
				editor.customConfig.pasteIgnoreImg = false

				editor.customConfig.pasteTextHandle = function(content) {
					// content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
					if (content == '' && !content) return ''
					let str = content;
					//处理的标签里的多余代码
					str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '');
					str = str.replace('/(\\n|\\r| class=(")?Mso[a-zA-Z]+(")?)/g', '');
					let reg = new RegExp('<!--(.*?)-->', 'g')
					str = str.replace(reg, '');
					str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
					// str = str.replace(/<\/?[^>]*>/g, '')
					// str = str.replace(/[ | ]*\n/g, '\n')
					// str = str.replace(/&nbsp;/ig, '')
					return str
				}


				// 隐藏“网络图片”tab
				editor.customConfig.showLinkImg = false
				editor.customConfig.colors = [
					'red',
					'black',
					'green',
					'yellow',
					'orange',
					'grey',
					'pink',
					'transparent',
				]

				// 允许上传到七牛云存储
				editor.customConfig.qiniu = true
				editor.create()
				if(this.content){
					editor.cmd.do('insertHTML', this.content)
				}else{
					editor.cmd.do('insertHTML', '<p><br></P>')
				}
				this.uploadInit(editor);
				this.uploadInitVideo(editor);
			},
			// 发布
			issue() {
				if (!this.imglist.length) {
					layer.msg("请上传至少一张头图")
					return
				}
				if (!this.formValue.companyName) {
					layer.msg("请输入公司名称")
					return
				}
				if (!this.formValue.productName) {
					layer.msg("请输入产品名称")
					return
				}
				if (!this.Fields.length) {
					layer.msg("请增加产品卖点标签")
					return
				}
				if (!this.content) {
					layer.msg("请输入产品说明")
					return
				}
				var extraProperties = [];
				extraProperties.push({
					fieldValue:this.formValue.companyName,
					fieldLabel:"",
					fieldName: "companyName",
					inx: 0
				},{
					fieldValue:this.formValue.productName,
					fieldLabel:"",
					fieldName: "productName",
					inx: 1
				})
				this.http.ajax({
					url: 'webSite/businessGov/saveBusinessActivity',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						attachments: this.imglist,
						extraProperties: extraProperties,
						tags:this.Fields,
						content: this.content,
						type:1500,
						action:15,
						actionName:"产品",
						startTime:new Date().getTime(),
						status:0,
						orgId:this.defOrg.id
					}
				}).then(res => {
					if (res.code == 200) {
						layer.msg("发布成功")
						return this.$router.push('/productShow/1');
					}
				})
			},
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			upImagesSuccess(e) {
				// console.log(e);
				this.imglist.push({
					url:e.url,
					name:e.name,
					// fileExtension:e.type.split("/")[1],
					// fileSize:parseFloat(e.size / 1024).toFixed(2)
					inx:this.imglist.length,
					type:1,
				});
				// 预览图片
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
		},
		mounted() {
			this.WangEditMethod()
		},

	}
</script>

<style lang="less">
	.hand {
		cursor: pointer;
	}

	.product {
		padding-top: 64px;
		padding-right: 76px;
				padding-left: 183px;
				.img{
						position:relative;
						.label{
								position:absolute;
								top:0;
								left:-74px;
								font-size:14px;
								color:#c7c7c7;
						}
						.remark{
								font-size:12px;
								font-family:PingFangSC-Regular,PingFang SC;
								font-weight:400;
								color:#c7c7c7;
								line-height:17px;
						}
				}
				.tag{
						.ivu-form-item-label{
								margin-top:6px;
						}
						.mc {
								// width:544px;
								.active {
										border-color: #2168eb;
										color: #2168eb;
										padding-right: 12px;
		
										img {
												width: 14px;
												height: 14px;
												display: inline-block;
												vertical-align: middle;
										}
								}
		
								span {
										-webkit-box-sizing: border-box;
										-moz-box-sizing: border-box;
										box-sizing: border-box;
										position: relative;
										cursor: pointer;
		
										.close {
												display: block;
												width: 20px;
												height:auto;
												position: absolute;
												z-index: 99;
												right: -15px;
												top: -8px;
										}
		
										img {
												display: none;
										}
		
										padding: 0 15px;
										// padding-right: 32px;
										border: 1px solid #eee;
										-webkit-border-radius: 38px;
										-moz-border-radius: 38px;
										border-radius: 38px;
										height: 30px;
										line-height: 30px;
										text-align: center;
										margin: 7px 6px;
										display: inline-block;
										-webkit-box-sizing: border-box;
										-moz-box-sizing: border-box;
										box-sizing: border-box;
								}
		
								.btn {
										border-bottom: none;
										background: #2168eb;
										color: #ffffff;
		
										b {
												font-weight: normal;
										}
		
										input {
												display: none;
										}
								}
		
								.btn.active {
										background: none;
										border: 1px solid #eee;
										padding: 0;
										vertical-align: middle;
										width: 100px;
		
										input {
												width: 100%;
												display: block;
												border: none;
												background: none;
												padding: 0 15px;
		
										}
		
										b {
												display: none;
										}
								}
		
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
		//    .ivu-input{
	// 	   height:30px;
	//    }
		.input.ivu-form-item{
			margin-bottom: 10px;
			.ivu-form-item-content{
				margin-right: 371px;
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
			margin-bottom: 29px;
			margin-right: 100px;
		}
		.line1 {
			border-bottom: 1px dotted #DDDDDD;
			margin: 23px 100px 19px 0;
				}
				.line2 {
			border-bottom: 1px dotted #DDDDDD;
			margin: 23px 100px 24px 0;
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
	

		.w-e-text {
			font-size: 20px
		}

		.ivu-form-item-content {
			margin-right: 100px;
		}


		
		.btn-save {
			width: 206px;
			height: 48px;
			background: rgba(33, 104, 235, 1);
			border-radius: 27px;
			text-align: center;
			line-height: 48px;
			display: block;
			margin: 44px 100px 38px;
			color: #ffffff;
			font-size: 14px;
			cursor: pointer;

		}

		.imgbox {
			margin-right:22px;
			margin-bottom:7px;
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

</style>

<template>
	<div class="w">
		<div class="position">创建组织
		<span @click="$router.back(-1)">返回</span>
		</div>
		<div class="addorganize bg" v-if="!isusccess">
			<Form :label-width="80" :rules="formdaterule" ref="formdata" :model="formdata">
				<FormItem label="组织名称" prop="orgName">
					<Input v-model="formdata.orgName" :maxlength="16" placeholder="组织名称（2-16个字）"/>
					<p class="upload_tips">填写组织、协会或团体名称</p>
				</FormItem>

				<FormItem label="组织logo" class="second">
					<Upload @success="uporgUrl" @error="error" :personalInfo="personalInfo" :mimeType="mimeType" style="width:150px">
						<img  class="upload_pic hand" src="https://img.yiqilaiwang.com/tmp/wxa0535d31b27c14d8.o6zAJs2b9caL0xH8yzIUilWRbI6Y.tqzh3Q75Sdyv840af565712bb19a8d65a06f1d070367.png" alt="" v-if="formdata.orgUrl=='https://img.yiqilaiwang.com/tmp/wxa0535d31b27c14d8.o6zAJs2b9caL0xH8yzIUilWRbI6Y.tqzh3Q75Sdyv840af565712bb19a8d65a06f1d070367.png'">
						<img  class="upload_pic hand" :src="formdata.orgUrl" alt=""  v-if="formdata.orgUrl!='https://img.yiqilaiwang.com/tmp/wxa0535d31b27c14d8.o6zAJs2b9caL0xH8yzIUilWRbI6Y.tqzh3Q75Sdyv840af565712bb19a8d65a06f1d070367.png'">
						<span class="upload_btn hand">上传</span>
					</Upload>
					<p class="upload_tips">建议上传图片尺寸为400*400px</p>
				</FormItem>
				<FormItem label="组织简介" prop="orgIntroduce">
					<Input v-model="formdata.orgIntroduce" :maxlength="140" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="组织简介..."/>
				</FormItem>
				<!-- <FormItem label="组织简介" class="editor" prop="orgIntroduce">
					<div ref="editor" style="text-align:left;position: relative;z-index: 0;" v-model="formdata.orgIntroduce"></div>
					<div class="editorHint">
						提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况
					</div>
				</FormItem> -->
				<FormItem label="组织类型" class="a">
					<Select v-model="formdata.orgType" placeholder="选择组织类型">
						<Option :value="item.dictValue" v-for="(item,index) in listBydictType" :key="index">{{item.dictName}}</Option>
					</Select>
				</FormItem>
				<div class="line"></div>
				<FormItem>
					<Button type="primary" shape="circle" @click="onfrom">创建</Button>
				</FormItem>
			</Form>
		</div>

		<div class="w bg" v-if="isusccess">
			<div class="page_suceess" style="padding-top: 77.5px">
				
				<p class="t1">
					<img src="../assets/img/cjzz2@2x.png"  style="width:72px;text-align: center;"><br/>
					创建成功</p>
				<p class="t2">你可以前往一起来往app、组织管理或发活动使用相关功能</p>
				<div class="tac">
					<router-link class="btn48" style="margin-top: 90px;" to="/organizeManage">组织管理</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import  email  from "../assets/validator";
	// import E from 'wangeditor';
	export default {
		name: 'addorganize',
		data() {
			return {
				listBydictType: null,
				isusccess: false,
				formdata: {
					orgName: '',
					orgIntroduce: '',
					orgRecommend: 0,
					// orgUrl: 'https://come2me2.centling.cn/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20191016193629.png',
					orgUrl:'https://img.yiqilaiwang.com/tmp/wxa0535d31b27c14d8.o6zAJs2b9caL0xH8yzIUilWRbI6Y.tqzh3Q75Sdyv840af565712bb19a8d65a06f1d070367.png',
					orgType: 0
				},
				checkAges: null,
				// 表单规则校验
				formdaterule: {
					orgName: [{
						required: true,
						// message: '组织名称不能为空！',
						message: '请输入组织名称',
						trigger: 'blur||change'
					},{
						type: 'string',
						max: 16,
						min: 2,
						// message: '长度不能超过30个字符！',
						message: '请输入正确的组织名称',
						trigger: 'blur'
					}],
					// orgUrl: [{
					// 	required: true,
					// 	message: '请上传组织logo！',
					// 	trigger: 'blur||change'
					// }],
					// orgIntroduce: [{
					// 		required: true,
					// 		message: '组织简介不能为空！',
					// 		trigger: 'blur'
					// 	},
					// 	// {
					// 	// 	validator: email,
					// 	// 	trigger: 'blur|change'
					// 	// },
					// 	{
					// 		type: 'string',
					// 		max: 30,
					// 		message: '长度不能超过30个字符！',
					// 		trigger: 'blur|change'
					// 	}
					// ],
					// orgUrl: [{
					// 	required: true,
					// 	message: '请上传组织logo',
					// 	trigger: 'blur'
					// }],
					// coverUrl: [{
					// 	required: true,
					// 	message: '请上传组织封面图',
					// 	trigger: 'blur'
					// }]
				},
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				add:"",
				lock:false,
				// mimeLimit:'image/*',
			}
		},
		props: {
			personalInfo: null,
			defOrg: null,
		},
		methods: {
			checkAge() {

				this.checkAges = (rule, value, callback) => {
					if (!value) {
						return callback(new Error('年龄不能为空'));
					}
					setTimeout(() => {
						if (!Number.isInteger(value)) {
							callback(new Error('请输入数字值'));
						} else {
							if (value < 18) {
								callback(new Error('必须年满18岁'));
							} else {
								callback();
							}
						}
					}, 1000);
				};
			},
			onfrom() {
				var that = this;
				// 锁定
				if (that.lock) {
					return
				}
				that.lock = true;
				var timeoutflag = null;
				if (timeoutflag != null) {
				clearTimeout(timeoutflag);
				}
				timeoutflag = setTimeout(function () {
					that.lock = false;
				}, 3000);
				
				if (this.formdata.orgName == "") {
					layer.msg("请输入组织名称")
					return
				}
				if (this.formdata.orgName.length < 2 || this.formdata.orgName.length > 16) {
					layer.msg("请输入正确的组织名称")
					return
				}
				// if (this.formdata.orgUrl == ""||this.formdata.orgUrl == "../assets/img/cjzz1@2x.png") {
				// 	layer.msg("请上传组织logo")
				// 	return
				// }
				// if (this.formdata.orgIntroduce == "") {
				// 	layer.msg("组织简介不能为空")
				// 	return
				// }
				if (this.formdata.orgType == "") {
					layer.msg("请选择组织类型")
					return
				}
				this.http.ajax({
					url: 'webSite/checkAddOrg',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						orgName: this.formdata.orgName
					}
				}).then(res => {
					if (res.code == 200) {
						if (res.data.orgId == '') {
							this.http.ajax({
								url: 'webSite/addOrg',
								method: 'post',
								headers: {
									'Content-Type': ' application/json'
								},
								data: this.formdata
							}).then(res => {
								// console.log("ceshishuju  res")
								// console.log(res)
								if (res.code == 200) {
									let login = this.local.fetch('loging');
									login.isOrg = 1;
									login.orgId = res.data.orgId
									this.local.save('loging', login);
									this.isusccess = true;
									this.$emit('getdefOrg', res.data.orgId)
								}
							})
						} else {
							this.$Message.info('组织名称已存在');
						}
					}
				})

			},
			uporgUrl(res) {
				this.formdata.orgUrl = res.url
			},
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			// 变更的富文本框方法
			WangEditMethod() {
				var editor = new E(this.$refs.editor)
				editor.customConfig.onchange = (html) => {
					let reg = new RegExp('<p></p>', 'g')
					html = html.replace(reg, '');
					this.formdata.orgIntroduce = html
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
						// 'video',  // 插入视频
						// 'music',  // 音乐
						// 'code',  // 插入代码
						'undo', // 撤销
						'redo' // 重复
					],
					// editor.
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
					// console.log('富文本的content', JSON.parse(JSON.stringify(content)))
					// console.log('****str修改后的content str', str)
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
				if (this.add) {
					editor.cmd.do('insertHTML', this.formdata.orgIntroduce)
				}else if(!this.formdata.orgIntroduce){
					editor.txt.append(`<p><br></p>`)
				}
				this.uploadInit(editor);
				// this.uploadInitVideo(editor);
				// this.uploadInitMusic(editor);
				this.addmethod()
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
						domain: 'https://img.yiqilaiwang.com/', //bucket 域名，下载资源时用到，**必需**
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
									'?imageView2/1/q/30/format/jpg/ignore-error/1' + '" style="max-width:100%;"/>')
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
			addmethod() {
				// console.log("aaaa")
				this.add = false
			},
		},
		created() {
			this.http.ajax({
				url: 'webSite/listBydictType',
				method: 'post',
				headers: {
					'Content-Type': ' application/json'
				},
				data: {
					dictType: "ORG_TYPE"
				}
			}).then(res => {
				if (res.code == 200) {
					res.data.forEach((item) => {
						item.value = item.id
					})
					this.listBydictType = res.data
				}
			})
			//listBydictType
		},
		mounted() {
			// this.WangEditMethod()
		},
	}
</script>

<style lang="less">
	.a{
		.ivu-form-item-label:before {
			content: '*';
			display: inline-block;
			margin-right: 4px;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}
	}
	.addorganize {
		padding-left: 332px;
		padding-right: 316px;
		// padding-left: 183px;
		// padding-right: 196px;

		padding-top: 48px;
		padding-bottom: 100px;
		margin-bottom: 80px;

		.editorHint {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #2168eb;
			line-height: 17px;
			min-width: 400px;
			margin-top: 9px;
		}
		.w-e-text {
			font-size: 20px;
		}
		.ivu-form-item:nth-child(1),.ivu-form-item:nth-child(4){
			width:432px;
		}
		// .ivu-form-item:nth-child(1){	
		// 	margin-bottom:0px;
		// }

		.ivu-form-item-required .ivu-form-item-label:before {
			content: '';
		}
		.ivu-form-item-required:nth-child(1) .ivu-form-item-label:before {
			content: '*';
			display: inline-block;
			margin-right: 4px;
			line-height: 1;
			font-family: SimSun;
			font-size: 14px;
			color: #ed4014;
		}

		.upload_pic {
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			width: 57px;
			height: 57px;
			-webkit-border-radius: 50%;
			-moz-border-radius: 50%;
			border-radius: 50%;
		}
		.second{
			.ivu-form-item-label{
				margin-top:11px;
			}
		}

		.upload_tips {
			font-size: 12px;
			color: #999999;
		}

		.upload_btn {
			width: 46px;
			height: 32px;
			background: rgba(235, 242, 255, 1);
			border-radius: 16px;
			text-align: center;
			line-height: 32px;
			color: #2168eb;
			text-align: center;
			vertical-align: middle;
			font-size: 12px;
			display: inline-block;
		}

		.ivu-btn-primary {
			height: 48px;
			line-height: 48px;
			padding: 0 89px;
			font-size: 14px;
			// margin-left:151px;
			margin-left:50px;
		}
		.line{
			height:34px;
			width:100%;
		}

	}
</style>

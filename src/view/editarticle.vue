<template>
	<div>
		<div class="w">
			<div class="position">修改{{ title}}
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px;">
			<div class="addarticle">
				<Form ref="formValidate" :label-width="100" :model="formValue" :rules="titlerules">
					<FormItem label="主图">
						<Upload @success="uppicUrl" :personalInfo="personalInfo" :mimeType="mimeTypepic" @error="error">
							<div class="uploadpic">
								<img :src="imageUrl" alt="">
							</div>
						</Upload>
						<div class="uploadpic_tips">建议上传750*416px尺寸图片</div>
					</FormItem>

					<FormItem label="可见人员" v-show="isAllShow">
						<Select multiple v-model="authList" placeholder="全员可见" @on-change="selectAll">
							<!-- <Option :value="'selectAll'">全员可见</Option> -->
							<Option :value="item.value" v-for="(item,index) in orgStructureListDtos" :key="index">{{item.structure}}</Option>
						</Select>
						<!--<span class="link" @click="tolayer(1)" style="width: 100%;display: block;padding-left: 8px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;">选择部门</span>
						-->
						<!-- <Input  value=""></Input> -->
					</FormItem>
					<FormItem label="标题" prop="newsDigest">
						<Input placeholder="标题" v-model="formValue.newsDigest"/>
					</FormItem>
					<div class="line"></div>

					<FormItem label="内容" class="editor" prop="content">
						<div ref="editor" style="text-align:left;position: relative;z-index: 0;" v-model="content" @click="getToken($event)"></div>
						<div class="editorHint">
							提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况
						</div>
					</FormItem>
					<!-- <FormItem label="图片" class="">
						<div class="imglist">
							<div class="imgbox" v-for="(v,i) in imglist">
								<img :src="v">
							</div>
						</div>
						<Upload @success="upImagesSuccess" @error="upImagesError" :personalInfo="personalInfo" v-if="imglist.length<6">
							<div class="" style="width: 150px;padding: 40px;border:1px solid #ccc;border-radius: 15px;">
								<img src="../assets/img/pz@3x.png" class="" alt="" style="width: 100%;height: auto;">
							</div>
						</Upload>
					</FormItem> -->
					<FormItem label="附件">
						<ul class="imgFileList" v-if="fileCollection.length >0">

							<li style="margin-left: 15px;" v-for="(v,i) in  fileCollection" :key="i">{{v[0]}}<span v-on:click="delFileCollection(i)">删除</span></li>
						</ul>
						<Upload @success="upcoverUrl" @error="error" :beforeUpload="beforeAvatarUpload" :personalInfo="personalInfo" v-if="fileCollection.length <3"
						 :mimeType="mimeType" type='file'>
							<div class="hand">
								<img src="../assets/img/fj@2x.png" class="uploadIco" alt="">
								上传附件
								<!-- {{ fileFname }} -->
							</div>
						</Upload>
					</FormItem>
					<div class="line"></div>
					<div style="margin-bottom: 24px">
						<span style="margin-right: 8px">是否在{{this.title}}列表置顶</span>
						<Switchs v-model="isTop" />
					</div>
					<div style="margin-bottom: 24px">
						<span style="margin-right: 8px">仅组织内成员可查看</span>
						<Switchs v-model="onlyOrgMember" />
					</div>
					<div style="margin-bottom: 24px">
						<span style="margin-right: 8px">是否推荐到平台</span>
						<Switchs v-model="isRecommend" />
					</div>
					<div class="line"></div>
					<div class="btn" @click="issue()">发布</div>
					<div>&nbsp;</div>
				</Form>
				<!-- 头像裁剪 -->
        <div
          class="layer staffeit"
          v-if="layer==4"
          style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;z-index:10002"
          >
          <div
            class="line"
            style="margin-left: 0px;margin-top: 0px;position: fixed;top: 36%; left: 15%;"
          >
            <div class="cropper-content" style="margin-top:-60px;margin-left:90px;">
							<img src="./../assets/img/xxtz2@2x.png" @click="layer=0" alt="" style="position:absolute;right:-100px;top:-150px">
              <div class="cropper">
                <vueCropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :autoCropWidth="option.autoCropWidth"
                  :autoCropHeight="option.autoCropHeight"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
                  @imgLoad="imgLoad"
                ></vueCropper>
              </div>
              <div style="margin-left: 20px;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                <div
                  class="show-preview"
                  :style="{'width': '300px', 'height':'166px',  'overflow': 'hidden', 'margin': '5px'}"
                >
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
                <input
                  type="button"
                  class="btn btn-blue"
                  value="上传"
                  @click="finish"
                />
              </div>
            </div>
          </div>
        </div>
			</div>
		</div>
	</div>
</template>
<script>
	import E from 'wangeditor';
	import { VueCropper } from "vue-cropper";
	import * as qiniu from "qiniu-js";
	export default {
		name: 'addarticle',
		props: {
			msg: String,
			personalInfo: null, //登陆后 的用户信息
			defOrg: null
		},
		components: {
			VueCropper
		},
		data() {
			return {
				addcontent: true,
				mimeTypepic: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg', 'doc', 'txt', 'docx',
					'pdf', 'wps', 'xls', 'ppt', 'xlsx', 'pptx', 'zip'
				],
				formValue: {
					newsDigest: "",
					content: "11111"
				},
				titlerules: {
					newsDigest: [{
						required: true,
						message: '标题不能为空！',
						trigger: 'blur|change'
					}],
					// ,
					// content: [{
					// 	required: true,
					// 	message: '内容不能为空！',
					// 	trigger: 'blur|change'
					// }]
				},
				title: "",
				editorContent: '',
				orgId: "组织id",
				//互动主图的上传地址
				imageUrl: "",
				newsDigest: "",
				content: "",
				messageType: "1",
				isComments: 0,
				authListModel: [],
				authList: [],
				fileCollection: [],
				fileCollection_old: [],
				imgCollection: ["图片1", "图片2"],
				isRecommend: false,
				onlyOrgMember:true,
				isOrg: 1,
				isTop: false,
				// 附件的上传地址与名字
				fileFname: "",
				fileFurl: "",
				// 弹窗
				layer: 0,
				// 所有部门
				orgStructureListDtos: [],
				// selectAll: false,
				// imgFileList
				imglist: [],
				add: true,
				isAllShow:true,
				QNtoken:"",
				option: {
					img: "",
					size: 1, //剪切后的图片质量（0.1-1）
					full: true, //输出原图比例截图 props名full
					outputType: "png",
					canMove: true,
					original: false,
					canMoveBox: true,
					autoCrop: true,
					autoCropWidth: 300,
					autoCropHeight: 166,
					fixedBox: true
				},
				previews: {},
				headImg: "",
				name: "",
				modelSrc: "",
			}
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.getOrgStructureList();

				}
			},
			onlyOrgMember(val){
				// console.log(val)
				if(val){
					this.isRecommend = false;
					this.isAllShow = true;
				}else{
					this.isAllShow = false;
				}
			},
			isRecommend(val){
				if(val){
					this.onlyOrgMember = false
				}
			}
		},
		methods: {
			// tianjia
			addmethod() {
				// console.log("aaaa")

				this.add = false


			},
			imgtoBig(url) {
				layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					shadeClose: true,
					area: [], //宽高
					content: "<img src=" + url + " style='max-width:700px;max-height:800px;overflow-y: scroll;width:100% ' />",
				});
			},
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
							this.addcontent = false
							// this.formValue=res.data
							this.imageUrl = res.data.imageUrl
							this.formValue.newsDigest = res.data.newsDigest
							this.newsDigest = res.data.newsDigest
							this.content = res.data.content;
							this.orgName = res.data.orgName;
							this.messageType = res.data.messageType;
							// this.messageTypeInfo = this.messageType();
							this.isAudit = res.data.status == 0;
							this.orgUrl = res.data.orgUrl;
							this.createTime = res.data.createTime;
							this.imgCollection = res.data.imgCollection
							if (res.data.isRecommend == 1) {
								this.isRecommend = true;
							}
							if(Boolean(res.data.isOnlyOrg)){
								this.onlyOrgMember = true;
								this.isAllShow = true;
							}else{
								this.onlyOrgMember = false;
								this.isAllShow = false;
							}
							var l = []
							for (var i = 0; i < res.data.fileCollection.length; i++) {

								l.push([res.data.fileCollection[i].file, res.data.fileCollection[i].fileUrl])
							}
							this.fileCollection = l


						}
					})
			},
			beforeAvatarUpload(file) {

				const isLt20M = file.size / 1024 / 1024 < 0.1
				if (!isLt20M) {
					this.$message.error('上传图片的大小不能超过 20M!');
				}
				return isLt20M
			},
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			selectAll(e) {
				// if(e.join(',').indexOf('selectAll') !=-1){
				// 	this.authList = ['selectAll'];
				// }
				// return;
				// console.log('x1323333',e.join(','));
				// var authList = [];
				// this.orgStructureListDtos.forEach((item )=>{
				//     console.log(item.id)
				// 	authList.push(item.id)
				// })

				// if(e.join(',').indexOf('selectAll') ==-1){
				// 	console.log('不包含');
				// 	// if()
				// 	// if(this.authList.length == authList.length){
				// 	// 	this.authList = [];
				// 	// }
				// }else{
				// 	// console.log('包含');
				// 	// if()

				// 	if(this.authList.length == authList.length){
				// 		this.authList = [];
				// 		console.log('包含','取消全员可见');
				// 	}else{
				// 		this.authList = authList;
				// 		console.log('包含','添加全员可见');
				// 	}
				// }
				// return;
				if (this.authList.indexOf('selectAll') != -1) {
					var authList = [];
					this.orgStructureListDtos.forEach((item) => {

						authList.push(item.id)
					})
					this.authList = authList;

				}
				// if(this.authList)
			},
			upImagesSuccess(e) {
				this.imglist.push(e.url);

			},
			upImagesError(e) {

			},
			delFileCollection(key) {
				this.fileCollection_old.splice(key, 1)
				this.fileCollection.splice(key, 1)
			},
			// 附件上传
			upcoverUrl(e) {
				this.fileFname = e.name
				this.fileFurl = e.url

				if (this.fileCollection_old.indexOf(e.url) == -1) {
					this.fileCollection_old.push(e.url)
					this.fileCollection.push([this.fileFname,this.fileFurl])
				}

				// console.log(e)
			},
			// 主图上传
			uppicUrl(e) {
				// this.imageUrl = e.url
				this.defOrg.picUrl = e.url
				this.option.img = e.url;
				this.name = e.name;
				this.layer =4;
				// console.log(e)
			},
			// 实时预览函数
			realTime(data) {
				// console.log(data)
				this.previews = data;
				this.$refs.cropper.getCropBlob(data => {
					this.modelSrc = data;
				});
			},
			imgLoad(msg) {
			},
			changeScale(num) {
				// console.log("changeScale");
				num = num || 1;
				this.$refs.cropper.changeScale(num);
			},
			finish() {
				if(!this.modelSrc){
					layer.msg("再试一次")
					return 
				}
				var loading = layer.load(1, {
					shade: [0.1, "#fff"] //0.1透明度的白色背景
				});
				this.http.ajax({
					url: "webSite/home/uploadApplication",
					method: "post",
					data: {
						uid: this.personalInfo.uid
					}
				})
				.then(res => {
					var uptoken = res.data.upToken;
					var file = this.modelSrc; //Blob 对象，上传的文件

					var key = null; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

					var region = res.data.region.split(".");
					let config = {
						useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
						region: qiniu.region[region[2]] // ,当为 null 或 undefined 时，自动分析上根据具体提示修改上传地区传域名区域
					};

					let putExtra = {
						fname: this.name, //文件原文件名
						params: {} //用来放置自定义变量
						// mimeLimit:"",
						// mimeLimit: this.mimeLimit,
						// mimeType: this.mimeType //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
					};
					var observable = qiniu.upload(file, key, uptoken, putExtra, config);
					observable.subscribe({
						next: result => {
							// 主要用来展示进度
						},
						error: errResult => {
							// 失败报错信息
							// console.log('异常类型')
							// this.file = null;
							// this.$refs.evfile
							// console.log(this.$refs.evfile.val());
							this.$refs.evfile.value = null;
							this.$emit("error", { errResult });
							layer.close(loading);
						},
						complete: result => {
							// console.log("result", result);
							layer.close(loading);
							this.layer = false;
							// 接收成功后返回的信息
							// console.log("图片地址", res.data.qiniuDomain + "/" + result.key);
							this.imageUrl=res.data.qiniuDomain + "/" + result.key
						}
					});
				});
			},
			// 发布
			issue() {

				if (this.formValue.newsDigest == "") {
					layer.msg("标题不能为空")
					return
				}

				if (this.content == "" || this.content == null) {
					layer.msg("内容不能为空")
					return
				}


				var t = 1
				if (!this.isTop) {
					t = 0
				}
				var isr = 1
				if (!this.isRecommend) {
					isr = 0
				} else {
					this.authList = []
				}
				this.http.ajax({
					url: 'webSite/orgMessage/editMessage',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"id": this.$route.query.id,
						"orgId": this.orgId,
						"imageUrl": this.imageUrl,
						"newsDigest": this.formValue.newsDigest,
						"content": this.content,
						"isOnlyOrg": this.onlyOrgMember? "1":"0",
						"messageType": this.messageType,
						"isComments": 0,
						"authList": this.authList,
						"fileCollection": this.fileCollection,
						"imgCollection": this.imglist,
						"isRecommend": isr,
						"isTop": t
					}
				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					if (res.code == 200) {
						if(this.messageType==6||this.messageType==7||this.messageType==8){
							return this.$router.push('/activitylist?messageType=' + this.messageType);
						}else{
							return this.$router.push('/managearticlelist?messageType=' + this.messageType);
						}
					}
					this.orgStructureListDtos = res.data.orgStructureListDtos
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
						orgId: this.orgId
					}
				}).then(res => {
					// console.log(res)
					/*for (let i = 0; i <= res.data.orgStructureListDtos.length; i++) {
					    // res.data.orgStructureListDtos[i]. = 0;
					    // console.log(res.data.orgStructureListDtos[i]);
					    let v = res.data.orgStructureListDtos[i];
					    // console.log(res.data.orgStructureListDtos[i]);
					    // this.authList[v.id] = true;
					}*/
					res.data.orgStructureListDtos.forEach((item) => {
						// console.log(item.id)
						item.value = item.id
					})
					this.orgStructureListDtos = res.data.orgStructureListDtos
				})
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
					this.QNtoken = res.data.upToken;
					var uploader = window.Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
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
								// layer.close(index);
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
			uploadInitVideo(editor) {
				// 获取相关 DOM 节点的 ID
				var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[15]
				var containerId = editor.toolbarElemId
				var textElemId = editor.textElemId
				var that = this;
				var index='';
				// console.log('上传开始啦')
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
			// uploadInitMusic(editor) {
			// 	// 获取相关 DOM 节点的 ID
			// 	var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[16]
			// 	console.log(btnId);
			// 	// var btnId = editor.imgMenuId;
			// 	// console.log(editor.$toolbarElem[0],btnId)
			// 	var containerId = editor.toolbarElemId
			// 	var textElemId = editor.textElemId
			// var index='';
			// 	// 创建上传对象
			// 	// this.http.ajax({
			// 	// 	url: 'webSite/home/uploadApplication',
			// 	// 	method: 'post',
			// 	// 	data: {
			// 	// 		uid: this.personalInfo.uid
			// 	// 	}
			// 	// }).then(res => {
			// 		// console.log(res)
			// 		var that = this;
			// 		var uploader = window.Qiniu.uploader({
			// 			runtimes: 'html5,flash,html4', //上传模式,依次退化
			// 			browse_button: btnId, //上传选择的点选按钮，**必需**
			// 			// uptoken: res.data.upToken,
			// 			uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
			// 				var uptoken ='';
			// 				that.http.ajax({
			// 					url: 'webSite/home/uploadApplication',
			// 					method: 'post',
			// 					data: {
			// 						uid: that.personalInfo.uid
			// 					}
			// 				}).then( res =>{
			// 					uptoken = res.data.upToken;
			// 					console.log('在需要获取uptoken时，该方法会被调用',uptoken)
			// 					return uptoken;
			// 				})
			// 				// setTimeout(()=>{
			// 				// 	
			// 				// },1000)
			// 			},


			// 			unique_names: true,
			// 			// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
			// 			domain: 'https://img.yiqilaiwang.com/',
			// 			container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
			// 			max_file_size: '100mb', //最大文件体积限制
			// 			region: "z1",
			// 			filters: {
			// 				mime_types: [
			// 					//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
			// 					{
			// 						title: "音频文件",
			// 						// extensions: "jpg,gif,png,bmp,jpeg"
			// 						// extensions: "avi,asf,wmv,mov,mp4,FLV"
			// 						extensions: "mp3,ogg,wav"
			// 					}
			// 				]
			// 			},
			// 			max_retries: 3, //上传失败最大重试次数
			// 			dragdrop: true, //开启可拖曳上传
			// 			drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			// 			chunk_size: '10mb', //分块上传时，每片的体积
			// 			auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			// 			init: {
							// 'UploadProgress': function(up, file) {
							// 	// 显示进度条
							// 	index = layer.load(0, {shade: false});
							// },
							//  'UploadComplete': function() {
							// 	//队列文件处理完毕后,处理相关的事情
							// 	// 隐藏进度条
							// 	layer.close(index);
							// },
			// 				'FileUploaded': function(up, file, info) {
			// 					var domain = up.getOption('domain')
			// 					var res = window.$.parseJSON(info)
			// 					var sourceLink = domain + res.key //获取上传成功后的文件的Url
			// 					console.log(file.name)
			// 					// 插入图片到editor
			// 					editor.cmd.do('insertHtml','<audio controls controlslist="nodownload" style="max-width:100%; width:100%"> <source   src="' + sourceLink + '?imageslim/imageView2/1/interlace/1/ignore-error/1"/></audio> ' )
			// 				}
			// 			}
			// 		})
			// 	// })
			// },
			// 变更的富文本框方法
			WangEditMethod() {
				var editor = new E(this.$refs.editor);
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
					editor.cmd.do('insertHTML', this.content)
				}else{
					editor.cmd.do('insertHTML', '<p><br></P>')
				}
				this.uploadInit(editor);
				this.uploadInitVideo(editor);
				// this.uploadInitMusic(editor);
				this.addmethod()
			},
			// 手动同步的method
			getLast() {
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
							this.addcontent = false
							// this.formValue=res.data

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
							// this.authList = res.data.jurisdictionList
							// if (res.data.isTop == 0) {
							// 	this.isTop = false
							// } else {
							// 	this.isTop = true
							// }
							// 可见
							if (res.data.jurisdictionList.length == this.orgStructureListDtos.length) {
								this.authList = []
							} else {
								this.authList = res.data.jurisdictionList
							}

							if (res.data.isTop == 0) {
								this.isTop = false
							} else {
								this.isTop = true
							}
							var l = []
							for (var i = 0; i < res.data.fileCollection.length; i++) {
								l.push([res.data.fileCollection[i].file, res.data.fileCollection[i].fileUrl])
							}
							this.fileCollection = l
							this.WangEditMethod()

						}
					})
			},
			// getQNToken(){
			// 	console.log("执行一次")
			// 	this.http.ajax({
			// 		url: 'webSite/home/uploadApplication',
			// 		method: 'post',
			// 		data: {
			// 			uid: this.personalInfo.uid
			// 		}
			// 	}).then( res =>{
			// 		this.QNtoken = res.data.upToken;
			// 	})
			// }

		},
		mounted() {
			if (this.addcontent) {
				this.getLast()
			} else {
				this.WangEditMethod()
			}
		},
		created() {
			this.messageType = Number(this.$route.query.m)
			switch (this.messageType) {
				case 1:
					this.title = "资讯";
					// this.imageUrl = "https://come2me2.centling.cn/fgg144@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg144@3x.png";
					break;
				case 2:
					this.title = "资源需求";
					// this.imageUrl = "https://come2me2.centling.cn/fgg133@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg133@3x.png";
					break;
				case 3:
					this.title = "通知";
					// this.imageUrl = "https://come2me2.centling.cn/fgg111@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg111@3x.png";
					break;
				case 4:
					this.title = "党建要闻";
					// this.imageUrl = "https://come2me2.centling.cn/fgg122@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
					break;
				case 6:
					this.title = "商会服务";
					// this.imageUrl = "https://come2me2.centling.cn/fgg122@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
					break;
				case 7:
					this.title = "协会服务";
					// this.imageUrl = "https://come2me2.centling.cn/fgg122@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
					break;
				case 8:
					this.title = "法规标准";
					// this.imageUrl = "https://come2me2.centling.cn/fgg122@3x.png";
					this.imageUrl = "https://img.yiqilaiwang.com/fgg122@3x.png";
					break;
			}

			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.m = this.$route.query.m
				this.getOrgStructureList();
				this.getOrgMessageListDeatil()
			}

		},
	}
</script>

<style lang="less">
	.hand {
		cursor: pointer;
	}

	.addarticle {
		padding-top: 64px;
		padding-right: 130px;
		padding-left: 130px;
		.icon {
			vertical-align: middle;
			margin-right: 3px;
		}

		.ivu-form .ivu-form-item-label {
			text-align: left;
		}

		.ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
			color:#515a6e
		}
		
		.line {
			border-bottom: 1px dotted #DDDDDD;
			margin-bottom: 24px;
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

		

		.editor {
			.ivu-form-item-content {
				margin-right: 0;
			}

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

		.w-e-text {
			font-size: 20px
		}

		.ivu-form-item-content {
			margin-right: 271px;
		}

		.uploadpic {
			width: 300px;
			height: 166px;

			img {
				width: 300px;
				height: 166px;
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
		.cropper-content {
			display: flex;
			display: -webkit-flex;
			justify-content: flex-end;
			-webkit-justify-content: flex-end;
			.cropper {
				width: 350px;
				height: 350px;
			}
			.show-preview {
				flex: 1;
				-webkit-flex: 1;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				-webkit-justify-content: center;
				.preview {
					overflow: hidden;
					border-radius: 5px;
					border: 1px solid #cccccc;
					background: #cccccc;
					// margin-left: 40px;
				}
			}
			.btn{
				width:auto;
				height: 35px;
				line-height: 35px;
				vertical-align: middle;
				background: #2168eb;
				display: inline-block;
				text-align: center;
				border-radius: 22px;
				color: #ffffff;
				font-size: 12px;
				padding: 0 60px;
				cursor: pointer;
			}
		}

		.btn {
			width: 205px;
			height: 48px;
			background: rgba(33, 104, 235, 1);
			border-radius: 27px;
			text-align: center;
			line-height: 48px;
			display: block;
			margin: 0 auto;
			color: #ffffff;
			font-size: 14px;
			margin-bottom: 44px;
			cursor: pointer;
			margin-top: 44px;
		}

		.imglist {
			display: block;
			width: 720px;
			overflow: hidden;

			.imgbox {
				width: 33%;
				margin-right: 0.3333%;
				border: 1px solid #ccc;
				border-radius: 15px;
				display: block;
				float: left;
				height: 0;
				padding-bottom: 33%;
				margin-bottom: 15px;

				img {
					width: 100%;
					height: auto;
				}
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

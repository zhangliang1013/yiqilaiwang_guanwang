<template>
	<div>
		<div class="w">
			<div class="position">
				<!-- <span @click="$router.back(-1)">返回</span> -->
			</div>
		</div>
		<div class="w bg staff" style="margin-top:1px;">
			<div class="warp staff" style="margin-top:1px;">
				<div class="leftcont">
					<div class="menu">
						<div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">本{{defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"?'委':'会'}}介绍</div>
						
						<div class="item n" @click="tomenu(3)" :class="{active:menuactive==3}" v-if="defOrg&&defOrg.digitalCommerce=='5ea6a71ca5f08e7ae71fa336'">机构信息</div>
						<dl class="child" v-show="menuactive==3">
							<dd :class="{active:synopsis==0 || synopsis==2 }" @click="synopsisbtn(0)">
								<span>机构领导</span>
							</dd>
							<dd :class="{active:synopsis==1 || synopsis==3 }" @click="synopsisbtn(1)">
								<span>部门设置</span>
							</dd>
						</dl>
						<div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">{{defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"?'联系我们':'工商联章程'}}</div>
					</div>
				</div>
				<!-- 组织架构-->
				<div class="rightcont" v-show="menuactive==0">
					<div v-if="menuactive==0">
						<div class="rightcont-top clear">
							<div class="tit fl">领导班子</div>
							<div class="addbtn fr" @click="check(0)">新赠</div>
						</div>
						<div class="table">
							<div class="mt">
								<div class="item" style="width: 100px">姓名</div>
								<div class="item" style="width: 130px">职务</div>
								<div class="item" style="width: 140px">个人照片</div>
								<div class="item" style="width: 220px">备注</div>
								<div class="item" style="width: 100px">操作</div>
							</div>

							<div
								class="mc hand"
								v-for="(value,index) in orgStructureListDtos"
								:key="index"
								style=" overflow:hidden;"
							>
								<div>
									<div class="item" style="width: 100px;">{{ value.name}}</div>
									<div class="item" style="width: 130px; overflow:hidden">
										<span v-for="(v,index) in value.position" :key="index">{{ v }}</span>
									</div>
									<img style="width: 66px;height:92px;margin-right:64px;" :src="value.photo" alt />
									<div class="item" style="width: 220px; overflow:hidden">{{ value.achievement }}</div>
									<div class="item" style="width: 100px;">
										<span class="edit" @click="check(value)">编辑</span>

										<span class="del" @click="dellayer(value)">删除</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--本会介绍-->
				<div class="rightcont" v-show="menuactive==1">
					<div>
						<div class="rightcont-top clear">
							<div class="tit fl">本{{defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"?'委':'会'}}介绍</div>
							<div class="item fr">
								<div class="addbtn" style="margin-top:10px;" @click="tolayer(1)">保存</div>
							</div>
						</div>
						<Form ref="formValidate" :label-width="100">
							<FormItem label="内容" class="editor" prop="content">
								<div ref="editor" v-model="content" @click="getToken($event)"></div>
								<div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
								<!-- {{content}} -->
							</FormItem>
						</Form>
					</div>
				</div>
				<!--工商联章程-->
				<div class="rightcont" v-show="menuactive==2">
					<div>
						<div class="rightcont-top clear">
							<div class="tit fl">{{defOrg&&defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"?'联系我们':'工商联章程'}}</div>
							<div class="item fr">
								<div class="addbtn" @click="tolayer(2)">保存</div>
							</div>
						</div>
						<Form ref="formValidate1" :label-width="100">
							<FormItem label="内容" class="editor" prop="content1">
								<div ref="editor1" v-model="content1" @click="getToken($event)"></div>
								<div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
							</FormItem>
						</Form>
					</div>
				</div>
				<!-- 机构信息列表 -->
				<div class="rightcont" v-show="menuactive==3">	
					<div v-show="synopsis==0 || synopsis==1">
						<div class="rightcont-top clear">
							<div class="tit fl">{{synopsis==0?'机构领导':'部门设置'}}</div>
							<div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
								<div class="addbtn" v-if="synopsis==0" @click="synopsisbtn(2)">新增</div>
								<div class="addbtn" v-if="synopsis==1" @click="synopsisbtn(3)">新增</div>
							</div>
						</div>
						<div class="table">
							<div class="mt" style="padding-right:0px;font-size:16px">
								<div class="item" style="min-width: 52px">序号</div>
								<div class="item" :style="{'width':(synopsis==0 ?'68':'446') + 'px'}">{{synopsis==0 ?'姓名':'机构名称'}}</div>
								<div class="item" v-if="synopsis==0" :style="{'width':(synopsis==0?'214':'141') + 'px'}">职务</div>
								<div class="item" v-if="synopsis==0" style="width: 317px">工作分工</div>
								<div class="item" style="text-align:left" :style="{'min-width':(synopsis==0?'70':'80') + 'px'}">操作</div>
							</div>
							<div class="mc" v-if="!orgStructureListDtos || !orgStructureListDtos.length">
								<div class="item" style="text-align: center; width:800px">暂无数据</div>
							</div>
							<div v-if="orgStructureListDtos">
								<!-- <div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " v-dragging="{ item: value, list: allusers.data,group:'alluserslist'}" :key="index"> -->
								<div class="mc hand" v-for="(value,index) in orgStructureListDtos" style="overflow: hidden;padding-right: 0px; " :key="index">
									<div class="item hand" @dblclick="test(index,value)" title="双击修改序号" :style="{'min-width':(synopsis==0?'52':'52') + 'px'}"><div class="sort-num">{{index+1}}</div></div>
									<div class="item" :style="{'width':(synopsis==0 ?'68':'402') + 'px'}">{{value.name?value.name:''}}</div>
									<div class="item" style="width: 210px;padding-right:10px;color:#999999" v-if="synopsis==0">
										<template v-for="(extra,i) in value.position">
											<div class="item" :key="i"  :title="extra">{{extra}}</div>
										</template>
										<span v-if="!value.position.length"> </span>
									</div>
									<div class="item" v-if="synopsis==0" style="width: 303px;padding-right:10px;color:#999999">{{value.achievement}}</div>
									<!-- <div class="item" style="width: 168px" :title="value.idCard">{{ value.extraProperties[0].fieldValue }}</div> -->
									<div class="item" :style="{'width':(synopsis==0 ?'100':'128') + 'px'}">
										<span class="edit" v-if="synopsis==1" @click="synopsisbtn(3,value,'isCheck')">查看</span>
										<span class="edit" v-if="synopsis==1" @click="synopsisbtn(3,value,index)">编辑</span>
										<span class="edit" v-if="synopsis==0" @click="synopsisbtn(2,value,index)">编辑</span>
										<span class="del" @click="dellayer(value,index)">删除</span>
									</div>
								</div>
								<!-- <Page v-if="orgStructureListDtos" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="orgStructureListDtos.totalElements"
									@on-change="getOrgUserPage()" show-elevator :page-size="pageSize" :show-total="true" /> -->
							</div>
						</div>
					</div>
					<div v-show="synopsis==2">	
						<div class="rightcont-top clear">
							<div class="tit fl">{{edit?'':'新增'}}机构领导</div>
							<!-- <div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
								<div class="addbtn" @click="check(0)">新增</div>
							</div> -->
						</div>
						<Form :label-width="100" :model="pre"> 
							<FormItem label="姓名">
								<Input style="width:350px;" :maxlength="20" v-model="pre.name" />
							</FormItem>
							<FormItem label="职务" >
								<Input style="width:350px;" :maxlength="20" v-model="pre.position1" />
							</FormItem>
							<div class="line"></div>
							<FormItem label="工作分工">
								<div class="count-box">
									<Input 
									style="width:350px;" 
									class="textarea"
									v-model="pre.achievement" 
									type="textarea"
									:maxlength="40"
									:autosize="{minRows: 5,maxRows: 8}"
									placeholder="点击输入分工信息"/>
								<div class="count">（{{pre && pre.achievement.length?pre.achievement.length:'0'}}/50）</div>
								</div>
							</FormItem>

							<FormItem label style="margin-top:73px">
								<div class="btn" v-back-top @click="savePre()">确认</div>
							</FormItem>
						</Form>
					</div>
					<div v-show="synopsis==3">	
						<div class="rightcont-top clear">
							<div class="tit fl">{{edit?'':'新增'}}部门设置</div>
							<!-- <div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
								<div class="addbtn" @click="check(0)">新增</div>
							</div> -->
						</div>
						<Form :label-width="100" :model="pre"> 
							<FormItem label="机构名称" prop="name">
								<Input style="width:350px;" :maxlength="20" v-model="pre.name" />
							</FormItem>
							<FormItem label="办公电话" >
								<Input style="width:350px;" :maxlength="20" v-model="pre.telephone" />
							</FormItem>
							<FormItem label="投诉电话" >
								<Input style="width:350px;" :maxlength="20" v-model="pre.complaints" />
							</FormItem>
							<FormItem label="传真号码" >
								<Input style="width:350px;" :maxlength="20" v-model="pre.fax" />
							</FormItem>
							<FormItem label="网址" >
								<Input style="width:350px;" :maxlength="40" v-model="pre.website" />
							</FormItem>
							<FormItem label="电子邮箱">
								<Input style="width:350px;" :maxlength="40" v-model="pre.email" />
							</FormItem>
							<div class="line"></div>
							<FormItem label="办公时间">
								<Input style="width:350px;" :maxlength="40" v-model="pre.officeHour" />
								<!-- <TimePicker class="actEndTime" format="HH:mm" :start-date="new Date()" @on-change="getOfficeTime" :value="pre.officeHour" type="timerange" placeholder="选择日期" style="width: 350px;"></TimePicker> -->
							</FormItem>
							<FormItem label="办公地址">
								<div class="count-box">
									<Input 
									style="width:350px;" 
									v-model="pre.address" 
									type="textarea"
									:maxlength="50"
									:autosize="{minRows: 5,maxRows: 8}"
									placeholder="点击输入办公地址"/>
								<div class="count">（{{pre && pre.address.length?pre.address.length:'0'}}/50）</div>
								</div>
							</FormItem>
							<FormItem label="职能">
								<div class="count-box">
									<Input 
									style="width:350px;" 
									v-model="pre.function"
									type="textarea"
									:maxlength="100"
									:autosize="{minRows: 5,maxRows: 8}"
									placeholder="点击输入职能信息"/>
								<div class="count">（{{pre && pre.function.length?pre.function.length:'0'}}/100）</div>
								</div>
							</FormItem>
							<FormItem label style="margin-top:73px" v-if="!isCheck">
								<div class="btn" v-back-top @click="savePre()">确认</div>
							</FormItem>
						</Form>
					</div>
				</div>
				<!-- 部门设置编辑 -->
				<!-- 机构领导编辑 -->
				<div class="cl"></div>
			</div>
			<!-- 删除部门 -->
			<div class="layer staffeit" v-if="layer==9">
				<div class="mask" @click="tolayer(3)"></div>
				<div class="content">
					<div class="title">删除</div>
					<div class="tips">是否确认删除{{delPartMgs.name}}</div>
					<div class="btns">
						<div class="btn1" v-if="this.synopsis ==0" @click="del(delPartMgs)">确认</div>
						<div class="btn1" v-if="this.synopsis ==1" @click="savePre('del')">确认</div>
						<div class="btn2" @click="tolayer(3)">取消</div>
					</div>
				</div>
			</div>
			<!-- 编辑序号 -->
			<div class="layer staffeit" v-if="layer==1">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">修改序号</div>
					<div class="tips">要修改<span style="color:#2168EB">{{ sortsetObj.name }}</span> 的序号由<span style="color:#2168EB">&nbsp;{{ sortsetObj.index }}&nbsp;</span>改为
						<div class="mc">
							<input class="sortnum" step="0.1" required="" v-model="newsort"/>
						</div>

					</div>
					<div class="btns">

						<div class="btn1" @click="tolayer(0)">我再想想</div>
						<div class="btn2" @click="save()">确认修改</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import E from "wangeditor";
export default {
	name: "organizationset",
	mounted() {
		this.getProperties();
	},
	data() {
		return {
			iswang: true,
			formValue: {
				newsDigest: "",
				content: null
			},
			menuactive: 1,
			content: "",
			content1: "",
			delPartMgs: "",
			id: "",
			//领导班子
			orgStructureListDtos: [],
			properties: {
				regulations: {},
				introduce: {}
			}, //介绍与章程
			layer: 0,
			editorDate: "",
			pre:{
				name:"",
				telephone:"",
				complaints:"",
				fax:"",
				officeHour:"",
				address:"",
				website:"",
				email:"",
				function:"",
				position:[],
				position1:"",
				achievement:''
			}, 
			synopsis:0,
			preItem:null,
			edit:false,
			isCheck:false,
			index:0,
			sortsetObj:{},
			newsort:"",
		};
	},
	props: {
		msg: String,
		defOrg: null,
		personalInfo: null,
		login: null
	},
	watch: {
		defOrg(res,old) {
			if (res) {
				this.orgId = res.id;
				this.currentOrgName = res.orgName;
				if(this.synopsis==0){
					this.getOrgStructureList();
				}else{
					this.getOrgStructureList1();
				}
				this.getProperties(1);
			}
		},
		newsort: function(val, oldval) {
			var reg = /^[1-9]\d*$/;

			if (val == 0) {
				this.newsort = "";
				this.sortsetObj.newsort = "";
				return;
			}
			if (val == "" || val == null) {
				this.newsort = "";
				this.sortsetObj.newsort = "";
				return;
			}
			if (reg.test(val)) {
				if (val > 99999) {
					val = 99999;
				}
				var m = val;
				this.newsort = m;
				this.sortsetObj.newsort = m;
				return;
			} else {
				if (oldval != null && oldval != "") {
					this.newsort = oldval;
					this.sortsetObj.newsort = oldval;
				} else {
					this.newsort = 1;
					this.sortsetObj.newsort = 1;
				}
			}
		},

		menuactive: function(val, oldval) {
			if (val == 1 && this.orgId != null) {
				this.getProperties(1);
			} else if (val == 0 && this.orgId != null) {
				//加载部门信息
				if(this.synopsis==0){
					this.getOrgStructureList();
				}else{

					this.getOrgStructureList1();
				}
			}
		},
		synopsis: function(val, oldval) {
			// if (val == 1 && this.orgId != null) {
			// 	this.getProperties();
			// } else if (val == 0 && this.orgId != null) {
			// 	//加载部门信息
			if(val == 0){
				this.getOrgStructureList();
			}else{
				this.getOrgStructureList1();
			}
			// }
		},
	},
	created() {
		this.menuactive = this.$route.params.page;
		if(this.synopsis == 0){
			this.getOrgStructureList();
		}else{
			this.getOrgStructureList1();
		}
		// }
	},
	methods: {
		check(row) {
			if (row) {
				let result = JSON.stringify(row);
				this.$router.push({
					path: "/addLeader",
					query: {
						row: result,
						m: 1
					}
				});
			} else {
				this.$router.push({
					path: "/addLeader",
					query: {
						m: 0
					}
				});
			}
		},
		WangEditMethod(ref, n) {
			var editor = new E(ref);
			// this.editorDate = editor;
			// console.log("213", editor);
			if (n == 0) {
				editor.customConfig.onchange = html => {
					let reg = new RegExp('<p></p>', 'g')
					html = html.replace(reg, '');
					this.content = html;
				};
			}
			if (n == 1) {
				editor.customConfig.onchange = html => {
					let reg = new RegExp('<p></p>', 'g')
					html = html.replace(reg, '');
					this.content1 = html;
				};
			}
			(editor.customConfig.menus = [
				"head", // 标题
				"bold", // 粗体
				"fontSize", // 字号
				"fontName", // 字体
				"italic", // 斜体
				"underline", // 下划线
				"strikeThrough", // 删除线
				"foreColor", // 文字颜色
				"backColor", // 背景颜色
				"link", // 插入链接
				"list", // 列表
				"justify", // 对齐方式
				"quote", // 引用
				"emoticon", // 表情
				"image", // 插入图片
				// 'table',  // 表格
				"video", // 插入视频
				// 'music',  // 插入音频
				// 'code',  // 插入代码
				"undo", // 撤销
				"redo" // 重复
			]),
				// 使用 base64 保存图片
				(editor.customConfig.uploadImgShowBase64 = false);
			// editor.customConfig.fontSize='normal'
			// editor.customConfig.pasteFilterStyle = true
			editor.customConfig.pasteIgnoreImg = false;

			editor.customConfig.pasteTextHandle = function(content) {
				// content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
				if (content == "" && !content) return "";
				let str = content;
				//处理的标签里的多余代码
				str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
				str = str.replace('/(\\n|\\r| class=(")?Mso[a-zA-Z]+(")?)/g', "");
				let reg = new RegExp("<!--(.*?)-->", "g");
				str = str.replace(reg, "");
				str = str.replace(/<style>[\s\S]*?<\/style>/gi, "");
				// str = str.replace(/<\/?[^>]*>/g, '')
				// str = str.replace(/[ | ]*\n/g, '\n')
				// str = str.replace(/&nbsp;/ig, '')
				return str;
			};

			// 隐藏“网络图片”tab
			editor.customConfig.showLinkImg = false;
			editor.customConfig.colors = [
				"red",
				"black",
				"green",
				"yellow",
				"orange",
				"grey",
				"pink",
				"transparent"
			];

			// 允许上传到七牛云存储
			editor.customConfig.qiniu = true;
			editor.create();
			// editor.cmd.do("insertHTML", this.content);
			if (n == 0) {
				if(this.content){
					editor.txt.append(`<p>${this.content}</p>`)
				}else{
					editor.txt.append(`<p><br></p>`)
				}
				// editor.cmd.do("insertHTML", this.content);
			}
			if (n == 1) {
				if(this.content1){
					editor.txt.append(`<p>${this.content1}</p>`)
				}else{
					editor.txt.append(`<p><br></p>`)
				}
			}
			this.uploadInit(editor);
			this.uploadInitVideo(editor);
			// this.uploadInitMusic(editor);
		},
		WangEditMethod1() {
			this.WangEditMethod(this.$refs.editor1, 1);
		},
		uploadInit(editor) {
			// 获取相关 DOM 节点的 ID
			var btnId = editor.imgMenuId;
			var containerId = editor.toolbarElemId;
			var textElemId = editor.textElemId;
			var index = "";
			var that = this;
			// 创建上传对象
			this.http
				.ajax({
					url: "../../webSite/home/uploadApplication",
					method: "post",
					headers: {
						// "api-client": "f07684ed4d4411e9ac1ffa163e4d6ba1",
						// "api-version": "1.2.2"
					},
					data: {
						uid: this.personalInfo.uid
					}
				})
				.then(res => {
					this.QNtoken = res.data.upToken;
					var uploader = window.Qiniu.uploader({
						runtimes: "html5,flash,html4", //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function() {
							// 在需要获取uptoken时，该方法会被调用
							var uptoken = that.QNtoken;
							return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: "https://img.yiqilaiwang.com/",
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: "100mb", //最大文件体积限制
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
						chunk_size: "4mb", //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							UploadProgress: function(up, file) {
								// 显示进度条
								index = layer.load(0, { shade: false });
							},
							UploadComplete: function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							FileUploaded: function(up, file, info) {
								var domain = up.getOption("domain");
								var res = window.$.parseJSON(info);
								var sourceLink = domain + res.key; //获取上传成功后的文件的Url

								// 插入图片到editor
								editor.cmd.do(
									"insertHtml",
									'<img  src="' +
										sourceLink +
										"?imageView2/1/q/30/format/jpg/ignore-error/1" +
										'" style="max-width:100%;"/>'
								);
							},
							Error: function(up, err, errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601  && err.file.type.indexOf('video') ==-1){
                  layer.msg("请选择jpg，gif，png，bmp，jpeg格式的图片上传")
                }else if(err.code != -601){
                  layer.msg(errTip)
                }
							}
						}
					});
				});
		},
		// 获取七牛云token
		getToken(e) {
			var that = this;
			if (e.target.type == "file") {
				that.http
					.ajax({
						url: "../../webSite/home/uploadApplication",
						method: "post",
						headers: {
							// "api-client": "f07684ed4d4411e9ac1ffa163e4d6ba1",
							// "api-version": "1.2.2"
						},
						data: {
							uid: that.personalInfo.uid
						}
					})
					.then(res => {
						that.QNtoken = res.data.upToken;
					});
			}
		},
		uploadInitVideo(editor) {
			// 获取相关 DOM 节点的 ID
			var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[15];
			// var btnId = editor.imgMenuId;
			// console.log(editor.$toolbarElem[0],btnId)
			var containerId = editor.toolbarElemId;
			var textElemId = editor.textElemId;
			var that = this;
			var index = "";
			// 创建上传对象
			this.http
				.ajax({
					url: "../../webSite/home/uploadApplication",
					method: "post",
					headers: {
						// "api-client": "f07684ed4d4411e9ac1ffa163e4d6ba1",
						// "api-version": "1.2.2"
					},
					data: {
						uid: this.personalInfo.uid
					}
				})
				.then(res => {
					// console.log(res)
					this.QNtoken = res.data.upToken;
					var uploader = window.Qiniu.uploader({
						runtimes: "html5,flash,html4", //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function() {
							// 在需要获取uptoken时，该方法会被调用
							var uptoken = that.QNtoken;
							return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: "https://img.yiqilaiwang.com/",
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: "100mb", //最大文件体积限制
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
						chunk_size: "20mb", //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							UploadProgress: function(up, file) {
								// 显示进度条
								index = layer.load(0, { shade: false });
							},
							UploadComplete: function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							FileUploaded: function(up, file, info) {
								var domain = up.getOption("domain");
								var res = window.$.parseJSON(info);
								var sourceLink = domain + res.key; //获取上传成功后的文件的Url
								// 插入图片到editor
								editor.cmd.do(
									"insertHtml",
									"<video style='margin-top:5px;background:black' width='100%' height='214px' webkit-playsinline = 'true' playsinline = 'true' controls controlslist='nodownload' poster=" +
										sourceLink +
										"?vframe/jpg/offset/0/imageslim/imageView2/1/interlace/1/ignore-error/1 ><source src='" +
										sourceLink +
										"' type='video/mp4'></video>"
								);
							},
							Error: function(up, err, errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601 && err.file.type.indexOf('image') ==-1){
                  layer.msg("上传视频仅支持mp4格式")
                }else if(err.code != -601){
                  layer.msg(errTip)
                }
							}
						}
					});
				});
		},
		//获取领导班子
		getOrgStructureList() {
			// console.log("获取领导班子");
			this.http
				.ajax({
					url: "person/" + this.defOrg.digitalCommerce,
					method: "GET",
					headers: {
						"Content-Type": " application/json"
					},
					data: {
						entityId: this.defOrg.digitalCommerce
					}
				})
				.then(res => {
					// console.log(res);
					this.orgStructureListDtos = res;
				});
		},
		//获取领导班子
		getOrgStructureList1() {
			// console.log("获取领导班子");
			this.http
				.ajax({
					url: "info/" +  this.defOrg.digitalCommerce,
					method: "GET",
					headers: {
						"Content-Type": " application/json"
					},
					data: {
						entityId: this.defOrg.digitalCommerce
					}
				})
				.then(res => {
					// console.log(res);
					for (var int in res.properties) {
						if (res.properties[int].fieldName == "departments" && this.defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336") {
							this.orgStructureListDtos = res.properties[int].extras;
						}
					}
				});
		},
		getProperties(val) {
			// debugger
			// console.log("新5ea6a71ca5f08e7ae71fa336:",this.defOrg.digitalCommerce == "5ea6a71ca5f08e7ae71fa336",this.defOrg.digitalCommerce)
			this.http.ajax({
				url: "/info/" + this.defOrg.digitalCommerce,
				method: "GET",
				headers: {
					"Content-Type": " application/json"
				},
				data: {
					entityId: this.defOrg.digitalCommerce
				}
			})
			.then(res => {
				this.iswang = false;
				// console.log(res);
				for (var int in res.properties) {
					// console.log(int)
					if (res.properties[int].fieldName == "regulations" && this.defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336") {
						this.properties.regulations = res.properties[int];
						// if (this.menuactive == 2) {
						this.content1 = res.properties[int].fieldValue;
						// }
					} else if (res.properties[int].fieldName == "introduce" && this.defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336") {
						this.properties.introduce = res.properties[int];
						// if (this.menuactive == 1) {
						this.content = res.properties[int].fieldValue;
						// }
					}
					if (res.properties[int].fieldName == "intro" && this.defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336") {
						this.properties.regulations = res.properties[int];
						// if (this.menuactive == 2) {
						this.content = res.properties[int].fieldValue;
						// }
					} else if (res.properties[int].fieldName == "contactUs" && this.defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336") {
						this.properties.introduce = res.properties[int];
						// if (this.menuactive == 1) {
						this.content1 = res.properties[int].fieldValue;
						// }
					}
				}
				// debugger;
				this.$nextTick(()=>{
					if(!val){
						this.WangEditMethod(this.$refs.editor, 0);
						this.WangEditMethod1();
					}
				})
			});
		},
		//保存
		tolayer(e) {
			if (e == 1) {
				if(this.defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"){
					var data = {
						fieldLabel: "本委介绍",
						fieldName: "intro",
						fieldValue: this.content,
						inx: 0,
						entityId: this.defOrg.digitalCommerce
					}
				}else{
					var data = {
						fieldLabel: "本会介绍",
						fieldName: "introduce",
						fieldValue: this.content,
						inx: 1,
						entityId: this.defOrg.digitalCommerce
					}
				}
				this.http
					.ajax({
						url: "info/" + this.defOrg.digitalCommerce,
						method: "POST",
						headers: {
							"Content-Type": " application/json"
						},
						data: data
					})
					.then(res => {
						layer.msg('保存成功');
						// console.log(res);
						for (var int in res.data.properties) {
							if(this.defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336"){
								if (res.data.properties[int].fieldName == "regulations") {
									this.properties.regulations = res.data.properties[int];
									// if (this.menuactive == 2) {
									this.content = res.data.properties[int].fieldValue;
									// }
								}
								if (res.data.properties[int].fieldName == "introduce") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
							}else{
								if (res.data.properties[int].fieldName == "intro") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
								if (res.data.properties[int].fieldName == "contactUs") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
							}
						}
					});
			} else if (e == 2) {
					// layer.msg('保存成功');
				if(this.defOrg.digitalCommerce=="5ea6a71ca5f08e7ae71fa336"){
					var data = {
						fieldLabel: "联系我们",
						fieldName: "contactUs",
						fieldValue: this.content1,
						inx: 2,
						entityId: this.defOrg.digitalCommerce
					}
				}else{
					var data = {
						fieldLabel: "本会章程",
						fieldName: "regulations",
						fieldValue: this.content1,
						inx: 3,
						entityId: this.defOrg.digitalCommerces
					}
				}
				this.http
					.ajax({
						url: "info/" + this.defOrg.digitalCommerce,
						method: "POST",
						headers: {
							"Content-Type": " application/json"
						},
						data: data
					})
					.then(res => {
						layer.msg('保存成功');
						// console.log(res);
						for (var int in res.data.properties) {
							if(this.defOrg.digitalCommerce!="5ea6a71ca5f08e7ae71fa336"){
								if (res.data.properties[int].fieldName == "regulations") {
									this.properties.regulations = res.data.properties[int];
									// if (this.menuactive == 2) {
									this.content = res.data.properties[int].fieldValue;
									// }
								}
								if (res.data.properties[int].fieldName == "introduce") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
							}else{
								if (res.data.properties[int].fieldName == "intro") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
								if (res.data.properties[int].fieldName == "contactUs") {
									this.properties.introduce = res.data.properties[int];
									// if (this.menuactive == 1) {
									this.content1 = res.data.properties[int].fieldValue;
									// }
								}
							}
						}
					});
			}else{
				this.layer = e
			}
		},
		// 刷新页面
		flash() {
			if(this.synopsis==0){
				this.getOrgStructureList();
			}else{
				this.getOrgStructureList1();
			}
		},
		dellayer(e,index) {
			this.layer = 9;
			this.delPartMgs = e;
			this.index = index?index:0;
		},
		// 删除
		del(value) {
			this.http
				.ajax({
					url: "person/" + value.id,
					method: "DELETE",
					headers: {
						"Content-Type": " application/json"
					}
				})
				.then(res => {
					// console.log(res)
					if(res.code ==1){
						layer.msg("删除成功");
						this.layer = 0;
						this.flash();
					}
				});
		},
		tomenu(n) {
			this.menuactive = n;
		},
		//切换synopsis
		synopsisbtn(n,val,status) {
			this.synopsis = n;
			if(val){
				// this.preItem = val;
				this.pre = val;
				this.edit = true;
				this.index = status;
				if(n == 2 && this.pre.position.length){
					var position = "";
					for(var item of this.pre.position){
						position += item + " ";
					}
					this.pre.position1 = position;
				}
				// this.pre.name = val.name;
			}else{
				this.edit = false;
				this.pre = {
					name:"",
					telephone:"",
					complaints:"",
					fax:"",
					officeHour:"",
					address:"",
					website:"",
					email:"",
					function:"",
					position:'',
					position1:"",
					achievement:""
				}
			}
			// 部门设置中区分查看与编辑
			if(status == 'isCheck'){
				this.isCheck = true;
			}else{
				this.isCheck = false;
			}
		},
		test(index,val) {
			this.sortsetObj.id = val.id
			this.sortsetObj.name = val.name
			this.sortsetObj.index = index +1
			this.layer = 1
		},
		save() {
			// this.allusers.rows[e].makesort = false
			if (/^[1-9]\d*$|^$/.test(this.newsort)) {
				if (this.newsort > 99999) {
					layer.msg("输入数字不能超过5位")
					return
				}
				this.setSort(this.sortsetObj.id, this.newsort)
				return
			}
			layer.msg("请输入大于0的数字")
		},
		// 单独排序--序号修改
		setSort(id, newSort) {
			if (newSort == "") {
				layer.msg("序号不能为空")
				return
			}
			this.http.ajax({
				url: '/person',
				method: 'put',
				headers: {
					'Content-Type': ' application/json'
				},
				data: {
					// "orgId": this.orgId,
					"id": id,
					"inx": newSort,
				}

			}).then(res => {
				// console.log(res)
				if(res.code ==1){
					layer.msg("修改成功")
					this.layer = 0
					this.newsort = null
					this.flash()
				}
			})
		},
		getOfficeTime(val){
			this.pre.officeHour = val;
		},
		savePre(del){
			if(del)	{
				delete this.pre.position1
				this.orgStructureListDtos.splice(this.index, 1)
				var data = {
					fieldLabel: "部门设置",
					fieldName: "departments",
					inx: 4,
					extras:this.orgStructureListDtos
				}
				var method = "post";
				var url = '/info/' + this.defOrg.digitalCommerce
			}else if(this.edit && this.synopsis ==3){
				if(!this.pre.name.trim()){
					layer.msg("请填写机构名称");
					return
				}
				delete this.pre.position1
				this.orgStructureListDtos[this.index] = this.pre;
				var data = {
					fieldLabel: "部门设置",
					fieldName: "departments",
					inx: 4,
					extras:this.orgStructureListDtos
				}
				var method = "post";
				var url = `${this.synopsis ==3?'/info/':'/person/'}` + this.defOrg.digitalCommerce
			}else if(!this.edit && this.synopsis ==3){
				if(!this.pre.name.trim()){
					layer.msg("请填写机构名称");
					return
				}
				delete this.pre.position1
				this.orgStructureListDtos.push(this.pre)
				var data = {
					fieldLabel: "部门设置",
					fieldName: "departments",
					inx: 4,
					personInfo: this.defOrg.digitalCommerce,
					extras:this.orgStructureListDtos
				}
				var method = "post";
				var url = `${this.synopsis ==3?'/info/':'/person/'}` + this.defOrg.digitalCommerce
			}else if(!this.edit && this.synopsis ==2){
				// var data = this.orgStructureListDtos.push({
				var data = {
					achievement: this.pre.achievement,
					name: this.pre.name,
					position: [this.pre.position1],
					entityId: this.defOrg.digitalCommerce,
				}
				var method = "post";
				var url = '/person'
			}else if(this.edit && this.synopsis ==2){
				delete this.pre.position1
				delete this.pre.birthdayStr
				var data = this.pre;
				var method = "put";
				var url = '/person'
			}
			this.http.ajax({
				url: url,
				method: method,
				headers: {
					"Content-Type": " application/json"
				},
				data: data
			})
			.then(res => {
				if(del)	{
					this.layer = 0;
					layer.msg("删除成功");
				}else if(this.synopsis ==3){
					layer.msg("保存成功")
					this.synopsis =1
				}else if(this.synopsis ==2){
					layer.msg("保存成功")
					this.synopsis =0
				}
			});
		},
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
	}
};
</script>

<style lang="less">
// .ivu-poptip-popper{
// 	top:130px !important;
// }
.ivu-poptip-rel {
	height: 38px;
}
.staffeit .mc .ivu-select-dropdown {
	will-change: unset !important;
}
.right .ivu-select-placeholder {
	text-align: right;
}

.sortnum {
	display: inline-block;
	width: 100%;
	// height: 40px;
	line-height: 1.5;
	padding: 4px 7px;
	font-size: 14px;
	border: 1px solid #c7c7c7;
	border-radius: 2px;
	color: #515a6e;
	background-color: #fff;
	background-image: none;
	position: relative;
	cursor: text;
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
		padding-top: 37px;
		margin-bottom: 21px;

		.btn1 {
			border: 1px solid #999999;
		}

		.btn2 {
			border: 1px solid #2168eb;
			background: #2168eb;
			color: #ffffff;
		}

		.btn1,
		.btn2 {
			cursor: pointer;
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
		font-family: "PingFangSC-Regular,PingFang SC";

		// float:left;
		// width:75%;
		.text-label {
			width: 100px;
			display: flex;
			line-height: 40px;

			p {
				color: #dc1a00;
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

		.ivu-select-dropdown {
			max-height: 164px;
			will-change: auto;
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

	.mt {
		font-size: 16px;
		font-weight: bold;
		line-height: 16px;
		margin-top: 15px;
		margin-left: 15px;
		margin-bottom: 5px;

		p {
			color: red;
			display: contents;
		}
		.mt-left {
			margin-right: 182px;
		}
		.ivu-switch-small {
			width: 32px;
		}
		.ivu-switch-small.ivu-switch-checked:after {
			left: 16px;
		}
	}

	.mc-phone {
		margin: 0 16px 7px;
		.text {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(136, 136, 136, 1);
			line-height: 17px;
		}
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
	.layer-top {
		margin: 13px 16px;
		width: 294px;
		height: 38px;
		background: rgba(250, 250, 250, 1);
		padding-left: 15px;
		line-height: 38px;
	}
	.layer-cont {
		margin: 0 17px 14px;
		.layer-cont-l {
			width: 68px;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 32px;
		}
		.layer-cont-r {
			width: 222px;
			min-height: 32px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 7px 11px;
			text-align: right;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 17px;
		}
		.height {
			line-height: 16px;
		}
	}
	.new {
		padding-top: 14px;
		margin-bottom: 27px;
		.btn2 {
			width: 104px;
			height: 28px;
			background: rgba(33, 104, 235, 1);
			border-radius: 14px;
		}
	}
}

.staff {
	margin-top: 69px;
	margin-bottom: 63px;

	.warp {
		.rightcont {
			width: 815px;
			float: right;
			padding-left: 40px;
			padding-right: 46px;
			padding-top: 10px;
			position: relative;
			min-height: 660px;
			.line{
				width:100%;
				height:1px;
				border-bottom:1px dotted #DDDDDD;
				margin-bottom:32px;
			}
			.sort-num{
				width:32px;
				height:28px;
				border-radius:4px;
				border:1px solid #cccccc;
				text-align: center;
				line-height: 28px;
			}
			.share_tips {
				position: absolute;
				width: 160px;
				right: 71px;
				top: 110px;

				.t {
					font-size: 14px;
					margin-bottom: 26px;
				}

				.btn {
					cursor: pointer;
				}
			}
			.btn{
				padding:5px 89px;
				height:auto;
				font-size:14px;
			}
			.share_t2 {
				font-size: 14px;
				color: #999999;
				border-bottom: 1px solid #eee;
				padding-bottom: 19px;
				line-height: 14px;
			}
			.tit {
				height: 40px;
				line-height: 40px;
				font-size: 16px;
				font-weight: 500;
				color: #333333;
				margin-bottom: 24px;
			}
			.btnD {
				height: 22px;
				background: rgba(255, 255, 255, 1);
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);
				color: #333333;
				padding: 0px 15px;
				text-align: center;
				line-height: 22px;
				display: inline-block;
				font-size: 12px;
				margin-right: 5px;
			}
			.addbtn {
				height: 22px;
				border-radius: 14px;
				line-height: 22px;
				background: #2168eb;
				display: inline-block;
				text-align: center;
				-webkit-border-radius: 22px;
				-moz-border-radius: 22px;
				color: #ffffff;
				font-size: 12px;
				padding: 0 16px;
				cursor: pointer;
			}
			.table {
				.link {
					cursor: pointer;
					color: #2168eb;
					margin: 0 7px;
					font-size: 10px;
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
					font-size: 11px;
					margin: 0px 10px;
					position: relative;
					display: inline-block;
					height: 100%;
					cursor: pointer;
					color: #2168eb;
				}

				.ivu-input-wrapper {
					width: 100%;

					input {
						border: none;
					}
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
					// padding-right: 20px;
					text-align: left;
					font-family: "PingFangSC-Regular,PingFang SC";

					.item {
						text-align: left;
						height: auto;
						// line-height: 60px;
						display: inline-block;
						min-width: 60px;
						-webkit-box-sizing: border-box;
						-moz-box-sizing: border-box;
						box-sizing: border-box;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin:auto 0;
					}
				}

				.mt {
					background: #f8f8f8;

					.item {
						height: 40px;
						line-height: 40px;
					}
				}
			}
			.line{
				border-bottom: 1px dashed #dddddd;
    			margin-bottom: 17px;
			}
			.count-box {
				position: relative;
				.count {
					position: absolute;
					right: 280px;
					bottom: 0;
					font-size: 12px;
					color: #999999;
			}
			}
		}

		.leftcont {
			float: left;
			width: 265px;
			border-right: 1px solid #eee;
			padding: 35px 0;

			.search {
				width: 168px;
				display: block;
				margin: 0 auto;

				img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}

			.menu {
				width: 168px;
				display: block;
				margin: 0 auto;

				.item {
					cursor: pointer;
					height: 59px;
					line-height: 59px;
					border-bottom: 1px solid #eee;
				}

				.active {
					color: #2168eb;
					font-weight: 500;
				}

				.child {
					span {
						line-height: 40px;
						padding-left: 15px;
						cursor: pointer;
					}
				}

				.n {
					background: url("../assets/img/zk2@2x.png") no-repeat right center;
				}

				.n.active {
					color: #515a6e;
					background: url("../assets/img/zk3@2x.png") no-repeat right center;
				}
			}
		}
	}
}
.editorHint {
	font-size: 12px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(33, 104, 235, 1);
	line-height: 17px;
	min-width: 400px;
	margin-top: 9px;
}
.ivu-form .ivu-form-item-label {
	text-align: left;
}

.staff .warp .rightcont .table .mc .item .link {
	display: none;
}

.staff .warp .rightcont .table .mc:hover .item .link {
	display: inline-block !important;
}
</style>

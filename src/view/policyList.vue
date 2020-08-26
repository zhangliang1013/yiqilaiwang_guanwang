<template>
	<div>
		<div class="w">
			<div class="position">政府政策
				<span @click="$router.back(-1)" v-if="messageType!=1">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 30px">
			<div class="activitylist">
				<div v-if="messageType == 1 && defOrg&&defOrg.isOrg == 1 || defOrg&&defOrg.isOrg == 5">
					<div class="title">
						中介招商专区
					</div>
					<ul class="nav clear">
						<!-- <router-link to="/policyDetail?id=5e96b1d5f594a3140f98af53&&page=1" class="nav-item">
							<img src="./../assets/img/glgj18.1@3x.png" alt="">
							<p>查看政策</p>
						</router-link> -->
						<li class="nav-item" @click="tomenu(2)" style="cursor:pointer">
							<img src="./../assets/img/glgj18.2@3x.png" alt="">
							<p>线上备案</p>
						</li>
						<li class="nav-item" @click="tomenu(3)" style="cursor:pointer">
							<img src="./../assets/img/glgj18.3@3x.png" alt="">
							<p>资金申请</p>
						</li>
						<li class="nav-item" @click="tomenu(4)" style="cursor:pointer">
							<img src="./../assets/img/glgj18.4@3x.png" alt="">
							<p>查询记录</p>
						</li>
						<!-- <router-link to="/policyList" class="nav-item">
							<img src="./../assets/img/glgj18.3@3x.png" alt="">
							<p></p>
						</router-link> -->
						<!-- <router-link to="/policyList" class="nav-item">
							<img src="./../assets/img/glgj18.4@3x.png" alt="">
							<p>查询记录</p>
						</router-link> -->
					</ul>
				</div>
				<div class="title" v-if="messageType != 4">
					<div v-if="messageType == 2" class="add" style="cursor:pointer" @click="tolayer(1,1)">{{messageType == 2? '新增预备案':''}}</div>
					{{messageType == 1?'政策列表':messageType == 2?'已通过的预备案':messageType == 3?'已通过的正式备案':''}}
				</div>
				<div class="table">
					<div class="mt">
						<div class="item" :style="{'width':(messageType == 1? '399':messageType == 4?'415':'415') + 'px'}">
							{{messageType == 1?'主题':'项目名称'}}
						</div>
						<div class="item" v-if="messageType == 1" :style="{'width':(messageType == 1? '209':'155') + 'px'}">
							发布部门
						</div>
						<div class="item" :style="{'width':(messageType == 1? '175':messageType == 4?'150':'150') + 'px'}"> 
							{{messageType == 1?'发布时间':'提交时间'}}
						</div>
						<div class="item" v-if="messageType != 1" :style="{'width':(messageType == 1? '0':messageType == 4?'199':'205') + 'px'}">
							{{messageType == 1?'':messageType != 4?'审核时间':'当前状态'}}
						</div>
						<div class="item" :style="{'min-width':(messageType == 1? '40':messageType == 4?'60':'60') + 'px'}">
							操作
						</div>
					</div>
					<!-- 政策 -->
					<div class="mc" v-if="!list.data.length">
						<div class="item" style="text-align: center; width:800px">暂无数据</div>
					</div>
					<div v-if="list.data.length">
						<div class="mc"  v-for="(item,index) in list.data" :key="index" @click="check(item)">
							<div class="item" style="padding-right:40px" :style="{'width':(messageType == 1? '399':messageType == 4?'415':'415') + 'px'}">
								<!-- <span style="color:#F81414">【精准匹配】</span> -->
								{{item.title}}
							</div>
							<div class="item" style="width:206px" v-if="messageType == 1">
								{{item.entity.name}}
							</div>
							<div class="item" :style="{'width':(messageType == 1?'175':messageType == 4? '155':'155') + 'px'}">
								{{messageType == 1?(item.createdDate? new Date(item.createdDate).Format("yyyy-MM-dd hh:mm"):''):(item.event&&item.event.createdDate? new Date(item.event.createdDate).Format("yyyy-MM-dd hh:mm"):'')}}
							</div>
							<div class="item" style="width: 150px;" v-if="messageType != 1" :style="{'width':(messageType == 1? '0':messageType == 4?'171':'165') + 'px'}">
								{{messageType == 1?'':messageType == 4?item.result:item.createdDate? new Date(item.createdDate).Format("yyyy-MM-dd hh:mm"):''}}
							</div>
							<div 
								class="item hand" 
								:style="{
									'min-width':(messageType == 1? '34':messageType == 4?'100':'120') + 'px',
									'text-align':messageType == 2&& item.reply ==6 ||
												 messageType == 3&& item.reply ==4 || 
												 messageType == 4&&(item.reply ==7 || item.reply ==5 || item.reply ==3)&&item.isPass == -1?
												 'left':'center'}"
							>
								<span @click.stop="check(item)" :class="messageType == 1 ? 'link1':''" class="link" style="height: 100%;display: inline-block;">查看</span>
								<span class="link" v-if="messageType == 3&& item.reply ==4 || messageType == 2&& item.reply ==6 || messageType == 4&&(item.reply ==7 || item.reply ==5 || item.reply ==3)&&item.isPass == -1" @click.stop="tolayer(2,2,item)" style="height: 100%;display: inline-block;">{{messageType == 2?'转正式备案':messageType == 3?'资金申请':'重新申请'}}</span>
							</div>
						</div>
					</div>
					<Page 
						v-if="list.data.length" 
						:current.sync="page" 
						style="text-align: right;margin-top: 20px;" 
						:total="list.totalElements" 
						@on-change="orgActivityList"
					 	show-elevator 
						:page-size="10" 
						:show-total="true" 
					/>
				</div>
			</div>
		</div>
		<!-- 新增 -->
		<div class="layer staffeit-p" v-if="layer==1">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title-layer">新增预备案</div>
				<div class="tips" style="margin: 0 auto;">
					<div class="upload clear" style="padding:24px 16px 16px">
						<div class="fl left">下载预申报表</div>
						<div class="fr btn2 btn3"><a :href="formUrl1" download="" title="下载" mce_href="#">下载</a></div>
					</div>
					<div class="line"></div>
					<div class="upload" style="padding:0 16px">
						<div class="clear" style="padding:16px 0 12px">
							<div class="fl left">上传填写完成的预申报表</div>
							<!-- <div class="fr btn2 btn3" style="margin-top:3px">上传</div> -->
							<!-- <input type="file" id="file" ref="evfile" @change="changes" style="display: none"> -->
							<Upload
								@success="upcoverUrl"
								@error="error"
								:beforeUpload="beforeAvatarUpload"
								:personalInfo="personalInfo"
								:mimeType="mimeType"
								class="fr btn2 btn3"
								v-if="attachments.length<5"
								type='file'
								>
								<div class="hand clear">
									<p class="fl" title="上传">上传</p>
								</div>
							</Upload>
							<!-- <a href="javascript:void(0);" class="fr btn2 btn3" style="margin-top:3px;display:inline-block" @click="zh_uploadFile()">上传</a> -->
						</div>
						<div v-if="attachments.length">
							<div class="file clear" v-for="(item,index) in attachments" :key="index">
								<div class="title fl">{{item.name}}</div>
								<div class="fr" style="padding: 0 4px;" @click="removeArray(attachments,item)">
									<img src="./../assets/img/gwhyzjsc@3x.png" alt=""  >
								</div>
							</div>
						</div>
					</div>
					<div class="left" style="padding:15px 16px 10px">项目名称<span style="font-size:14px;color:#999999"> ({{projectName.length}}/40)</span></div>
					<div class="input" style="padding:0 16px;">
						<Input v-model="projectName" placeholder="请输入项目名称" maxlength="40"/>
					</div>
				</div>
				<div class="btns">
					<div class="btn2" @click="tolayer1(1)">提交</div>
				</div>
			</div>
		</div>
		<!-- 转正式 -->
		<div class="layer staffeit-p" v-if="layer==2">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title-layer">{{messageType == 2?'转正式备案':messageType == 3?'资金申请':'重新申请'}}</div>
				<div class="tips" style="margin: 0 auto;">
					<div class="upload clear" style="padding:24px 16px 16px">
						<div class="fl left">下载{{messageType == 2?'正式':'资金'}}申报表</div>
						<div class="fr btn2 btn3"><a :href="formUrl2" download="" title="下载" mce_href="#">下载</a></div>
					</div>
					<div class="line"></div>
					<div class="upload" style="padding:0 16px">
						<div class="clear" style="padding:16px 0 12px">
							<div class="fl left">上传填写完成的{{messageType == 2?'正式':'资金'}}申报表</div>
							<!-- <div class="fr btn2 btn3" style="margin-top:3px" @click="zh_uploadFile()">上传</div> -->
							<!-- <input type="file" id="file" ref="evfile" @change="changes" style="display: none"> -->
							<Upload
								@success="upcoverUrl"
								@error="error"
								:beforeUpload="beforeAvatarUpload"
								:personalInfo="personalInfo"
								:mimeType="mimeType"
								class="fr btn2 btn3"
								v-if="attachments.length<5"
								type='file'
								>
								<div class="hand clear">
									<p class="fl" title="上传">上传</p>
								</div>
							</Upload>
							<!-- <a href="javascript:void(0);" class="fr btn2 btn3" style="margin-top:3px;display:inline-block" @click="zh_uploadFile()">上传</a> -->
						</div>
						<div v-if="attachments.length">
							<div class="file clear" v-for="(item,index) in attachments" :key="index">
								<div class="title fl">{{item.name}}</div>
								<div class="fr" style="padding: 0 4px;cursor:pointer" @click="removeArray(attachments,item)">
									<img src="./../assets/img/gwhyzjsc@3x.png" alt=""  >
								</div>
							</div>
						</div>
						<!-- <p class="file" v-if="fileName">{{fileName}}</p> -->
					</div>
					<!-- <div class="left" style="padding:15px 16px 10px">项目名称</div>
					<div class="input" style="padding:0 16px;">
						<Input v-model="projectName" placeholder="请输入项目名称"/>
					</div> -->
				</div>
				<div class="btns">
					<div class="btn2" @click="tolayer1(2)">提交</div>
				</div>
			</div>
		</div>
		<!-- 资金查询 -->
		<div class="layer staffeit-p" v-if="layer==3">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content" style="width:548px">
				<div class="title-layer">资金申请</div>
				<div class="tips" style="margin: 0 auto;">
					<div class="upload clear" style="padding:16px 16px 12px">
						<!-- <div class="fl left">下载{{messageType == 2?'正式':'资金'}}申报表</div>
						<div class="fr btn2 btn3"><a :href="formUrl2" download="" title="下载" mce_href="#">下载</a></div> -->
						<p class="p1 p clear"><span class="sort fl">1</span><span class="fl">&nbsp;请准备以下材料</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">1.&nbsp;</span><span class="fl con">企业（项目）基本情况（企业简介含投资规模、投资方简介，企业基本情况，主营业务情况等内容），加盖企业公章；</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">2.&nbsp;</span><span class="fl con">投资方身份证明（复印件加盖企业公章）；</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">3.&nbsp;</span><span class="fl con">发改部门出具的项目立项批复、备案证明、核准文件等（无需立项项目不需要提供）；</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">4.&nbsp;</span><span class="fl con">正式投资协议、合同等（注册资本达到1亿元的项目可提供公司章程，未达到1亿元的项目需提供投资额达到1亿元的正式投资协议、合同等）；</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">5.&nbsp;</span><span class="fl con">开工（开业）证明（三张形像照片）；</span></p>
						<p class="p1 clear"><span style="color:#2168EB" class="fl">6.&nbsp;</span><span class="fl con">资金到位金额证明（加盖企业公章）；</span></p>
					</div>
					<div class="line"></div>
					<div class="upload" style="padding:0 16px">
						<div class="clear" style="padding:16px 0">
							<p class="p1 p clear fl left" style="margin:0"><span class="sort fl">2</span><span class="fl">&nbsp;上传填写完成的申请材料</span></p>
							<!-- <div class="fl left"></div> -->
							<!-- <div class="fr btn2 btn3" style="margin-top:3px" @click="zh_uploadFile()">上传</div> -->
							<!-- <input type="file" id="file" ref="evfile" @change="changes" style="display: none"> -->
							<Upload
								@success="upcoverUrl"
								@error="error"
								:beforeUpload="beforeAvatarUpload"
								:personalInfo="personalInfo"
								:mimeType="mimeType"
								class="fr btn2 btn3"
								v-if="attachments.length<5"
								type='file'
								>
								<div class="hand clear">
									<p class="fl" title="上传">上传</p>
								</div>
							</Upload>
							<!-- <a href="javascript:void(0);" class="fr btn2 btn3" style="margin-top:3px;display:inline-block" @click="zh_uploadFile()">上传</a> -->
						</div>
						<div v-if="attachments.length">
							<div class="file clear" v-for="(item,index) in attachments" :key="index">
								<div class="title fl">{{item.name}}</div>
								<div class="fr" style="padding: 0 14px 0 4px;cursor:pointer" @click="removeArray(attachments,item)">
									<img src="./../assets/img/gwhyzjsc@3x.png" alt=""  >
								</div>
							</div>
						</div>
						<!-- <p class="file" v-if="fileName">{{fileName}}</p> -->
					</div>
					<div class="upload clear" style="padding:14px 0;border-bottom:1px solid #EEEEEE;margin:0 16px">
						<p class="p1 p fl"><span>项目类型</span></p>
						<div class="p1 fr">
							<span :class="{'active':choose==1}" class="item" @click="toChoose(1)">内资项目</span>
							<span :class="{'active':choose==2}" class="item" @click="toChoose(2)">外资项目</span>
							<span :class="{'active':choose==3}" class="item" @click="toChoose(3)">税源项目</span>
						</div>
					</div>
					<!-- <div class="left" style="padding:15px 16px 10px">项目名称</div>
					<div class="input" style="padding:0 16px;">
						<Input v-model="projectName" placeholder="请输入项目名称"/>
					</div> -->
				</div>
				<div class="btns">
					<div class="btn2" @click="tolayer1(3)">提交</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'policyList',
		props: {
			defOrg: null,
			personalInfo: null
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.id;
					this.isOrg = res.isOrg;
					this.orgActivityList(this.page);
				}
			},
			$route(to, form) {
				this.messageType = to.query.messageType;
				this.orgActivityList(this.page);
			},
			change(val,oldval){
				// console.log(val,oldval)
				this.fileName = "";
				this.attachments = [];
				this.projectName = "";
			}
		},
		data() {
			return {
				isOrg: 0,
				list: {
					data:[],
				},
				orgId: null,
				page: 1,
				messageType:1,
				layer:0,
				change:"",
				projectName:"",
				orgId: null,
				mimeType: [
					"image/png",
					"image/jpeg",
					"image/gif",
					"image/jpg",
					"doc",
					"txt",
					"docx",
					"pdf",
					"wps",
					"xls",
					"ppt",
					"xlsx",
					"pptx",
					"zip"
				],
				attachments: [],
				fileName:"",
				formUrl1:"",//预申报表
				formUrl2:"",//正式备案表
				preItem:"",
				choose:0,
			}
		},
		created() {
			// console.log("刷新")
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				// console.log('this.$route.query.page',this.$route.query.page)
				if (this.$route.query.page) {
					
					this.page = Number(this.$route.query.page)
				}
			}
			this.messageType = this.$route.query.messageType;	
			this.orgActivityList(this.page);
			this.getForm();
		},
		methods: {
			toChoose(n){
				this.choose = n;
			},
			//移除数组
			removeArray(_arr, _obj) {
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i] == _obj) {
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
			// 附件上传
			upcoverUrl(e) {
				// console.log(e);
				// this.fileName = e.name;
				if (e.type.indexOf("image") == -1) {
					// this.fileCollection_old.push(e.url)
					this.attachments.push({
						url: e.url,
						name: e.name,
						size: parseFloat(e.size / 1024).toFixed(1),
						inx: this.attachments.length +1,
						type: 2
					});
				} else {
					this.attachments.push({
						url: e.url,
						name: e.name,
						size:parseFloat(e.size / 1024).toFixed(1),
						inx:this.attachments.length+1,
						type: 1
					});
				}
			},
			error(res) {
				// console.log(res);
				layer.msg("文件类型不正确,请重新上传");
				// console.log(res);
			},
			beforeAvatarUpload(file) {
				const isLt20M = file.size / 1024 / 1024 < 0.1;
				if (!isLt20M) {
					this.$message.error("上传图片的大小不能超过 20M!");
				}
				return isLt20M;
			},

			// 弹窗弹出
			tolayer(n,val,item) {
				// if(n==2 || n==3){
				// 	this.preItem = item;
				// }
				// if(this.messageType == 3&&n!=0){
				// 	this.layer = 3;
				// }else{
				// 	this.layer = n;
				// 	this.change = val?val:this.change;
				// }
				// if(n == 2|| n==3){
				// 	// this.fileName = "";
				// 	this.attachments = [];
				// 	this.projectName = "";
				// 	this.choose = 0;
				// }



				if(n !=0 && item){
					// this.layer = 3;
					if(item.reply ==7 || item.reply ==6 || item.reply ==5){
						this.layer = 2;
					}else if(item.reply ==4 || item.reply ==3){
						this.layer = 3;
					}
					this.change = val?val:this.change;
					this.attachments = [];
					this.projectName = "";
					this.choose = 0;
					this.preItem = item;
				}else{
					this.layer = n
				}
			},
			tolayer1(n){
				// 1:新增；2：转正式
				if(n != 3 &&!this.attachments.length){
					layer.msg(`请上传填写完成的${n==1?'预':'正式'}申报表`)
					return
				}
				if(n == 3 &&!this.attachments.length){
					layer.msg(`请上传填写完成的申请材料`)
					return
				}
				if(n == 1 && !this.projectName){
					layer.msg(`请输入项目名称`)
					return
				}
				if(n == 3 && !this.choose){
					layer.msg(`请选择项目类型`)
					return
				}
				var isRenew = "";
				if(this.preItem&&(this.preItem.reply ==7 || this.preItem.reply ==5 || this.preItem.reply ==3)&&this.preItem.isPass == -1){
					isRenew = 1
				}
				var data = {
						orgId: this.orgId,
						title:n==1? this.projectName:'',
						attachments:this.attachments,
						projectType:this.messageType == 3?this.choose:0,
						isFirst:n==1? 1:0,
						eventId:n==1? '':this.preItem.id,
						isRenew:isRenew
					}
					// console.log(data)
				// return
				this.http.ajax({
					url: 'webSite/businessGov/commitReply',
					method: 'post',
					headers: {
						"Content-Type": "application/json"
					},
					data: {
						orgId: this.orgId,
						title:n==1? this.projectName:'',
						attachments:this.attachments,
						projectType:this.messageType == 3?this.choose:0,
						isFirst:n==1? 1:0,
						eventId:n==1? '':this.preItem.id,
						isRenew:isRenew
					}

				}).then(res => {
					// console.log(res)
					if(res.code == 200){
						this.layer = 0;
						// this.fileName = "";
						this.attachments = [];
						this.projectName = "";
						this.choose = "";
						layer.msg("提交成功");
						// if(n== 2){
							this.orgActivityList(this.page);
						// }
					}
				})

			},
			getForm(){
				this.http.ajax({
					url: 'webSite/businessGov/readDigitalJson',
					method: 'post',
					headers: {
						// "Content-Type": "multipart/form-data"
						"content-type": "application/json;charset=UTF-8"
					},
					data:{}
				}).then(res => {
					// console.log(res)
					if(res.code == 200){
						this.formUrl1 = res.data.tableProjectImport;//预申报表
						this.formUrl2 = res.data.tableInter;//正式备案表
					}
				})
			},
			// 列表
			orgActivityList(page) {
				if(!this.orgId){
					return
				}
				if(this.messageType == 1){
				// if(1){
					var url = "webSite/businessGov/searchBusinessActivity";
					var data= {
						"orgId": this.orgId,
						"pageNumber": page,
						"pageSize": 10,
						"type":1600,
					}
				}else if(this.messageType != 4){
					var url = "webSite/businessGov/listBusinessReply";
					var data= {
						"orgId": this.orgId,
						"pageNumber": page,
						"pageSize": 10,
						reply:this.messageType == 2?'6':this.messageType == 3?'4':'1',
						isPass:this.messageType == 2?'1':this.messageType == 3?'1':'1',
						status:this.messageType == 2?'-1':this.messageType == 3?'-1':'0',
					}
				}else{
					var url = "webSite/businessGov/searchAllByEntity";
					var data= {
						"orgId": this.orgId,
						"pageNumber": page,
						"pageSize": 10,
					}
				}
				this.http.ajax({
					url: url,
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: data
				}).then(res => {
					if (res.code == 200) {
						this.list = res.data;
						// this.list.data = JSON.parse(res.data.data)
						if(this.messageType ==4 && res.data.data.length){
							for(var item of res.data.data){
								var result = "";
								var color = "";
								switch (item.reply) {
									case 7:
									{
										if (item.isPass == -1) {
											result = "预备案被退回";
											color= "F81414";
										}else {
											result = "预备案待审核";
											color= "2168EB";
										}
									}
										break;
									case 6:
									{
										result = "预备案已通过审核";
										color= "30AE61";
										// [self.chageButton setTitle:@"转正式备案" forState:UIControlStateNormal];
									}
										break;
									case 5:
									{
										if (item.isPass == -1) {
											result = "正式备案被退回";
											color= "F81414";
										}else {
											result = "正式备案待审核";
											color= "2168EB";
										}
									}
										break;
									case 4:
									{
										result = "正式备案已通过审核";
										color= "30AE61";
										// [self.chageButton setTitle:@"申请资金" forState:UIControlStateNormal];
									}
										break;
									case 3:
									{
										if (item.isPass == -1) {
											result = "资金申请被退回";
											color= "F81414";
										}else {
											result = "资金申请待审核";
											color= "2168EB";
										}
									}
										break;
									case 2:
									{
										result = "资金申请已通过";
										color= "30AE61";
									}
										break;
									case 1:
									{
										result = "资金已拨付";
										color= "#30AE61";
									}
									break;
									case 0:
									{
										result = "已结束";
										color= "#30AE61";
									}
									break;
									default:
									break;
								}
								item.result = result;
								item.color = color;
							}
						}
					}
				})
			},
			tomenu(val){
				this.$router.push('/policyList?messageType=' + val);
				// 获取数据
			},
			check(row) {
				if(this.messageType == 1){
					var url="/policyDetail";
				}else{
					var url="/submitDetails";
				}
				this.$router.push({
					path:url,
					query: {
						'id': row.id,
						'page':this.page,
						'messageType':this.messageType,
					}
				});
            },
		}
	}
</script>

<style lang="less">
	.activitylist {
        padding:36px 90px;
		.nav{
			margin: auto;
			text-align: center;
			width: 624px;
			.nav-item{
				// margin:-2px 50px 35px;
				margin:-2px 69px 35px;
				list-style: none;
				display: inline-block;
				float:left;
				img{
					width:50px;
					height:50px;
					text-align:center;
					margin-bottom:8px;
				}
				p{
					font-size:14px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:20px;
					text-align:center;
				}
			}
		}
		// .table .hand:hover .link{
		// 	display: inline-block;
		// }
		.table {
			font-size: 0;

			.link {
				color: #2168eb;
				font-size: 14px;
				margin:0;
				// display: none;
			}
			.link:nth-child(1){
				margin-right:22px;
			}
			.link.link1{
				margin-right:0;
			}
			.mt {
				height: 50px;
				line-height: 50px;
				background: #f8f8f8;
				font-size: 16px;
			}

			.mc {
				font-size: 14px;
				height: 70px;
				line-height: 70px;
				border-bottom: 1px solid #eee;
				height: 70px;
				line-height: 70px;
				cursor: pointer;
				.item {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.mt,
			.mc {
				font-size: 16px;

				padding-left: 20px;

				.item {
					display: inline-block;
				}
			}

			.item {
				overflow: hidden;
			}
		}

		.title {
			font-size: 16px;
			margin-bottom: 40px;

			.add {
				float: right;
				// width: 60px;
				// height: 22px;
				background: rgba(33, 104, 235, 1);
				border-radius: 14px;
				line-height: 17px;
				text-align: center;
				color: #ffffff;
				font-size: 12px;
				padding:3px 11px;
			}

		}
	}
	.staffeit-p {	
		.tips {
			margin-top: 8px;
			text-align: inherit;
			font-size: 14px;
			color: #333333;
			font-size:16px;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:22px;
			.upload{
				.file{
					padding-bottom:10px;
					padding-top:10px;
					border-bottom:1px solid #eee;
					color:#2168EB;
					.title-dialog{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						width: 88%;
						display: inline-block;
					}
					img{
						width:14px;
						height:14px;
						background:rgba(0,0,0,1);
						border-radius: 50%;
						// padding:4px;
					}
				}
				.p1{
					font-size:14px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:24px;
					.item{
						display: inline-block;
						padding:0 4px;
						border:1px solid #999999;
						background:#fff;
						color:#999999;
						margin-left:14px;
						border-radius: 20px;
						cursor:pointer;
						font-size: 12px;
					}
					.item.active{
						border:1px solid #2168EB;
						background:#2168EB;
						color:#ffffff;
					}
				}
				.p.p1{
					font-size:16px;
					margin:0 0 9px;
					.sort{
						width:19px;
						height:19px;
						line-height:19px;
						text-align: center;
						background:rgba(33,104,235,1);
						border-radius: 50%;
						color:#fff;
						display: inline-block;
						margin-top: 4px;
						
					}
				}
				.con{
					width:96%;
				}
			}
		}
		.ivu-input{
			padding:7px 15px;
			height:34px;
		}
		.content {
			overflow: hidden;
		}

		.title-layer {
			height: 70px;
			background: #2168eb;
			font-size: 20px;
			color: #ffffff;
			line-height: 70px;
			text-align: center;
		}
		.btns {
			text-align: center;
			font-size: 0;
			padding-top: 22px;
			margin-bottom: 21px;
		}
		.btn1 {
			border: 1px solid #999999;
		}

		.btn1,
		.btn2 {
			cursor: pointer;
			display: inline-block;
			font-size: 14px;
			padding: 0 22px;
			height: 28px;
			line-height: 28px;
			-webkit-border-radius: 28px;
			-moz-border-radius: 28px;
			border-radius: 28px;
			margin: 0 10px;
		}
		.btn2 {
			border: 1px solid #2168EB;
			background: #2168eb;
			color: #ffffff;
			padding: 0 38px;
		}
		.btn3{
			height: 18px;
			line-height: 17px;
			background: #fff;
			color: #2168EB;
			padding:0 9px;
			font-size: 12px;
		}
		.line{
			// width:326px;
			height:10px;
			background:rgba(251,251,251,1);
		}

	}
</style>

<template>
  <div>
    <div class="w">
      <div class="position" v-if="messageType != 4">已通过的{{messageType == 2?'预':'正式'}}备案详情
        <span ><router-link :to="'/policyList?page='+page + '&messageType=' + messageType"  >返回</router-link></span>
      </div>
      <div class="position" v-else style="height:60px"></div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="details">
        <div class="list">
          <div class="box">
            <div class="li-box">
              <div class="li-left">项目名称</div>
              <div class="li-right">{{detail.title}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">中介机构</div>
              <div class="li-right">{{detail.orgName}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">提交时间</div>
              <div class="li-right">{{detail.createdDateStr}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">类型</div>
              <!-- <div class="li-right">{{detail.projectType ==1?'内资项目':detail.projectType ==2?'外资项目':detail.projectType ==3?'税源项目':detail.reply ==6|| detail.reply ==7?'预备案':detail.reply ==5|| detail.reply ==4?'正式备案':''}}</div> -->
              <div class="li-right">{{detail.type}}</div>
            </div>
            <div class="li-box clear" style="height:auto;display:flex">
              <div class="li-left">审批结果</div>
              <div class="li-right" style="line-height: inherit;width: 730px;"> 
                <img
                  v-if="detail.sign==1"
                  src="../assets/img/szssss1@3x.png"
                  style="width: 18px;height:18px;float: left;margin-top:15px;margin-right:5px;"
                />
                <img
                  v-if="detail.sign==2"
                  src="../assets/img/szsxhytg@3x.png"
                  style="width: 18px;height:18px;float: left;margin-top:15px;margin-right:5px;"
                />
                <img
                  v-if="detail.sign==3"
                  src="../assets/img/szsxhyth@3x.png"
                  style="width: 18px;height:18px;float: left;margin-top:15px;margin-right:5px;"
                />
                <span
                  :style="{'color':detail.color,}"
                  style="font-weight: 500;line-height: 48px;"
                >{{detail.result}}</span><br/>
                <span v-if="detail.isPass==-1" style="line-height: 28px;word-break: break-all;">原因:{{detail.suggestion}}</span>
              </div>
            </div>
            <div class="li-box">
              <div class="li-left">审批时间</div>
              <div class="li-right">{{detail.checkTime?detail.checkTime.substring(0,17):''}}</div>
            </div>
          </div>
          <div class="enclosure" v-if="detail.attachments">
            <span style="float: left;margin-right:50px;">附件 ({{detail.attachments.length}}个)</span>
            <div style="float: left;" @click="downloadAll()">
              <img
                src="../assets/img/fjxqyl2@2x.png"
                style="width: 16px;height:16px;float: left;margin-top:17px;"
              />
              <span style="color:#2A6EEB;margin-left:5px;">
                <a href="javascript:void(0)">全部下载</a>
              </span>
            </div>
          </div>
          <div class="file" v-for="(value,index) in detail.attachments" :key="index">
            <img
              src="../assets/img/fjxqyl1@3x.png"
              style="width: 50px;height:50px;float: left; display: block;"
            />
            <div style="margin-left:15px;float: left;">
              <div>
                {{ value.name }}
                <span style="color:#999999;margin-left:10px;">({{value.size?value.size:1}}k)</span>
              </div>
              <div>
                <a href="javascript:void(0)" @click="download(value.url,value.name)">下载</a>
                &nbsp;&nbsp;&nbsp;
                <a target='_black' v-if="value.name.indexOf('pdf') == -1&& value.name.indexOf('txt') == -1 && value.type ==2" :href="'https://view.officeapps.live.com/op/view.aspx?src='+value.url">预览</a>
								<span v-else @click="tolayer2(4,value)" style="color: #2D8cF0;;cursor: pointer;">预览</span>
              </div>
            </div>
          </div>
          <div style="padding-left:290px;margin-top:45px;padding-bottom:50px;" v-if="detail.reply ==6||(detail.reply ==7 || detail.reply ==5 || detail.reply ==3)&&detail.isPass == -1||detail.reply ==4" >
            <div class="btn2" @click="tolayer()" :style="{background:isSubmit?'#DDDDDD':'#2168eb'}">{{detail.reply ==6?'转正式备案':(detail.reply ==7 || detail.reply ==5 || detail.reply ==3)&&detail.isPass == -1?'重新申请':detail.reply ==4?'申请资金':''}}</div>
          </div>
        </div>
        <!-- 转正式 -->
        <div class="layer staffeit-p" v-if="layer==2">
          <div class="mask" @click="tolayer(0)"></div>
          <div class="content">
            <div class="title-layer">转正式备案</div>
            <div class="tips" style="margin: 0 auto;">
              <div class="upload clear" style="padding:24px 16px 16px">
                <div class="fl left">下载正式申报表</div>
                <div class="fr btn2 btn3"><a :href="formUrl2" download="" title="下载" mce_href="#">下载</a></div>
              </div>
              <div class="line"></div>
              <div class="upload" style="padding:0 16px">
                <div class="clear" style="padding:16px 0 12px">
                  <div class="fl left">上传填写完成的正式申报表</div>
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
                </div>
                <div v-if="attachments.length">
                  <div class="file clear" v-for="(item,index) in attachments" :key="index">
                    <div class="title-dialog fl">{{item.name}}</div>
                    <div class="fr" style="padding: 0 4px;cursor:pointer" @click="removeArray(attachments,item)">
                      <img src="./../assets/img/gwhyzjsc@3x.png" alt=""  >
                    </div>
                  </div>
                </div>
              </div>
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
                </div>
                <div v-if="attachments.length">
                  <div class="file clear" v-for="(item,index) in attachments" :key="index">
                    <div class="title-dialog fl">{{item.name}}</div>
                    <div class="fr" style="padding: 0 14px 0 4px;cursor:pointer" @click="removeArray(attachments,item)">
                      <img src="./../assets/img/gwhyzjsc@3x.png" alt=""  >
                    </div>
                  </div>
                </div>
              </div>
              <div class="upload clear" style="padding:14px 0;border-bottom:1px solid #EEEEEE;margin:0 16px">
                <p class="p1 p fl"><span>项目类型</span></p>
                <div class="p1 fr">
                  <span :class="{'active':choose==1}" class="item" @click="toChoose(1)">内资项目</span>
                  <span :class="{'active':choose==2}" class="item" @click="toChoose(2)">外资项目</span>
                  <span :class="{'active':choose==3}" class="item" @click="toChoose(3)">税源项目</span>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="btn2" @click="tolayer1(3)">提交</div>
            </div>
          </div>
        </div>
      </div>
    </div>
		<!-- 文件预览 -->
		<div class="layer staffeit-p1" v-if="layer==4">
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
	name: "submitDetails",
	props: {
		defOrg: null,
		personalInfo: null
	},
	data() {
		return {
			layer: 0,
			pre:"",
			formValue: "",
			type: 2,
			color:"",
			messageType:"",
			id:"",
			page:1,
			detail:{
				attachments:[],
			},
			projectName:"",
			attachments: [],
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
			choose:0,
			formUrl2:"",
			isSubmit:false,
		};
	},
	methods: {
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
		toChoose(n){
			this.choose = n;
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
		tolayer(n){
			if(this.isSubmit){
				return
			}
			if(n !=0){
				// this.layer = 3;
				if(this.detail.reply ==7 || this.detail.reply ==6 || this.detail.reply ==5){
					this.layer = 2;
				}else if(this.detail.reply ==4 || this.detail.reply ==3){
					this.layer = 3;
				}
			}else{
				this.layer = n
			}
			// if(n == 2){
			// 	// this.fileName = "";
			// 	this.attachments = [];
			// 	this.projectName = "";
			// }
		},
		tolayer1(n){
			// 1:新增；2：转正式
			if(n==2&&!this.attachments.length){
				layer.msg(`请上传填写完成的正式申报表`)
				return
			}
			if(n==3&&!this.attachments.length){
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
			if(this.detail&&(this.detail.reply ==7 || this.detail.reply ==5 || this.detail.reply ==3)&&this.detail.isPass == -1){
				isRenew = 1
			}
			this.http.ajax({
				url: 'webSite/businessGov/commitReply',
				method: 'post',
				headers: {
				"Content-Type": "application/json"
				},
				data: {
					orgId: this.defOrg.id,
					title:n==1? this.projectName:'',
					attachments:this.attachments,
					projectType:this.messageType == 3?this.choose:0,
					isFirst:n==1? 1:0,
					eventId:n==1? '':this.id,
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
				this.getDetail();
				this.isSubmit = true;
				}
			})

		},
		tolayer2(n,value){
			this.layer = n;
			if(value){
				this.pre = value;
				this.pre.url = this.pre.url.split('?')[0];
			}
		},
		// 文件下载
		download(url, filename) {
		// 下载表格
			axios.get(url, {
				responseType: "blob"
			})
			.then(res => {
				// res = ''
				// console.log(res)
				const content = res;
				const blob = new Blob([content.data], {
					// type: 'application/vnd.ms-excel'
					// 'Accept': 'application/vnd.openxmlformats-officedocument'
					//            + '.spreadsheetml.sheet',
				}); // 构造一个blob对象来处理数据
				const fileName = filename; // 导出文件名
				// 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
				// IE10以上支持blob但是依然不支持download
				if ("download" in document.createElement("a")) {
					// 支持a标签download的浏览器

					const link = document.createElement("a"); // 创建a标签
					link.download = fileName; // a标签添加属性
					link.style.display = "none";
					link.href = URL.createObjectURL(blob);
					document.body.appendChild(link);
					link.click(); // 执行下载
					URL.revokeObjectURL(link.href); // 释放url
					document.body.removeChild(link); // 释放标签
				} else {
					// 其他浏览器
					navigator.msSaveBlob(blob, fileName);
				}
			})
			.catch(err => {
			// 失败处理,此时后端会返回Json格式错误

			// layer.msg(res.msg)
			});
		},
		downloadAll(){		
		for(var item of this.detail.attachments){
			this.download(item.url, item.name)
		}
		},
		submit() {},
		getDetail(){
		this.http.ajax({
			url: 'webSite/businessGov/getBusinessReplyInfo',
			method: 'post',
			headers: {
			// "Content-Type": "multipart/form-data"
			"Content-Type": "application/json"
			},
			data:{
				id:this.id
			}
		}).then(res => {
			// console.log(res)
			if(res.code == 200){
			this.detail = res.data;
			var result = "";
			var color = "";
			var sign = "";
			switch (res.data.reply) {
				case 7:
				{
					if (res.data.isPass == -1) {
						result = "预备案被退回";
						color= "#F81414";
						sign = 3;
					}else {
						result = "预备案待审核";
						color= "#2168EB";
						sign = 1;
					}
				}
				break;
				case 6:
				{
					result = "预备案已通过审核";
					color= "#30AE61";
					sign = 2;
				// [self.chageButton setTitle:@"转正式备案" forState:UIControlStateNormal];
				}
				break;
				case 5:
				{
				if (res.data.isPass == -1) {
					result = "正式备案被退回";
					color= "#F81414";
					sign = 3;
				}else {
					result = "正式备案待审核";
					color= "#2168EB";
					sign = 1;
				}
				}
				break;
				case 4:
				{
				result = "正式备案已通过审核";
				color= "#30AE61";
				sign = 2;
				// [self.chageButton setTitle:@"申请资金" forState:UIControlStateNormal];
				}
				break;
				case 3:
				{
				if (res.data.isPass == -1) {
					result = "资金申请被退回";
					color= "#F81414";
					sign = 3;
				}else {
					result = "资金申请待审核";
					color= "#2168EB";
					sign = 1;
				}
				}
				break;
				case 2:
				{
				result = "资金申请已通过";
				color= "#30AE61";
				sign = 2;
				}
				break;
				case 1:
				{
					result = "资金已拨付";
					color= "#30AE61";
					sign = 2;
				}
				break;
				case 0:
				{
					result = "已结束";
					color= "#30AE61";
					sign = 2;
				}
				break;
				default:
				break;
			}
			this.detail.result = result;
			this.detail.color = color;
			this.detail.sign = sign;
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
				// this.formUrl1 = res.data.tableProjectImport;//预申报表
				this.formUrl2 = res.data.tableInter;//正式备案表
				}
			})
		},
	},
	created() {
		this.messageType = this.$route.query.messageType;
		this.id = this.$route.query.id;
		this.page=this.$route.query.page;
		this.getDetail();
		this.getForm();
	},
};
</script>
<style lang='less'>
.details {
	overflow: hidden;
	font-size: 16px;
	.list {
		margin: 36px 90px;
		.box {
		width: 900px;
		// height: 393px;
		border: 1px solid #eeeeee;
		.li-box {
			height: 49px;
			border-bottom: 1px solid #eeeeee;
			.li-left {
			width: 144px;
			border-right: 1px solid #eeeeee;
			background: #f0f7fc;
			float: left;
			line-height: 48px;
			padding-left: 20px;
			}
			.li-right {
			line-height: 48px;
			padding-left: 20px;
			float: left;
			}
			.li-right1 {
			width: 304px;
			line-height: 48px;
			padding-left: 20px;
			border-right: 1px solid #eeeeee;
			float: left;
			}
		}
		.li-box1 {
			border: 0;
		}
		}
		.enclosure {
		height: 50px;
		background: #f8f8f8;
		margin-top: 30px;
		line-height: 50px;
		padding-left: 20px;
		}
		.file {
		border-bottom: 1px solid #eeeeee;
		height: 94px;
		padding: 22px 18px;
		}
		.btn1 {
		width: 138px;
		height: 46px;
		border: 1px solid #999999;
		border-radius: 27px;
		font-size: 14px;
		color: #999999;
		text-align: center;
		line-height: 46px;
		float: left;
		}
		.btn2 {
		// width: 1px;
		height: 48px;
		border-radius: 27px;
		font-size: 14px;
		color: #ffffff;
		text-align: center;
		line-height: 48px;
		background: #2168eb;
		float: left;
		margin-left: 40px;
		padding:0 75px;
		cursor: pointer;
		}
	}
	.title {
		height: 70px;
		background: #2168eb;
		font-size: 20px;
		color: #ffffff;
		line-height: 70px;
		text-align: center;
	}
	.count-box {
		position: relative;
		.ivu-input {
		height: 194px;
		width: 294px;
		padding: 14px 13px 32px;
		border: 1px solid rgba(221, 221, 221, 1);
		}
		.count {
		position: absolute;
		right: 20px;
		bottom: 10px;
		font-size: 12px;
		color: #999999;
		}
	}
	.btns {
		text-align: center;
		font-size: 0;
		padding-top: 37px;
		margin-bottom: 21px;

		.btn1 {
		border: 1px solid #999999;
		color: #999999;
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
					.title{
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
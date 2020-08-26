<template>
  <div>
    <div class="w">
      <div class="position">
        {{isNotice?"发通知":"发资讯"}}
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 73px;">
      <div class="addarticle">
        <Form ref="formValidate" :label-width="100" :model="formValue">
          <FormItem label="头图">
            <Upload
              @success="uppicUrl"
              :personalInfo="personalInfo"
              :mimeType="mimeTypepic"
              @error="error"
              type='img'
            >
              <div class="uploadpic">
                <img :src="imageUrl" alt />
              </div>
            </Upload>
            <div class="uploadpic_tips">建议上传750*416px尺寸图片</div>
          </FormItem>
          <FormItem label="标题">
            <Input
              style="width:350px;"
              placeholder="标题"
              :maxlength="40"
              v-model="formValue.newsDigest"
            />
          </FormItem>
          <FormItem v-if='!isNotice' label="选择类型">
            <Select v-model="type" style="width:350px;">
              <Option
                :value="Number(item.dictValue)"
                v-for="(item,index) in actType"
                :key="index"
              >{{item.dictName}}</Option>
            </Select>
          </FormItem>
          <FormItem v-if='isNotice' label="选择通知下达的商协会" prop='actManageOrg'>
						<div class="select">
							<div class="select-choose clear" @click="tolayer(4)">
								<div class="item" v-for="(item,index) in chooseArr" :key="index" @click.stop="deleteStructureList(item)">
									<span>{{item.orgName}}</span>
									<img src="../assets/img/close12@3x.png" alt="" >
								</div>
								<span v-show="!chooseArr.length" class="span fl">请选择通知下达的商协会</span>
								<i class="ivu-icon ivu-icon-ios-arrow-down fr"></i>
							</div>
						</div>
					</FormItem>
          <div class="line1 line"></div>
          <FormItem label="内容" class="editor content" prop="content">
            <div
              ref="editor"
              style="text-align:left;position: relative;z-index: 0;"
              v-model="content"
              @click="getToken($event)"
            ></div>
            <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
            <!-- {{content}} -->
          </FormItem>
          <FormItem label="附件">
            <ul class="imgFileList" v-if="attachments.length >0">
              <li style="margin-left: 15px;" v-for="(v,i) in  attachments" :key="i">
                {{v.name}}
                <span v-on:click="delFileCollection(i)">删除</span>
              </li>
            </ul>
            <Upload
              @success="upcoverUrl"
              @error="error"
              :beforeUpload="beforeAvatarUpload"
              :personalInfo="personalInfo"
              :mimeType="mimeType"
              type='file'
            >
              <div class="hand clear">
                <img
                  src="../assets/img/fj@2x.png"
                  class="uploadIco fl"
                  alt
                  style="margin:6px 4px 0 0"
                />
                <p class="fl">点击上传</p>
                <!-- {{ fileFname }} -->
              </div>
            </Upload>
          </FormItem>
          <!-- <div class="line"></div> -->
          <!-- <div style="margin-bottom: 24px">
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
          </div>-->
          <!-- <div class="line"></div> -->
          <div class="btns clear">
            <div v-if="isshowbtn" class="btn fl btn1" @click="issue(1)">保存草稿</div>
            <div class="btn fl btn2" @click="issue(2)">预览</div>
            <div class="btn fl" @click="issue(3)">发布</div>
          </div>
        </Form>
        <!-- 邀请商协会 -->
				<div class="layer staffeit choose-org" v-if="layer==4">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="content content1" style="width:420px">
						<div class="title clear">
              <div class="fl t-left" @click="chooseGovOrg">
                <img class="img" v-show="!isChooseOrg" src="./../assets/img/zzgl12.png" alt="">
                <img class="img" v-show="isChooseOrg" src="./../assets/img/title-c.png" alt="">
                <span>快速选择辖属组织</span>
              </div>
              <div class="fr t-right">已选择：{{chooseArr.length}}组</div>
            </div>
						<div class="select-sort">
							<sort :structureList='StructureList' :oldParts='chooseArr' @onchange='updateList' @length='getStructureListLength'></sort>
						</div>
						<div class="btns clear" style="padding:0">
              <div class="all fl" @click="chooseAll">
                <img class="img" v-show="!isChooseAll" src="./../assets/img/zzgl11@3x.png" alt="">
                <img class="img" v-show="isChooseAll" src="./../assets/img/zzgl10@3x.png" alt="">
                <span>全选</span>
              </div>
              <div class="btn2 fr" style="padding:0 17px;margin-right:20px" @click="tolayer(0)">确定（{{chooseArr.length}}/{{structureListLength}}）</div>
            </div>
          </div>
        </div>
        <!-- 头像裁剪 -->
        <div
          class="layer staffeit"
          v-if="layer==5"
          style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;z-index:10002"
          >
          <div
            class="line"
            style="margin-left: 0px;margin-top: 0px;position: fixed;top: 36%; left: 15%;"
          >
            <div class="cropper-content" style="margin-top:-60px;margin-left:90px;">
              <img src="../assets/img/xxtz2@2x.png" @click="layer=0" alt="" style="position:absolute;right:-100px;top:-150px">
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
import E from "wangeditor";
import sort from '../components/sort';
import { VueCropper } from "vue-cropper";
import * as qiniu from "qiniu-js";
export default {
  components: {
    sort,VueCropper
  },
  name: "editarticle",
  props: {
    msg: String,
    personalInfo: null, //登陆后 的用户信息
    defOrg: null,
    login: null
  },
  data() {
    return {
      uploadImg:'img',
      mimeTypepic: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
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
      formValue: {
        newsDigest: "",
        content: null
      },
      formdaterule: {
        actManageOrg: [{ 
						required: true, 
						type: 'array', 
						min: 1, 
						message: '请选择邀请商协会', 
						trigger: 'change' 
        }],
      },
      formdate: {
        actManageOrg:[],
      },
      title: "",
      orgId: "组织id",
      //互动主图的上传地址
      imageUrl: "",
      imageUrl1:'',
      type: 1101,
      content: "",
      messageType: "1",
      authListModel: [],
      authList: [],
      fileCollection: [],
      isRecommend: false,
      onlyOrgMember: true,
      isTop: false,
      actType0: [
        {
          dictValue: "1101",
          dictName: "商务要闻"
        },
        {
          dictValue: "1102",
          dictName: "经济时讯"
        },
        {
          dictValue: "1103",
          dictName: "重要通知"
        },
        {
          dictValue: "1104",
          dictName: "部门动态"
        },
        {
          dictValue: "1105",
          dictName: "双招双引"
        }
      ],
      actType1: [
        {
          dictValue: "1001",
          dictName: "工商联要闻"
        },
        {
          dictValue: "1002",
          dictName: "经济服务"
        },
        {
          dictValue: "1003",
          dictName: "会员风采"
        },
        {
          dictValue: "1004",
          dictName: "商会活动"
        }
      ],
      actType2: [
        {
          dictValue: "1201",
          dictName: "走进自贸区"
        },
        {
          dictValue: "1202",
          dictName: "政务公开"
        },
        {
          dictValue: "1203",
          dictName: "中介招商"
        },
        {
          dictValue: "1204",
          dictName: "政策法规"
        },
        {
          dictValue: "1205",
          dictName: "企业风采"
        }
      ],
      // 附件的上传地址与名字
      fileFname: "",
      fileFurl: "",
      // 弹窗
      layer: 0,
      // 所有部门
      orgStructureListDtos: [],
      // imgFileList
      imglist: [],
      QNtoken: "",
      attachments: [],
      isshowbtn: true,
      id:'',
      isact:false,
      lock:false,
      chooseArr:[],
      structureListLength:0,
      isNotice:false,
      StructureList:null,
      oldParts:[],
      issave:true,
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
      isChooseAll:false,
      isChooseOrg:false,

    };
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.digitalCommerce;
        // this.getOrgStructureList();
      }
    },
    chooseArr(val){
      if(val.length == this.StructureList.length){
        this.isChooseAll = true;
        this.isChooseOrg = true;
      }else{
        this.isChooseAll = false;
      }
      
      var isAllOrg = true
      this.StructureList.forEach((item,index)=>{
        // if(Boolean(item.isGovOrg) && !item.choose&& !this.oldParts.length || Boolean(item.isGovOrg) && !item.disabled && this.oldParts.length){
        if(Boolean(item.isGovOrg) && !item.choose){
          isAllOrg = false
          return
        }
      })
      // console.log('isAllOrg:',isAllOrg)
      this.isChooseOrg = isAllOrg;
      this.formdate.actManageOrg = this.chooseArr.map(i => i.id);
    },
    type(newtype, oldtype) {
      if(this.isact){
        // console.log("值", newtype, oldtype);
        if (newtype == 1103) {
          this.imageUrl =
            "https://img.yiqilaiwang.com/7fe08272-f4f6-4750-82ed-e809a9073e12.png";
        }else{
          if(this.imageUrl1!=''){
            this.imageUrl = this.imageUrl1
          }else{
            this.imageUrl =''
          }
        }
      }
    },
    oldParts(val){
      var i =0;
      var j =0;
      this.chooseArr = [];
      for(i in this.StructureList){
        let index = i;
        for(j in this.oldParts){
          if(this.StructureList[i].id == this.oldParts[j]){
            this.StructureList[i].disabled = true;
            this.chooseArr.push(
              this.StructureList[i]
            )
          }
        }
      }
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 0.1;
      if (!isLt20M) {
        this.$message.error("上传图片的大小不能超过 20M!");
      }
      return isLt20M;
    },
    error(res) {
      layer.msg("文件类型不正确,请重新上传");
      // console.log(res);
    },
    upImagesSuccess(e) {
      this.imglist.push(e.url);
    },
    upImagesError(e) {},
    delFileCollection(key) {
      this.attachments.splice(key, 1);
      this.fileCollection.splice(key, 1);
    },
    tolayer(n) {
				// console.log('xxx', this.layer);
				this.layer = n
			},
    // 附件上传
    upcoverUrl(e) {
      if (e.type.indexOf("image") == -1) {
        this.attachments.push({
          url: e.url,
          name: e.name,
          inx: this.attachments.length+1,
          type: 2,
          size:parseFloat(e.size / 1024).toFixed(1)
        });
      } else {
        this.attachments.push({
          url: e.url,
          name: e.name,
          inx: this.attachments.length+1,
          type: 1,
          size:parseFloat(e.size / 1024).toFixed(1)
        });
      }
      this.fileFname = e.name;
      this.fileFurl = e.url;
      this.fileCollection.push([this.fileFname, this.fileFurl]);
    },
    // 主图上传
    uppicUrl(e) {
      if(this.type==1103){
        return
      }else{

      // this.imageUrl = e.url;
      // this.defOrg.picUrl = e.url;
      // this.imageUrl1=e.url
				this.option.img = e.url;
				this.name = e.name;
				this.layer =5;
      }
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
      // console.log("imgLoad");
      // console.log(msg);
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
        url: "../../webSite/home/uploadApplication",
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
            this.imageUrl = res.data.qiniuDomain + "/" + result.key;
            this.defOrg.picUrl = res.data.qiniuDomain + "/" + result.key;
            this.imageUrl1=res.data.qiniuDomain + "/" + result.key
          }
        });
      });
    },
    getDraft(){
      if(this.isNotice){
        this.http.ajax({
					url: '../../webSite/businessGov/info',
          method: 'post',
          headers: {
            'Content-Type': ' application/json'
          },
          data: {
            orgId:this.defOrg.digitalCommerce,
            id:this.id,
            currentOrgId:this.login.orgId,
          }
				}).then(res => {
          for(let i of res.data.fileCollection){
            this.attachments.push({
              url: i.fileUrl,
              name: i.file,
              inx: this.attachments.length+1,
              type: 2,
              size:i.fileSize
            });
          }
             this.formValue.newsDigest= res.data.newsDigest
            this.content=res.data.content
            this.imageUrl=res.data.imageUrl,
            this.formdate.actManageOrg = res.data.actManageOrg;
            this.oldParts = res.data.actManageOrg;
				})
      }else{
        this.http.ajax({
					url: '/activities/' + this.id,
					// url: 'business/g/policies',
					method: 'get',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
					entityId:this.defOrg.digitalCommerce,
					}
				}).then(res => {
            this.formValue.newsDigest=res.title
            this.type = res.type
            this.content=res.content
            this.imageUrl=res.banner,
            this.attachments=res.attachments
            // console.log('内容',this.content)
				})
      }
      },
      getDraft1(){
        if(this.isNotice){
        this.http.ajax({
					url: '../../webSite/businessGov/info',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							orgId:this.defOrg.digitalCommerce,
							id:this.id,
							currentOrgId:this.login.orgId,
						}
				}).then(res => {
          for(let i of res.data.fileCollection){
            this.attachments.push({
              url: i.fileUrl,
              name: i.file,
              inx: this.attachments.length+1,
              type: 2,
              size:i.fileSize
            });
          }
            this.formValue.newsDigest= res.data.newsDigest
            this.content=res.data.content
            this.imageUrl=res.data.imageUrl,
            this.formdate.actManageOrg = res.data.actManageOrg
            this.oldParts = res.data.actManageOrg

            this.WangEditMethod()
				})
      }else{
        	this.http.ajax({
					url: '/activities/' + this.id,
					// url: 'business/g/policies',
					method: 'get',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
					entityId:this.defOrg.digitalCommerce,
					}
				}).then(res => {
             this.formValue.newsDigest=res.title
             this.type = res.type
            this.content=res.content
            this.imageUrl=res.banner,
            this.attachments=res.attachments
            // console.log('内容',this.content)
            this.WangEditMethod()
        })
      }
      },
      getStructureList() {
				this.http.ajax({
					// url: '../../webSite/activity/getStructureList',
					url: '../../webSite/businessGov/getBusinessAssociationList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
					entityId: this.defOrg.digitalCommerce,
						// "name": ''
					}
				}).then(res => {
					if (res.code == 200) {
						res.data.forEach((item) => {
							item.value = item.id;
							item.disabled = false;
							item.choose = false;
						})
						this.StructureList = res.data
						var i =0;
            var j =0;
            this.chooseArr = [];
						for(i in this.StructureList){
							let index = i;
							for(j in this.oldParts){
								if(this.StructureList[i].id == this.oldParts[j]){
                  this.StructureList[i].disabled = true;
                  this.StructureList[i].choose = true;
									this.chooseArr.push(
										this.StructureList[i]
									)
								}
							}
						}
					}
				})
      },
      chooseGovOrg(){
        // 编辑时
        // if(this.oldParts.length && this.isChooseOrg){
        //   console.log('return')
        //   return
        // }
        // 双重保护
        if(this.oldParts.length){
          var isAllOrg = true
          this.StructureList.forEach((item,index)=>{
            if(Boolean(item.isGovOrg) && !item.disabled){
              isAllOrg = false
              return
            }
          })
          if(isAllOrg){
            return
          }
        }
        // console.log(1,this.isChooseOrg)
        this.isChooseOrg = !this.isChooseOrg;
        // console.log(2,this.isChooseOrg)
        this.chooseArr = [];
        if(this.isChooseOrg){
          // console.log('this.isChooseOrg为true')
          this.StructureList.forEach((item,index,arr)=>{
            item.choose =  item.isGovOrg ==1?true:false;
            if(item.isGovOrg ==1){
              this.chooseArr.push(item)
            }
          })
        }else if(this.isChooseAll){
          // console.log('this.isChooseAll为true')
          this.chooseArr = [];
          this.StructureList.forEach((item,index,arr)=>{
            item.choose = false;
            if(!Boolean(item.isGovOrg)&& !this.oldParts.length || (!Boolean(item.isGovOrg) || item.disabled) && this.oldParts.length){
              item.choose = true;
              this.chooseArr.push(item)
            }
          })
        }else{
          // console.log('else')
          this.StructureList.forEach((item,index,arr)=>{
            item.choose = false;
          })
          this.chooseArr = [];
        }
      },
      chooseAll(){
        if(this.oldParts.length){
          var all = true;
          this.StructureList.forEach((item,index)=>{
            if(!item.disabled){
              all = false;
              return
            }
          })
          if(all){
            // console.log('return')
            return
          }
        }
        this.isChooseAll = !this.isChooseAll;
        if(this.isChooseAll){
          this.chooseArr = [];
          this.StructureList.forEach((item,index)=>{
            item.choose = true;
            this.chooseArr.push(item)
          })
        }else if(!this.oldParts.length){
          this.StructureList.forEach((item,index)=>{
            item.choose = false;
          })
          this.chooseArr = [];
        }else{
          this.chooseArr = [];
          this.StructureList.forEach((item,index)=>{
            if(!item.disabled){
              item.choose = false;
            }
            if(item.choose){
              this.chooseArr.push(item)
            }
          })
        }
      },
      // 获取选择的商协会
			updateList(data){
				// console.log('父组件',data);
				this.chooseArr = data;
				this.formdate.actManageOrg = data.map(i => i.id);
      },
      getStructureListLength(length){
				this.structureListLength = length
			},
      deleteStructureList(fitem){
				// if(!fitem.disabled){
					fitem.choose = !fitem.choose;
					this.chooseArr.map((item,index)=>{
						if(item.id == fitem.id){
							this.chooseArr.splice(index,1)
						}
					})
					this.formdate.actManageOrg = this.chooseArr.map(i => i.id);
				// }
			},
    // 发布
    issue(e) {
      if (this.formValue.newsDigest == "") {
        layer.msg("标题不能为空");
        return;
      }
      if (this.imageUrl == "") {
        layer.msg("头图不能为空");
        return;
      }
      if(this.isNotice && this.formdate.actManageOrg.length<1){
        layer.msg("下达的商协会不能为空");
        return;
      }
      if (
        this.content == "" ||
        this.content == null ||
        this.content == "<p><br></p>"
      ) {
        layer.msg("内容不能为空");
        return;
      }
      layer.load();
       if(this.lock){
        return
      }
      this.lock  = true;
      var timeoutflag = null;
      if (timeoutflag != null) {
        clearTimeout(timeoutflag);
      }
      timeoutflag = setTimeout(function () {
        this.lock = false;
      }, 3000);
      var url = ''
      var data = {}
      if(this.issave){
        this.issave=false
        if(this.isNotice){
          if(this.id){
            url = '../../webSite/businessGov/edit'
          }else{
            url = '../../webSite/businessGov/save'
          }
          var fileCollection = []
          if(this.attachments){
              for (let item in this.attachments){
              var arr = {
                fileName:'',
                fileExtension:'',
                fileUrl:'',
                fileSize:''
              }
              arr.fileName=this.attachments[item].name
              arr.fileUrl=this.attachments[item].url
              arr.fileSize=this.attachments[item].size
              arr.fileExtension = this.attachments[item].name.substr(this.attachments[item].name.lastIndexOf("."))
              // console.log(arr.fileExtension)
              fileCollection.push(arr)
                  }
          }
          // console.log(fileCollection)
          data = {
            messageType: 15,
            content: this.content,
            isDraft: e == 3 ? 0: 1,
            newsDigest: this.formValue.newsDigest,
            webSiteFileCollection: fileCollection,
            webSiteImgCollection:[],
            imageUrl: this.imageUrl,
            entityId: this.defOrg.digitalCommerce,
            uid: this.login.id,
            actManageOrg:this.formdate.actManageOrg,
            isRecommend:0,
            isTop:0,
            isOnlyOrg:0,
            isComments:0,
            orgId:this.login.orgId,
          };
        }else{
          url = "activities"
          data = {
            type: this.type,
            startTime: new Date().getTime(),
            content: this.content,
            status: e == 3 ? 1 : 0,
            title: this.formValue.newsDigest,
            attachments: this.attachments,
            banner: this.imageUrl,
            entityId: this.defOrg.digitalCommerce,
            action:10,
            creator: this.login.id,
            creatorName: this.login.realName
          };
        }
        if(this.id){
          data.id=this.id
        }
        this.http.ajax({
          url: url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        }).then(res => {
          if (res.code == 1 || res.code == 200) {
            layer.closeAll();
            data.id = res.data.id;
            let result = JSON.stringify(data);
            if (e == 2) {
              if(this.isNotice){
                return this.$router.push({
                path: "/information",
                query: { id: data.id, isAudit: true ,preview:true,messageType:3}
              });
              }else{
                return this.$router.push({
                path: "/information",
                query: { id: data.id, isAudit: true ,preview:true}
              });
              }
            } else if (e == 1) {
              layer.msg('保存成功')
              if(this.defOrg.digitalCommerce=="5e88d1cf6b0366dd9cf01e50"){
                    this.$router.push("/gslDraft?messageType=1");
              }else{
                this.$router.push("/draftList?messageType=0");
              }
            } else {
              layer.msg('发布成功')
              if(this.isNotice){
                this.$router.push("/managearticlelist?messageType=3");
              }else{
                this.$router.push("/managearticlelist");
              }
            }
          }
          this.issave=true
        });
      }
    },
    // 自动保存草稿
    issue1() {
      var url = ''
      var data = {}
      if(this.issave){
        this.issave=false
      if(this.isNotice){
        if(this.id){
          url = '../../webSite/businessGov/edit'
        }else{
          url = '../../webSite/businessGov/save'
        }
        var fileCollection = []
        if(this.attachments){
          for (let item in this.attachments){
            var arr = {
              fileName:'',
              fileExtension:'',
              fileUrl:'',
              fileSize:''
            }
            arr.fileName=this.attachments[item].name
            arr.fileUrl=this.attachments[item].url
            arr.fileSize=this.attachments[item].size
            arr.fileExtension = this.attachments[item].name.substr(this.attachments[item].name.lastIndexOf("."))
            fileCollection.push(arr)
                }
        }
        data = {
        messageType: 15,
        content: this.content,
        isDraft:1,
        newsDigest: this.formValue.newsDigest,
        webSiteFileCollection: fileCollection,
        webSiteImgCollection:[],
        imageUrl: this.imageUrl,
        entityId: this.defOrg.digitalCommerce,
        uid: this.login.id,
        actManageOrg:this.formdate.actManageOrg,
        isRecommend:0,
        isTop:0,
        isOnlyOrg:0,
        isComments:0,
        orgId:this.login.orgId,
      };
      }
      if(this.id){
        data.id=this.id
      }
      this.http
        .ajax({
          url: url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        })
        .then(res => {
          if (res.code == 200) {
            layer.closeAll();
            this.id = res.data.id;
          }
          this.issave=true
        });
        }
    },
    getOrgStructureList() {
      this.http
        .ajax({
          url: "webSite/orgStructure/list",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            orgId: this.orgId
          }
        })
        .then(res => {
          // console.log(res)
          /*for (let i = 0; i <= res.data.orgStructureListDtos.length; i++) {
					    // res.data.orgStructureListDtos[i]. = 0;
					    // console.log(res.data.orgStructureListDtos[i]);
					    let v = res.data.orgStructureListDtos[i];
					    // console.log(res.data.orgStructureListDtos[i]);
					    // this.authList[v.id] = true;
					}*/
          res.data.orgStructureListDtos.forEach(item => {
            // console.log(item.id)
            item.value = item.id;
          });
          this.orgStructureListDtos = res.data.orgStructureListDtos;
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
    // uploadInitMusic(editor) {
    // 	// 获取相关 DOM 节点的 ID
    // 	var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[16]
    // 	console.log(btnId);
    // 	// var btnId = editor.imgMenuId;
    // 	// console.log(editor.$toolbarElem[0],btnId)
    // 	var containerId = editor.toolbarElemId
    // 	var textElemId = editor.textElemId
    // 	// 创建上传对象
    // 	this.http.ajax({
    // 		url: 'webSite/home/uploadApplication',
    // 		method: 'post',
    // 		data: {
    // 			uid: this.personalInfo.uid
    // 		}
    // 	}).then(res => {
    // 		console.log(res)
    // 		var uploader = window.Qiniu.uploader({
    // 			runtimes: 'html5,flash,html4', //上传模式,依次退化
    // 			browse_button: btnId, //上传选择的点选按钮，**必需**
    // 			uptoken: res.data.upToken,
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
    // 				'FileUploaded': function(up, file, info) {
    // 					var domain = up.getOption('domain')
    // 					var res = window.$.parseJSON(info)
    // 					var sourceLink = domain + res.key //获取上传成功后的文件的Url
    // 					console.log(sourceLink)
    // 					// 插入图片到editor
    // 					editor.cmd.do('insertHtml','<audio controls controlslist="nodownload" style="max-width:100%; width:100%"> <source   src="' + sourceLink + '?imageslim/imageView2/1/interlace/1/ignore-error/1"/></audio> ' )
    // 				}
    // 			}
    // 		})
    // 	})
    // },
    WangEditMethod(){
          // console.log('qiniuqiniuqiniuqiniuqiniu',qiniu)
    // console.log(this.$refs.editor)
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = html => {
      let reg = new RegExp('<p></p>', 'g')
			html = html.replace(reg, '');
      this.content = html;
    };
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
      // console.log(content)
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
      "#515a6e",
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
    if(this.content){
      editor.cmd.do("insertHTML", this.content);
    }else{
      editor.txt.append(`<p><br></p>`)
    }
    this.uploadInit(editor);
    this.uploadInitVideo(editor);
    // this.uploadInitMusic(editor);
    },
  },
  mounted() {
    if(this.$route.query.id){
      this.getDraft1();
    }else{
      this.WangEditMethod()
    }
    this.getStructureList();
    if(this.isNotice){
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.formValue.newsDigest != "" && this.imageUrl != "" &&(this.content != "" && this.content != null && this.content != "<p><br></p>")) {
          this.issue1();
        }
      }, 20000);
    }
  },
  created() {
    // console.log("登录", this.login, this.defOrg);
    this.messageType = Number(this.$route.query.messageType);
    if(this.$route.query.type==2){
      // this.getStructureList();
      this.isNotice=true
    }
    if(this.$route.query.id){
				this.id=this.$route.query.id
				this.getDraft()
      }
      // console.log(this.$route.query.type, this.isNotice)
    // if (this.defOrg) {
    // 	this.orgId = this.defOrg.digitalCommerce;
    // 	this.getOrgStructureList();
    // }

    if (this.defOrg.digitalCommerce == "5e935acfa5f08e7ae71b5557") {
      this.actType = this.actType0;
      this.type = 1101;
      this.isact = true
    } else if (this.defOrg.digitalCommerce == "5e88d1cf6b0366dd9cf01e50") {
      this.actType = this.actType1;
      this.type = 1001;
      this.isshowbtn = true;
    } else if (this.defOrg.digitalCommerce == "5e8ecdeb3e43463fd4668207") {
      this.actType = this.actType2;
      this.type = 1201;
      this.isshowbtn = false;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less">
.hand {
  cursor: pointer;
}

.addarticle {
  .icon {
    vertical-align: middle;
    margin-right: 3px;
  }

  .ivu-form .ivu-form-item-label {
    text-align: left;
  }

  .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
    color: #515a6e;
  }

  .line {
    border-bottom: 1px dotted #dddddd;
    margin-bottom: 17px;
  }
  .line1 {
    margin-bottom: 24px;
    margin-top: 17px;
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

  padding-top: 64px;
  padding-right: 130px;
  padding-bottom: 30px;
  padding-left: 130px;
  .content{
    .ivu-form-item-label:after{
				content:"";
				color:#ccc;
				font-size:12px;
			}
  }
  .editor {
    .ivu-form-item-content {
      margin-right: 0;
    }
    .w-e-text p,
    .w-e-text h1,
    .w-e-text h2,
    .w-e-text h3,
    .w-e-text h4,
    .w-e-text h5,
    .w-e-text table,
    .w-e-text pre {
      word-break: break-all;
    }
  }

  .w-e-text {
    font-size: 20px;
  }

  .ivu-form-item-content {
    margin-right: 271px;
  }

  .uploadpic {
    width: 350px;
    height: 194px;

    img {
      width: 350px;
      height: 194px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      cursor: pointer;
    }

    background: #fafafa url("../assets/img/pz@2x.png") no-repeat center center;
    border-radius: 5px;
    border: 1px solid #ddd;
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
      margin-bottom: 44px;
    }
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
  .btns {
    text-align: center;
    font-size: 0;
    // padding:0 204px;
    // padding-top: 30px;
    padding: 34px 0 70px 208px;

    .btn1 {
      border: 1px solid #999999;
      background: #fff;
      color: #999999;
    }

    .btn2 {
      border: 1px solid #2168eb;
      background: #fff;
      color: #2168eb;
    }

    .btn {
      display: inline-block;
      font-size: 12px;
      padding: 0 22px;
      width: 116px;
      height: 48px;
      line-height: 48px;
      -webkit-border-radius: 28px;
      -moz-border-radius: 28px;
      border-radius: 28px;
      margin: 0 10px;
    }
  }
  .btns2 {
			text-align: center;
			font-size: 0;
			padding-top: 20px;
			margin-bottom: 20px;

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
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 16px;
				height: 28px;
				line-height: 28px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

    }
    .bg{
			width:100%;
			height:28px;
			line-height:28px;
			text-align:center;
			background:rgba(251,251,251,1);
		}
  .select{
			// position:relative;
			// z-index:100;
			.select-choose{
				width:350px;
				min-height:38px;
				border:1px solid rgb(220, 222, 226);
				padding: 0 24px 0 8px;
				position:relative;
				cursor:pointer;
				.item{
					float:left;
					padding: 0 0 0 8px;
					height:22px;
					line-height:22px;
					border: 1px solid #e8eaec;
					border-radius: 3px;
					background: #f7f7f7;
					margin: 3px 4px 3px 0;
					cursor:pointer;
					span{
						// margin-right:6px;
						display:inline-block;
						font-size:12px;
						color:#333333;
						max-width:350px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-right:6px;
					}
					img{
						height: 21px;
    				padding: 6px 6px 6px 0;
					}
				}
				.span{
					height: 38px;
					line-height: 38px;
					color: #c5c8ce;
					font-size: 14px;
				}
				.ivu-icon-ios-arrow-down{
					position: absolute;
					top: 37%;
					right:10px;
				}
			}
		}
}
.addarticle {
  .tips {
    margin-top: 45px;
    text-align: center;
    font-size: 14px;
    color: #333333;
  }

  .tag {
    .ivu-form-item-label {
      margin-top: 8px;
    }
    .ivu-form-item-content {
      margin-right: 0;
    }
    .mgl {
      margin-left: 6px;
    }

    .mc {
      width: 544px;
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
          height: auto;
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
        height: 38px;
        line-height: 38px;
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
    .mt {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin: 14px 0 0 0;
      width: 92px;
    }
    .ivu-select {
      margin-top: 10px;
      width: 350px;
      .ivu-select-selection {
        height: 30px;
        .ivu-select-placeholder {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .btn {
      line-height: 54px;
    }
    .define {
      margin-left: 7px;
      min-height: 54px;
      .span {
        margin-right: 10px;
      }
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
}

.imgFileList {
  li {
    span {
      padding-left: 15px;
      font-size: 13px;
      color: #1e9fff;
      // line-height: 40px;
    }
  }
}
.staffeit {
  .select-sort{
    position:relative;
    // top:40px;
    left:0;
    // width:398px;
    // height:382px;
    // border:1px solid rgb(220, 222, 226);
    background:#fff;
  }
  .tips {
    margin-top: 25px;
    text-align: center;
    font-size: 14px;
    color: #333333;
  }

  .btns {
    text-align: center;
    font-size: 0;
    padding-top: 20px;
    margin-bottom: 20px;

    .btn1 {
      border: 1px solid #999999;
      color:#999999;
    }

    .btn2 {
      border: 1px solid #2168EB;
      background: #2168eb;
      color: #ffffff;
    }

    .btn1,
    .btn2 {
      cursor: pointer;
      display: inline-block;
      font-size: 12px;
      padding: 0 38px;
      height: 28px;
      line-height: 28px;
      -webkit-border-radius: 28px;
      -moz-border-radius: 28px;
      border-radius: 28px;
      margin: 0 10px;
    }

  }
  .content {
    overflow: hidden;
    width:332px;
  }

  .title {
    height: 70px;
    background: #2168eb;
    font-size: 20px;
    color: #ffffff;
    line-height: 70px;
    text-align: center;
  }
  .bg{
    width:100%;
    height:28px;
    line-height:28px;
    text-align:center;
    background:rgba(251,251,251,1);
  }
  .content-item{
    padding:0 23px;
    div{
      text-align: center;
      border-bottom:1px solid #EEEEEE;
      height:47px;
      line-height:47px;
      cursor:pointer;
    }
  }

}
.choose-org{
  .title{
    height:70px;
    .t-left{
      background:#1268EB;
      width:269px;
      cursor: pointer;
      text-align:left;
      .img{
        width:18px;
        height:18px;
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px 0 20px;
      }
      span{
        display: inline-block;
      }

    }
    .t-right{
      background:#0E53BC;
      width:151px;
    }
  }
  .all{
    margin-left:20px;
    margin-top: 5px;
    cursor: pointer;
    .img{
      width:18px;
      height:18px;
      display: inline-block;
      vertical-align: middle;
      margin-right:9px;
    }
    span{
      display: inline-block;
      font-size:20px;
      vertical-align: middle;
      color:#333;
    }
  }
}
</style>

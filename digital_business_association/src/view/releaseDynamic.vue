<template>
  <div>
    <div class="w">
       <div class="position">
         发布
        <!--<span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 73px;">
      <div class="addarticle">
        <Form ref="formValidate" :label-width="100" :model="formValue">
          <FormItem label="选择类型" class="clear">
            <Select v-model="type" style="width:175px;" class="fl">
              <Option
                :value="Number(item.dictValue)"
                v-for="(item,index) in actType0"
                :key="index"
              >{{item.dictName}}</Option>
            </Select>
            <Select v-if="type==2001" v-model="type1" style="width:175px;margin-left:50px;" class="fl">
              <Option
                :value="Number(item.dictValue)"
                v-for="(item,index) in actType1"
                :key="index"
              >{{item.dictName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="标题">
            <Input
              style="width:350px;"
              placeholder="标题"
              :maxlength="40"
              v-model="formValue.newsDigest"
            />
          </FormItem>
          <FormItem label="头图" v-if="type!=2002">
            <Upload
              @success="uppicUrl"
              :personalInfo="personalInfo"
              :mimeType="mimeTypepic"
              @error="error"
            >
              <div class="uploadpic">
                <img :src="imageUrl" alt />
              </div>
            </Upload>
            <div class="uploadpic_tips">建议上传750*416px尺寸图片</div>
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
            <ul class="imgFileList" v-if="fileCollection.length >0">
              <li style="margin-left: 15px;" v-for="(v,i) in  fileCollection" :key="i">
                {{v[0]}}
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
          <div class="btns clear">
            <div v-if="isshowbtn" class="btn fl btn1" @click="issue(1)">保存草稿</div>
            <div class="btn fl btn2" @click="issue(2)">预览</div>
            <div class="btn fl" @click="issue(3)">发布</div>
          </div>
        </Form>
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
import { VueCropper } from "vue-cropper";
import * as qiniu from "qiniu-js";
export default {
  name: "releaseDynamic",
  components: {
    VueCropper
  },
  props: {
    msg: String,
    personalInfo: null, //登陆后 的用户信息
    defOrg: null,
    login: null
  },
  data() {
    return {
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
      title: "",
      orgId: "组织id",
      //互动主图的上传地址
      imageUrl: "",
      imageUrl1: "",
      type: 2001,
      type1:20011,
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
          dictValue: "2001",
          dictName: "本会动态"
        },
        {
          dictValue: "2002",
          dictName: "办事指南"
        },
        {
          dictValue: "2003",
          dictName: "仲裁园地"
        }
      ],
      actType1: [
        {
          dictValue: "20011",
          dictName: "新闻动态"
        },
        {
          dictValue: "20012",
          dictName: "通知公告"
        },
        {
          dictValue: "20013",
          dictName: "网络问政"
        },
        {
          dictValue: "20014",
          dictName: "国内快讯"
        }
      ],
      tags:[],
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
      id: "",
      isact: false,
      option: {
        img: "",
        size: 1, //剪切后的图片质量（0.1-1）
        full: true, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 350,
        autoCropHeight: 194,
        fixedBox: true
      },
      previews: {},
      headImg: "",
      name: "",
      modelSrc: "",
    };
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.id;
        this.getOrgStructureList();
      }
    },
    type(newtype, oldtype) {
      if (this.isact) {
        if (newtype == 1103) {
          this.imageUrl =
            "https://img.yiqilaiwang.com/7fe08272-f4f6-4750-82ed-e809a9073e12.png";
        } else {
          if (this.imageUrl1 != "") {
            this.imageUrl = this.imageUrl1;
          } else {
            this.imageUrl = "";
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
    // 附件上传
    upcoverUrl(e) {
      if (e.type.indexOf("image") == -1) {
        this.attachments.push({
          url: e.url,
          name: e.name,
          inx: this.attachments.length + 1,
          type: 2,
          size: parseFloat(e.size / 1024).toFixed(1)
        });
      } else {
        this.attachments.push({
          url: e.url,
          name: e.name,
          inx: this.attachments.length + 1,
          type: 1,
          size: parseFloat(e.size / 1024).toFixed(1)
        });
      }
      this.fileFname = e.name;
      this.fileFurl = e.url;
      this.fileCollection.push([this.fileFname, this.fileFurl]);
    },
    // 主图上传
    uppicUrl(e) {
      if (this.type == 1103) {
        return;
      } else {
        // this.imageUrl = e.url;
        // this.defOrg.picUrl = e.url;
        // this.imageUrl1 = e.url;
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
    getDraft() {
      this.http
        .ajax({
          url: "/activities/" + this.id,
          // url: 'business/g/policies',
          method: "get",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            entityId: this.defOrg.digitalCommerce
          }
        })
        .then(res => {
          this.formValue.newsDigest = res.title;
          this.type = res.type;
          this.type1 = Number(res.tags[0].name)
          this.content = res.content;
          (this.imageUrl = res.banner), (this.attachments = res.attachments);
          // console.log("内容", this.content,this.type,this.type1);
        });
    },
    getDraft1() {
      this.http
        .ajax({
          url: "/activities/" + this.id,
          // url: 'business/g/policies',
          method: "get",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            entityId: this.defOrg.digitalCommerce
          }
        })
        .then(res => {
          this.formValue.newsDigest = res.title;
          this.type = res.type;
          this.type1 = Number(res.tags[0].name)
          this.content = res.content;
          (this.imageUrl = res.banner), (this.attachments = res.attachments);
          this.WangEditMethod();
        });
    },
    // 发布
    issue(e) {
      if (this.formValue.newsDigest == "") {
        layer.msg("标题不能为空");
        return;
      }
      if (this.type!=2002&&this.imageUrl == "") {
        layer.msg("头图不能为空");
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
      this.tags.push({
            name: this.type1
          });
      let data = {
        type: this.type,
        startTime: new Date().getTime(),
        content: this.content,
        status: e == 3 ? 1 : 0,
        title: this.formValue.newsDigest,
        attachments: this.attachments,
        banner: this.imageUrl,
        entityId: this.defOrg.digitalCommerce,
        action: 10,
        creator: this.login.id,
        creatorName: this.login.realName,
        tags:this.tags
      };
      if(this.id){
        data.id=this.id
      }
      // console.log("data", data);
      this.http
        .ajax({
          url: "activities",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        })
        .then(res => {
          // console.log(res)
          // layer.msg(res.msg)
          if (res.code == 1) {
            // data.id = res.data.id;
            // let result = JSON.stringify(data);
            if (e == 2) {
              return this.$router.push({
                path: "/arbitration",
                query: { id: res.data.id, isAudit: true, preview: true }
              });
            } else if (e == 1) {
              layer.msg("保存成功");
              this.$router.push("/draftList?messageType=1");
            } else {
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
            }
          }
          // this.orgStructureListDtos = res.data.orgStructureListDtos
        });
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
    WangEditMethod() {
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
      // editor.cmd.do("insertHTML", this.content);
      this.uploadInit(editor);
      this.uploadInitVideo(editor);
      // this.uploadInitMusic(editor);
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDraft1();
    } else {
      this.WangEditMethod();
    }
  },
  created() {
    this.messageType = Number(this.$route.query.menuactive);
    // console.log("登录", this.type);
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDraft();
    }
    if(this.messageType==0){
      this.type=2001
    }else if(this.messageType==1){
      this.type=2002
    }else{
      this.type=2003
    }
    // if (this.defOrg) {
    // 	this.orgId = this.defOrg.digitalCommerce;
    // 	this.getOrgStructureList();
    // }

    // if (this.defOrg.digitalCommerce == "5e935acfa5f08e7ae71b5557") {
    //   this.actType = this.actType0;
    //   this.type = 1101;
    //   this.isact = true;
    // } else if (this.defOrg.digitalCommerce == "5e88d1cf6b0366dd9cf01e50") {
    //   this.actType = this.actType1;
    //   this.type = 1001;
    //   this.isshowbtn = true;
    // } else if (this.defOrg.digitalCommerce == "5e8ecdeb3e43463fd4668207") {
    //   this.actType = this.actType2;
    //   this.type = 1201;
    //   this.isshowbtn = false;
    // }
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
  .content {
    .ivu-form-item-label:after {
      content: "";
      color: #ccc;
      font-size: 12px;
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
  padding-left: 130px;

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
</style>

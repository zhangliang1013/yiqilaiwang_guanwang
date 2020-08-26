<template>
  <div>
    <div class="w">
      <div class="position">
        发政策
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 73px;">
      <div class="addarticle">
        <Form ref="formValidate" :label-width="100" :rules="formdaterule">
          <FormItem label="标题">
            <Input placeholder="标题" :maxlength="40" v-model="title" />
          </FormItem>
          <!-- <div class="line"></div> -->
          <div class="line"></div>
          <FormItem label="选择标签" class="tag">
            <div class="clear">
              <!-- <div class="mt">点击选择需要填写的信息 <div class="btn" >保存</div>
              </div>-->
              <div class="fl mt">选择行业</div>
              <div class="mc fl">
                <template v-for="(item,index) in industries">
                  <span :class="{active:item.state}" @click="setformdate(index)">
                    {{item.name}}
                    <img src="./../assets/img/xzdh@2x.png" alt />
                  </span>
                </template>
                <div class="define">
                  <div style="display:inline-block">自定义行业标签：</div>
                  <span class="active" v-for="(item,index) in Fields" :key="index">
                    {{item.name}}
                    <img src="./../assets/img/xzdh@2x.png" alt />
                    <img
                      src="./../assets/img/hd7@2x.png"
                      alt
                      v-if="isfieldsedit"
                      @click="deleteFieldslist(index)"
                      class="close"
                    />
                  </span>
                  <span class="btn" :class="{active:isfields}" @click="onisfields(1)">
                    <input ref="fields" @blur="onisfields(0)" type="text" />
                    <b>+增加行业标签</b>
                  </span>
                </div>
              </div>
            </div>
            <div class="clear">
              <div class="fl mt">选择区域</div>
              <div class="fl mgl" style="margin-top:6px">
                <select
                  v-model="provinceValue"
                  @change="changeProvince(provinceValue)"
                  style="display: inline-block;height:30px;width:140px;overflow:hiddenline-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff; background-image: none;position: relative;margin-right:12px;cursor:pointer"
                >
                  <option value style="color: #b6b6b6" disabled selected>请选择省级</option>
                  <option value="000000" selected>全国</option>
                  <option v-for="(t,i) in province" :key="i" :value="t.id">{{t.name}}</option>
                </select>
                <select
                  v-model="cityValue"
                  @change="changeCity(cityValue)"
                  style="display: inline-block;height:30px;width:140px;overflow:hiddenline-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff; background-image: none;position: relative;cursor:pointer;margin-right:12px"
                >
                  <option value style="color: #b6b6b6" disabled selected>请选择市级</option>
                  <option v-for="(c,i) in city" :key="i" :value="c.id">{{c.name}}</option>
                </select>
                <select
                  v-model="regionValue"
                  @change="changeRegion(regionValue)"
                  style="display: inline-block;height:30px;width:140px;overflow:hiddenline-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff; background-image: none;position: relative;cursor:pointer;margin-right:12px"
                >
                  <option value style="color: #b6b6b6" disabled selected>请选择区县</option>
                  <option value="0" selected>全部区县</option>
                  <option v-for="(c,i) in region" :key="i" :value="c.id" :label="c.name">{{c.name}}</option>
                </select>
              </div>
            </div>
            <div class="clear">
              <div class="fl mt">企业人数规模</div>
              <div class="fl mgl">
                <Select
                  v-model="scale.fieldValue"
                  placeholder="不限规模"
                  label-in-value
                  style="height:30px;line-height:30px"
                  @on-change="scaleChange($event,'scale')"
                >
                  <Option
                    :value="item.fieldValue"
                    :label="item.fieldLabel"
                    v-for="(item,index) in scaleArr"
                    :key="index"
                  >{{item.fieldLabel}}</Option>
                </Select>
              </div>
            </div>
            <div class="clear">
              <div class="fl mt">企业年营业额</div>
              <div class="fl mgl">
                <Select
                  v-model="turnover.fieldValue"
                  placeholder="不限规模"
                  label-in-value
                  style="height:30px;line-height:30px"
                  @on-change="scaleChange($event,'turnover')"
                >
                  <Option
                    :value="item.fieldValue"
                    :label="item.fieldLabel"
                    v-for="(item,index) in turnoverArr"
                    :key="index"
                  >{{item.fieldLabel}}</Option>
                </Select>
              </div>
            </div>
            <div class="clear">
              <div class="fl mt">企业性质</div>
              <div class="fl mgl">
                <Select
                  v-model="nature.fieldValue"
                  placeholder="不限规模"
                  label-in-value
                  style="height:30px;line-height:30px"
                  @on-change="scaleChange($event,'nature')"
                >
                  <Option
                    :value="item.fieldValue"
                    :label="item.fieldLabel"
                    v-for="(item,index) in natureArr"
                    :key="index"
                  >{{item.fieldLabel}}</Option>
                </Select>
              </div>
            </div>
            <!-- <div class="clear">
							<div class="fl mt">政策截止日期</div>
							<div class="fl mgl" style="margin-top:8px">
								<DatePicker class="actEndTime" format="yyyy-MM-dd" :start-date="new Date()" @on-change="changeEndTime" :value="endTime" type="date" placeholder="选择日期" style="width: 100%;"></DatePicker>
							</div>
            </div>-->
            <!-- <div class="clear" style="margin-top:7px;">
							<div class="fl mt">其他标签</div>
							<div class="fl mgl mc">
								<div class="define" style="margin-left:-6px">
									<span :class="[{active:formdate.extras.findIndex(d => d.fields === item.fields)>=0},'span']" @click="pushextras(item)"
									v-for="(item,index) in Fields" :key="index" v-if="fieldslist.findIndex(d => d === item.id)<0">
										{{item.fieldsName}} <img src="./../assets/img/xzdh@2x.png" alt="">
										<img src="./../assets/img/hd7@2x.png" alt="" v-if="isfieldsedit" @click="addfieldslist(item.id)" class="close">
									</span>
									<span class="btn" :class="{active:isfields}" @click="onisfields(1)"><input ref="fields"
										@blur="onisfields(0)" type="text"><b>+增加行业标签</b></span>
								</div>
							</div>
            </div>-->
          </FormItem>
          <div class="line1 line"></div>

          <FormItem label="摘要" class="editor" prop="content">
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
                <span v-on:click="delFileCollection(i)" style="cursor:pointer">删除</span>
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
              </div>
            </Upload>
          </FormItem>
          <div class="btns clear">
            <div class="btn fl btn1" @click="issue(0)">保存草稿</div>
            <div class="btn fl btn2" @click="issue(2)">预览</div>
            <div class="btn fl" @click="issue(1)">发布</div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
import { province } from "./../assets/js/map.js";
// import * as qiniu from 'qiniu-js'
export default {
  inject: ['reload'],
  name: "addarticle",
  props: {
    msg: String,
    personalInfo: null, //登陆后 的用户信息
    defOrg: null,
    login: null
  },
  data() {
    return {
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
      formdaterule: {
        // title: [{
        // 	required: true,
        // 	message: '标题不能为空',
        // 	trigger: 'blur|change'
        // }],
        // ,
        // content: [{
        // 	required: true,
        // 	message: '内容不能为空！',
        // 	trigger: 'blur|change'
        // }]
      },
      title: "",
      // 行业
      industries: [
        {
          id: "1",
          name: "互联网",
          state: 0
        },
        {
          id: "2",
          name: "房地产",
          state: 0
        },
        {
          id: "3",
          name: "金融",
          state: 0
        },
        {
          id: "4",
          name: "电商",
          state: 0
        },
        {
          id: "5",
          name: "人工智能",
          state: 0
        },
        {
          id: "6",
          name: "消费品",
          state: 0
        },
        {
          id: "7",
          name: "机械/制造",
          state: 0
        },
        {
          id: "8",
          name: "广告/传媒",
          state: 0
        },
        {
          id: "9",
          name: "教育/文化",
          state: 0
        },
        {
          id: "10",
          name: "交通/贸易/物流",
          state: 0
        },
        {
          id: "11",
          name: "制药/医疗",
          state: 0
        },
        {
          id: "12",
          name: "能源/化工/环保",
          state: 0
        },
        {
          id: "13",
          name: "政府/农林牧渔",
          state: 0
        },
        {
          id: "14",
          name: "其他",
          state: 0
        }
      ],
      Fields: [],
      isfields: false,
      isfieldsedit: true,
      province: [],
      provinceValue: "",
      provinceLabel: "",
      city: [],
      cityValue: "",
      cityLabel: "",
      region: [],
      regionValue: "",
      regionLabel: "",
      scaleArr: [
        {
          fieldLabel: "不限规模",
          fieldValue: "1"
        },
        {
          fieldLabel: "1-49人",
          fieldValue: "2"
        },
        {
          fieldLabel: "50-99人",
          fieldValue: "3"
        },
        {
          fieldLabel: "100-499人",
          fieldValue: "4"
        },
        {
          fieldLabel: "500-999人",
          fieldValue: "5"
        },
        {
          fieldLabel: "1000-5000人",
          fieldValue: "6"
        },
        {
          fieldLabel: "5000人以上",
          fieldValue: "7"
        }
      ],
      scale: {
        fieldValue: "1",
        fieldLabel: "不限规模",
        fieldName: "scale",
        inx: 0
      },
      turnoverArr: [
        {
          fieldLabel: "不限营业额",
          fieldValue: "1"
        },
        {
          fieldLabel: "1-49万",
          fieldValue: "2"
        },
        {
          fieldLabel: "50-99万",
          fieldValue: "3"
        },
        {
          fieldLabel: "100-499万",
          fieldValue: "4"
        },
        {
          fieldLabel: "500-999万",
          fieldValue: "5"
        },
        {
          fieldLabel: "1000-5000万",
          fieldValue: "6"
        },
        {
          fieldLabel: "5000万以上",
          fieldValue: "7"
        }
      ],
      turnover: {
        fieldValue: "1",
        fieldLabel: "不限营业额",
        fieldName: "turnover",
        inx: 1
      },
      natureArr: [
        {
          fieldLabel: "不限",
          fieldValue: "1"
        },
        {
          fieldLabel: "外商独资",
          fieldValue: "2"
        },
        {
          fieldLabel: "中外合营",
          fieldValue: "3"
        },
        {
          fieldLabel: "私营.民营企业",
          fieldValue: "4"
        },
        {
          fieldLabel: "国有企业",
          fieldValue: "5"
        },
        {
          fieldLabel: "国内上市企业",
          fieldValue: "6"
        },
        {
          fieldLabel: "政府机关/非营利机构",
          fieldValue: "7"
        },
        {
          fieldLabel: "事业单位",
          fieldValue: "8"
        },
        {
          fieldLabel: "其他",
          fieldValue: "9"
        }
      ],
      nature: {
        fieldValue: "1",
        fieldLabel: "不限",
        fieldName: "nature",
        inx: 2
      },
      QNtoken: "",
      content: "",
      attachments: [],
      // 弹窗
      layer: 0,
      // imglist: [],
      endTime: "",
	    id: "",
    };
  },
  watch: {
    $route:function() {
      this.reload();
    }
  },
  methods: {
    // 省市联动
    changeProvince(id) {
      this.city = [];
      this.region = [];
      this.cityValue = "";
      this.regionValue = "";
      for (let item of this.province) {
        if (id == item.id) {
          this.provinceLabel = item.name;
          this.city = item.children;
        }
      }
      if (id == "000000") {
        this.provinceLabel = "全国";
        this.cityLabel = "";
        this.regionLabel = "";
      }
    },
    changeCity(id) {
      this.region = [];
      this.regionValue = "";
      for (let item of this.city) {
        if (id == item.id) {
          this.cityLabel = item.name;
          this.region = item.children;
        }
      }
    },
    changeRegion(id) {
      for (let item of this.region) {
        if (id == item.id) {
          this.regionLabel = item.name;
        }
      }
      if (id == 0) {
        this.regionLabel = "全部区县";
      }
    },
    scaleChange(e, name) {
      // console.log(e, name);
      this[name].fieldLabel = e.label;
      this[name].fieldValue = e.value;
      // console.log(this[name].fieldLabel, this[name].fieldValue);
    },
    changeEndTime(e) {
      this.endTime = e;
    },
    beforeAvatarUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 0.1;
      if (!isLt20M) {
        this.$message.error("上传图片的大小不能超过 20M!");
      }
      return isLt20M;
    },
    error(res) {
      // console.log(res);
      layer.msg("文件类型不正确,请重新上传");
      // console.log(res);
    },
    // upImagesSuccess(e) {
    // 	this.imglist.push(e.url);

    // },
    upImagesError(e) {},
    delFileCollection(key) {
      // this.fileCollection_old.splice(key, 1)
      this.attachments.splice(key, 1);
    },
    // 附件上传
    upcoverUrl(e) {
      // console.log(e);
      if (e.type.indexOf("image") == -1) {
        // this.fileCollection_old.push(e.url)
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
    deleteFieldslist(index) {
      this.Fields.splice(index, 1);
    },
    // 自定义标签
    onisfields(e) {
      this.isfields = e;
      // console.log(this.$refs.fields.value)
      // console.log("getFields", this.Fields)
      for (var i = 0; i < this.Fields.length; i++) {
        if (this.Fields[i].name == this.$refs.fields.value) {
          layer.msg("该标签已存在");
          return;
        }
      }
      if (e) {
        // console.log("e", e);
        setTimeout(() => {
          this.$refs.fields.focus();
        });
      } else {
        if (this.$refs.fields.value != "") {
          this.Fields.push({
            name: this.$refs.fields.value
          });
          this.isfieldsedit = 1;
          this.$refs.fields.value = "";
        }
      }
    },
    // 选中标签
    setformdate(e) {
      this.industries[e].state == 1
        ? (this.industries[e].state = 0)
        : (this.industries[e].state = 1);
    },
    // 草稿
    issue1() {
      // 数据处理-行业
      var industries = [];
      for (var item of this.industries) {
        if (item.state == 1) {
          industries.push({
            id: item.id,
            name: item.name
          });
        }
      }
      // 省市区
      if (this.provinceValue == "000000") {
        var location = this.provinceLabel;
      } else {
        var location =
          this.provinceLabel +
          `${this.cityLabel ? "-" : ""}` +
          this.cityLabel +
          `${this.regionLabel ? "-" : ""}` +
          this.regionLabel;
      }
      var locCode =
        this.provinceValue == "000000"
          ? "000000"
          : this.provinceValue && !this.cityValue
          ? this.provinceValue
          : this.cityValue && !parseInt(this.regionValue)
          ? this.cityValue
          : this.regionValue
          ? this.regionValue
          : this.provinceValue
          ? this.provinceValue
          : this.cityValue;
      // 自定义
      var extraProperties = [];
      extraProperties.push(this.scale, this.turnover, this.nature);
      var data = {
        type: 1600,
        action: 16,
        title: this.title,
        industries: industries,
        tags: this.Fields,
        locCode: locCode,
        location: location,
        extraProperties: extraProperties,
        endTime: new Date("2079").getTime(),
        startTime: new Date().getTime(),
        content: this.content,
        entityId: this.defOrg.digitalCommerce,
        status: 0,
        attachments: this.attachments,
        creatorName: this.login.realName
      };
      if (this.id) {
        data.id = this.id;
      }
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
          // console.log("草稿", status, res);
          // layer.msg(res.msg)
          // if (res.code == 200) {
          if (!this.id) {
            this.id = res.data.id;
          }
          // }
        });
    },
    //发布
    issue(status) {
      if (this.title == "") {
        layer.msg("标题不能为空");
        return;
      }
      // 数据处理-行业
      var industries = [];
      for (var item of this.industries) {
        if (item.state == 1) {
          industries.push({
            id: item.id,
            name: item.name
          });
        }
      }
      if (!industries.length) {
        layer.msg("请选择行业");
        return;
      }
      // 省市区
      if (this.provinceValue == "000000") {
        var location = this.provinceLabel;
      } else {
        var location =
          this.provinceLabel +
          `${this.cityLabel ? "-" : ""}` +
          this.cityLabel +
          `${this.regionLabel ? "-" : ""}` +
          this.regionLabel;
      }
      var locCode =
        this.provinceValue == "000000"? 
        "000000" : this.provinceValue && !this.cityValue? 
        this.provinceValue : this.cityValue && !parseInt(this.regionValue)? 
        this.cityValue : this.regionValue? 
        this.regionValue : this.provinceValue? 
        this.provinceValue : this.cityValue;
      // 自定义
      var extraProperties = [];
      extraProperties.push(this.scale, this.turnover, this.nature);
      var data = {
        type: 1600,
        action: 16,
        title: this.title,
        industries: industries,
        tags: this.Fields,
        locCode: locCode,
        location: location,
        extraProperties: extraProperties,
        endTime: new Date("2079").getTime(),
        startTime: new Date().getTime(),
        content: this.content,
        entityId: this.defOrg.digitalCommerce,
        status: status == 2 ? 0 : status,
        attachments: this.attachments,
        creatorName: this.login.realName
      };
      if (this.id) {
        data.id = this.id;
      }
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
          // console.log("发布", status, res);
          // layer.msg(res.msg)
          // if (res.code == 200) {
          if (status == 1) {
             layer.msg("发布成功");
            return this.$router.push("/activitylist?messageType=0");
          } else if (status == 2) {
            data.id = res.data.id;
            let result = JSON.stringify(data);
            return this.$router.push({
              path: "/contentaudit",
              query: {
                id: data.id,
                isAudit: true,
                preview: true,
                page: this.page
              }
            });
          } else if (status == 0) {
            layer.msg("保存成功");
            return this.$router.push("/draftList?messageType=0");
          }
          // }
        });
    },
	  getDraft1() {
      this.http.ajax({
        url: "/activities/" + this.id,
        // url: 'business/g/policies',
        method: "get",
        headers: {
          "Content-Type": " application/json"
        },
        data: {
          entityId: this.defOrg.digitalCommerce
        }
      }).then(res => {
        this.title = res.title;
        this.Fields = res.tags;
        this.content = res.content;
        this.attachments = res.attachments;
        // 行业
        if(this.industries.length){
          for( var itemX of this.industries){
            for( var itemY of res.industries){
              if(itemX.id == itemY.id){
                itemX.state = 1
              }
            }
          }
        }
        // 地区
        if(res.locCode){
          var stringSpt = res.locCode;
          var arr= [];
          arr[0] = stringSpt[0] + stringSpt[1];
          arr[1] = stringSpt[2] + stringSpt[3];
          arr[2] = stringSpt[4] + stringSpt[5];
          if(res.locCode == '000000'){
            this.provinceLabel="全国";
            this.provinceValue="000000";
            this.cityValue="";
            this.cityLabel="";
            this.regionValue="";
            this.regionLabel="";
          }else if(!parseInt(arr[2]) && !parseInt(arr[1])){
            this.provinceValue = res.locCode;
            this.changeProvince(res.locCode);
            this.cityValue="";
            this.cityLabel="";
            this.regionValue="";
            this.regionLabel="";
          }else if(!parseInt(arr[2]) && parseInt(arr[1])){
            this.provinceValue = arr[0] + '0000';
            this.changeProvince(arr[0] + '0000');
            this.cityValue = res.locCode;
            this.changeCity(res.locCode);
            this.regionValue="";
            this.regionLabel="";
          }else{
            this.provinceValue = arr[0] + '0000';
            this.changeProvince(arr[0] + '0000');
            this.cityValue = arr[0] +arr[1] + '00';
            this.changeCity(arr[0] + arr[1] +'00');
            this.regionValue=res.locCode;
            this.regionLabel=res.locCode;
          }
          if(res.location.indexOf('全部区县')){
            this.regionValue='0';
            this.regionLabel='全部区县';
          }
        }
        // 下拉
        this.scale = res.extraProperties[0];
        this.turnover = res.extraProperties[1];
        this.nature = res.extraProperties[2];
        this.WangEditMethod()
      });
    },
    WangEditMethod(){
      // console.log('qiniuqiniuqiniuqiniuqiniu',qiniu)
      // console.log(this.$refs.editor)
      var editor = new E(this.$refs.editor);
      editor.customConfig.onchange = html => {
        // console.log(html)
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
      editor.create()
      if(this.content){
        editor.txt.append(`<p>${this.content}</p>`)
      }else{
        editor.txt.append(`<p><br></p>`)
      }
      // editor.cmd.do("insertHTML", this.content);
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
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.title != "" ||this.content != "") {
        this.issue1();
      }
    }, 20000);
  },
  created() {
    this.province = province;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      // this.getDraft();
    }else{
      // 省市级联动
      this.provinceValue = 370000;
      this.changeProvince(370000);
      this.cityValue = 370200;
      this.changeCity(370200);
      this.regionValue = 0;
      this.changeRegion(0);
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
  .btn.focus,
  .btn:focus,
  .btn:hover {
    color: #fff;
    text-decoration: none;
    box-shadow: 0 0px 0px #ccc;
  }
  .icon {
    vertical-align: middle;
    margin-right: 3px;
  }

  .ivu-form .ivu-form-item-label {
    text-align: left;
    color: #333333;
  }

  .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
    color: #515a6e;
  }
  .ivu-input-suffix i {
    line-height: 30px;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    line-height: 30px;
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

  .editor {
    .ivu-form-item-label:after {
      content: "（选填）";
      color: #ccc;
      font-size: 12px;
    }
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
    margin-right: 370px;
    .ivu-input {
      height: 30px;
    }
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

    background: #fafafa url("../assets/img/pz@2x.png") no-repeat center center;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .uploadpic_tips {
    font-size: 12px;
    color: #999999;
  }

  padding-left: 130px;

  // .imglist {
  // 	display: block;
  // 	width: 720px;
  // 	overflow: hidden;

  // 	.imgbox {
  // 		width: 33%;
  // 		margin-right: 0.3333%;
  // 		border: 1px solid #ccc;
  // 		border-radius: 15px;
  // 		display: block;
  // 		float: left;
  // 		height: 0;
  // 		padding-bottom: 33%;
  // 		margin-bottom: 15px;

  // 		img {
  // 			width: 100%;
  // 			height: auto;
  // 		}
  // 	}

  // }
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
      font-size: 14px;
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

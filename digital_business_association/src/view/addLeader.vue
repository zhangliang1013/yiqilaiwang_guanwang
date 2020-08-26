<template>
  <div>
    <div class="w">
      <div class="position">新增领导班子</div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="declare">
        <Form ref="formValidate" :label-width="100" :model="formValue">
          <FormItem label="机构名称">
            <Input style="width:350px;" placeholder :maxlength="35" v-model="formValue.name" />
          </FormItem>
          <FormItem label="职务">
            <Input style="width:350px;" placeholder :maxlength="35" v-model="formValue.newsDigest" />
          </FormItem>
          <div class="line"></div>
          <FormItem label="个人照片" class="clear">
            <Upload
              @success="upactPoster"
              @error="error"
              :personalInfo="personalInfo"
              :mimeType="mimeType"
              class="fl"
            >
              <div
                style="width: 110px;height: 154px;border:1px solid #ccc;border-radius: 5px;margin-right:22px;margin-bottom:18px;position: relative;"
              >
                <img
                  v-if="imglist==''"
                  src="../assets/img/pz@3x.png"
                  alt
                  style="width: 32px;height: auto;margin:62px 38px;"
                />
                <img v-if="imglist" :src="imglist" alt style="width: 110px;height: 154px;" />
                <span style="position: absolute;right: 5px;top: 0;color: #2168eb;">上传</span>
              </div>
            </Upload>
            <!-- </div> -->
          </FormItem>
          <div class="line"></div>
          <FormItem label="内容">
            <!-- <Input placeholder="标题" :maxlength="35" v-model="formValue.newsDigest"/> -->
            <Input
              style="width:350px;height:138px;"
              type="textarea"
              v-model="formValue.content"
              :maxlength="500"
              :autosize="{minRows: 6,maxRows: 6}"
              placeholder="点击输入人物备注信息"
            />
          </FormItem>
          <div>&nbsp;</div>
        </Form>
        <div
          class="btn"
          style="width:206px;margin-left:100px;margin-bottom:120px;"
          @click="issue()"
        >确认</div>
        <div
          class="layer staffeit"
          v-if="layer"
          style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;"
        >
          <div
            class="line"
            style="margin-left: 0px;margin-top: 0px;position: fixed;top: 50%; left: 15%;"
          >
            <div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
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
              <div style="margin-left:20px;">
                <div
                  class="show-preview"
                  :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}"
                >
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
                <input
                  type="button"
                  class="btn btn-blue"
                  style="margin-top:30px;margin-left:40px;"
                  value="上传头像"
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
import { VueCropper } from "vue-cropper";
import * as qiniu from "qiniu-js";
export default {
  name: "addLeader",
  props: {
    msg: String,
    personalInfo: null, //登陆后 的用户信息
    defOrg: null,
    login: null
  },
  data() {
    return {
      layer: false,
      formValue: {
        content: "",
        name: "",
        newsDigest: ""
      },
      imglist: "",
      headImg: "",
      previews: {},
      mimeType: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: true, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 110,
        autoCropHeight: 154,
        fixedBox: true
      },
      modelSrc: "",
      name: ""
    };
  },
  components: {
    VueCropper
  },
  created() {
    // this.getperson()
    if (this.$route.query.m == 1) {
      // console.log(this.$route.query.m);
      let data = JSON.parse(this.$route.query.row);
      this.formValue.name = data.name;
      this.formValue.newsDigest = data.position[0];
      this.imglist = data.photo;
      this.formValue.content = data.achievement;
    }
  },
  methods: {
    upactPoster(res) {
      // console.log(res);
      this.headImg = res.url;
      this.option.img = res.url;
      this.name = res.name;
      this.layer = true;
    },
    error(res) {
      layer.msg("文件类型不正确,请重新上传");
      // console.log(res);
    },
    // getperson(){
    //   console.log('查询')
    //     this.http
    //     .ajax({
    //       url: "person/"+this.$route.query.id,
    //       method: "GET",
    //       headers: {
    //         "Content-Type": " application/json"
    //       },
    //     })
    //     .then(res => {
    //       console.log('查询',res)
    //     });
    // },
    // 实时预览函数
    realTime(data) {
      // console.log("realTime", data);
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
      var loading = layer.load(1, {
        shade: [0.1, "#fff"] //0.1透明度的白色背景
      });
      this.http
        .ajax({
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
              this.imglist = res.data.qiniuDomain + "/" + result.key;
            }
          });
        });
    },
    //保存
    issue() {
      if (this.$route.query.m == 1) {
        let data = JSON.parse(this.$route.query.row);
        var position = [];
        position.push(this.formValue.newsDigest);
        this.http
          .ajax({
            url: "person",
            method: "POST",
            headers: {
              "Content-Type": " application/json"
            },
            data: {
              id: data.id,
              achievement: this.formValue.content,
              name: this.formValue.name,
              photo: this.imglist,
              position: position,
              inx: 0,
              entityId: this.defOrg.digitalCommerce
            }
          })
          .then(res => {
            // console.log(res);
            this.$router.back(-1);
          });
      } else {
        var position = [];
        position.push(this.formValue.newsDigest);
        this.http
          .ajax({
            url: "person",
            method: "POST",
            headers: {
              "Content-Type": " application/json"
            },
            data: {
              achievement: this.formValue.content,
              name: this.formValue.name,
              photo: this.imglist,
              position: position,
              inx: 0,
              entityId: this.defOrg.digitalCommerce
            }
          })
          .then(res => {
            // console.log(res);
            this.$router.back(-1);
          });
      }
    }
  }
};
</script>
<style lang="less">
.declare {
  overflow: hidden;
  padding: 64px 180px 0;
  .line {
    border-bottom: 1px dashed #dddddd;
    margin-bottom: 24px;
  }
}
.ivu-form .ivu-form-item-label {
  text-align: left;
}
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .cropper {
    width: 260px;
    height: 260px;
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
      border-radius: 50%;
      border: 1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.cropper-content .show-preview .preview {
  margin-left: 0;
  width: 110px;
  height: 154px;
  border-radius: 5px;
}
</style>
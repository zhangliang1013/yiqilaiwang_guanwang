<template>
  <div class=".uploadfile" @click="zh_uploadFile">
    <slot></slot>
    <input type="file" ref="evfile" @change="zh_uploadFile_change" style="display: none" />
  </div>
</template>

<script>
import axios from "axios";
import * as qiniu from "qiniu-js";
export default {
  name: "upload",
  data() {
    return {
      filename: ""
    };
  },
  props: {
    mimeType: null,
    type:null,
    // file2:null,
    // mimeLimit:null,
  },
  methods: {
    zh_uploadFile() {
      this.$refs.evfile.click();
    },
    zh_uploadFile_change(evfile) {
      var loading = layer.load(1, {
        shade: [0.1, "#fff"] //0.1透明度的白色背景
      });

      if (evfile.target.files.length == 0) {
        layer.close(loading);
        return;
      }
      if (evfile.target.files[0].size / 1024 / 1024 > 100) {
        layer.msg("上传文件不能超过100M");
        layer.close(loading);
        return;
      }
      if (this.mimeType == null || this.mimeType == "") {
      } else {
        if (this.mimeType.length > 0) {
          var aname = evfile.target.files[0].name.split(".");
          if (aname.length > 2) {
            aname[1] = aname[aname.length - 1];
          }
          aname[1] = aname[1].toLowerCase();
          if (
            aname[1] == "gif" ||
            aname[1] == "png" ||
            aname[1] == "jpg" ||
            aname[1] == "jpeg"
          ) {
            aname[1] = "image/" + aname[1];
          }
          var t = this.mimeType.join("_").indexOf(aname[1]);
          if (t == -1) {
            layer.msg("上传文件类型错误");
            layer.close(loading);
            return;
          }
        }
      }
      this.filename = evfile.target.files[0].name;
      this.http
        .ajax({
          url: "../../webSite/home/uploadApplication",
          method: "post",
          headers: {
            // "api-client": "f07684ed4d4411e9ac1ffa163e4d6ba1",
            // "api-version": "1.2.2"
          }
          // data: {
          // 	uid: this.personalInfo.uid
          // }
        })
        .then(res => {
          // this.http.ajax({
          // 	url: 'webSite/home/uploadApplication',
          // 	method: 'post',
          // 	data: {
          // 		uid: this.personalInfo.uid
          // 	}
          // }).then(res => {
          var uptoken = res.data.upToken;
          var file = evfile.target.files[0]; //Blob 对象，上传的文件

          var key = null; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

          var region = res.data.region.split(".");
          let config = {
            useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
            region: qiniu.region[region[2]] // ,当为 null 或 undefined 时，自动分析上根据具体提示修改上传地区传域名区域
          };

          let putExtra = {
            fname: this.filename, //文件原文件名
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
              this.$emit("success", {
                url: encodeURI(res.data.qiniuDomain + "/" + result.key + (this.type=='file'?`?attname=${this.filename}`:'')),
                qiniu: result,
                uploadApplication: res,
                name: this.filename,
                type: file.type,
                size: file.size
              });
              layer.close(loading);
              // 接收成功后返回的信息
              // console.log(this.type,encodeURI(res.data.qiniuDomain + "/" + result.key + (this.type=='file'?`?attname=${this.filename}`:'')))
            }
          });
        });
    }
  }
};
</script>
<style lang="less">
.uploadfile {
  display: inline-block;
}
</style>

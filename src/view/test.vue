<template>
  <div style="display:flex;">
    <div class="info-item" style="flex:1;">
      <!-- <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin-left:123px;border:1px solid #ddd">
        <img style="width:120px;height:120px;" :src="headImg" alt="头像">
      </div> -->
    </div>
    <div class="info-item" style="flex:1;margin-left:-160px;margin-top:30px;">
      <!-- <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;">选择图片</label> -->
      <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      <input type="button" class="oper" style="width:23px;font-size:20px;margin:3px 5px;" value="+" title="放大" @click="changeScale(1)">
      <input type="button" class="oper" style="width:23px;font-size:20px;margin:3px 5px;" value="-" title="缩小" @click="changeScale(-1)">
      <input type="button" class="oper" style="width:23px;font-size:20px;margin:3px 5px;" value="↺" title="左旋转" @click="rotateLeft">
      <input type="button" class="oper" style="width:23px;font-size:20px;margin:3px 5px;" value="↻" title="右旋转" @click="rotateRight">
      <input type="button" class="oper" style="width:23px;font-size:20px;margin:3px 5px;" value="↓" title="下载" @click="down('blob')">
      <input type="button" class="btn btn-blue" value="上传头像" @click="finish">
      <input type="button" class="btn btn-blue" value="shangchuan " @click="startCrop">
    
      <div class="line" style="margin-left: -280px;margin-top: 85px;">
        <div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
          <img src="./../assets/img/xxtz2@2x.png"  alt="" style="position:absolute;right:-100px;top:-150px">
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
            <div class="show-preview" :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Upload @success="upactPoster" :personalInfo="personalInfo" :mimeType="mimeType" @error="error">
        <div class="uploadpic">
            上传
            <!-- <img :src="headImg" alt=""> -->
        </div>
    </Upload>
  </div>
</template>

<script>
  import { VueCropper }  from 'vue-cropper' 
  import * as qiniu from 'qiniu-js'
//   import Api from '@/js/api.js' //接口url配置文件

  export default {
    props: {
        personalInfo: null,
        defOrg: null
    },
    data() {
      return {
        headImg:'',
		mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
        //剪切图片上传
        crap: false,
        previews: {},
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: true,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true, 
          original: false, 
          canMoveBox: true, 
          autoCrop: true, 
          autoCropWidth: 170, 
          autoCropHeight: 150, 
          fixedBox: true 
        }, 
        fileName:'',  //本机文件地址
        downImg: '#',
        imgFile:'',
        uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
        modelSrc:"",
        name:"",
      }
    },
    components: { 
      VueCropper 
    }, 
    methods: { 
        upactPoster(res) {
            // console.log(res);
            this.headImg = res.url;
            this.option.img = res.url;
            this.name = res.name;

        },
        finish(){
            var loading = layer.load(1, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
            this.http.ajax({
                url: 'webSite/home/uploadApplication',
                method: 'post',
                data: {
                    uid: this.personalInfo.uid
                }
            }).then(res => {
                var uptoken = res.data.upToken
                var file = this.modelSrc //Blob 对象，上传的文件
                
                var key = null // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

                var region = res.data.region.split('.');
                let config = {
                    useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    region: qiniu.region[region[2]] // ,当为 null 或 undefined 时，自动分析上根据具体提示修改上传地区传域名区域
                };

                let putExtra = {
                    fname: this.name, //文件原文件名
                    params: {}, //用来放置自定义变量
                    // mimeLimit:"",
                    // mimeLimit: this.mimeLimit,
                    // mimeType: this.mimeType //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                };
                var observable = qiniu.upload(file, key, uptoken, putExtra, config);
                observable.subscribe({
                    next: (result) => {
                        // 主要用来展示进度

                    },
                    error: (errResult) => {
                        // 失败报错信息
                        // console.log('异常类型')
                        // this.file = null;
                        // this.$refs.evfile
                        // console.log(this.$refs.evfile.val());
                        this.$refs.evfile.value = null;
                        this.$emit('error', {errResult})
                        layer.close(loading)
                    },
                    complete: (result) => {
                        // console.log("result",result)
                        layer.close(loading)
                        // 接收成功后返回的信息
                        // console.log(res.data.qiniuDomain+'/'+result.key)
                    }
                })
            })
        },
        error(res) {
            layer.msg('文件类型不正确,请重新上传')
            // console.log(res);
        },
      //放大/缩小
      changeScale(num) { 
        // console.log('changeScale')
        num = num || 1; 
        this.$refs.cropper.changeScale(num); 
      }, 
      //坐旋转
      rotateLeft() { 
        // console.log('rotateLeft')
        this.$refs.cropper.rotateLeft(); 
      }, 
      //右旋转
      rotateRight() { 
        // console.log('rotateRight')
        this.$refs.cropper.rotateRight(); 
      }, 
      startCrop(){
          this.$refs.cropper.startCrop();
      },
      // 实时预览函数 
      realTime(data) { 
        // console.log('realTime',data)
        this.previews = data 
        this.$refs.cropper.getCropBlob((data) => { 
          this.modelSrc = data; 
        })
      }, 
      //下载图片
      down(type) { 
        // console.log('down')
        var aLink = document.createElement('a') 
        aLink.download = 'author-img' 
        if (type === 'blob') { 
          this.$refs.cropper.getCropBlob((data) => { 
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data) 
            aLink.click() 
          }) 
        } else { 
          this.$refs.cropper.getCropData((data) => { 
            this.downImg = data;
            aLink.href = data; 
            aLink.click() 
          }) 
        } 
      }, 
      //选择本地图片
      uploadImg(e, num) { 
        // console.log('uploadImg');
        var _this = this;
        //上传图片 
        var file = e.target.files[0] 
        _this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) { 
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种') 
          return false 
        } 
        var reader = new FileReader(); 
        reader.onload =(e) => { 
          let data; 
          if (typeof e.target.result === 'object') { 
            // 把Array Buffer转化为blob 如果是base64不需要 
            data = window.URL.createObjectURL(new Blob([e.target.result])) 
          } 
          else { 
            data = e.target.result 
          }
          if (num === 1) { 
            _this.option.img = data 
          } else if (num === 2) { 
            _this.example2.img = data 
          } 
        } 
        // 转化为base64 
        // reader.readAsDataURL(file) 
        // 转化为blob 
        reader.readAsArrayBuffer(file);
        
      }, 
      imgLoad (msg) { 
      }
    }, 
    
  }
</script>

<style lang="less">
  .info {
    width: 720px;
    margin: 0 auto;
    .oper-dv {
      height:20px;
      text-align:right;
      margin-right:100px;
      a {
        font-weight: 500;
        &:last-child {
          margin-left: 30px;
        }
      }
    }
    .info-item {
      margin-top: 15px;
      label {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      .sel-img-dv {
        position: relative;
        .sel-file {
          position: absolute;
          width: 90px;
          height: 30px;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .sel-btn {
          position: absolute;
          cursor: pointer;
          z-index: 1;
        }
      }
    }
  }

  .cropper-content{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper{
      width: 260px;
      height: 260px;
    }
    .show-preview{
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview{
        overflow: hidden;
        border-radius: 50%;
        border:1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }
  .cropper-content .show-preview .preview {margin-left: 0;}
 
</style>
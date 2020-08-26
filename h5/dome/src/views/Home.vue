<template>
  <div class="wrapper">
    <!-- <div class="title" v-html="title"></div> -->

    <div class="input-wrapper">

      <input type="file" name=""  ref="evfile" id="upload"  @change="zh_uploadFile_change($event,'image')" style="display: none">
      <input type="file" name=""  ref="evfile" id="upload1"  @change="zh_uploadFile_change($event,'video')" style="display: none">

      <quill-editor
        class="editor"
        v-model="messages"
        ref="myQuillEditor"
        @blur="onEditorBlur"
        @focus="onEditorFocus"
        @ready="onEditorReady"
        :options="editorOption"
        style="height: 500px;"
      >
        <!-- <div id="toolbar" slot="toolbar">
                <button class="ql-bold">Bold</button>
                <button class="ql-italic">Italic</button>
                <select class="ql-size">
                    <option value="small"></option>
                    <option selected></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                </select>
                <select class="ql-font">
                    <option selected="selected"></option>
                    <option value="serif"></option>
                    <option value="monospace"></option>
                </select>

                <button class="ql-script" value="sub"></button>
                <button class="ql-script" value="super"></button>
           
                 <button id="custom-button" >[ Click me ]</button> 
        </div>-->
      </quill-editor>
    </div>

    <!--videoUploadTag 默认是 false -->
    <!--所以这里的上传弹框是隐藏的 -->
    <!--当点击编辑器菜单栏中的视频图标时，将videoUploadTag 修改为 true 在页面上显示出来插入视频的弹框-->
    <!-- <div v-if="videoUploadTag">
      <el-dialog
        width="50%"
        id="video_upload"
        style="margin-top: 1px"
        title="视频上传"
        :visible.sync="videoUploadTag"
        append-to-body
      >
        <el-tabs value="0">
          <el-tab-pane label="添加视频链接" name="first">
            <el-input placeholder="请输入视频链接" clearable></el-input>
            <el-button
              type="primary"
              size="small"
              style="margin: 20px 0px 0px 0px "
              @click="addVideoLink()"
            >添加</el-button>
          </el-tab-pane>
          <el-tab-pane label="素材库" name="second">请期待</el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>-->
  </div>
</template>

<script>
  import * as qiniu from 'qiniu-js'
  const toolbarOptions = [
      // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      // ['blockquote', 'code-block'],
      ['blockquote', ],
    
      [{'header': 1}, {'header': 2}],               // custom button values
      // [{'list': 'ordered'}, {'list': 'bullet'}],
      [ {'list': 'bullet'}],
      // [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      // [{'direction': 'rtl'}],                         // text direction
    
      // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      // [{'header': [1, 2, 3, 4, 5, 6, false]}],
    
      // [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      // [{'font': []}],
      // [{'align': []}],
      ['link', 'image', 'video'],
      ['clean']                                         // remove formatting button
    ]
export default {
  data() {
    return {
      title: "富文本编辑器测试",
      messages: "", //绑定数据
      history: [],
      editorOption: {
        //配置
        modules: {
          toolbar:{
            container: toolbarOptions,  // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  // alert('自定义图片')
                  document.querySelector('#upload').click()
                } else {
                  this.quill.format('image', false);
                }
              },
              'video': function (value) {
                if (value) {
                  // alert('自定义图片')
                  document.querySelector('#upload1').click()
                } else {
                  this.quill.format('image', false);
                }
              },
            }
          },
        },
      },
      filename:'',
      // mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
      mimeType: null,
    };
  },
  methods: {
    hintGetFun() {
      this.$nextTick(function () {
        this.$refs.myQuillEditor.quill.enable(true);
        this.$refs.myQuillEditor.quill.blur();
      });
    },

    onEditorBlur() {
      //失焦事件
      console.log("blur", this.messages);
    },
    onEditorFocus() {
      //聚焦事件
      console.log("focus", this.messages);
    },
    onEditorReady() {
      //进来执行
      console.log("ready", this.messages);
    },
    // addVideoLink() {
    //   if (this.videoLink.length == 0) {
    //     alert("请输入视频链接");
    //   }
    //   //当编辑器中没有输入文本时，这里获取到的 range 为 null
    //   var range = this.$refs.editer.quill.getSelection();
    //   //视频插入在富文本中的位置
    //   var index = 0;
    //   if (range == null) {
    //     index = 0;
    //   } else {
    //     index = range.index;
    //   }
    //   //隐藏弹框
    //   this.videoUploadTag = false;
    //   //将视频链接插入到当前的富文本当中
    //   this.$refs.editer.quill.insertEmbed(index, "video", this.videoLink);
    // },
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      return str;
    },

    handleSuccess (res,type) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, type, res)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        layer.msg('图片插入失败')
      }
    },
    zh_uploadFile_change(evfile,type) {
				var loading = layer.load(1, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});

				if(evfile.target.files.length==0){
					layer.close(loading)
					return
				}
				if(evfile.target.files[0].size/ 1024 / 1024 > 100){
					layer.msg("上传文件不能超过100M")
					// layer.close(loading)
					return
				}
				if(this.mimeType==null||this.mimeType==""){
					
				}else{
				if(this.mimeType.length>0){
					var aname=evfile.target.files[0].name.split(".")
					if(aname.length>2){
						aname[1]=aname[aname.length-1]
					}
					aname[1]=aname[1].toLowerCase()
					if(aname[1]=="gif"||aname[1]=="png"||aname[1]=="jpg"||aname[1]=="jpeg"){
						aname[1]=("image/"+aname[1])
					}
					var t=this.mimeType.join('_').indexOf(aname[1])
					if(t==-1){
						layer.msg("上传文件类型错误")
						layer.close(loading)
						return
					}
					
				}}
				this.filename=evfile.target.files[0].name

				this.http.ajax({
					url: 'webSite/home/uploadApplication',
					method: 'post',
					data: {
						uid: '789b0074fa1311e9945200163e05ff66'
					}
				}).then(res => {
					var uptoken = res.data.upToken
					var file = evfile.target.files[0] //Blob 对象，上传的文件
					// console.log("file",file)
					var key = null // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

					var region = res.data.region.split('.');
					let config = {
						useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
						region: qiniu.region[region[2]] // ,当为 null 或 undefined 时，自动分析上根据具体提示修改上传地区传域名区域
					};

					let putExtra = {
						fname: this.filename, //文件原文件名
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
              console.log( encodeURI(res.data.qiniuDomain + '/' + result.key + (this.type=='file'?`?attname=${this.filename}`:'') ) )
              console.log(result)
              console.log(this.filename)
              var url = encodeURI(res.data.qiniuDomain + '/' + result.key + (this.type=='file'?`?attname=${this.filename}`:'') );
              this.handleSuccess(url,type);
							// this.$emit('success', {
							// 	url:encodeURI(res.data.qiniuDomain + '/' + result.key + (this.type=='file'?`?attname=${this.filename}`:'')),
							// 	qiniu: result,
							// 	uploadApplication: res,
							// 	name:this.filename,
							// 	type:file.type,
							// 	size:file.size,
							// })
							layer.close(loading)
							// 接收成功后返回的信息
							//console.log(res.data.qiniuDomain+'/'+result.key)
						}
					})
				})
			}
  },
  mounted() {
    this.editorOption.initButton && this.editorOption.initButton();
    this.hintGetFun();
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  props: {
    deconstruct: {
      type: String,
      required: false,
      default: "",
    },
  },
  watch: {},
  created() {
    this.content = this.escapeStringHTML(this.deconstruct);
    if (this.deconstruct === "") {
      this.history.push("");
    }
    // this.editorOption.modules.toolbar.container = [
    //   ["bold", "italic", "underline", "strike"],
    //   [{ color: [] }],
    //   ["revoke"],
    //   ["restore"],
    // ];

    // this.editorOption.modules.toolbar.handlers.revoke = () => {
    //   if (this.history.length > 1) {
    //     let history = this.history.pop();
    //     history = this.history.pop();
    //     this.content = history;
    //   }
    //   this.hintGetFun();
    // };
    // this.editorOption.modules.toolbar.handlers.restore = () => {
    //   let history = this.history[0];
    //   this.history = [];
    //   this.content = history;
    //   this.hintGetFun();
    // };
    //   this.editorOption.initButton = function () {
    //     // 在使用的页面中初始化按钮样式
    //     const revokeButton = document.querySelector(".ql-revoke");
    //     revokeButton.style.cssText = "width:28px;height:24px;padding:2px 4px";
    //     revokeButton.innerHTML =
    //       '<img style="width:18.4px;height:18.4px" src="' + revokeImg + '" />';

    //     const restoreButton = document.querySelector(".ql-restore");
    //     restoreButton.parentNode.style.cssText = "float:right;margin-right:0";
    //     restoreButton.style.cssText =
    //       "height:24px;color:#3B80FC;cursor:pointer;width:80px;text-align:center;";
    //     restoreButton.innerHTML = "一键恢复";
    //   };
  },
};
</script>

<style lang="less">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .title {
    // font-size: 30px;
    color: red;
    padding-bottom: 20px;
    line-height: 150%;
  }

  .input-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    // margin: px2rem(5) 0;
    box-sizing: border-box;

    .editor {
      width: 100%;
      // height: px2rem(200);
      .ql-toolbar.ql-snow{
        text-align: left;
        .ql-formats {
          margin-right: 0;
        }
        .ql-picker.ql-size{
          width: 70px; 
        }
        .ql-picker.ql-header {
          width: 82px; 
        }
      }
      .ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button {
        height:auto;
        width:42px;
        padding: 3px 9px;
      }
      .ql-container.ql-snow{
        font-size:16px;
      }
      .ql-editor.ql-blank:before {
        font-style: normal;
      }
      .ql-editor ol, .ql-editor ul {
        padding-left: 10px;
      }
      .ql-editor ol li:not(.ql-direction-rtl), .ql-editor ul li:not(.ql-direction-rtl) {
        padding-left: 20px;
      }
      .ql-toolbar.ql-snow{
        position:absolute;
        bottom:10px;
        border:none;
      }
      .ql-container.ql-snow{
        position:relative;
        top:0px;
        border:1px solid #ccc;
      }
      .ql-tooltip{
        font-size: 13px;
        padding: 5px 6px;
        .ql-preview{
          max-width:183px;
        }
       
      }
      .ql-snow .ql-tooltip a.ql-action::after {
        margin-left:8px;
      }
    
    }

    .sub-title {
      // font-size: $font-size-normal;
      // color: $text-normal;
    }

    .field {
      flex: 1;
      border: 1px solid pink;
    }
  }
}

div.ql-container.ql-snow {
  // height: px2rem(100);
}

div.ql-editor.ql-blank {
  // height: px2rem(50);
}
</style>

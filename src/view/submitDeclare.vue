<template>
  <div>
    <div class="w">
      <div class="position">政策提报</div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="declare">
        <div class="inputbox clear">
          <span class="fl title">公司名称</span>
          <input class="fl txt" type="text" />
        </div>
        <div class="inputbox clear">
          <span class="fl title">营业执照编号</span>
          <input class="fl txt" type="text" />
        </div>
        <div style="border-bottom: 1px dashed #dddddd;width: 719px;margin:23px 0 24px;"></div>
        <div class="inputbox clear">
          <span class="fl title">法人姓名</span>
          <input class="fl txt" type="text" />
        </div>
        <div class="inputbox clear">
          <span class="fl title">法人手机号</span>
          <input class="fl txt" type="text" />
        </div>
        <div style="border-bottom: 1px dashed #dddddd;width: 719px;margin:23px 0 24px;"></div>
        <div class="inputbox clear">
          <span class="fl title">企业性质</span>
          <input class="fl txt" type="text" />
        </div>
        <div class="inputbox clear">
          <span class="fl title">企业年营业额</span>
          <input class="fl txt" type="text" />
        </div>
        <div class="inputbox clear">
          <span class="fl title">企业人数</span>
          <input class="fl txt" type="text" />
        </div>
        <div style="border-bottom: 1px dashed #dddddd;width: 719px;margin:23px 0 24px;"></div>
        <Form ref="formValidate">
          <FormItem label="附件" :label-width="100">
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
              v-if="fileCollection.length <3"
              :mimeType="mimeType"
              type='file'
            >
              <div class="hand">
                <img src="../assets/img/fj@2x.png" class="uploadIco" alt />
                点击上传
              </div>
            </Upload>
          </FormItem>
        </Form>
        <div style="border-bottom: 1px dashed #dddddd;width: 719px;margin:23px 0 24px;"></div>
        <div class="btn" @click="issue()">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "submitDeclare",
  props: {
    msg: String,
    personalInfo: null, //登陆后 的用户信息
    defOrg: null
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
      fileCollection: [],
      fileCollection_old: []
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 0.1;
      if (!isLt20M) {
        this.$message.error("上传图片的大小不能超过 20M!");
      }
      return isLt20M;
    },
    // 附件上传
    upcoverUrl(e) {
      this.fileFname = e.name;
      this.fileFurl = e.url;
      // console.log(e)
      // this.fileCollection.push(e.url);

      if (this.fileCollection_old.indexOf(e.url) == -1) {
        this.fileCollection_old.push(e.url);
        this.fileCollection.push([this.fileFname, this.fileFurl]);
      }

      // console.log(e)
    },
    error(res) {
      layer.msg("文件类型不正确,请重新上传");
      // console.log(res);
    },
    delFileCollection(key) {
      this.fileCollection_old.splice(key, 1);
      this.fileCollection.splice(key, 1);
    }
  }
};
</script>
<style lang="less">
.declare {
  padding-top: 64px;
  padding-left: 180px;
  .inputbox {
    margin-bottom: 12px;
    .title {
      width: 102px;
    }
    .txt {
      width: 350px;
    }
  }
  .ivu-form .ivu-form-item-label {
    text-align: left;
  }
  .imgFileList {
		li {
			span {
				padding-left: 15px;
				font-size: 13px;
				color: #1E9FFF;
				// line-height: 40px;
			}
		}
    }
    .btn{
        width: 206px;
        margin: 28px 0 130px 257px;
    }
}
</style>
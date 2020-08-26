<template>
  <div>
    <div class="w">
      <div class="position">
        审批详情
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
      <!-- <div class="position" style="height:60px"></div> -->
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="details">
        <div class="list">
          <div class="box">
            <div class="li-box">
              <div class="li-left">项目名称</div>
              <div class="li-right">{{details.title}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">中介机构</div>
              <div class="li-right">{{details.entity&&details.entity.name}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">提交时间</div>
              <!-- <div class="li-right1">青岛十</div>
              <div class="li-left">法人手机号</div>-->
              <div class="li-right">{{details.createdDate? new Date(details.createdDate).Format("yyyy-MM-dd"):''}}</div>
            </div>
            <div class="li-box">
              <div class="li-left">类型</div>
              <!-- <div class="li-right1">民营企业</div>
              <div class="li-left">企业年营业额</div>-->
              <div class="li-right">{{getformId(details.reply)}}</div>
            </div>
            <!-- <div class="li-box">
              <div class="li-left"></div>
              <div class="li-right">2000人</div>
            </div>
            <div class="li-box">
              <div class="li-left">提报时间</div>
              <div class="li-right">2020-3-32 19：00</div>
            </div>-->
            <!-- <div class="li-box">
              <div class="li-left">审批结果</div>
              <div class="li-right">
                <img
                  v-if="type==1"
                  src="../assets/img/szsxhytg@3x.png"
                  style="width: 18px;height:18px;float: left;margin-top:15px;margin-right:5px;"
                />
                <img
                  v-if="type==2"
                  src="../assets/img/szsxhyth@3x.png"
                  style="width: 18px;height:18px;float: left;margin-top:15px;margin-right:5px;"
                />
                <span
                  :style="{color:(type==0?conFontColor0:type==1?conFontColor1:type==2?conFontColor2:type)}"
                >{{type==1?'已通过':type==2?'已退回':'未审核'}}</span>
                <span v-if="type==2" style="color:#f81414;margin-left:15px;font-weight: 600;">原因:</span>
              </div>
            </div>-->
            <!-- <div class="li-box">
              <div class="li-left">审批时间</div>
              <div class="li-right" style="color:#2168eb;text-decoration:underline">关于读书会</div>
            </div>-->
          </div>
          <div class="enclosure" v-if="details.attachments">
            <span style="float: left;margin-right:50px;">附件 ({{details.attachments.length}}个)</span>
            <div style="float: left;" @click="downloadAll">
              <img
                src="../assets/img/fjxqyl2@2x.png"
                style="width: 16px;height:16px;float: left;margin-top:17px;"
              />
              <span style="color:#2A6EEB;margin-left:5px;">
                <a href="javascript:void(0)">全部下载</a>
              </span>
            </div>
          </div>
          <div v-if="details.attachments">
            <div class="file" v-for="(value,index) in details.attachments" :key="index">
              <img
                src="../assets/img/fjxqyl1@3x.png"
                style="width: 50px;height:50px;float: left; display: block;"
              />
              <div style="margin-left:15px;float: left;">
                <div>
                  {{ value.name }}
                  <span style="color:#999999;margin-left:10px;">({{value.inx}}k)</span>
                </div>
                <div>
                  <a href="javascript:void(0)" @click="download(value.url,value.name)">下载</a>
                  &nbsp;&nbsp;&nbsp;
                  <a
                    target="_black"
                    v-if="value.name.indexOf('pdf') == -1&& value.name.indexOf('txt') == -1 && value.type ==2"
                    :href="'https://view.officeapps.live.com/op/view.aspx?src='+value.url"
                  >预览</a>
									<span v-else @click="tolayer(4,value)" style="color: #2D8cF0;;cursor: pointer;">预览</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isbtn==0" style="padding-left:290px;margin-top:45px;padding-bottom:50px;">
            <div v-if="details.reply!=1" class="btn1" @click="tolayer(1)" style='cursor:pointer'>退回</div>
            <div v-if="details.reply!=1" class="btn2" @click="tolayer(2)" style='cursor:pointer'>通过</div>
            <div v-if="details.reply==1" class="btn2" @click="tolayer(2)" style='cursor:pointer'>资金已拨付</div>
          </div>
        </div>
        <!-- 退回弹窗 -->
        <div class="layer staffeit" v-if="layer && layer !=4">
          <div class="content">
            <div class="title">填写退回原因</div>
            <div class="count-box">
              <Input
                type="textarea"
                :maxlength="50"
                placeholder="请输入退回原因"
                style="height:194px;width:294px;margin-top:32px; margin-left:18px;"
                v-model="formValue"
              />
              <div class="count">（{{formValue.length}}/50）</div>
            </div>
            <div class="btns">
              <div class="btn1" style="width:90px;padding:0" @click="tolayer(0)">取消</div>
              <div class="btn2" style="width:90px;padding:0" @click="tolayer(3)">确认退回</div>
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
  data() {
    return {
      layer: false,
      pre:"",
      formValue: "",
      type: 2,
      conFontColor0: "#f81414",
      conFontColor1: "#81c645",
      conFontColor2: "#333333",
      messageType: 2,
      fileCollection: [
        {
          name: "政策申请.xxlx",
          url:
            "https://img.yiqilaiwang.com/o_1e5onck63b2qvsrl5ltp214s5g.jpg?imageView2/1/q/30/format/jpg/ignore-error/1",
          inx: "11.5",
          type: 2
        }
      ],
      details: {},
      isbtn: 0,
      isrepeat:true,
    };
  },
  methods: {
    tolayer(e,value) {
      if (this.isrepeat) {
        if (e == 1) {
          this.layer = true;
        } else if (e == 0) {
          this.layer = false;
        } else if (e == 2) {
          this.isrepeat=false
          var data = {
            isPass: 1
          };
          if (this.details.reply == 3) {
            data.skipCount = 1;
          }
          this.http
            .ajax({
              url: "/replies/" + this.$route.query.id + "/approval",
              method: "post",
              headers: {
                "Content-Type": " application/json"
              },
              data: data
            })
            .then(res => {
              // console.log("通过");
              this.$router.back(-1);
            });
        } else if (e == 3) {
          this.isrepeat=false
          this.http
            .ajax({
              url: "/replies/" + this.$route.query.id + "/approval",
              method: "post",
              headers: {
                "Content-Type": " application/json"
              },
              data: {
                isPass: -1,
                suggestion: this.formValue
              }
            })
            .then(res => {
              // console.log("退回");
              this.layer = false;
              this.$router.back(-1);
            });
        }else if(e==4){
          this.layer = e;
          if(value){
					this.pre = value;
					this.pre.url = this.pre.url.split('?')[0];
				}
        }
      }
    },
    getformId(reply) {
      switch (reply) {
        case 0:
          return "已结束";
        case 1:
          return "资金拨付";
        case 2:
          return "资金申请已通过";
        case 3:
          return "资金申请";
        case 4:
          return "正式备案已通过";
        case 5:
          return "正式备案";
        case 6:
          return "预备案已通过";
        case 7:
          return "预备案";
      }
    },
    getdetails() {
      this.http
        .ajax({
          url: "replies/" + this.$route.query.id,
          method: "get",
          headers: {
            "Content-Type": " application/json"
          }
        })
        .then(res => {
          // console.log("详情", res);
          this.details = res;
        });
    },
			// 文件下载
			download(url, filename) { // 下载表格    

				axios.get(url, {
					responseType: 'blob',
				}).then(res => {
					// res = ''
					// console.log(res)
					const content = res
					const blob = new Blob([content.data], {
						// type: 'application/vnd.ms-excel'
						// 'Accept': 'application/vnd.openxmlformats-officedocument'
						//            + '.spreadsheetml.sheet',

					}) // 构造一个blob对象来处理数据
					const fileName = filename // 导出文件名
					// 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
					// IE10以上支持blob但是依然不支持download
					if ('download' in document.createElement('a')) { // 支持a标签download的浏览器

						const link = document.createElement('a') // 创建a标签
						link.download = fileName // a标签添加属性
						link.style.display = 'none'
						link.href = URL.createObjectURL(blob)
						document.body.appendChild(link)
						link.click() // 执行下载
						URL.revokeObjectURL(link.href) // 释放url
						document.body.removeChild(link) // 释放标签
					} else { // 其他浏览器
						navigator.msSaveBlob(blob, fileName)
					}


				}).catch(err => {
					// 失败处理,此时后端会返回Json格式错误

					// layer.msg(res.msg)
					layer.msg("shiba")
				})
			},
			downloadAll(){
				for(var index of this.details.attachments){
					this.download(index.url,index.name)
				}
      },
  },
  created() {
    // this.messageType = this.$route.query.messageType;
    this.isbtn = this.$route.query.m;
    this.getdetails();
  }
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
        width: 140px;
        height: 48px;
        border: 1px solid #999999;
        border-radius: 27px;
        font-size: 14px;
        color: #999999;
        text-align: center;
        line-height: 48px;
        float: left;
      }
      .btn2 {
        width: 140px;
        height: 48px;
        border-radius: 27px;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 48px;
        background: #2168eb;
        float: left;
        margin-left: 40px;
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
        width: 100px;
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        // padding: 0 22px;
        height: 28px;
        line-height: 28px;
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
        margin: 0 10px;
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
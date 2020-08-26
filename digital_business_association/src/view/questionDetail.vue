<template>
  <div>
    <div class="w">
      <div class="position">
        市民提问箱
      </div>
    </div>
    <div class="w bg" style='margin-bottom: 73px;'>
      <!-- 详情 -->
      <div class="detail" v-if="detail">
        <div class="u clear">
					<img class="uimg fl" :src="detail.avatarUrl" alt="">
          <div class="fl">
            <div style="margin:4px 0;">
              <span class="name">{{detail.userName}}</span><span class="phone">{{detail.telphone}}</span>
            </div>
            <div>
              <span class="name company" v-if="detail.company">{{detail.company}}&nbsp;</span>
              <span class="name company">{{detail.post}}</span>				
            </div>
          </div>
				</div>
        <div class="content">
          <div class="clear">
            <div class="left fl">问</div>
            <div class="right fl">
              <div class="question">{{detail.problemInfo}}</div>
              <div class="img-box clear">
                <div class="item fl" v-for="(item,index) in detail.govProblemFileEntityList" :key="index">
                  <img :src="item.fileUrl" preview alt="">
                </div>
              </div>
            </div>
          </div>
          <div>
          <div class="clear">
            <div class="left fl left1">答</div>
            <Form style="width: 480px;" class="fl quse-textarea">
              <FormItem label="" style="position:relative">
                <Input placeholder="" :autosize="{minRows: 6,maxRows: 14}" type="textarea" :maxlength="1000" v-model="feedbackResult" :disabled='status==1' />
                <div class="length">（{{feedbackResult.length}}/1000）</div>
              </FormItem>
            </Form>
          </div>
          <div class="btn" @click="toCommit">{{status==1?'返回':'完成'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "questionDetail",
    props: {
      personalInfo: null, //登陆后 的用户信息
      defOrg: null,
    },
    data() {
      return {
        feedbackResult:'',
        id:'',
        status:0,
        detail:null,
      }
    },
    methods:{
      getDetail(){
        this.http.ajax({
          url:'../../webSite/GovProblem/webSiteProblemInfo',
          method: 'post',
          headers: {
            'Content-Type': ' application/json'
          },
          data: {
            id:this.id,
          }
        }).then((res)=>{
          if(res.code == 200){
            this.detail = res.data;
            this.feedbackResult = this.detail.feedbackResult;
            this.status = this.detail.status;
            this.$previewRefresh();
          }
        })
      },
      toCommit(){
        if(this.status ==1){
          this.$router.back(-1);
          return
        }
        this.feedbackResult = this.feedbackResult.trim();
        if(!this.feedbackResult){
          layer.msg('请输入回复内容');
          return 
        }
        this.http.ajax({
        url:'../../webSite/GovProblem/saveGovProblemReply',
        method: 'post',
        headers: {
          'Content-Type': ' application/json'
        },
        data: {
          id:this.id,
          "feedbackResult":this.feedbackResult.trim()
        }
      }).then((res)=>{
        if(res.code == 200){
         layer.msg('回复成功');
         this.$router.back(-1);
        }
      })
      }
    },
    created(){
      this.id = this.$route.query.id;
      // this.status = this.$route.query.status;
      this.getDetail();
      // if(this.$route.query.status == 0){
      // }
      // 获取详情
    }
  }
</script>

<style lang="less">
  .detail{
    padding-top: 54px;
    padding-right: 200px;
    padding-bottom: 30px;
    padding-left: 260px;

    .u {
			// margin-top: 20px;
			margin-bottom: 20px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
			.uimg {
        width:60px;
        height:60px;
				-webkit-border-radius: 50%;
				-moz-border-radius: 50%;
				border-radius: 50%;
				background: #eeeeee;
				margin-right: 13px;
				display: inline-block;
				vertical-align: middle;
			}

			.name {
        font-size:18px;
        color:rgba(51,51,51,1);
        line-height:25px;
				margin-right: 14px;
      }
      .phone{
        font-size:14px;
        color:rgba(153,153,153,1);
        line-height:20px;
      }
      .company{
        font-size:16px;
      }

			.btn1 {
				padding: 0 10px;
				text-align: center;
				line-height: 22px;
				display: block;
				font-size: 12px;
				margin: 0 5px;
				height: 22px;
				border-radius: 14px;
				border: 1px solid rgba(151, 151, 151, 1);
				cursor: pointer;
				background: rgba(33, 104, 235, 1);
				color:white;
				float:right;
			}

			.time {
				font-size: 14px;
				color: #999999;
			}
    }
    .content{
      .img-box{
        margin:10px 10px 40px 0;
        .item{
          width:100px;
          height:75px;
          margin-right:10px;
          cursor: pointer;
          overflow: hidden;
          // transform: translate()
          img{
            width:100px;
            min-height:75px;
          }
        }
      }
      .answer{
        position:relative;
      }
      .left{
        width:40px;
        height:40px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(33,104,235,1);
        border-radius: 50%;
        text-align: center;
        color:rgba(33,104,235,1);
        line-height:40px;
        margin-right:23px;
      }
      .left1{
        color:#EB8E21;
        border:1px solid #EB8E21;
      }
      .question{
        width:480px;
        min-height: 98px;
        background:rgba(250,250,250,1);
        border-radius:3px;
        border:1px solid rgba(221,221,221,1);
        padding:13px 14px;
        font-size:14px;
        color:rgba(51,51,51,1);
        line-height:20px;
      }
      .quse-textarea{
        .ivu-input{
          background:#FAFAFA;
          padding: 13px 14px;
        }
      }
      .length{  
        position:absolute;bottom:0;right:0;
        padding: 0 9px 9px 0;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(136,136,136,1);
        line-height:17px;
      }
    }
    .btn{
      margin-left:64px;
      padding:0 89px;
      height:48px;
      line-height:48px;
      background:rgba(33,104,235,1);
      border-radius:27px;
      font-size:14px;
      color:rgba(255,255,255,1);
      margin-top: 16px;
    }
  }
</style>
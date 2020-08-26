<template>
    <div class="w">
        <div class="position">统计结果</div>
        <div class="wjStatistics bg">
            <div class="content">
                <div class="title">{{deatil.questionTitle}}</div>
                <div class="num">总回收量：<span style="color:#2168eb;">{{deatil.recoverCount}}</span> <span style="color:#2168eb;font-size:14px;margin-left:40px;cursor: pointer;" @click="check(deatil,2)">查看填报人员</span></div>
                <div class="line"></div>
                <div class="statistics">统计报表</div>
                <div class="list" v-for="(item,index) in list" :key="index">
                    <!-- 选择题 -->
                    <div class="choice" v-if='item.type==1 || item.type==3'>
                        <div class="clear" style="width:763px;">
                            <img v-if='item.mustAnswer==1' class="fl" style="width:20px;height:20px;" src='../assets/img/star.png'></img>
                            <span class="subject fl">{{index+1}}.{{item.questionSubject}}{{item.multipleChoice==0?'（单选）':'（多选）'}}</span>
                            <span class="answer fr">共{{item.replyCount}}人回答</span>
                        </div>
                        <div class="table">
                            <div class="mt">
                                <div class="item" style="width:592px;height:32px;">{{item.type==1?'选项':'名称'}}</div>
                                <div class="item" style="width:102px;border-left: 1px solid #eeeeee;height:32px;">{{item.type==1?'回复情况':'平均分'}}</div>
                            </div>
                            <div class="mc hand" v-for="(v,i) in item.options" :key="i">
                                <div class="item" style="width:592px;border-right: 1px solid #eeeeee;">{{v.option}}</div>
                                <div class="item" style="width:102px;">{{item.type==1?v.chooseCount:v.averageScore}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 填空题 -->
                    <div class="fill" v-if='item.type==2'>
                        <img v-if='item.mustAnswer==1' class="fl" style="width:20px;height:20px;" src='../assets/img/star.png'/>
                        <div class="fill-title">{{index+1}}.{{item.questionSubject}}</div>
                        <div class="clear" style="width:763px; background: #f8f8f8;border: 1px solid #eeeeee;padding:0 16px;">
                            <span class="fl">共{{item.replyCount}}回答</span>
                            <span class="fr" style="cursor: pointer;" @click="check(item,1)">查看详情</span>
                        </div>
                    </div>
                </div>
                <div class="btn" @click="$router.back(-1)">返回</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "wjStatistics",
    props: {
        defOrg: null,
        personalInfo: null
    },
    data() {
    return {
      deatil:{},
      list: [],
      id:''
    };
  },
  methods: {
      getstatistics(){
          this.http.ajax({
						url: '../../webSite/questionMain/statistics',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data:{
                            id:this.id
                        }
					})
					.then(res => {
							if(res.code==200){
                                this.deatil=res.data
                                this.list = res.data.subjects
                            }
					})
      },
    check(row,type) {
      this.$router.push({
        path: "/wjFill",
        query: {
         'id': row.id,
         'type':type
        }
      });
    },
  },
  created() {
      this.id = this.$route.query.id;
      this.getstatistics()
  }
}
</script>
<style lang="less">
    .wjStatistics{
        margin-bottom: 73px;
        .content {
			overflow: hidden;
			width: 900px;
			display: block;
			margin: 0 auto;
			padding-top: 48px;
            padding-bottom:50px;
            .title {
                font-size: 24px;
                color: #333333;
            }
            .num{
                font-size: 14px;
                margin-top: 26px;
                line-height: 20px;
                color: #333333;
            }
             .line {
                border-bottom: 1px dotted #dddddd;
                margin: 28px 0;
            }
            .statistics{
                font-size: 16px;
                line-height: 22px;
                color: #333333;
                font-weight: 600;
            }
            .choice{
                margin-top: 30px;
                span{
                    font-size: 14px;
                    color: #333333;
                    line-height: 20px;
                }
                .subject{
                    max-width: 650px;
                }
                .answer{
                    color: #2168eb;
                }
                .table{
                    border: 1px solid #eeeeee;
                    width: 763px;
                    margin-top: 14px;
                    .mt{
                        height: 32px;
                        .item{
                            text-align: center;
                            line-height: 32px;
                        }
                    }
                    .mc{
                        border-top: 1px solid #eeeeee;
                        border-bottom: none;
                        // height: auto !important;
                        cursor: default;
                       .item{
                            text-align: center;
                            line-height: 32px;
                            height: auto ;
                        } 
                    }
                }
            }
            .fill{
                margin-top: 30px;
                .fill-title{
                    margin-bottom: 14px;
                    font-size: 14px;
                    color: #333333;
                    line-height: 20px;
                }
                span{
                    color: #2168eb;
                }
            }
            .btn{
              width: 206px;
              height: 48px;
              line-height: 48px;
              border-radius: 24px;
              color: #ffffff;
              font-size: 14px;
              text-align: center;
              margin: 66px 340px 0;
            }
        }
    }
</style>
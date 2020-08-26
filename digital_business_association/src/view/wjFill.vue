<template>
  <div class="w">
    <div class="position">
      统计结果
      <span @click="$router.back(-1)">返回</span>
    </div>
    <div class="wjFill bg">
      <div class="content" v-if='type==1'>
        <div class="title">填空题答案</div>
        <div class="table">
          <div class="mt">
            <div class="item" style="width: 100px;">序号</div>
            <div class="item" style="width: 450px;">回答内容</div>
            <div class="item" style="width: 120px;">人员</div>
            <div class="item" style="width: 190px;">所属组织</div>
          </div>
          <div class="mc" v-if="list.rows.length==0">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div class="mc hand" v-for="(v,i) in list.rows" :key="i">
              <div class="item" style="width:100px;">{{i+1}}</div>
            <div class="item" style="width:450px; padding-left:10px;">
                <div v-if="v.questionReply.length>50 && isshow!=i" style="width:430px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{v.questionReply}}</div>
                <div  v-if="v.questionReply.length<=50 || isshow==i">{{v.questionReply}}</div>
                <div v-if="v.questionReply.length>50" @click="showbtn(i)" style="font-size:14px;color:#2168eb;line-height:20px;">{{isshow==i?'收起':'展开全部'}}</div>
            </div>
            <div class="item" style="width:120px;">{{v.realName}}</div>
            <div class="item" style="width:190px; padding-left:10px;">{{v.orgName}}</div>
          </div>
           <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="list.total"
            @on-change="getstatistics"
            show-elevator
            :page-size="10"
            :show-total="true"
          />
        </div>
      </div>
      <!-- 填报人员 -->
      <div class="content" v-if='type==2'>
      <div class="table">
          <div class="mt">
            <div class="item" style="width: 100px;">序号</div>
            <div class="item" style="width: 450px;">参与组织</div>
            <div class="item" style="width: 120px;">参与人数</div>
          </div>
          <div class="mc" v-if="list.rows.length==0">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div class="mc hand" v-for="(v,i) in list.rows" :key="i">
             <div class="item" style="width:100px;">{{i+1}}</div>
            <div class="item" style="width:450px;">{{v.orgName}}</div>
            <div class="item" style="width:120px; color:#2168eb;" @click="check(v)">{{v.replyCount}}</div>
          </div>
           <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="list.total"
            @on-change="getstatistics"
            show-elevator
            :page-size="10"
            :show-total="true"
          />
        </div>
      </div>
    </div>
  </div> 
</template>
<script>
    export default {
    name: "wjFill",
    props: {
        defOrg: null,
        personalInfo: null,
    },
    data() {
        return {
        list: [],
        page: 1,
        isshow:null,
        type:null,
        };
    },
    methods:{
        getstatistics(page){
          this.http.ajax({
						url: '../../webSite/questionMain/answer',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data:{
                id:this.id,
                pageSize:10,
                pageNumber:page,
              }
					})
					.then(res => {
							if(res.code==200){
                this.list = res.data
              }
					})
      },
      getreplyOrg(page){
          this.http.ajax({
						url: '../../webSite/questionMain/replyOrg',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data:{
                id:this.id,
                pageSize:10,
                pageNumber:page,
              }
					})
					.then(res => {
							if(res.code==200){
                this.list = res.data
              }
					})
      },
      showbtn(a){
        if(this.isshow==a){
          this.isshow=null
        }else{
          this.isshow=a
        }
      },
      check(row){
        this.$router.push({
        path: "/wjSee",
        query: {
         'id': this.id,
         'orgId':row.orgId
        }
      });
      },
    },
    created() {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type
      if(this.type==1){
        this.getstatistics(this.page)
      }else{
        this.getreplyOrg(this.page)
      }
  }
    };
</script>
<style lang="less">
    .wjFill {
        margin-bottom: 30px;
        .content {
            overflow: hidden;
            padding-top: 36px;
            padding-left: 90px;
            padding-right: 90px;
            padding-bottom: 36px;
            .title {
            font-size: 16px;
            margin-bottom: 40px;
            }
            .table{
                width: 900px;
                .mt{
                    .item{
                        text-align: center;
                    }
                }
                .mc{
                    .item{
                        font-size: 14px;
                        text-align: center;
                        line-height: 22px;
                        height: 60px;
                        padding-top: 10px;
                        height: auto;
                    }
                }
                
            }
        }
    }
</style>

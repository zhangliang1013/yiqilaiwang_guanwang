<template>
  <div class="w">
    <div class="position">
      统计结果
      <span @click="$router.back(-1)">返回</span>
    </div>
    <div class="wjSee bg">
      <div class="content">
      <div class="table">
          <div class="mt">
            <div class="item" style="width: 100px;">序号</div>
            <div class="item" style="width: 200px;">姓名</div>
            <div class="item" style="width: 250px;">组织内职务</div>
            <div class="item" style="width: 120px;">填报时间</div>
          </div>
          <div class="mc" v-if="list.rows.length==0">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div class="mc hand" v-for="(v,i) in list.rows" :key="i">
             <div class="item" style="width:100px;">{{i+1}}</div>
            <div class="item" style="width:200px;">{{v.userName}}</div>
            <div class="item" style="width:250px; color:#999999;">{{v.orgPositions}}</div>
            <div class="item" style="width:120px; color:#999999;">{{v.replyTime}}</div>
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
    name: "wjSee",
    props: {
        defOrg: null,
        personalInfo: null,
    },
    data() {
        return {
        list: [],
        page: 1,
        type:null,
        id:'',
        orgId:''
        };
    },
    methods:{
        getstatistics(page){
          this.http.ajax({
			url: '../../webSite/questionMain/replyDetail',
			method: 'post',
			headers: {
				'Content-Type': ' application/json'
			},
			data:{
                id:this.id,
                orgId:this.orgId,
                pageSize:10,
                pageNumber:page,
              }
			}).then(res => {
				if(res.code==200){
                this.list = res.data
              }
			})
      },
    },
    created() {
      this.id = this.$route.query.id;
      this.orgId = this.$route.query.orgId;
        this.getstatistics(this.page)
  }
    };
</script>
<style lang="less">
    .wjSee {
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

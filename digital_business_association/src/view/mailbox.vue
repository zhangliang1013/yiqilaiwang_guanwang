<template>
  <div>
    <div class="w">
      <div class="position">
        市民提问箱
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div class="activitylist">
        <div class="title">
          <!-- <router-link class="add" :to="messageType == 5?'/addHome':'/activityrelease'">发{{messageType == 5? '会员之家':'活动'}}</router-link> -->
          市民问题列表
        </div>
        <div class="table">
          <div class="mt">
            <div
              class="item"
              style="width:426px;"
            >市民问题</div>
            <div
              class="item"
              style="width:137px;"
            >回复人</div>
            <div
              class="item"
              style="width:165px;"
            >回复时间</div>
            <div class="item" style="width: 95px;">状态</div>
            <div class="item" style="min-width:34px">操作</div>
          </div>
           <div class="mc" v-if="list && list.length==0">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div>
            <div class="mc" v-for="(item,index) in list" :key="index" @click="check(item)">
              <div class="item" style="width:426px">{{item.problemInfo}}</div>
              <div class="item" style="width:137px;padding:0 5px;">{{item.feedbackName?item.feedbackName:'暂无'}}</div>
              <div class="item" style="width:165px;padding:0 5px;">{{item.feedbackTime?new Date(item.feedbackTime).Format("yyyy-MM-dd hh:mm"):'暂无'}}</div>
              <div class="item" style="width:95px">{{item.status==0?'待回复':'已回复'}}</div>
              <div class="item" style="min-width:34px">
                <span class="link">查看</span>
              </div>
            </div>
          </div>
          <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="total"
            @on-change="getWebSiteProblemList"
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
  name: "mailbox",
  props: {
    defOrg: null,
    personalInfo: null,
    login: null
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.id;
        this.isOrg = res.isOrg;
        this.getWebSiteProblemList(this.page)
      }
    }
  },
  data() {
    return {
      list: [],
      page:1,
      total:0,
    };
  },
  created() {
      this.getWebSiteProblemList(this.page)
  },
  methods: {
      getWebSiteProblemList(page){
        this.http
        .ajax({
          url:'../../webSite/GovProblem/getWebSiteProblemList',
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data:{
            govId:this.defOrg.digitalCommerce,
            pageSize:10,
            pageNumber:page,
            status:''
          }
        })  
        .then(res => {
            this.list = res.data.rows
            this.total = res.data.total
        });
      },
      check(row){
          this.$router.push({
            path: '/questionDetail',
            query: {
              'id':row.id,
            }
				  });
      }
  }
};
</script>

<style lang="less">
.activitylist {
  padding-top: 36px;
  padding-left: 90px;
  padding-right: 90px;
  padding-bottom: 36px;

  .table {
    font-size: 0;

    .link {
      color: #2168eb;
      font-size: 14px;
      margin: 0;
    }

    .mt {
      height: 50px;
      line-height: 50px;
      background: #f8f8f8;
      font-size: 16px;
    }

    .mc {
      font-size: 14px;
      height: 70px;
      line-height: 70px;
      border-bottom: 1px solid #eee;
      height: 70px;
      line-height: 70px;
      cursor: pointer;
      .item {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .mt,
    .mc {
      font-size: 16px;

      padding-left: 20px;

      .item {
        display: inline-block;
      }
    }

    .item {
      overflow: hidden;
    }
  }

  .title {
    font-size: 16px;
    margin-bottom: 40px;

    .add {
      float: right;
      // width: 60px;
      // height: 22px;
      background: rgba(33, 104, 235, 1);
      border-radius: 14px;
      line-height: 17px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      padding: 3px 11px;
    }
  }
}
</style>

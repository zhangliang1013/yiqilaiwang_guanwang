<template>
  <div>
    <div class="w">
      <div class="position">
        范围详情
        <span @click="$router.back(-1)">返回</span>
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div class="activitylist">
         <!-- <div class="title">
        
        </div> -->
        <div class="table">
          <div class="mt">
            <div
              class="item"
              style="width:50%;"
            >
              受邀组织
            </div>
            <div v-if='type==3'
              class="item"
              style="width:50%;"
            >
              组织内已接收通知的管理员
            </div>
          </div>
          <!-- 活动 -->
          <div v-if="list">
            <div
              class="mc"
              v-for="(item, index) in list.rows"
              :key="index"
              @click="check(item)"
            >
              <div class="item" style="width:50%;">{{ item.orgName }}</div>
              <div  v-if='type==3' class="item" style="width:50%;">{{ item.createName?item.createName:'暂未接收'}}</div>
            </div>
          </div>
           <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="list.total"
            @on-change="orgList"
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
  name: "activityorglist",
  props: {
    defOrg: null,
    personalInfo: null
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.id;
        this.isOrg = res.isOrg;
        this.orgList(this.page);
      }
    }
  },
  data() {
    return {
      isOrg: 0,
      list: [],
      orgId: null,
      page: 1,
      messageType: "",
      id:'',
      type:0,
    };
  },
  methods:{
    orgList(page) {
      if(this.type==3){
        var data = {
          id:this.id,
          pageNumber: page,
          pageSize: 10,
          orgId:this.defOrg.digitalCommerce
        }
        var url = "../../webSite/businessGov/noticeListInfo"
      }else{
        var data = {
          actId:this.id,
          pageNumber: page,
          pageSize: 10
        }
        var url = "../../webSite/activity/govActOrgList"
      }
      this.http
        .ajax({
          url:url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        })
        .then(res => {
          if (res.code == 200) {
              this.list = res.data;
          }
        });
    },
  },
   created() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.messageType;
    this.orgList(this.page);
  },
}
</script>
<style lang="less">
.activitylist {
  padding-top: 36px;
  padding-left: 93px;
  padding-right: 93px;
  padding-bottom: 36px;

  .table {
    font-size: 0;

    .link {
      color: #2168eb;
      font-size: 14px;
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
    .mc1 {
      cursor: pointer;
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
<template>
  <div>
    <div class="w">
      <div class="position">
        签到详情
        <span @click="$router.back(-1)">返回</span>
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="admissionreview">
        <div class="title2">
           <router-link class="add" :to="{path: '/everywhere', query: {path:'/signList'}}" style="color: #333333;display:inline-block;background:#fff;border:1px solid #979797">导出名单</router-link>
        </div>
        <div class="table">
          <div class="mt">
            <div class="item" style="width: 140px;">签到人姓名</div>
            <div class="item" style="width: 120px;">手机号</div>
            <div class="item" style="width: 150px;">公司</div>
            <div class="item" style="width: 90px;">职务</div>
            <div class="item" style="width: 90px;">性别</div>
            <div class="item" style="width: 90px;">年龄</div>
            <div class="item" style=" width: 80px;text-align: center;">签到时间</div>
          </div>
          <div class="mc" v-if="Array.isArray(list) && list.length==0 || !Array.isArray(list)&&Object.keys(list).length ==0 ">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div class="mc hand" v-for="(v,i) in list" :key="i">
            <div
              class="item"
              style="width: 140px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.title}}</div>
            <div
              class="item"
              style="width: 120px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 90px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 90px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{new Date(v.createdDate).Format("yyyy-MM-dd")}}</div>
          </div>
          <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            @on-change="getOrgMessageList"
            show-elevator
            :page-size="10"
            :show-total="true"
            :total="total"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "signList",
  props: {
    msg: String,
    defOrg: null,
    personalInfo: null,
    login: null
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.id;
        this.getOrgMessageList(this.page);
      }
    }
  },
  data() {
    return {
      list: [],
      orgId: null,
      page: 1,
      total: 0,
      conFontColor0: "#2168eb",
      conFontColor1: "#5AA20C",
      conFontColor2: "#DC1A00",
      newsDigest: null
    };
  },
  methods: {
    getOrgMessageList(page) {
      // console.log("获取列表");
      let data = {
        entityId: this.defOrg?this.defOrg.digitalCommerce:'',
        // newsDigest: this.newsDigest,
        "type@bwt": [1000, 1206],
        status: 1
        // "messageType":this.messageType,
      };
      this.http
        .ajax({
          url: "/activities/search?page="+(page-1)+"&size=10",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        })
        .then(res => {
          // if (res.code == 200) {
          this.list = res.data;
          this.total = res.totalCount
          // }
        });
      // console.log(this.messageType, data);
    },
    getnoticeList(page){
      var url =''
      var data = {}
      if(this.messageType==3){
        url = "../../webSite/businessGov/noticeList"
        data ={
            orgId:this.defOrg.digitalCommerce,
            pageSize:10,
            pageNumber:page,
            isDraft:0
          }
      }else{
        url = "../../webSite/questionMain/list"
        data={
            entityId:this.defOrg.digitalCommerce,
            pageSize:10,
            pageNumber:page,
            status:1
          }
      }
       this.http
        .ajax({
          url: url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: data
        })
        .then(res => {
          if (res.code == 200) {
          this.list = res.data;
          this.total = res.totalCount
          
          }
        });
    },
    getMessageType(type) {
      // console.log('类型',type)
      switch (type) {
        case 1101:
          return "商务要闻";
        case 1102:
          return "经济时讯";
        case 1103:
          return "重要通知";
        case 1104:
          return "部门动态";
        case 1105:
          return "双招双引";
        case 1001:
          return "工商联要闻";
        case 1002:
          return "经济服务";
        case 1003:
          return "会员风采";
        case 1004:
          return "商会活动";
        case 1201:
          return "走进自贸区";
        case 1202:
					return '政务公开';
				case 1203:
					return '中介招商';
				case 1204:
					return '政策法规';
				case 1205:
					return '企业风采';
      }
    },
        // 删除通知等
    del(v) {
      var that = this
       var url = ''
	  var data={}
	  if(that.messageType==3){
      var method = "POST"
		  url="../../webSite/businessGov/removeNotice"
		  data={
			  'id':v
		  }
	  }else{
       var method = "DELETE"
      url="/activities/" + v +'/withcacha'
	  }
      layer.confirm(
        "请确认是否将该条内容删除",
        {
          title: ["提示"],
          closeBtn: false,
          btnAlign: "c",
          shadeClose: true,
          skin: "yq-confirm",
          btn: ["取消", "确认"] //按钮
        },
        function() {
          layer.closeAll();
        },
        function() {
         that.http
        .ajax({
              url: url,
              method: method,
              headers: {
                "Content-Type": " application/json"
              },
              data:data
            })
            .then(res => {
               layer.msg('操作成功');
                if(that.messageType==3 || that.messageType==16){
                  that.getnoticeList(that.page);
                }else{
                  that.getOrgMessageList(that.page);
                }
            });
        }
      );
    },
    check(row) {
      // console.log(row, 'xxxxxx');
      // if (row.status == 0) {
        if(this.messageType==16){
        this.$router.push({
        path: "/dcwj",
        query: {
         'id':row.id,
         'type':2
        }
      });
        }else{
        var m = 0;
      if (this.messageType ==3) {
        m = this.messageType;
      }
      let result = JSON.stringify(row)
      this.$router.push({
        path: "/information",
        query: {
         'id': row.id,
         'isAudit':false,
         'messageType':m
        }
      });
        }
    },
    tocheck(row) {
      this.$router.push({
        path: "/wjStatistics",
        query: {
         'id': row.id,
        }
      });
    },
    toOrg(id,messageType){
       this.$router.push({
        path: "/activityorglist",
        query: {
         'id': id,
         'messageType':messageType
        }
      });
    },
    // 刷新当前页
    flash() {
      this.getOrgMessageList(1);
    }
  },
  created() {
    this.messageType = this.$route.query.messageType;
    if (this.$route.query.newsDigest != null) {
      this.newsDigest = this.$route.query.newsDigest;
    }

    // if (this.defOrg) {
    // this.orgId = this.defOrg.id;
    // console.log('this.messageType',this.messageType)
    if(this.messageType==3 || this.messageType==16){
      this.getnoticeList(this.page);
    }else{
       this.getOrgMessageList(this.page);
    }

    // }
    // console.log(this.messageType, this.$route.query.messageType);
  }
};
</script>

<style lang="less">
.yq-confirm .layui-layer-content {
  padding: 35px 40px;
}

.hand {
  cursor: pointer;
}

.search {
  width: 168px;

  margin: 0 auto;
}

.btn1 {
  padding: 0 10px;
  text-align: center;
  line-height: 22px;
  display: inline-block;
  font-size: 12px;
  margin: 0 5px;
  height: 22px;
  border-radius: 14px;
  border: 1px solid rgba(151, 151, 151, 1);
  cursor: pointer;
}

.admissionreview {
  overflow: hidden;
  padding-top: 36px;
  padding-left: 90px;
  padding-right: 90px;
  padding-bottom: 36px;
  .title {
    font-size: 16px;
    margin-bottom: 40px;
  }
  //   .table {
  //     margin: 30px 90px 46px 90px;
  //   }

  .searchBox {
    span,
    .ivu-select,
    .ivu-input-type {
      margin-right: 10px;
    }

    .ivu-select-selected-value,
    .ivu-select-item {
      text-align: center;
    }

    .btn1 {
      width: 60px;
      height: 22px;
      background: #2168eb;
      border-radius: 14px;
      line-height: 22px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
    }
  }
  .title2 {
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
  .wjsee{
    margin-right: 10px;
    cursor: pointer;
  }
   .wjsee1{
    cursor: pointer;
  }
}
</style>

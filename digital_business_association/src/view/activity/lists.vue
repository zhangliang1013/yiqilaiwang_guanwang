<template>
  <div>
    <div class="w">
      <div class="position">
        活动管理
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div
        class="activitylist"
      >
        <div class="title">
          <router-link
            class="add"
            :to="'/activityrelease'"
          >发活动</router-link>
          活动列表
        </div>
        <div class="table">
          <div class="mt">
            <div
              class="item"
              style="width:150px;"
            >主题</div>
            <div class="item" style="width:250px;">范围</div>
            <div class="item" style="width:92px;">发布人</div>
            <div class="item" style="width:170px;}">发布时间</div>
            <div class="item" style="width: 104px;">状态</div>
            <div class="item">操作</div>
          </div>
          <!-- 活动 -->
          <div v-if="list">
            <div class="mc" v-for="(item,index) in list.rows" :key="index" @click="check(item)">
              <div class="item" style="width:150px;padding-right:10px;">{{item.topic}}</div>
              <!-- <div class="item" style="width:150px;">{{item.visible}}</div> -->
              <div class="item clear" style="width:250px;padding-right:10px">
                <div class="fl" style="max-width:150px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size:14px;">
                  <router-link style="" :to="{path: '/activityorglist',query: {id:item.id}}">{{item.visible}}</router-link>
                </div>
                <img class="fl" style="width:6px;height:10px;margin-top:25px;margin-left:5px;" src="../../assets/img/more@3x.png" alt="">
              </div>
              <div class="item" style="width:90px;font-size:14px;">{{item.createName}}</div>
              <div class="item" style="width:170px;font-size:14px;">{{item.createTime.substr(0,16)}}</div>
              <div
                class="item"
                style="width: 108px;font-size:14px;"
              >{{item.status==0?'报名中':item.status==3?'已取消':item.status==4?'报名已截止':item.status==-1?'草稿':item.status==1?'已开始':item.status==2?'已结束':''}}</div>
              <div class="item" style="font-size:14px;">
                <router-link :to="'/activitydetails?id='+item.id+'&&page='+page" class="link">{{item.isCreate==1?'管理':'查看详情'}}</router-link>
              </div>
            </div>
          </div>
          <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="list.total"
            @on-change="orgActivityList"
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
  name: "activitylists",
  props: {
    defOrg: null,
    personalInfo: null
  },
  watch: {
    defOrg(res) {
      if (res) {
        this.orgId = res.id;
        this.isOrg = res.isOrg;
        this.orgActivityList(this.page);
      }
    }
  },
  data() {
    return {
      isOrg: 0,
      list: [],
      orgId: null,
      page: 1,
      messageType: ""
    };
  },
  created() {
    // console.log("刷新")
    if (this.defOrg) {
      this.orgId = this.defOrg.id;
      // console.log('this.$route.query.page',this.$route.query.page)
      if (this.$route.query.page) {
        this.page = Number(this.$route.query.page);
      }
    }
    this.messageType = this.$route.query.messageType;
    this.orgActivityList(this.page);
  },
  methods: {
    orgActivityList(page) {
      var data = {
        // orgId: this.orgId,
        pageNumber: page,
        pageSize: 10
      };
      this.http
        .ajax({
          url: "../../webSite/activity/govActManageList",
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
    // 删除通知等
    del(v) {
      // console.log(v)

      var _t = this;
      layer.confirm(
        "您确认要将该记录删除吗？删除将无法恢复！",
        {
          title: ["安全警告"],
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
		// console.log( _t.messageType)
		if( _t.messageType==9){
			_t.http
            .ajax({
              url: "webSite/businessGov/deleteActivity",
              method: "post",
              headers: {
                "Content-Type": " application/json"
              },
              data: {
                id: v.id
              }
            })
            .then(res => {
              layer.msg(res.msg);
              if (res.code == 200) {
                _t.orgActivityList(1);
                // this.total = res.data.total;
                // console.log(this.list);
              }
			});
		}else{
          _t.http
            .ajax({
              url: "webSite/orgMessage/remove?uid=" + _t.personalInfo.id,
              method: "post",
              headers: {
                "Content-Type": " application/json"
              },
              data: {
                id: v.id
              }
            })
            .then(res => {
              layer.msg(res.msg);
              if (res.code == 200) {
                _t.orgActivityList(1);
                // this.total = res.data.total;
                // console.log(this.list);
              }
			});
		}
        }
      );
    },
    check(row) {
      if (this.messageType != 5) {
        return;
      }
      this.$router.push({
        path: "/homeDetail",
        query: {
          id: row.id
        }
      });
      // this.$router.push({name:'admissionreviews',params:row});
      // } else {
      // 	return layer.msg('此信息已审核!');
      // }
    }
  }
};
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

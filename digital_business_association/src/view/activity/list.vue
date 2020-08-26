<template>
  <div>
    <div class="w">
      <div class="position">
        {{messageType == 5? '企业提报列表':'已发布政策'}}
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div class="activitylist">
        <div class="title">
          <router-link v-if='messageType != 5' class="add" to="/addarticle">发布</router-link>
          {{messageType == 5? '提报':'政策'}}列表
        </div>
        <div class="table">
          <div class="mt">
            <div
              class="item"
              :style="{'width':(messageType == 5? '247':'390') + 'px'}"
            >{{messageType == 5? '公司名称':'主题'}}</div>
            <div
              class="item"
              v-if="messageType == 5"
              :style="{'width':(messageType == 5? '247':'130') + 'px'}"
            >政策主题</div>
            <div
              class="item"
              :style="{'width':(messageType == 5? '161':'137') + 'px'}"
            >{{messageType == 5? '提报时间':'发布人'}}</div>
            <div
              class="item"
              :style="{'width':(messageType == 5? '81':'165') + 'px'}"
            >{{messageType == 5? '状态':'发布时间'}}</div>
            <div
              class="item"
              :style="{'width':(messageType == 5? '87':'105') + 'px'}"
            >{{messageType == 5? '审批人':'状态'}}</div>
            <div class="item" style="min-width:34px">操作</div>
          </div>
          <!-- 政策 -->
          <div v-if="list && messageType != 5">
            <div class="mc" v-for="(item,index) in list" :key="index">
              <div class="item" style="width:390px">{{item.title}}</div>
              <!-- <div class="item" style="width:130px;padding-right:10px">
								{{item.visible}}
              </div>-->
              <div class="item" style="width:137px;font-size:14px;">{{item.creatorName}}</div>
              <div class="item" style="width:165px;font-size:14px;">{{new Date(item.createdDate).Format("yyyy-MM-dd")}}</div>
              <div
                class="item"
                style="width: 96px;font-size:14px;"
              >已发布</div>
              <div class="item" style="min-width:34px;font-size:14px;">
                <!-- <router-link :to="'/policyDetail?id='+item.id+'&&page='+page" class="link">查看</router-link> -->
                <span class="link" style="display:inline-block;cursor:pointer" @click="check(item)">查看</span>
                <span class="link" style="display:inline-block;cursor:pointer;margin-left:10px;"
                @click="del(item.id)">删除</span>
              </div>
            </div>id
          </div>
          <!-- 提报 -->
          <div v-if="list && messageType == 5">
            <div class="mc mc1" v-for="(item,index) in list.rows" :key="index" @click="check(item)">
              <div
                class="item"
                style="width:247px;padding-right:39px"
              >{{messageType == 5&& item.imgs.length ? '[图片] ':''}}{{item.content}}</div>
              <div
                class="item"
                style="width:247px;padding-right:39px"
              >{{item.isOnlyOrg?'仅组织内':'组织外可见'}}</div>
              <div class="item" style="width:161px;">{{item.userName}}</div>
              <div class="item" style="width:81px">{{item.createTime.substr(0,16)}}</div>
              <div class="item" style="width:87px">{{item.createTime.substr(0,16)}}</div>
              <div class="item" @click.stop="del(item)" style="min-width:34px">
                <!-- <router-link v-else :to="'/addHome?id='+item.id" class="link">修改</router-link> -->
                <span class="link" style="display:inline-block;cursor:pointer">查看</span>
              </div>
            </div>
          </div>
          <Page
            v-if="list"
            :current.sync="page"
            style="text-align: right;margin-top: 20px;"
            :total="total"
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
  name: "activitylist",
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
      messageType: "",
      total:0,
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
      var url = "";
      if (this.messageType == 5) {
        url = "webSite/orgMessage/memberList";
      } else {
        url = "/activities/search?page="+(page-1)+"&size=10";
      }
      let data = {
        entityId: this.defOrg.digitalCommerce,
        "type@bwt": [1600, 1700],
        status: 1
      };
      this.http
        .ajax({
          url: url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data:data
        })
        .then(res => {
            if (this.messageType == 5) {
              // console.log(res)
              this.list = res.data;
            } else {
        this.list = res.data;
        this.total = res.totalCount
			  //  console.log('政策',res)
            }
        });
    },
    // 删除通知等
   del(v) {
      var that = this
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
              url: "/activities/" + v +'/withcacha',
              method: "DELETE",
              headers: {
                "Content-Type": " application/json"
              },
            })
            .then(res => {
               layer.msg('操作成功');
              that.orgActivityList(this.page);
            });
        }
      );
    },
    check(row) {
      var url = "";
      if (this.messageType != 5) {
        url = "/contentaudit";
      } else {
        url = "/submitDetails";
	  }
	  let result = JSON.stringify(row)
      this.$router.push({
        path: url,
        query: {
        'id': row.id,
         'isAudit':false
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

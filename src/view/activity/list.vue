<template>
  <div>
    <div class="w">
      <div class="position">
        {{getMessageType()}}管理
        <span @click="$router.back(-1)">返回</span>
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div
        class="activitylist"
        v-if="messageType!=6&&messageType!=7&&messageType!=8 && messageType!=9"
      >
        <div class="title">
          <router-link
            class="add"
            :to="messageType == 5?'/addHome':'/activityrelease'"
          >发{{messageType == 5? '会员之家':'活动'}}</router-link>
          {{messageType == 5? '会员之家':'活动'}}列表
        </div>
        <div class="table">
          <div class="mt">
            <div
              class="item"
              :style="{'width':(messageType == 5? '300':'290') + 'px'}"
            >{{messageType == 5? '内容':'主题'}}</div>
            <div class="item" :style="{'width':(messageType == 5? '120':'130') + 'px'}">范围</div>
            <div class="item" :style="{'width':(messageType == 5? '110':'92') + 'px'}">发布人</div>
            <div class="item" :style="{'width':(messageType == 5? '246':'170') + 'px'}">时间</div>
            <div class="item" style="width: 104px;" v-if="messageType != 5">状态</div>
            <div class="item">操作</div>
          </div>
          <!-- 活动 -->
          <div v-if="list && messageType != 5">
            <div class="mc" v-for="(item,index) in list.rows" :key="index" @click="check(item)">
              <div class="item" style="width:290px">{{item.topic}}</div>
              <div class="item" style="width:130px;padding-right:10px">{{item.visible}}</div>
              <div class="item" style="width:90px">{{item.createName}}</div>
              <div class="item" style="width:170px">{{item.createTime.substr(0,16)}}</div>
              <div
                class="item"
                style="width: 100px;"
              >{{item.status==0?'未开始':item.status==3?'已取消':item.status==4?'未完成':item.status==-1?'草稿':item.status==1?'进行中':item.status==2?'已结束':''}}</div>
              <div class="item">
                <router-link :to="'/activitydetails?id='+item.id+'&&page='+page" class="link">管理</router-link>
              </div>
            </div>
          </div>
          <!-- 会员之家 -->
          <div v-if="list && messageType == 5">
            <div class="mc mc1" v-for="(item,index) in list.rows" :key="index" @click="check(item)">
              <div
                class="item"
                style="width:300px;padding-right:30px"
              >{{messageType == 5&& item.imgs.length ? '[图片] ':''}}{{item.content}}</div>
              <div class="item" style="width:120px">{{item.isOnlyOrg?'仅组织内':'组织外可见'}}</div>
              <div class="item" style="width:110px">{{item.userName}}</div>
              <div class="item" style="width:240px">{{item.createTime.substr(0,16)}}</div>
              <div class="item" @click.stop="del(item)">
                <!-- <router-link v-else :to="'/addHome?id='+item.id" class="link">修改</router-link> -->
                <span class="link" style="display:inline-block;cursor:pointer">删除</span>
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
      <div class="activitylist" v-if="messageType==6||messageType==7||messageType==8">
        <div class="title">
          <router-link class="add" :to="{path: '/addarticle', query: {messageType:messageType}}">发布</router-link>
          {{getMessageType()}}列表
        </div>
        <div class="table">
          <div class="mt">
            <div class="item" style="width:350px;">主题</div>
            <div class="item" style="width:162px;">发布人</div>
            <div class="item" style="width:270px;">发布时间</div>
            <div class="item">操作</div>
          </div>
          <div v-if="list" style="color:#333333;">
            <div class="mc mc1" v-for="(item,index) in list" :key="index" @click="check(item)">
              <div class="item" style="width:350px;padding-right:50px">{{item.newsDigest}}</div>
              <div class="item" style="width:162px">{{item.createName}}</div>
              <div class="item" style="width:240px">{{item.createTime.substr(0,16)}}</div>
              <div class="item">
                <router-link
                  :to="{path:'/editarticle',query: {id:item.id,m:messageType}}"
                  class="link"
                >修改</router-link>
                <span
                  class="link"
                  @click.stop="del(item)"
                  style="display:inline-block;cursor:pointer"
                >删除</span>
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
      <div class="activitylist" v-if="messageType==9">
        <div class="title">
          <router-link class="add" :to="{path: '/addBusiness?type=business',}">发布</router-link>
          {{getMessageType()}}列表
        </div>
        <div class="table">
          <div class="mt">
            <div class="item" style="width:240px;">公司名称</div>
            <div class="item" style="width:122px;">类型</div>
            <div class="item" style="width:150px;">发布时间</div>
            <div class="item" style="width:270px;">内容</div>
            <div class="item">操作</div>
          </div>
          <div v-if="list" style="color:#333333;">
            <div class="mc mc1" v-for="(item,index) in list" :key="index" @click="check(item)">
              <div class="item" style="width:240px;padding-right:50px">{{item.title}}</div>
              <div class="item" style="width:122px;padding-right:20px">供需</div>
              <div class="item" style="width:150px">{{item.createdDateStr.substr(0,10)}}</div>
              <div class="item" style="width:250px">{{item.content}}</div>
              <div class="item">
                <router-link
                  :to="{path:'/addBusiness',query: {id:item.id}}"
                  class="link"
                >修改</router-link>
                <span
                  class="link"
                  @click.stop="del(item)"
                  style="display:inline-block;cursor:pointer"
                >删除</span>
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
  name: "activitylist",
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
    getMessageType() {
	    this.messageType = Number(this.messageType)
      switch (this.messageType) {
        case 5:
          return "会员之家";
        case 6:
          return "商会服务";
        case 7:
          return "协会服务";
        case 8:
        return '法规标准';
        case 9:
          return '商机';
        default:
          return "活动";
      }
    },
    orgActivityList(page) {
      var url = "";
      var data = {
        orgId: this.defOrg.id,
        pageNumber: page,
        pageSize: 10
      };
      if (this.messageType == 5) {
        url = "webSite/orgMessage/memberList";
      } else if (
        this.messageType == 6 ||
        this.messageType == 7 ||
        this.messageType == 8
      ) {
        url = "/webSite/orgMessage/list";
        data.messageType = this.messageType;
      } else if (this.messageType == 9) {
        url = "/webSite/businessGov/searchBusinessActivity";
        data.type = 1301;
      } else {
        url = "webSite/orgActivityList";
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
            if (this.messageType == 5) {
              // console.log(res)
              this.list = res.data;
            } else if (
              this.messageType == 6 ||
              this.messageType == 7 ||
              this.messageType == 8
            ) {
              this.list = res.data.rows;
              this.list.total = res.data.total;
            } else if (this.messageType == 9) {
              this.list = res.data.data;
              this.list.total = res.data.totalElements;
            } else {
              this.list = res.data.page;
            }
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

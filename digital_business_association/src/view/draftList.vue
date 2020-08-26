<template>
  <div>
    <div class="w">
      <div class="position">
        草稿箱
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px">
      <div class="activitylist">
        <div class="title">
          <!-- <router-link class="add" :to="messageType == 5?'/addHome':'/activityrelease'">发{{messageType == 5? '会员之家':'活动'}}</router-link> -->
          草稿列表
        </div>
        <div class="table">
          <div class="mt">
            <div
              class="item"
              :style="{'width':(messageType == 5? '200':'390') + 'px'}"
            >{{messageType == 5? '公司名称':'主题'}}</div>
            <div
              class="item"
              v-if="messageType == 5"
              :style="{'width':(messageType == 5? '120':'130') + 'px'}"
            >政策主题</div>
            <div
              class="item"
              :style="{'width':(messageType == 5? '110':'137') + 'px'}"
            >{{messageType == 5? '保存时间':'发布人'}}</div>
            <div
              class="item"
              :style="{'width':(messageType == 5? '170':'165') + 'px'}"
            >{{messageType == 5? '状态':'编辑时间'}}</div>
            <div class="item" style="width: 110px;">{{messageType == 5? '审批人':'类型'}}</div>
            <div class="item" style="min-width:34px">操作</div>
          </div>
          <!-- 政策 -->
          <div v-if="list && messageType != 5">
            <div class="mc" v-for="(item,index) in list" :key="index">
              <div class="item" style="width:390px">{{item.title}}</div>
              <!-- <div class="item" style="width:130px;padding-right:10px">
								{{item.visible}}
              </div>-->
              <div class="item" style="width:137px">{{item.creatorName}}</div>
              <div class="item" style="width:165px">{{new Date(item.createdDate).Format("yyyy-MM-dd")}}</div>
              <div
                class="item"
                style="width: 96px;"
              >{{getMessageType(item.type)}}</div>
              <div class="item" style="min-width:34px">
                <span class="link"  @click="check(item)">编辑</span>
                <span class="link" style="margin-left:10px;"  @click="del(item.id)">删除</span>
              </div>
            </div>
          </div>
          <!-- 会员之家 -->
          <div v-if="list && messageType == 5">
            <div class="mc mc1" v-for="(item,index) in list.rows" :key="index" @click="check(item)">
              <div
                class="item"
                style="width:200px;padding-right:30px"
              >{{messageType == 5&& item.imgs.length ? '[图片] ':''}}{{item.content}}</div>
              <div class="item" style="width:120px">{{item.isOnlyOrg?'仅组织内':'组织外可见'}}</div>
              <div class="item" style="width:110px">{{item.userName}}</div>
              <div class="item" style="width:140px">{{item.createTime.substr(0,16)}}</div>
              <div class="item" style="width:140px">{{item.createTime.substr(0,16)}}</div>
              <div class="item" @click.stop="del(item)">
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
  name: "draftList",
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
      messageType: 0,
      total:0,
    };
  },
  created() {
    // console.log("刷新")
    // if (this.defOrg) {
    // 	this.orgId = this.defOrg.id;
    // 	// console.log('this.$route.query.page',this.$route.query.page)
    // 	if (this.$route.query.page) {

    // 		this.page = Number(this.$route.query.page)
    // 	}
    // }
    this.messageType = this.$route.query.messageType;
    this.orgActivityList(this.messageType == 0);
  },
  methods: {
    		getMessageType(type) {
				switch (type) {
					case 1101:
						return '商务要闻';
					case 1102:
						return '经济时讯';
					case 1103:
						return '重要通知';
					case 1104:
						return '部门动态';
					case 1105:
						return '双招双引';
					case 1001:
						return '工商联要闻';
					case 1002:
						return '经济服务';
					case 1003:
						return '会员风采';
					case 1004:
						return '商会活动';
					case 1201:
            return '走进自贸区';
          case 1600:
            return '政策';
          case 2001:
            return "本会动态";
          case 2002:
            return "办事指南";
          case 2003:
            return "仲裁园地";
				}
			},
    orgActivityList(page) {
      var url = "";
      if (this.messageType == 5) {
        url = "webSite/orgMessage/memberList";
      } else {
        url = "/activities/search?page="+(page-1)+"&size=10";
      }
      this.http
        .ajax({
          url: url,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            entityId: this.defOrg.digitalCommerce,
            "type@bwt": [1000, 2005],
            status: 0
          }
        })  
        .then(res => {
          // if (res.code == 200) {
            if (this.messageType == 5) {
              // console.log(res)
              this.list = res.data;
            } else {
              this.list = res.data;
              this.total = res.totalCount
              // console.log('草稿',this.list)
            }
          // }
        });
    },
    // 删除
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
      // console.log('mess',this.messageType)
      if (this.messageType != 5) {
        if(this.messageType=='1'){
          //  console.log('草稿',row.type)
          this.$router.push({
            path: '/releaseDynamic',
            query: {
              'id':row.id,
            }
				  });
        }else if(row.type==1600){
         this.$router.push({
					path: '/addarticle',
					query: {
						'id':row.id,
					}
				  });
        }else{
          this.$router.push({
					path: '/editarticle',
					query: {
						'id':row.id,
					}
				});
        }
      }
      // let result = JSON.stringify(row)
      // this.$router.push({
      //   path: url,
      //   query: {
      //    'res': result,
      //    'isAudit':true,
      //    'draft':false
      //   }
      // });
      // this.$router.push({
      //   path: url,
      //   query: {
      //     id: row.id,
      //     page: this.page
      //   }
      // });
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

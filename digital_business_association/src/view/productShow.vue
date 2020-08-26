<template>
  <div>
    <div class="w">
      <div class="position">
        <!-- <span @click="$router.back(-1)"></span> -->
      </div>
    </div>
    <div class="w bg staff" style="margin-top:1px;">
      <div class="warp staff" style="margin-top:1px;">
        <div class="leftcont">
          <div class="menu">
            <div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">未审批</div>
            <div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">已审批</div>
          </div>
        </div>
        <div class="rightcont" >
          <div class="rightcont-top clear">
            <div class="tit fl">{{menuactive==1?'未':'已'}}审批列表</div>
            <div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
            </div>
          </div>
          <div class="table">
            <div class="mt" style="padding-right:0px;font-size:16px">
              <div class="item" style="min-width: 202px">项目名称</div>
              <div class="item" style="width: 153px">中介机构</div>
              <div class="item" style="width: 168px">提交时间</div>
              <div class="item" style="width: 133px">类型</div>
              <div class="item" style="min-width: 54px">操作</div>
            </div>
            <div >
              <div
                class="mc hand"
                v-for="(value,index) in allusers.nopass"
                :key="index"
                style="overflow: hidden;padding-right: 0px; "
                @click="getDetail(value)"
              >
                <div class="item hand" style="width: 202px">
                  <div class="sort-num">{{value.title}}</div>
                </div>
                <div
                  class="item"
                  style="width: 153px;color:#999999;"
                  :title="value.userName"
                >{{ value.entity.name}}</div>
                <div
                  class="item"
                  style="width: 168px;color:#999999;"
                  :title="value.idCard"
                >{{new Date(value.createdDate).Format("yyyy-MM-dd")}}</div>
                <div class="item" style="width: 133px;color:#999999;">{{getformId(value.reply)}}</div>
                <div class="item" style="min-width: 60px">
                  <span class="link" @click.stop="getDetail(value)">查看</span>
                </div>
              </div>
              <Page
                v-if="allusers.rows"
                :current.sync="pageNumber"
                style="text-align: right;margin: 20px 0;"
                :total="allusers.total"
                @on-change="getOrgUserPage"
                show-elevator
                :page-size="pageSize"
                :show-total="true"
              />
            </div>
          </div>
        </div>
        <div class="cl"></div>
      </div>
      <!-- 弹窗 -->
      <div class="layer staffeit" v-if="layer==5">
        <div class="mask" @click="tolayer(0)"></div>
        <div class="content">
          <div class="title">无法访问</div>
          <div class="tips" style="width: 154px;margin: 0 auto;margin-top: 33px;">
            您的组织身份已被冻结，
            请联系组织管理员处理。
          </div>
          <div class="btns">
            <div class="btn2" @click="tolayer(0)">我已知晓</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "productShow",
  data() {
    return {
      // 二级菜单展示
      show: false,
      // 组织架构显示页面重构
      //部门显示--------部门人员显示---添加该部门所属人员
      // step==1表示显示部门      2人员
      step: 1,
      // 部门名称
      positionName: "",
      // 更换主管理员
      // 验证码
      verificationCode: "",
      // 倒计时
      time: 60,
      // 是否获取到验证码
      isGetting: false,
      // 用户信息保存在adduser中

      // 添加管理员数组
      adminAdd: [],

      // 序号临时保存
      sortsetObj: {
        newsort: ""
      },
      // 临时序号
      newsort: "",
      //表单
      formItem: {
        telphone: ""
      },
      //部门信息
      orgStructureListDtos: [],
      menuactive: 0,
      layer: 0,
      //添加用户
      adduser: {
        applyTel: "",
        applyName: "",
        structureList: [],
        orgPositions: "职员"
      },
      //部门名称
      structure: "",
      //是否开启群聊
      isChat: 0,

      //组织id
      orgId: null,
      //部门用户
      users: [],
      //组织用户
      allusers: {
        nopass: [],
        ispass: [],
        total: 1,
        rows: [
          {
          }
        ]
      },
      //组织用户---编辑信息，
      staff: null,
      //组织用户---临时名字字段，
      groupNickname: "",
      // 組織用戶臨時部門
      structureList: [],
      // 组织用户临时职位
      structurePositions: "",
      //组织的用户信息组
      structureMsg: null,
      // 组织用户临时手机号隐藏否
      isHideTel: false,
      //人员管理------------
      //搜索条件
      //分页
      pageNumber: 1,
      pageSize: 10,
      //分页
      freezepageNumber: 1,
      freezepageSize: 10,
      // 部门
      //权限
      // 临时用户的信息------编辑权限
      uMsg: null,
      // 排序编辑---用户id与排序序号
      orgUserList: [],
      // 临时删除部门id
      delPartMgs: null,
      // 临时主管理员列表
      mainAdmin: [],
      // 临时主管理员信息
      AdminUser: {},
      // 临时普通管理员列表
      commonAdmin: [],
      // 冻结人员列表
      allfreezeusers: null,
      // 是否展示冻结人员 f不展示，t展示
      freezeshow: false,
      itemDetail: "" //临时存放人员详情
    };
  },
  props: {
    msg: String,
    defOrg: null,
  },
  watch: {
    defOrg(res) {
      // console.log('defOrg',res)
      if (res) {
        this.orgId = res.id;
        this.getOrgUserPage(this.pageNumber);
      }
    },
    menuactive: function(val, oldval) {
      if (this.orgId != null) {
        this.getOrgUserPage(this.pageNumber);
      }
    }
  },
  created() {
    this.menuactive = this.$route.params.page;
    if (this.defOrg) {
      this.orgId = this.defOrg.digitalCommerce;
    }
  },
  methods: {
    toPage() {
      this.$router.push({
        path: "/product"
      });
    },
    getformId(reply) {
      switch (reply) {
        case 0:
          return "已结束";
        case 1:
          return "资金拨付";
        case 2:
          return "资金申请已通过";
        case 3:
          return "资金申请";
        case 4:
          return "正式备案已通过";
        case 5:
          return "正式备案";
        case 6:
          return "预备案已通过";
        case 7:
          return "预备案";
      }
    },
    // 刷新页面
    flash(e) {
      this.getOrgUserPage(this.pageNumber);
    },
    //获取列表
    getOrgUserPage(page) {
      // console.log(page)
      if(this.menuactive ==1){
        var url = "/replies/"+this.defOrg.digitalCommerce+"/untreated?page="+(page-1)+"&size=10";
        var data = {
            entityId: this.defOrg.digitalCommerce,
        }
      }else{
        var url = "/replies/search?page="+(page-1)+"&size=10";
        var data = {
          'event.entityId': this.defOrg.digitalCommerce,
          'isPass@ne':0
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
          //展示组织用户的分頁數據
          // if (res.code == 200) {
          this.allusers.nopass = res.data;
          this.allusers.total =res.totalCount
        });
    },

    // 单独排序--序号修改
    setSort(orgUserId, newSort, oldSort) {
      if (newSort == "") {
        layer.msg("序号不能为空");
        return;
      }
      this.http
        .ajax({
          url: "webSite/updateOrgUserSort",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            orgId: this.orgId,
            orgUserId: orgUserId,
            newSort: newSort,
            oldSort: oldSort
          }
        })
        .then(res => {
          layer.msg(res.msg);
          this.layer = 0;
          this.newsort = null;
          this.flash(1);
        });
    },
    dellayer(e) {
      this.layer = 9;
      this.delPartMgs = e;
    },
    tomenu(n) {
      this.pageNumber = 1;
      this.menuactive = n;
      //获取组织用户
    },
    // 弹窗弹出
    tolayer(n) {
      this.layer = n;
    },
    // 下架
    getDetail(value) {
      this.$router.push({
        path: "/submitDetails",
        query: { id: value.id ,m:this.menuactive==1?0:1}
      });
    }
  }
};
</script>

<style lang="less">
// .ivu-poptip-popper{
// 	top:130px !important;
// }
.ivu-poptip-rel {
  height: 38px;
}
.staffeit .mc .ivu-select-dropdown {
  will-change: unset !important;
}
.right .ivu-select-placeholder {
  text-align: right;
}
.staffeit {
  .tips {
    margin-top: 45px;
    text-align: center;
    font-size: 14px;
    color: #333333;
  }

  .btns {
    text-align: center;
    font-size: 0;
    padding-top: 37px;
    margin-bottom: 21px;

    .btn1 {
      border: 1px solid #999999;
    }

    .btn2 {
      border: 1px solid #2168eb;
      background: #2168eb;
      color: #ffffff;
    }

    .btn1,
    .btn2 {
      cursor: pointer;
      display: inline-block;
      font-size: 12px;
      padding: 0 22px;
      height: 28px;
      line-height: 28px;
      -webkit-border-radius: 28px;
      -moz-border-radius: 28px;
      border-radius: 28px;
      margin: 0 10px;
    }
  }

  .mc {
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid #eee;
    margin: 15px;
    // padding:0 15px 0 10px;
    display: flex;
    position: relative;
    font-family: "PingFangSC-Regular,PingFang SC";

    // float:left;
    // width:75%;
    .text-label {
      width: 100px;
      display: flex;
      line-height: 40px;

      p {
        color: #dc1a00;
      }

      //
    }

    .label {
      margin-left: 11px;
    }

    input.ivu-input {
      text-align: right;
    }

    .ivu-select-selection {
      min-height: 40px;
      padding: 4px 24px 4px 4px;
    }

    .ivu-select-dropdown {
      max-height: 164px;
      will-change: auto;
    }

    .ivu-select-placeholder {
      height: 26px;
      line-height: 26px;
    }

    .right .label {
      float: left;
      margin-left: 0;
    }

    .ivu-checkbox {
      margin-left: 15px;
      margin-right: 15px;
    }

    .ivu-checkbox-checked .ivu-checkbox-inner {
      background: #2d8cf0;
    }

    .ivu-checkbox-inner:after {
      transform: rotate(45deg) scale(1);
    }

    .ivu-checkbox-inner {
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      background: #eeeeee;
      transform: scale(1.15);
    }

    .ivu-checkbox-wrapper {
      width: 100%;
    }

    .right .ivu-checkbox {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }

    .getcode {
      width: 30%;
      text-align: center;
      line-height: 40px;
      background: #2168eb;
      color: #fff;
    }
  }

  .mt {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    margin-top: 15px;
    margin-left: 15px;
    margin-bottom: 5px;

    p {
      color: red;
      display: contents;
    }
    .mt-left {
      margin-right: 182px;
    }
    .ivu-switch-small {
      width: 32px;
    }
    .ivu-switch-small.ivu-switch-checked:after {
      left: 16px;
    }
  }

  .mc-phone {
    margin: 0 16px 7px;
    .text {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(136, 136, 136, 1);
      line-height: 17px;
    }
  }
  .username {
    width: 294px;
    height: 38px;
    background: #fafafa;
    display: block;
    margin: 0 auto;
    text-indent: 15px;
    line-height: 38px;
    margin-top: 11px;
  }

  .content {
    overflow: hidden;
  }

  .title {
    height: 70px;
    background: #2168eb;
    font-size: 20px;
    color: #ffffff;
    line-height: 70px;
    text-align: center;
  }
  .layer-top {
    margin: 13px 16px;
    width: 294px;
    height: 38px;
    background: rgba(250, 250, 250, 1);
    padding-left: 15px;
    line-height: 38px;
  }
  .layer-cont {
    margin: 0 17px 14px;
    .layer-cont-l {
      width: 68px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
    }
    .layer-cont-r {
      width: 222px;
      min-height: 32px;
      border: 1px solid rgba(221, 221, 221, 1);
      padding: 7px 11px;
      text-align: right;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 17px;
    }
    .height {
      line-height: 16px;
    }
  }
  .new {
    padding-top: 14px;
    margin-bottom: 27px;
    .btn2 {
      width: 104px;
      height: 28px;
      background: rgba(33, 104, 235, 1);
      border-radius: 14px;
    }
  }
}

.staff {
  margin-top: 69px;
  margin-bottom: 63px;

  .warp {
    .rightcont {
      .share_tips {
        position: absolute;
        width: 160px;
        right: 71px;
        top: 110px;

        .t {
          font-size: 14px;
          margin-bottom: 26px;
        }

        .btn {
          cursor: pointer;
        }
      }
      .sort-num {
        line-height: 28px;
        border:none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        text-align: left;
      }
      .form {
        margin-right: 288px;
        margin-top: 24px;

        .btn {
          width: 205px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          color: #ffffff;
          background: #2168eb;
          font-size: 14px;
          -webkit-border-radius: 48px;
          -moz-border-radius: 48px;
          border-radius: 48px;
          cursor: pointer;
        }
      }

      .share_t2 {
        font-size: 14px;
        color: #999999;
        border-bottom: 1px solid #eee;
        padding-bottom: 19px;
        line-height: 14px;
      }

      width: 815px;
      float: right;
      padding-left: 40px;
      padding-right: 46px;
      padding-top: 10px;
      position: relative;
      min-height: 660px;

      .tit {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 540;
        color: #333333;
      }
      .btnD {
        // height:22px;
        background: rgba(255, 255, 255, 1);
        border-radius: 14px;
        border: 1px solid rgba(151, 151, 151, 1);
        color: #333333;
        padding: 0px 15px;
        text-align: center;
        line-height: 20px;
        display: inline-block;
        font-size: 12px;
        margin-right: 5px;
      }
      .addbtn {
        height: 22px;
        border-radius: 14px;
        line-height: 22px;
        background: #2168eb;
        display: inline-block;
        text-align: center;
        -webkit-border-radius: 22px;
        -moz-border-radius: 22px;
        color: #ffffff;
        font-size: 12px;
        padding: 0 14px;
        cursor: pointer;
      }
      .table {
        .link {
          cursor: pointer;
          color: #2168eb;
          margin: 0 7px;
        }

        .btn {
          padding: 0 10px;
          text-align: center;
          line-height: 22px;
          display: inline-block;
          font-size: 12px;
          margin: 0 5px;
          height: 22px;
          border-radius: 14px;
          border: 1px solid rgba(151, 151, 151, 1);

          span {
            font-size: 1px;
          }
        }

        .edit,
        .del {
          font-size: 0;
          width: 20px;
          margin: 0px 10px;
          position: relative;
          display: inline-block;
          height: 100%;
          cursor: pointer;

          img {
            vertical-align: middle;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .ivu-input-wrapper {
          width: 100%;

          input {
            border: none;
          }
        }

        .saveBtn {
          height: 40px;
          line-height: 40px;
          padding: 0 15px;
          cursor: pointer;
        }

        .mc {
          border-bottom: 1px solid #eee;
        }

        .mt,
        .mc {
          display: flex;
          justify-content: space-between;
          padding-left: 12px;
          // padding-right: 20px;
          text-align: left;
          font-family: "PingFangSC-Regular,PingFang SC";
          height: 60px;

          .item {
            text-align: left;
            height: auto;
            // line-height: 60px;
            display: inline-block;
            min-width: 60px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: auto 0;
          }
        }

        .mt {
          background: #f8f8f8;

          .item {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }

    .leftcont {
      float: left;
      width: 265px;
      border-right: 1px solid #eee;
      padding: 35px 0;

      .search {
        width: 168px;
        display: block;
        margin: 0 auto;

        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .menu {
        width: 168px;
        display: block;
        margin: 0 auto;

        .item {
          cursor: pointer;
          height: 59px;
          line-height: 59px;
          border-bottom: 1px solid #eee;
          font-weight: 500;
        }

        .active {
          color: #2168eb;
          font-weight: 500;
        }

        .child {
          span {
            line-height: 40px;
            padding-left: 15px;
            cursor: pointer;
          }
        }

        .n {
          background: url("../assets/img/zk2@2x.png") no-repeat right center;
        }

        .n.active {
          background: url("../assets/img/zk3@2x.png") no-repeat right center;
        }
      }
    }
  }
}

// .staff .warp .rightcont .table .edit,
// .staff .warp .rightcont .table .del {
//   display: none;
// }

// .staff .warp .rightcont .table .hand:hover .edit,
// .staff .warp .rightcont .table .hand:hover .del {
//   display: inline-block;
// }

.staff .warp .rightcont .table .mc .item .link {
  display: inline-block;
}

// .staff .warp .rightcont .table .mc:hover .item .link {
//   display: inline-block !important;
// }
</style>

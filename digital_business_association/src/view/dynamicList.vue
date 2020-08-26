<template>
  <div>
    <div class="w">
      <div class="position">
        {{menuactive==0?'本会动态':(menuactive==1?'办事指南':'仲裁园地')}}
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
      <div class="admissionreview">
         <div class="title clear">
           <div class="fl">{{menuactive==0?'本会动态':(menuactive==1?'办事指南':'仲裁园地')}}列表</div>
          <router-link class="add" :to="{path: '/releaseDynamic',query: {menuactive:menuactive}}">发布</router-link>
        </div>
        <div class="table">
          <div class="mt">
            <div class="item" style="width: 320px;">主题</div>
            <div class="item" style="width: 150px;">发布人</div>
            <div class="item" style="width: 220px;">发布时间</div>
            <div class="item" style="width: 90px;">类型</div>
            <div class="item" style=" width: 80px;text-align: center;">操作</div>
          </div>
          <div class="mc" v-if="list.length==0">
            <div class="item" style="text-align: center; width:800px">暂无数据</div>
          </div>
          <div class="mc hand" v-for="(v,i) in list" :key="i">
            <div
              class="item"
              style="width: 320px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
              v-on:click="check(v)"
            >{{v.title}}</div>
            <div
              class="item"
              style="width: 150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
              v-on:click="check(v)"
            >{{v.creatorName}}</div>
            <div
              class="item"
              style="width: 220px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
              v-on:click="check(v)"
            >{{new Date(v.createdDate).Format("yyyy-MM-dd")}}</div>
            <div class="item" style="width: 90px;" v-on:click="check(v)">{{getMessageType(v.type,v.tags)}}</div>
            <div class="item" style="width: 80px;text-align: center;">
              <span :style="{color:conFontColor0}" v-on:click="check(v)">查看</span>
              <span style="width:10px;display: inline-block;"></span>
              <span :style="{color:conFontColor0}" v-on:click="del(v.id)">删除</span>
            </div>
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
  inject: ['reload'],
  name: "dynamicList",
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
    },
    $route:function(to, form){
      this.reload();
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
      newsDigest: null,
      menuactive:null,
    };
  },
  methods: {
    getOrgMessageList(page) {
      // console.log("获取列表");
      let data = {
        entityId: this.defOrg?this.defOrg.digitalCommerce:'',
        // newsDigest: this.newsDigest,
        // "type": 2002,
        status: 1
        // "messageType":this.messageType,
      };
      if(this.menuactive==0){
        data.type=2001
      }else if(this.menuactive==1){
        data.type=2002
      }else{
        data.type=2003
      }
      this.http
        .ajax({
          url: "activities/search?page="+(page-1)+"&size=10",
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
          // this.total = res.data.total;
          // this.total = res.data.total;
          // console.log("列表", this.list, this.list.length);
          // }
        });
      // console.log(this.messageType, data);
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
               that.getOrgMessageList(that.page);
            });
        }
      );
    },
    getMessageType(type,type1) {
      // console.log('类型',type,type1)
      if(type==2001 && type1){
        for(var i of type1){
          if(i.name==20011){
            return '新闻动态';
          }
          if(i.name==20012){
             return '通知公告';
          }
           if(i.name==20013){
            return '网络问政';
          }
           if(i.name==20014){
            return '国内快讯';
          }
        }
      }else{
        switch (type) {
          case 2001:
            return "本会动态";
          case 2002:
            return "办事指南";
          case 2003:
            return "仲裁园地";
        }
      }
    },
    check(row) {
      // console.log(row, 'xxxxxx');
      // if (row.status == 0) {id
      var m = 0;
      if (this.messageType > 0) {
        m = this.messageType;
      }
      let result = JSON.stringify(row)
      this.$router.push({
        path: "/arbitration",
        query: {
         'id': row.id,
         'isAudit':false
        }
      });
    },
    // 刷新当前页
    flash() {
      this.getOrgMessageList(1);
    }
  },
  created() {
    // console.log('刷新')
    this.menuactive = this.$route.params.page;
    this.messageType = this.$route.query.messageType;
    if (this.$route.query.newsDigest != null) {
      this.newsDigest = this.$route.query.newsDigest;
    }

    // if (this.defOrg) {
    // this.orgId = this.defOrg.id;
    this.getOrgMessageList(this.page);
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
    margin: 0 90px;
    padding: 15px 0 0 0;

    .add {
      float: right;
      width: 60px;
      height: 22px;
      background: rgba(33, 104, 235, 1);
      border-radius: 14px;
      line-height: 22px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>

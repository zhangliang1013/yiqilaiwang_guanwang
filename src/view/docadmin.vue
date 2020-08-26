<template>
  <div>
    <div class="w">
      <div class="position">新闻管理/通知管理
	  <span @click="$router.back(-1)">返回</span>
	  </div>
    </div>
    <div class="w bg" style="margin-bottom: 30px;">
        <div class="docadmin" v-if="list">
            <div class="tablemt">
                <div class="item">
                    <div class="n">3</div>
                    <p>待审核</p>
                </div>
                <div class="item">
                    <div class="n">3</div>
                    <p>待审核</p>
                </div>
                <div class="item">
                    <div class="n">3</div>
                    <p>待审核</p>
                </div>
            </div>
            <div class="table">
                <div class="mt">
                    <div class="item" style="width: 305px;">标题</div>
                    <div class="item" style="width: 110px;">范围</div>
                    <div class="item" style="width: 100px;">发布人</div>
                    <div class="item" style="width: 240px;">时间</div>
                    <div class="item" style="width: 100px;text-align: right;">操作</div>
                </div>
				<div class="mc" v-if="list.rows.length==0">
					<div class="item" style="text-align: center; width:800px">暂无数据</div>
				</div>
                <div class="mc" v-for="(item,index) in list.rows" :key="index">
                    <div class="item" style="width: 305px;">{{item.newsDigest}}</div>
                    <div class="item" style="width: 110px;">{{item.newsDigest}}</div>
                    <div class="item" style="width: 100px;">{{item.userName}}</div>
                    <div class="item" style="width: 240px;">{{item.createTime}}</div>
                    <div class="item" style="width: 100px;text-align: right;">
                        <span style="margin-right: 10px; color: #2168eb;">修改</span>
                        <span style="color: #2168eb;">删除</span>
                    </div>
                </div>
                <Page v-if="list" :current.sync="page" style="text-align: right;margin-top: 20px;"  @on-change="getparticipantListDetail"
                      show-elevator :page-size="10" :show-total="true" :total="list.total"/>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'docadmin',
    props: {
        personalInfo:null,//登陆后 的用户信息
        defOrg: null,
    },
    data () {
        return {
            page: 1,
            list:null
        }
    },
    methods: {
        getparticipantListDetail(page) {
            this.http.ajax({
                url: 'webSite/orgMessage/list',
                method: 'post',
                headers: {
                    'Content-Type': ' application/json'
                },
                data: {
                    "orgId":this.defOrg.id,
                    "messageType": this.$route.query.type,
                    "pageNumber": page,
                    "pageSize": 10,
                    "type":1//1：审核列表 2：费用列表已收款 3：用户信息 4： 查看 5: 费用详情已退款
                }
            })
                .then(res => {
                    // console.log(res)
                    if (res.code == 200) {
                        this.list=res.data

                    }
                })
        },
    }
    ,
    created() {
        this.getparticipantListDetail(this.page);
    }
}
</script>

<style lang="less">
  .docadmin{
      overflow: hidden;
        .table{
            margin: 46px 90px;
        }
        .tablemt{
            text-align: center;
            padding-top: 55px;
            .item{
                display: inline-block;
                width: 200px;


            }
            .n{
                font-size: 36px;
                font-weight: bold;

            }
            p{
                margin-top: 10px;
                font-size: 14px;
            }
        }

  }
</style>

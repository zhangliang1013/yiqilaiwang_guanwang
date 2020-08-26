<template>
	<div>
     <div class="w">
				<div class="position">
					草稿箱
					<!-- <span @click="$router.back(-1)">返回</span> -->
				</div>
			</div>
		<div class="w bg gslDraft">
			<div class="wrap clear">
				<div class="leftcont">
					<div class="menu">
							<div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">通知</div>	
							<div class="item" @click="tomenu(3)" :class="{active:menuactive==3}">政府要闻</div>
							<div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">调查问卷</div>
					</div>
				</div>
				<!-- 通知-->
				<div class="rightcont" v-show="menuactive==1 || menuactive==2">
					<div v-if="menuactive==1 || menuactive==2">
						<div class="table">
							<div class="mt">
								<div class="item" style="width: 320px">主题</div>
								<div class="item" style="width: 130px">发布人</div>
								<div class="item" style="width: 150px">编辑时间</div>
								<div class="item" v-if="menuactive==1" style="width: 80px;text-align:center;">操作</div>
								<div class="item" v-if="menuactive==2" style="width: 80px;">操作</div>
							</div>
							<div class="mc" v-if="Object.prototype.toString.call(list) == '[object Array]'&& !list.length || Object.prototype.toString.call(list) == '[object Object]' && !list.rows.length">
								<div class="item" style="width:100%;text-align:center">暂无数据</div>
							</div>
							<div class="mc hand" v-for="(value,index) in list.rows" :key="index" style=" overflow:hidden;"
							>
								<div>
									<div class="item" style="width: 320px;">{{menuactive==1?value.newsDigest:value.questionTitle}}</div>
									<div class="item" style="width: 130px; overflow:hidden">
										{{menuactive==1?value.createName:value.realName}}
									</div>
									<div class="item" style="width: 150px; overflow:hidden">{{value.createTime.substr(0,16)}}</div>
									<div v-if="menuactive==1" class="item clear" style="width: 80px; color:#2168eb;padding-left:10px;">
										<span class="fl"  @click="check(value)">编辑</span>
										<span class="fr"  @click="del(value.id)">删除</span>
									</div>
									<div v-if="menuactive==2" class="item" style="width: 80px; color:#2168eb;" @click="check(value)">
										编辑
									</div>
								</div>
							</div>
							<Page
								v-if="list"
								:current.sync="page"
								style="text-align: right;margin-top: 20px;"
								:total="list.total"
								@on-change="getnoticeList"
								show-elevator
								:page-size="10"
								:show-total="true"
							/>
						</div>
					</div>
				</div>
				<!-- 政府要闻-->
				<div class="rightcont" v-show="menuactive==3">
					<div v-if="menuactive==3">
						<div class="table">
							<div class="mt">
								<div class="item" style="width: 320px">主题</div>
								<div class="item" style="width: 130px">发布人</div>
								<div class="item" style="width: 150px">编辑时间</div>
								<div class="item" style="width: 80px;text-align:center;">操作</div>
							</div>
							<div class="mc" v-if="Object.prototype.toString.call(list) == '[object Array]'&& !list.length || Object.prototype.toString.call(list) == '[object Object]' && !list.rows.length">
								<div class="item" style="width:100%;text-align:center">暂无数据</div>
							</div>
							<div class="mc hand" v-for="(value,index) in list" :key="index" style=" overflow:hidden;"
							>
								<div>
									<div class="item" style="width: 320px;">{{value.title}}</div>
									<div class="item" style="width: 130px; overflow:hidden">
										{{value.creatorName}}
									</div>
									<div class="item" style="width: 150px; overflow:hidden">{{new Date(value.createdDate).Format("yyyy-MM-dd")}}</div>
									<div class="item clear" style="width: 80px; color:#2168eb;padding-left:10px;">
										<span class="fl" @click="check(value)">编辑</span>
										<span class="fr" @click="del(value.id)">删除</span>
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
		</div>
	</div>
</template>
<script>
    export default {
    name: "gslDraft",
    props: {
        defOrg: null,
        personalInfo: null,
        login: null
    },
    data(){
			return{
				menuactive: 1,
				list:{
					rows:[],
				},
				page:1,
				total:0,
			}
    },
    methods:{
        tomenu(n) {
			this.menuactive = n;
			if(this.menuactive==3){
				this.orgActivityList(this.page)
			}else{
				this.getnoticeList(this.page)
			}
		},
	getnoticeList(page){
      var url =''
      var data = {}
      if(this.menuactive==1){
        url = "../../webSite/businessGov/noticeList"
        data ={
            orgId:this.defOrg.digitalCommerce,
            pageSize:10,
            pageNumber:page,
            isDraft:1
          }
      }else if(this.menuactive==2){
        url = "../../webSite/questionMain/list"
        data={
            entityId:this.defOrg.digitalCommerce,
            pageSize:10,
            pageNumber:page,
            status:0
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
          // console.log("列表", this.list, this.list.length);
          }
        });
	},
	del(v) {
	  var that = this
	  var url = ''
	  var data={}
	  if(that.menuactive==3){
		  var method = "DELETE"
		  url="/activities/" + v +'/withcacha'
	  }else{
		var method = "POST"
		  url="../../webSite/businessGov/removeNotice"
		  data={
			  'id':v
		  }
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
              if(that.menuactive==3){
				that.orgActivityList(that.page)
			}else{
				that.getnoticeList(that.page)
			}
            });
        }
      );
    },
	orgActivityList(page) {
      this.http
        .ajax({
          url: "/activities/search?page="+(page-1)+"&size=10",
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
              this.list = res.data;
              this.total = res.totalCount
              // console.log('草稿',this.list)
        });
	},
	check(row){
		if(this.menuactive==1){
			this.$router.push({
				path: '/editarticle',
				query: {
					'id':row.id,
					'type':2
				}
			});
		}else if(this.menuactive==2){
			this.$router.push({
				path: '/dcwj',
				query: {
					'id':row.id,
					'type':1
				}
			});
		}else if(this.menuactive==3){
			this.$router.push({
					path: '/editarticle',
					query: {
						'id':row.id,
					}
				});
		}
	}
	},
	created() {
		this.menuactive = this.$route.query.messageType;
		if(this.menuactive==3){
			this.orgActivityList(this.page)
		}else{
			this.getnoticeList(this.page)
		}
	}
}
</script>
<style lang="less">
	.gslDraft{
		margin-bottom: 63px;
		// margin-top: 69px;
		// margin-bottom: 63px;
		// padding: 48px 90px 60px;
		// .warp{
		.rightcont {
			width: 810px;
			float: left;
			padding-left: 40px;
			padding-right: 46px;
			padding-top: 70px;
			position: relative;
			min-height: 660px;
			border-left:1px solid #eee;
			.mt,.mc {
				padding-left: 20px;
				padding-right: 20px;
				text-align: left;

				.item {
					text-align: left;
					height: 60px;
					line-height: 60px;
					display: inline-block;
					min-width: 60px;
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
					vertical-align: middle;
				}
			}

			.mt {
				background: #fff;

				.item {
					height: 40px;
					line-height: 40px;
				}
			}
		}
		.leftcont {
			float: left;
			width: 265px;
			// border-right: 1px solid #eee;
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
			}
		}
	// }
}
</style>
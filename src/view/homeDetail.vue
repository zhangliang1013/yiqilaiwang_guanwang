<template>
    <div>
        <div class="w">
			<div class="position">会员之家详情
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
        <div class="w bg" style="margin-bottom: 30px">
            <div class="homeDetail">
               <div class="top-d clear">
                   <div class="t-l fl clear">
                        <img :src="detail.avatarUrl" alt="" class="fl ava">
                        <div class="name fl">{{detail.userName}}</div>
                        <div class="time fl">{{detail.showDate}}</div>
                   </div>
                   <div class="t-r fr" v-if="detail.location">
                       <img src="./../assets/img/rhsh4@3x.png" alt="">
                       <span>{{detail.location}}</span>
                   </div>
                </div> 
                <div class="isOrgOnly" v-if="detail.isOnlyOrg == 1">此内容仅组织内成员可见</div>
                <div class="line"></div>
                <div class="content" v-html="detail.content"></div>
                <div :class="[{'img1': detail.imgCollection && (detail.imgCollection.length==2 || detail.imgCollection.length==4) },'img clear']">
                    <div :class="[{'img-box1': detail.imgCollection.length==1},'img-box']" v-for="(item, index) in detail.imgCollection" :key="index">
                        <img :src="item" alt="" preview>
                    </div>
                    <!-- <img :class="{'img-item': detail.imgCollection.length==1}" :src="item" alt="" v-for="(item, index) in detail.imgCollection" :key="index" preview> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"homeDetail",
    props: {
        msg: String,
        personalInfo: null, //登陆后 的用户信息
        defOrg: null
    },
    data(){
        return {
            detail:"",
        }
    },
    methods: {
        // 获取修改内容
        getHomeInfo(){
            this.http.ajax({
                url: 'webSite/orgMessage/info',
                method: 'post',
                headers: {
                    'Content-Type': ' application/json'
                },
                data: {
                    id:this.id,
                    sourceType:6
                }
            }).then(res => {
                // console.log(res)
                // layer.msg(res.msg)
                if (res.code == 200) {
                    this.detail = res.data;
                    this.detail.content= this.detail.content.replace(/\n/g,"<br/>");
                    // this.messageType = res.data.messageType;
                    // this.imglist = res.data.imgCollection;
                    // this.isOnlyOrg = res.data.isOnlyOrg;
                    // this.location = res.data.location;
                    // this.latitude = res.data.latitude;
                    // this.longitude = res.data.longitude;
                }
                this.orgStructureListDtos = res.data.orgStructureListDtos
            })
        },
    },
    created() {
        this.id = this.$route.query.id;
        this.getHomeInfo();
        this.$previewRefresh();
    },
}
</script>
<style lang="less">
    .homeDetail{
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        color:#333333;
        font-weight:400;
        padding:48px 80px 58px 94px;
        .top-d {
            .t-l{
                .ava{
                    width:32px;
                    height:32px;
                    border-radius: 50%;
                }
                .name{
                    line-height:20px;
                    margin:6px 9px 0 13px ;
                }
                .time{
                    color:rgba(153,153,153,1);
                    line-height:20px;
                    margin:6px 0;
                }
            }
            .t-r{
                margin:6px 0 0;
                img{
                    width:10px;
                    height:10px;
                    margin-right:8px;
                }
                span{
                    display: inline-block;
                }
            }
        }
        .isOrgOnly{
            text-align: right;
            color:rgba(33,104,235,1);
            line-height:20px;
            margin-top:9px;
        }
        .line{
            // width:900px;
            height:1px;
            background:#EEEEEE;
            margin:24px 6px 21px 0;
        }
        .content{
            margin-left:4px;
            line-height:20px;
        }
        .img{
            margin:6px 120px 0 130px;
            // img{
            //     width:200px;
            //     height:200px;
            //     margin:16px 16px 0 0;
            // }
            .img-box{
                float:left;
                width:200px;
                height:200px;
                margin:16px 16px 0 0;
                overflow: hidden;
                img{
                    width:100%;
                    min-height:100%;
                    height:auto;
                }
            }
            .img-box1{
                width:636px;
                height:auto;
                max-height:1248px;
                margin: auto;
                display: block;
            }
        }
        .img1{
            margin:6px 236px 0 236px;
        }
        
    }
</style>
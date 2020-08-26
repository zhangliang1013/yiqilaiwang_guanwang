<template>
	<div>
		<div class="w">
			<div class="position">政策详情
				<!-- <span ><router-link :to="'/policyList?page='+page" >返回</router-link></span> -->
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 64px;">
            <div class="policyState">
                <div class="steps">
                    <div class="step clear">
                        <img src="./../assets/img/szsxhysb1@3x.png" alt="" class="fl">
                        <div class="content fl">
                            <div class="title">已提报</div>
                            <div class="remark">提报时间：2020-3-20 20:30</div>
                        </div>
                    </div>
                    <div class="line"></div> 
                    <div class="step clear">
                        <img v-if="status == 2 || status == 3" src="./../assets/img/szsxhysb2.1@3x.png" alt="" class="fl">
                        <img v-else src="./../assets/img/szsxhysb2.2@3x.png" alt="" class="fl">
                        <div class="content fl">
                            <div class="title">商会初审已查看</div>
                            <div class="remark">{{status == 2 || status == 3?'查看时间：2020-3-20 20:30':'暂无信息'}}</div>
                        </div>
                    </div> 
                    <div class="line"></div>  
                    <div class="step clear">
                        <img  v-if="status == 3" src="./../assets/img/szsxhysb3.1@3x.png" alt="" class="fl">
                        <img v-else src="./../assets/img/szsxhysb3.2@3x.png" alt="" class="fl">
                        <div class="content fl">
                            <div class="title">商会初审已审批</div>
                            <div class="remark">{{status == 3?'查看时间：2020-3-20 20:30':'暂无信息'}}</div>
                        </div>
                    </div>  
                </div>
                <div style="width:100%;text-align:center;">
                    <div class="btn" @click="check(id)">查看政策详情</div>
                </div>
            </div>
        </div>
	</div>
</template>
<script>
	import axios from 'axios';
	export default {
		name: 'policyState',
		props: {
			msg: String,
			defOrg: null,
        },
        data() {
			return {
                page:1,
                id:"",
                status:1,
            }
        },
        methods: {
            check(row) {
				this.$router.push({
					path: "/policyDetail",
					query: {
						'id': this.id,
						'page':this.page,
					}
				});
				// this.$router.push({name:'admissionreviews',params:row});
				// } else {
				// 	return layer.msg('此信息已审核!');
				// }
            },
        },
        created() {
            this.page=this.$route.query.page;
            this.id=this.$route.query.id;
        },
	}
</script>
<style lang="less">
    .policyState{
        padding:92px 222px;
        .steps{
            .step img{
                width:46px;
                height:46px;
                margin-right:13px;
            }
            .content{
                font-size:14px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(153,153,153,1);
                line-height:20px;
                .title{
                    font-size:20px;
                    font-weight:600;
                    color:rgba(51,51,51,1);
                    line-height:28px;
                    margin-bottom: 4px;
                }
            }
            .line{
                width:2px;
                height:46px;
                background:rgba(80,137,242,1);
                border-radius:2px;
                margin:2px 22px 10px;
            }
        }
        .btn{
            width:206px;
            height:48px;
            line-height:48px;
            text-align: center;
            background:rgba(33,104,235,1);
            border-radius:27px;
            margin:88px auto 0;
            font-size:14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
    }
</style>
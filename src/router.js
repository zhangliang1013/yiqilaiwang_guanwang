import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
     mode: 'history',
	// mode: 'hash',
	
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: function () {
                return import('./view/index.vue');
            }
        },
        {
            path: '/login/:page',//注册
            name: 'login',
            component: function () {
                return import('./view/login.vue');
            }
        },
        {
            path: '/down',//注册
            name: 'down',
            component: function () {
                return import('./view/down.vue');
            }
        },
        {
            path: '/organize',//组织
            name: 'organize',
            component: function () {
                return import('./view/organize.vue');
            }
        },
        {
            path: '/addorganize',//新建组织
            name: 'addorganize',
            component: function () {
                return import('./view/addorganize.vue');
            }
        },
        {
            path: '/news',//新闻中心
            name: 'news',
            component: function () {
                return import('./view/news.vue');
            }
        },
        {
            path: '/newsArticle',//新闻中心
            name: 'newsArticle',
            component: function () {
                return import('./view/newsArticle.vue');
            }
        },
        {
            path: '/about',//关于我们
            name: 'about',
            component: function () {
                return import('./view/about.vue');
            }
        },
        {
            path: '/organizeManage',//组织管理
            name: 'organizeManage',
            component: function () {
                return import('./view/organizeManage.vue');
            }
        },
        {
            path: '/staff/:page',//人员管理
            name: 'staff',
            component: function () {
                return import('./view/staff.vue');
            }
        },
        {
            path: '/everywhere',//导出
            name: 'everywhere',
            component: function () {
                return import('./view/everywhere.vue');
            }
        },
        {
            path: '/tolead',//导入
            name: 'tolead',
            component: function () {
                return import('./view/tolead.vue');
            }
        },
        {
            path: '/activityrelease',//活动发布
            name: 'activityrelease',
            component: function () {
                return import('./view/activity/release.vue');
            }
        },
        {
            path: '/activitymember',//活动内的成员审核列表
            name: 'activitymember',
            component: function () {
                return import('./view/activity/member.vue');
            }
        },
        {
            path: '/activitycost',//活动费用
            name: 'activitycost',
            component: function () {
                return import('./view/activity/cost.vue');
            }
        },{
            path: '/activitysignup',//报名信息
            name: 'activitysignup',
            component: function () {
                return import('./view/activity/signup.vue');
            }
        },{
            path: '/activitylist',//组织的活动列表
            name: 'activitylist',
            component: function () {
                return import('./view/activity/list.vue');
            }
        },{
            path: '/activitydetails',//活动管理  //活动内容审核  //
            name: 'activitydetails',
            component: function () {
                return import('./view/activity/details.vue');
            }
        },{
            path: '/organizationset/:page',//组织设置
            name: 'organizationset',
            component: function () {
                return import('./view/organizationset.vue');
            }
        },{
            path: '/tongji',//统计
            name: 'tongji',
            component: function () {
                return import('./view/tongji.vue');
            }
        },{
            path: '/tool',//管理工具
            name: 'tool',
            component: function () {
                return import('./view/tool.vue');
            }
        },{
            path: '/docadmin',//新闻管理 //通知管理
            name: 'docadmin',
            component: function () {
                return import('./view/docadmin.vue');
            }
        },{
            path: '/admissionreview',//入会审核 是个列表
            name: 'admissionreview',
            component: function () {
                return import('./view/admissionreview.vue');
            }
        },{
            path: '/admissionreviews',//入会审核 同意有弹框
            name: 'admissionreviews',
            component: function () {
                return import('./view/admissionreviews.vue');
            }
        },{
            path: '/manageactivitylist',//管理员需要审核的活动列表
            name: 'manageactivitylist',
            component: function () {
                return import('./view/manageactivitylist.vue');
            }
        },{
		    path: '/activityaudit',//活动审核的详情页
		    name: 'activityaudit',
		    component: function () {
		        return import('./view/activity/audit.vue');
		    }
		},{
            path: '/contentaudit',//内容审核 通知
            name: 'contentaudit',
            component: function () {
                return import('./view/contentaudit.vue');
            }
        },{
            path: '/managearticlelist',//内容审核 //管理工具-资讯、通知、资源、党建列表 内容列表
            name: 'managearticlelist',
            component: function () {
                return import('./view/managearticlelist.vue');
            }
        },{
            path: '/heat',//热度
            name: 'heat',
            component: function () {
                return import('./view/heat.vue');
            }
        },{
            path: '/addarticle',//发布通知
            name: 'addarticle',
            component: function () {
                return import('./view/addarticle.vue');
            }
        },{
		    path: '/editarticle',//修改通知
		    name: 'editarticle',
		    component: function () {
		        return import('./view/editarticle.vue');
		    }
        },{
            path: '/addHome',//发布会员之家
            name: 'addHome',
            component: function () {
                return import('./view/addHome.vue');
            }
        },{
            path: '/homeDetail',//会员之家详情
            name: 'homeDetail',
            component: function () {
                return import('./view/homeDetail.vue');
            }
        },{
            path: '/policyList',//政策列表
            name: 'policyList',
            component: function () {
                return import('./view/policyList.vue');
            }
        },{
            path: '/policyDetail',//政策详情
            name: 'policyDetail',
            component: function () {
                return import('./view/policyDetail.vue');
            }
        },{
            path: '/policyState',//提报状态
            name: 'policyState',
            component: function () {
                return import('./view/policyState.vue');
            }
        },{
            path: '/submitDeclare',//政策提报
            name: 'submitDeclare',
            component: function () {
                return import('./view/submitDeclare.vue');
            }
        },{
            path: '/test',//图片截图
            name: 'test',
            component: function () {
                return import('./view/test.vue');
            }
        },{
            path: '/productShow/:page',//产品展示
            name: 'productShow',
            component: function () {
                return import('./view/productShow.vue');
            }
        },{
            path: '/product',//发产品
            name: 'product',
            component: function () {
                return import('./view/product.vue');
            }
        },{
            path: '/addBusiness',//发商机
            name: 'addBusiness',
            component: function () {
                return import('./view/addBusiness.vue');
            }
        },{
            path: '/submitDetails',//备案详情
            name: 'submitDetails',
            component: function () {
                return import('./view/submitDetails.vue');
            }
        },
        {
            path: '/union',//联盟
            name: 'union',
            component: function () {
                return import('./view/union.vue');
            }
        },
    ]
})

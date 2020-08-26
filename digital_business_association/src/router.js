import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	 mode: 'history',
	// mode: 'hash',
	
	base: process.env.BASE_URL,
	routes: [
		{
			path: '*',
			redirect:"/",
			component: function () {
				return import('./view/index.vue');
			}
		},{
			path: '/',
			name: 'home',
			component: function () {
				return import('./view/index.vue');
			}
		},{
			path: '',
			redirect:"/",
			component: function () {
				return import('./view/index.vue');
			}
		},{
			path: '/login/:page',//注册
			name: 'login',
			component: function () {
				return import('./view/login.vue');
			}
		},{
			path: '/down',//注册
			name: 'down',
			component: function () {
				return import('./view/down.vue');
			}
		},{
			path: '/organize',//组织
			name: 'organize',
			component: function () {
				return import('./view/organize.vue');
			}
		},{
			path: '/addorganize',//新建组织
			name: 'addorganize',
			component: function () {
				return import('./view/addorganize.vue');
			}
		},{
			path: '/news',//新闻中心
			name: 'news',
			component: function () {
				return import('./view/news.vue');
			}
		},{
			path: '/newsArticle',//新闻中心
			name: 'newsArticle',
			component: function () {
				return import('./view/newsArticle.vue');
			}
		},{
			path: '/about',//关于我们
			name: 'about',
			component: function () {
				return import('./view/about.vue');
			}
		},{
			path: '/organizeManage',//组织管理
			name: 'organizeManage',
			component: function () {
				return import('./view/organizeManage.vue');
			}
		},{
			path: '/staff/:page',//人员管理
			name: 'staff',
			component: function () {
				return import('./view/staff.vue');
			}
		},{
			path: '/everywhere',//导出
			name: 'everywhere',
			component: function () {
				return import('./view/everywhere.vue');
			}
		},{
			path: '/tolead',//导入
			name: 'tolead',
			component: function () {
				return import('./view/tolead.vue');
			}
		},{
			path: '/activityrelease',//活动发布
			name: 'activityrelease',
			component: function () {
				return import('./view/activity/release.vue');
			}
		},{
			path: '/activitymember',//活动内的成员审核列表
			name: 'activitymember',
			component: function () {
				return import('./view/activity/member.vue');
			}
		},{
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
			path: '/activityDetails',//活动管理  //活动内容审核  //
			name: 'activityDetails',
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
			path: '/submitDetails',//企业提报详情
			name: 'submitDetails',
			component: function () {
				return import('./view/submitDetails.vue');
			}
		},{
			path: '/draftList',//草稿箱
			name: 'draftList',
			component: function () {
				return import('./view/draftList.vue');
			}
		},{
			path: '/addLeader',//添加领导班子
			name: 'addLeader',
			component: function () {
				return import('./view/addLeader.vue');
			}
		},{
			path: '/information',//资讯详情
			name: 'information',
			component: function () {
				return import('./view/information.vue');
			}
		},{
			path: '/echarts/:page',//图表
			name: 'echarts',
			component: function () {
				return import('./view/echarts.vue');
			}
		},{
			path: '/productShow/:page',//产品展示
			name: 'productShow',
			component: function () {
				return import('./view/productShow.vue');
			}
		},{
			path: '/dynamicList/:page',//本会动态
			name: 'dynamicList',
			component: function () {
				return import('./view/dynamicList.vue');
			}
		},{
			path: '/releaseDynamic',//发布本会动态
			name: 'releaseDynamic',
			component: function () {
				return import('./view/releaseDynamic.vue');
			}
		},{
			path: '/arbitration',//仲裁详情
			name: 'arbitration',
			component: function () {
				return import('./view/arbitration.vue');
			}
		},{
			path: '/memberList/:page',//仲裁详情
			name: 'memberList',
			component: function () {
				return import('./view/memberList.vue');
			}
		},{
			path: '/policyDetail',//政策详情
			name: 'policyDetail',
			component: function () {
				return import('./view/policyDetail.vue');
			}
		},{
			path: '/activitylists',//组织的活动列表
			name: 'activitylists',
			component: function () {
				return import('./view/activity/lists.vue');
			}
		},{
			path: '/activityorglist',//范围
			name: 'activityorglist',
			component: function () {
				return import('./view/activity/orglist.vue');
			}
		},{
			path: '/dcwj',//范围
			name: 'dcwj',
			component: function () {
				return import('./view/dcwj.vue');
			}
		},{
			path: '/dcQuestions',//范围
			name: 'dcQuestions',
			component: function () {
				return import('./view/dcQuestions.vue');
			}
		}, {
			path: '/wjStatistics',//问卷统计
			name: 'wjStatistics',
			component: function () {
				return import('./view/wjStatistics.vue');
			}
		},{
			path: '/wjFill',//问卷统计填空题
			name: 'wjFill',
			component: function () {
				return import('./view/wjFill.vue');
			}
		},{
			path: '/gslDraft',//问卷统计填空题
			name: 'gslDraft',
			component: function () {
				return import('./view/gslDraft.vue');
			}
		},{
			path: '/wjSee',//问卷统计填空题
			name: 'wjSee',
			component: function () {
				return import('./view/wjSee.vue');
			}
		},{
			path: '/questionDetail',//我有话说详情
			name: 'questionDetail',
			component: function () {
				return import('./view/questionDetail.vue');
			}
		},
		{
			path:'/mailbox',//市民提问箱
			name: 'mailbox',
			component: function () {
				return import('./view/mailbox.vue');
			}
		},
		{
			path:'/signList',//签到详情
			name: 'signList',
			component: function () {
				return import('./view/signList.vue');
			}
		},
	]
})

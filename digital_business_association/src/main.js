import '@babel/polyfill'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import ajax from './assets/js/ajax.js'
import local from './assets/js/local.js'
// import qiniu from './assets/js/qiniu.js'
import headers from './components/header.vue'
import footers from './components/footer.vue'
import Upload from './components/upload.vue'

import VueDND from 'awe-dnd'

import AMap from 'vue-amap'
Vue.config.productionTip = false;
Vue.use(AMap);
AMap.initAMapApiLoader({
	key: '12399ff0812339527e25693f6e3130ec',
	// 插件集合
	plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor','Geocoder','Geolocation','CitySearch'],
	v: '1.4.4'
})

Vue.use(VueDND)

Vue.use(ajax)
Vue.use(local)

import { Switch,Button, Table ,Input,Form,FormItem,Select,Option,DatePicker,Col,Radio,Checkbox,TimePicker,Page,Message,RadioGroup,Poptip,Rate} from 'view-design';
import 'view-design/dist/styles/iview.css';
import '../my-theme/index.less';
Vue.component('Switchs', Switch);
Vue.component('Button', Button);
Vue.component('Table', Table);
Vue.component('Input', Input);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Col', Col);
Vue.component('Radio', Radio);
Vue.component('Checkbox', Checkbox);
Vue.component('TimePicker', TimePicker);
Vue.component('Page', Page);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Poptip',Poptip)
Vue.prototype.$Message=Message;
Vue.config.productionTip = false;
Vue.component('headers',headers);
Vue.component('footers',footers);
Vue.component('Upload', Upload);
Vue.component('Rate', Rate);

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

//引入redirective
import "./modules/directive"
import "./modules/common"


router.beforeEach((to, from, next) => {
	if (to.name === 'login') {
		var token=local.fetch('tokeng');
		if(token&&token!=''){
				next(from);
				return;
		}
		/*  if (!window.sessionStorage.tokenId) {
					router.push({name: 'login'})
			}*/
	}next()
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

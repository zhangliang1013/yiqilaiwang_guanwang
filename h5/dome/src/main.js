import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ajax from './assets/js/ajax.js'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';//样式文件一定要引入

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, { placeholder: '请输入内容' })
// Vue.use(ElementUI);
Vue.config.productionTip = false

Vue.use(ajax)

// 移动端适配
document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5+"px";
window.onresize = function(){
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

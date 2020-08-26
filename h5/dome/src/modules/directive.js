import Vue from "vue"

//v-back-top
Vue.directive("back-top",{
	inserted(el,binding,vnode){
		let event_type = binding.arg || "click";
		el.addEventListener(event_type,()=>{
				document.documentElement.scrollTop = 0;
		})
	}
});
Vue.directive('clickOutSide', {
	bind(el, binding, vnode) {

		el.handler = function(e) {
			if (el.contains(e.target)) {
				return false
			}
			//console.log(vnode)
			// vnode.context[binding.expression] = false
			binding.value?binding.value():'';
		}
		el.stopProp = function(event) {
			event.stopPropagation()
		}
		el.addEventListener('click', el.stopProp)

		document.body.addEventListener('click', el.handler)
	},
	unbind(el, binding) {
		el.removeEventListener('click', el.stopProp)
		document.body.removeEventListener('click', el.handler)
	}
})















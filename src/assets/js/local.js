//本地储存
let local={
	save(key,value){
		return localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key))
	},
	del(key){
		return localStorage.removeItem(key);
	}
}
export default {
	install:function(vm){
		vm.prototype.local=local;
	},
	...local
}
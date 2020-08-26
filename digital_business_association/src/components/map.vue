<template>
	 <div id="container" ></div>
</template>

<script>
	import VueAMap from 'vue-amap'
	let amapManager = new VueAMap.AMapManager();
	export default {
		name: 'Address',
		data() {
			return {
				zoom: 10,
				center: [116.383798, 39.908315],
				amapManager: amapManager,
			}
		},
		mounted() {
			this.loadmap(); //加载地图和相关组件
		},
		methods: {
			loadmap() {
				const map = new AMap.Map('container', {
					zoom: 9
				});
			}
		}
	}
</script>

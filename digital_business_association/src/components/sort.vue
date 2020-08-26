<template>
	<div class="hello">
		<div class="singer" id="singer">
			<ul class="singer-ul">
				<li v-for="(item, index) in list" :key="index" class="singer-ul-li">
					<!-- <div class="singer-tag" :id="item.tag">{{item.tag | filterSingerTag}}</div> -->
					<div class="" :id="item.tag=='*'?'other':item.tag"></div>
					<!-- <div class="" :id="item.tag=='9'?'other':item.tag"></div> -->
					<ul>
						<li v-for="(fitem, findex) in item.data" :key="findex" @click="select(fitem)" :class="{'li':fitem.disabled}">
							<!-- <img :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${fitem.Fsinger_mid}.jpg?max_age=2592000`"> -->
							<!-- <div>{{fitem.Fsinger_name}}</div> -->
							<img v-show="fitem.choose || fitem.disabled" src="./../assets/img/zzgl10@3x.png" alt="">
							<img v-show="!fitem.choose && !fitem.disabled" src="./../assets/img/zzgl11@3x.png" alt="">
							<div style="margin-left:11px">{{fitem.orgName}}</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- <div class="singer-top-tag">{{singerTopTag | filterSingerTag}}</div> -->
		<div class="sort">
			<ul>
				<li 
					v-for="(item, index) in sortList"
					:key="index"
					@click="jumpTag(item)"
					:class="{current:currentSort == item? true : false}"
				>
					<!-- {{item == `hot` ? `热` : item}} -->
					{{item}}
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
		// import axios from 'axios'
    export default {
			name: 'sort',
			props:{
				structureList:null,
				oldParts:null,
			},
			data () {
				return {
					list:[], // 歌手列表
					sortList:[], // 侧栏排序列表
					currentSort: '*', // 当前排序的标签
					chooseList:[],
					chooseArr:[],
					arrLength:0,
					// singerTopTag: '*', // 歌手栏头部的标签名字
				}
			},
			watch:{
				oldParts(val){
					this.chooseArr = val
				}
			},
			methods: {
				select (fitem) {

					if(fitem.disabled){
						return
					}
					fitem.choose = !fitem.choose;
					if(this.oldParts.length){
						this.chooseArr = this.oldParts;
					}
					if(fitem.choose){
						this.chooseArr.push(fitem);
					}else{
						this.chooseArr.map((item,index)=>{
							if(item.id == fitem.id){
								this.chooseArr.splice(index,1)
							}
						})
					}
					this.$emit('onchange',this.chooseArr)
				},
				handleScroll () {
					// console.log('滚动监听')
					let scrollTop = document.getElementById("singer").scrollTop;
					let offsetTop = 0
					this.list.forEach((item,index) => {
						// 获取每个排序标签的位置
						offsetTop = document.querySelectorAll('.singer-ul-li')[index].offsetTop
						// console.log('offsetTop:',offsetTop,'scrollTop：',scrollTop,'offsetTop1:',offsetTop+ 37.8*item.data.length,scrollTop > offsetTop && scrollTop < (offsetTop+ 37.8*item.data.length))
						// console.log('判断:',scrollTop > offsetTop && scrollTop < (offsetTop+ 37.8*item.data.length),index)
						// 当前滚动条的位置 和 当前的标签偏移顶部的距离进行对比
						// 每一个歌手的li标签的高度必须要保持一致，我这里的高度是70，可以计算自己项目的内容的具体高度进行修改
						if (scrollTop > offsetTop && scrollTop < (offsetTop+ 37.8*item.data.length)-13) {
							this.currentSort = item.tag
						}
					})
				},
				pySegSort(arr,empty) {
					var _this = this;
					if(!String.prototype.localeCompare)
					return null;

					var letters ="*abcdefghjklmnopqrstwxyz".split('');
					var zh ="啊把差大额发噶哈级卡啦吗那哦爬器然啥他哇西呀咋".split('');

					var segs = [];
					var curr;
					$.each(letters, function(i){
						curr = {tag: this, data:[]};
						var letter = this;
						$.each(arr, function() {
							if(
								(!zh[i-1] || zh[i-1].localeCompare(this.orgName) <= 0) 
								&& this.orgName.localeCompare(zh[i]) == -1 
								&& /^[\u4e00-\u9fa5]+$/i.test(this.orgName[0]) 
								|| !(/^[\u4e00-\u9fa5]+$/i.test(this.orgName[0])) 
								&& this.orgName[0].search( new RegExp(`\${letter}`,'i') ) !=-1
								|| letter=='*' && !/^[a-zA-Z]+$/.test(this.orgName[0])
								&&!/^[\u4e00-\u9fa5]+$/i.test(this.orgName[0])
							) {
								curr.data.push(this);
							}
						});
						if(empty || curr.data.length) {
							segs.push(curr);
							curr.data.sort(function(a,b){
								return a.orgName.localeCompare(b.orgName);
							});
						}
						segs.forEach((item,index) => {
							//　添加侧栏排序
							// item.Findex = item.Findex == 9 ? 'hot' : item.Findex
							_this.sortList.push(item.tag)
						})
						_this.sortList = new Set(_this.sortList)
						_this.sortList = [..._this.sortList]
					});
					return segs;
				},
				// 跳转标签
				jumpTag(i){
					// this.singerTopTag = i
					this.currentSort = i;
					if(i == '*'){
						i = 'other';
					}
					// console.log('item',i,'this.currentSor',this.currentSor,)
					document.querySelector(`#${i}`).scrollIntoView()
				},
			},
			// filters :{
			// 	filterSingerTag(i) {
			// 		return i == `hot` ? `热门` : i
			// 	}
			// },
			mounted() {
				this.list = this.pySegSort(this.structureList);
				this.list.map(i =>{
					this.arrLength +=  i.data.length
					this.$emit('length',this.arrLength)
				})
				// this.testData()
				// 监听滚动条
				var singer = document.getElementById('singer');
				singer.addEventListener('scroll', this.handleScroll)
			},
			destroyed () {
			 	// 页面摧毁的时候要关闭监听 
				var singer = document.getElementById('singer');
				if(singer){
					singer.removeEventListener('scroll', this.handleScroll)
				}
			},
    }
</script>
<style>
.hello {
 position: relative;
 /* background-color: #222; */
}
 
.singer {
 position: relative;
 width: 100%;
 height: auto;
 max-height: 372px;
 min-height: 70px;
 /* overflow: hidden; */
 overflow-y: auto;
 /* background: #222; */
}
.singer::-webkit-scrollbar {
  display: none;
}
.singer-top-tag {
	position: absolute;
	top: 0px;
	left: 0;
	width: calc(100% - 20px);
	height: 30px;
	line-height: 30px;
	padding-left: 20px;
	font-size: 12px;
	color: hsla(0,0%,100%,.5);
	background: #333;
}
 
.singer-tag {
 width: 100%;
 height: 30px;
 margin-bottom: 20px;
 line-height: 30px;
 padding-left: 20px;
 font-size: 12px;
 color: hsla(0,0%,100%,.5);
 background: #333;
}
.singer-ul{
	margin:13px 30px 0 16px
}
.singer-ul-li ul li {
	list-style-type: none;
	display: flex;
	/* justify-content: space-between; */
	align-items: center;
	padding: 8px 4px;
	color: #333333;
	border-bottom:1px solid #EEEEEE;
	cursor:pointer;
}
.singer-ul-li ul li.li{
	cursor:not-allowed;
}
.singer-ul-li ul li:last-child{
	/* border-bottom:none; */
}
.singer-ul-li ul li img {
	border-radius: 50%;
	width: 16px;
	height: 16px;
}
 
.singer-ul-li ul li div {
 /* padding-left: 20px; */
 	width: 256px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
 
.sort {
 position: absolute;
 z-index: 30;
 right: 7px;
 top: 50%;
 -webkit-transform: translateY(-50%);
 transform: translateY(-50%);
 text-align: center;
 background: #fff;
 font-family: Helvetica;
}
 
ul {
 margin: 0;
 padding: 0;
}
 
.sort ul{
 color: #333333;
}
 
.sort ul li {
	list-style-type: none;
	padding: 3px 3px;
	line-height: 1;
	font-size: 11px;
	cursor: pointer;
	width: 16px;
}
 
.current {
 color: #2168EB;
 background:rgba(62,201,252,0.4);
 border-radius: 50%;
}
</style>
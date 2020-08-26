<template>
	<div>
		<div class="page_news_banner" style="background-size:1920px"></div>
		<div class="w bg ">
			<div class="new_list page_news" v-if="list">
				<router-link :to="'/newsArticle?id='+item.id" class="item" v-for="(item,index) in list.rows" :key="index">
					<h3>{{item.newsDigest}}</h3>
					<p v-text="item.newsDigest"></p>
					<span class="time">{{item.createTime.substr(0,10)}}</span>
					<img :src="item.imageUrl" alt="" class="pic">
				</router-link>

				<div class="tac">
					<div class="btn28 " @click="more" v-if="(list.total%10)>=page?true:false">
						查看更多
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'news',
		data() {
			return {
				list: null,
				page: 1
			}
		},
		methods: {
			more() {
				var page = this.page;
				if (this.page == 0) {
					return;
				}
				this.http.ajax({
					url: 'webSite/home/newsList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"pageNumber": this.page,
						"pageSize": '10'
					}
				}).then(res => {
					if (res.code == 200) {
						page++
						this.page = page;

						if (this.list) {
							this.list.rows = this.list.rows.concat(res.data.rows)
						} else {
							this.list = res.data;
						}

					}
				})
				this.page = 0;
			}
		},
		created() {
			this.more();
			//
		}
	}
</script>

<style lang="less">
	.page_news_banner {

		background: #2168EB url("../assets/img/banner3@2x.png") no-repeat center;
		width: 100%;
		height: 200px;


	}

	.page_news {
		padding-left: 95px;
		padding-right: 82px;
		padding-top: 55px;
		margin-top: 44px;
	}

	.new_list {
		padding-bottom: 53px;

		.btn28 {
			margin-top: 39px;
			cursor: pointer;
		}

		.item {
			padding-left: 0px;
			padding-right: 255px;
			position: relative;
			padding-bottom: 19px;
			margin-top: 33px;

			h3 {
				color: #333333;
				font-size: 22px;
				margin-bottom: 7px;
				color: #333333;
				font-weight: bold;
			}

			.pic {
				position: absolute;
				width: 101px;
				height: 76px;
				top: 0;
				right: 0;
			}

			p {
				font-size: 14px;
				color: #666666;
				margin-bottom: 3px;
			}

			.time {
				color: #999999;
			}

			display: block;
			// 虚线
			border-bottom: 1px #cccccc dotted;
			// border-bottom: 1px solid #DDDDDD;
		}
	}
</style>

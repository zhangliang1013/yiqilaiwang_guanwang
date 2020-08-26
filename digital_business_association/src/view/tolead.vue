<template>
	<div>
		<div class="w">
			<div class="position">批量导入
				<span @click="$router.back(-1)">返回</span>
			</div>

		</div>
		<div class="w bg tolead">
			<div class="item">
				<div class="n">1</div>
				<p>下载辖属组织通用模板    批量填写组织信息<p/>
				<a href="https://img.yiqilaiwang.com/XXX%EF%BC%88%E7%BB%84%E7%BB%87%E5%90%8D%E7%A7%B0%EF%BC%89---%E9%80%9A%E8%AE%AF%E5%BD%95%E6%A8%A1%E6%9D%BF.xls"
					download="" title="下载" mce_href="#">下载</a>
			</div>
			<div class="jt"></div>
			<div class="item">
				<div class="n">2</div>
				<p>上传填写好的 辖属组织信息表
					<p />
					<input type="file" id="file" ref="evfile" @change="changes" style="display: none">
					<a href="javascript:void(0);" @click="zh_uploadFile()">选择文件</a>
					<span>{{ filename }}</span>
			</div>
			<div class="jt"></div>
			<div class="item">
				<div class="n">3</div>

				<span class="upload" @click="upload()">上传</span>
			</div>
		</div>
	</div>
</template>
<script>
	// import axios from 'axios'
	// import Vue from 'vue'
	// import local from '../assets/js/local'
	export default {
		name: 'tolead',
		props: {
			msg: String,
			defOrg: null
		},
		created() {
			this.path = this.$route.query.path
			if (this.defOrg) {	
				this.orgId = this.defOrg.digitalCommerce;
			}
		},
		data() {
			return {
				filename: null,
				orgId: null,
				file: null,
				// 添加完成之后的跳转路径
				path: ''
			}
		},
		watch: {
			defOrg(res) {
				if (res) {
					this.orgId = res.digitalCommerce;

				}
			}
		},
		methods: {
			//模拟触发input点击	
			zh_uploadFile() {
				this.$refs.evfile.click();
			},
			changes(e) {
				// e为文件
				this.filename = e.currentTarget.files[0].name
				this.file = e.currentTarget
			},
			upload(e) {
				var loading = layer.load(1, {
					shade: [0.1, '#fff'] //0.1透明度的白色背景
				});
				// console.log(this.file)
				if(this.file==null){
					layer.close(loading)
					layer.msg("请先上传文件")
					return
				}
				var img_file = this.file;
				var formData = new FormData();
				var fileObj = img_file.files[0];
				formData.append("dsc", "dsc");
				formData.append("file", fileObj);

				this.http.ajax({
					url: '../../webSite/gov/importBatch?govId=' + this.orgId,
					method: 'post',
					headers: {
						"Content-Type": "multipart/form-data"
					},
					data: formData

				}).then(res => {
					// console.log(res)
					layer.close(loading)
					this.$router.push({
						path: this.path
					})
					layer.msg(res.msg)
				})
			}
		}
	}
</script>

<style lang="less">
	.tolead {
		font-size: 0;
		text-align: center;
		padding-top: 159px;
		padding-bottom: 401px;
		margin-bottom: 63px;

		.jt {
			display: inline-block;
			width: 32px;
			height: 32px;
			background: url("../assets/img/zk4@2x.png") no-repeat;
			vertical-align: middle;
			margin: 0 32px;
		}

		.item {
			width: 160px;
			vertical-align: middle;
			height: 200px;

			.upload {
				margin-top: 32px;
				width: 90px;
				height: 36px;
				text-align: center;
				line-height: 36px;
				background: #2168eb;
				color: #ffffff;
				font-size: 13px;
				display: inline-block;
				-webkit-border-radius: 36px;
				-moz-border-radius: 36px;
				border-radius: 36px;
				cursor: pointer;
			}

			.n {
				width: 55px;
				height: 55px;
				background: #efefef;
				-webkit-border-radius: 55px;
				-moz-border-radius: 55px;
				border-radius: 55px;
				text-align: center;
				line-height: 55px;
				font-size: 28px;
				margin: 0 auto;
			}

			p {
				margin-top: 10px;
			}

			a {
				font-size: 14px;
			}

			display: inline-block;
			font-size: 16px;
		}
	}
</style>

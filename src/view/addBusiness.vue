<template>
	<div>
		<div class="w">
			<div class="position">发{{type=='honor'?defOrg&&defOrg.orgType ==1?'布商会荣誉':'协会荣誉':'商机'}}
				<span @click="$router.back(-1)" v-if="type!='honor'">返回</span>
			</div>
		</div>
		<div class="w bg" style="margin-bottom: 74px;">
			<div class="addBusiness">
				<Form ref="formValidate" :label-width="100" :model="formValue">
          <FormItem :label="type=='honor'? '主题':'公司名称'" class="input">
						<Input v-model="formValue.companyName" :placeholder="type=='honor'? '':'请输入公司名称'" :maxlength="30"/>
					</FormItem>
          <FormItem label="选择类型" class="input" v-if="type!='honor'">
						<Select v-model="scale.fieldValue" placeholder="选择类型" @on-change="scaleChange($event,'scale')">
							<!-- <Option :value="'selectAll'">全员可见</Option> -->
							<Option :value="item.fieldValue" :label="item.fieldLabel" v-for="(item,index) in scaleArr" :key="index">{{item.fieldLabel}}</Option>
						</Select>
					</FormItem>
					<FormItem v-if="type=='honor'" label="获得荣誉时间" prop="actStartTime">
						<DatePicker format="yyyy-MM-dd"  :options="dateoptions" @on-change="onactStartTime"
						 :value="formdate.actStartTime" type="date" placeholder="选择时间" style="width: 350px;"></DatePicker>
					</FormItem>
					<div class="line1"></div>
					<FormItem label="内容" class="count-box">
						<!-- <Input placeholder="标题" :maxlength="35" v-model="formValue.newsDigest"/> -->
						<Input type="textarea" v-model="formValue.content" :maxlength="500" :autosize="{minRows: 9,maxRows: 9}" :placeholder="type=='honor'? defOrg&&defOrg.orgType ==1?'点击输入商会荣誉':'点击输入协会荣誉':'点击输入合作描述'"/>
						<!-- <div class="uploadpic_tips">建议上传750*400px尺寸图片</div> -->
						<div class="count">（{{formValue.content?formValue.content.length:0}}/500）</div>
					</FormItem>
					<FormItem label="图片" class="clear img">
						<div class="clear">
							<Upload @success="upImagesSuccess" @error="upImagesError" :personalInfo="personalInfo" v-if="imglist.length<9" :mimeType="mimeType" class="fl">
									<div style="width: 68px;height: 68px;padding: 22px;border:1px solid #ccc;border-radius: 5px;margin-right:22px;margin-bottom:7px;">
											<img src="../assets/img/pz@3x.png" alt="" style="width: 100%;height: auto;">
									</div>
							</Upload>
							<div class="imgbox fl" v-for="(v,i) in imglist" :key="i" v-dragging="{ item: v, list: imglist, group:'imglist'}" :style="{'margin-right':i==5?'0':'22'+'px'}">
									<div class="img">
											<img :src="v.url" preview ="0">
									</div>
									<img src="../assets/img/gwhyzjsc@3x.png" alt="" class="del" @click="removeArray(imglist,v.url)">
							</div>
					</div>
					<!-- <div class="remark">建议上传750*750px尺寸图片</div> -->
					</FormItem>
					<div class="btn-save" @click="issue()">发布</div>
					<div>&nbsp;</div>
				</Form>

			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'addBusiness',
		props: {
			msg: String,
			personalInfo: null, //登陆后 的用户信息
			defOrg: null
		},
		data() {
			let self = this;
			return {
				scaleArr:[
					{
						fieldLabel:"发布供需",
						fieldValue:"1",
					},
				],
				scale:{
					fieldValue:"1",
					fieldLabel:"发布供需",
					fieldName: "scale",
					inx: 0
				},
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				formValue: {
					companyName: null,
					content:"",
				},
				formdaterule:{
					actStartTime: [{
						required: true,
						message: '选择时间',
						trigger: 'blur'
					}],
				},
				formdate:{
					"actStartTime": ""
				},
				dateoptions: {
					// disabledDate(date) {
					// 	return date && date.valueOf() < Date.now() - 86400000;
					// }
				},
				orgId:"",
				// 弹窗
				layer: 0,
				imglist: [],
				id:"",
				type:'',
			}
		},
		watch: {
			defOrg:{
				handler:function(val){
					if(val && !val.orgSearch){
						this.isOnlyOrg = false;
					}
				},
				immediate: true
			} 
		},
		methods: {
			scaleChange(e,name){
				this[name].fieldLabel = e.label;
				this[name].fieldValue = e.value;
			},
            getFields() {
				this.http.ajax({
					url: 'webSite/userFields/getFields',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						uid: this.personalInfo.id
					}
				}).then(res => {
					if (res.code == 200) {
						this.Fields = res.data
					}
				})
			},
				onactStartTime(e) {
				this.formdate.actStartTime = e;
				var start = new Date(this.formdate.actStartTime);
				this.startDate = start
			},
			getBusinessActivity(){
				this.http.ajax({
					url: 'webSite/businessGov/getBusinessActivity',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						id: this.id
					}
				}).then(res => {
					if (res.code == 200) {
					this.formValue.content=res.data.content
					this.imglist=res.data.attachments
					this.formValue.companyName=res.data.title
					}
				})
			},
			pushextras(item) {
				item.isChoose == 1 ? item.isChoose = 0 : item.isChoose = 1;
				var index = this.formdate.extras.findIndex(d => d.fields === item.fields)
				if (index < 0) {
					this.formdate.extras.push(item)
				} else {
					this.formdate.extras.splice(index, 1);
				}

			},
			addfieldslist(id) {
				// console.log(id)
				this.fieldslist.push(id)
				this.onisfieldsedit();
			},
			// 保存标签
			onisfieldsedit() {
				if (this.isfieldsedit) {
					if (this.fieldslist.length > 0) {
						this.http.ajax({
							url: 'webSite/userFields/deleteFields',
							method: 'post',
							headers: {
								'Content-Type': ' application/json'
							},
							data: {
								"list": this.fieldslist
							}
						}).then(res => {
							if (res.code == 200) {
								this.getFields();
							}
							this.fieldslist = []
							// this.isfieldsedit = 0
						})
					} else {
						// this.isfieldsedit = 0
					}
				} else {
					this.isfieldsedit = 1
				}
			},
			// 自定义标签
			onisfields(e) {
				this.isfields = e;
				// console.log(this.$refs.fields.value)

				// console.log("getFields", this.Fields)
				for (var i = 0; i < this.Fields.length; i++) {
					if (this.Fields[i].fields == this.$refs.fields.value) {
						layer.msg("该标签已存在")
						return
					}
				}
				if (e) {
					setTimeout(() => {
						this.$refs.fields.focus()
					})
				} else {
					if (this.$refs.fields.value != '') {
						// console.log(this.$refs.fields.value)
						this.http.ajax({
							url: 'webSite/userFields/save',
							method: 'post',
							headers: {
								'Content-Type': ' application/json'
							},
							data: {
								"actType": 1,
								"fieldsName": this.$refs.fields.value
							}
						}).then(res => {
							if (res.code == 200) {
								this.$refs.fields.value = '';
								this.getFields();
								this.isfieldsedit = 1
							}
						})
					}
				}
			},
			// 选中标签
			setformdate(e) {
				this.formdate[e] == 1 ? this.formdate[e] = 0 : this.formdate[e] = 1
			},
			//移除数组
			removeArray(_arr, _obj) {
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i].url == _obj) {
						if (i == 0) {
							_arr.shift(); //删除并返回数组的第一个元素
							return _arr
						}
						else if (i == length - 1) {
							_arr.pop();  //删除并返回数组的最后一个元素
							return _arr
						}
						else {
							_arr.splice(i, 1); //删除下标为i的元素
							return _arr
						}
					}
				}
			},
			// 发布
			issue() {
				if (!this.formValue.companyName && this.type == 'business') {
					let msg = this.type == 'business'?'请输入公司名称':'请输入主题';
					layer.msg(msg)
					return
				}
				if (this.formValue.content.trim() == "") {
					layer.msg("请输入内容")
					return
				}
				if (this.formdate.actStartTime == "") {
					layer.msg("请选择时间")
					return
				}
				// console.log(new Date(this.formdate.actStartTime).getTime())
				// if (!this.imglist.length) {
				// 	layer.msg("请上传至少一张头图")
				// 	return
				// }
				// var extraProperties = [];
				// extraProperties.push({
				// 	fieldValue:this.formValue.companyName,
				// 	fieldLabel:"",
				// 	fieldName: "companyName",
				// 	inx: 0
				// },this.scale)
				var data = {
					// extraProperties: extraProperties,
					content: this.formValue.content,
					attachments: this.imglist,
					type:this.type=='honor'? 2100:1301,
					action:this.type=='honor'? 17:13,
					startTime:this.type=='honor'?new Date(this.formdate.actStartTime).getTime():new Date().getTime(),
					endTime:this.type=='honor'? null:new Date('2079').getTime(),
					status:this.type=='honor'? null:1,
					orgId: this.defOrg.id,
					title:this.formValue.companyName
				};
				var url = 'webSite/businessGov/saveBusinessActivity'
				if(this.id){
					data.id= this.id
					url ='webSite/businessGov/updateBusinessActivity'
				}
				this.http.ajax({
					url: url,
					method: 'post',
					headers: {
            'Content-Type': 'application/json',
					},
					data: data
				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					if (res.code == 200) {
						layer.msg("发布成功")
						// return this.$router.back(-1);
						if(this.$route.query.type == 'honor'){
							var url = "/organizationset/4?synopsis=5"
						}else{
							var url = "activitylist?messageType=9"
						}
						this.$router.push({
							path: url,
						});
					}
				})
			},
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			upImagesSuccess(e) {
				// console.log(e);
				this.imglist.push({
					url:e.url,
					name:e.name,
					// fileExtension:e.type.split("/")[1],
					// fileSize:parseFloat(e.size / 1024).toFixed(2)
					inx:this.imglist.length,
					type:1,
				});
				// 预览图片
				this.$previewRefresh();

			},
			upImagesError(e) {
				// console.log('图片上传失败',e)
			},
			// 弹窗弹出
			tolayer(n) {
				this.layer = n
				if (n == 1) {

				}
			},
			// 附件上传
			// upcoverUrl(e) {
			// 	this.fileFname = e.name
			// 	this.fileFurl = e.url
			// 	// console.log(e)
			// 	// this.fileCollection.push(e.url);

			// 	if (this.fileCollection_old.indexOf(e.url) == -1) {
			// 		this.fileCollection_old.push(e.url)
			// 		this.fileCollection.push([this.fileFname, this.fileFurl])
			// 	}
			// },
			
			
		},
		created() {
			this.type = this.$route.query.type;
			this.formdate.actStartTime = new Date(new Date().getTime() + 1000 * 60 * 10).Format("yyyy-MM-dd hh:mm:ss");
			this.getFields();
			if(this.$route.query.id){
				this.id=this.$route.query.id
				this.getBusinessActivity()
			}
        },
        mounted() {
		},

	}
</script>

<style lang="less">
	.hand {
		cursor: pointer;
	}

	.addBusiness {
		padding-top: 64px;
		padding-right: 76px;
        padding-left: 183px;
        .count-box{
			.ivu-form-item-content{
				position:relative;
				.count{
					position:absolute;
					bottom:15px;
					right:20px;
					height:17px;
					font-size:12px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:17px;
				}
				.ivu-input{
					padding:14px 13px 32px;
					background:#FAFAFA;
					border:1px solid rgba(221,221,221,1);
				}
			}

		}
        .img{
            position:relative;
            .label{
                position:absolute;
                top:0;
                left:-74px;
                font-size:14px;
                color:#c7c7c7;
            }
            .remark{
                font-size:12px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:#c7c7c7;
                line-height:17px;
            }
        }
        .tag{
            .ivu-form-item-label{
                margin-top:6px;
            }
            .mc {
                // width:544px;
                .active {
                    border-color: #2168eb;
                    color: #2168eb;
                    padding-right: 12px;
    
                    img {
                        width: 14px;
                        height: 14px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
    
                span {
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    position: relative;
                    cursor: pointer;
    
                    .close {
                        display: block;
                        width: 20px;
                        height:auto;
                        position: absolute;
                        z-index: 99;
                        right: -15px;
                        top: -8px;
                    }
    
                    img {
                        display: none;
                    }
    
                    padding: 0 15px;
                    // padding-right: 32px;
                    border: 1px solid #eee;
                    -webkit-border-radius: 38px;
                    -moz-border-radius: 38px;
                    border-radius: 38px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    margin: 7px 6px;
                    display: inline-block;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                }
    
                .btn {
                    border-bottom: none;
                    background: #2168eb;
                    color: #ffffff;
    
                    b {
                        font-weight: normal;
                    }
    
                    input {
                        display: none;
                    }
                }
    
                .btn.active {
                    background: none;
                    border: 1px solid #eee;
                    padding: 0;
                    vertical-align: middle;
                    width: 100px;
    
                    input {
                        width: 100%;
                        display: block;
                        border: none;
                        background: none;
                        padding: 0 15px;
    
                    }
    
                    b {
                        display: none;
                    }
                }
    
            }
        }
		.icon {
			vertical-align: middle;
			margin-right: 3px;
		}
		.ivu-form .ivu-form-item{
			.ivu-form-item-content{
				margin-right: 100px;
			}
		}
		.ivu-form .ivu-form-item-label {
			text-align: left;
			color:#333333;
		}
        .ivu-input{
            // height:30px;
        }
	    .input.ivu-form-item{
			margin-bottom: 12px;
			.ivu-form-item-content{
				margin-right: 371px;
			}
		}
		.btn-title{
			font-size:14px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:20px;
		}
		// .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder {
		// 	color:#515a6e
        // }
        // .ivu-select-single .ivu-select-selection{
        //     height:30px;
        //     .ivu-select-selected-value{
        //         height:30px;
        //         line-height:30px;
        //     }
        // }

		.line {
			border-bottom: 1px dotted #DDDDDD;
			margin-bottom: 29px;
			margin-right: 100px;
		}
		.line1 {
			border-bottom: 1px dotted #DDDDDD;
			margin: 23px 100px 19px 0;
        }
        .line2 {
			border-bottom: 1px dotted #DDDDDD;
			margin: 23px 100px 24px 0;
		}
		.editorHint{
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(33,104,235,1);
			line-height:17px;
			min-width:400px;
			margin-top:9px;
		}
	

		.w-e-text {
			font-size: 20px
		}

		.ivu-form-item-content {
			margin-right: 100px;
		}


		
		.btn-save {
			width: 206px;
			height: 48px;
			background: rgba(33, 104, 235, 1);
			border-radius: 27px;
			text-align: center;
			line-height: 48px;
			display: block;
			margin: 44px 100px 38px;
			color: #ffffff;
			font-size: 14px;
			cursor: pointer;

		}

		.imgbox {
			margin-right:22px;
			margin-bottom:7px;
			width:68px;
			height:68px;
			position:relative;
			.img {
				width:68px;
				height:68px;
				border-radius: 5px;
				overflow: hidden;
				img{
					width:100%;
					min-height:100%;
				}
			}
			.del{
				width: 14px;
				height: 14px;
				position: absolute;
				top: -12px;
				right: -12px;
				padding: 5px;
				box-sizing: content-box;
			}
		}

	}

</style>

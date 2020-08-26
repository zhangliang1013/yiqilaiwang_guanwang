<template>
	<div>
		<div class="w">
			<div class="position">
				联盟介绍
				<!-- <span @click="$router.back(-1)">返回</span> -->
			</div>
		</div>
		<div class="w bg union">
			<div class="warp clear">
				<div class="leftcont">
					<div class="menu">
						<div class="item" @click="tomenu(0)" :class="{active:menuactive==0}">简介</div>
						<div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">章程</div>
						<div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">架构</div>
						<div class="item" @click="tomenu(3)" :class="{active:menuactive==3}">发起单位</div>
						<div class="item" @click="tomenu(4)" :class="{active:menuactive==4}">理事会</div>
						<div class="item" @click="tomenu(5)" :class="{active:menuactive==5}">成员</div>
					</div>
				</div>
					<div class="rightcont">
							<!--商会简介-->
							<div class="rightcont1" v-show="menuactive==0">
									<div>
									<div class="rightcont-top clear">
											<div class="tit fl">联盟简介</div>
											<div class="item fr">
											<div class="addbtn" @click="saveIntroduce">保存</div>
											</div>
									</div>
									<Form ref="formValidate" :label-width="100" :model="formValue">
											<FormItem label="内容" class="editor">
											<div ref="editor" v-model="commerceIntroduce.intro" @click="getToken($event)"></div>
											<div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
											<!-- {{content}} -->
											</FormItem>
									</Form>
									</div>
							</div>
							<!--联盟章程-->
							<div class="rightcont1" v-show="menuactive==1">
									<div>
									<div class="rightcont-top clear">
											<div class="tit fl">联盟章程</div>
											<div class="item fr">
											<div class="addbtn" @click="saveIntroduce">保存</div>
											</div>
									</div>
									<Form ref="formValidate" :label-width="100" :model="formValue">
											<FormItem label="内容" class="editor">
											<div ref="editor1" v-model="commerceIntroduce.rule" @click="getToken($event)"></div>
											<div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
											<!-- {{content}} -->
											</FormItem>
									</Form>
									</div>
							</div>
							<!--联盟架构-->
							<div class="rightcont1" v-show="menuactive==2">
									<div>
									<div class="rightcont-top clear">
											<div class="tit fl">联盟架构</div>
											<div class="item fr">
											<div class="addbtn" @click="saveIntroduce">保存</div>
											</div>
									</div>
									<Form ref="formValidate" :label-width="100" :model="formValue">
											<FormItem label="内容" class="editor">
											<div ref="editor2" v-model="commerceIntroduce.org" @click="getToken($event)"></div>
											<div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
											<!-- {{content}} -->
											</FormItem>
									</Form>
									</div>
							</div>
							<!-- 添加成员 -->
							<div class="rightcont1" v-show="menuactive==3 && layer ==0 || menuactive==4 && layer ==0 || menuactive==5 && layer ==0">
								<div class="rightcont-top clear">
										<div class="tit fl">
												{{menuactive==3?'发起单位':menuactive==4?'理事会':'成员'}}
										</div>
										<div class="item fr">
										<div class="addbtn" @click="saveEdit()">{{isMenuactive3Edit?'完成':'编辑'}}</div>
										</div>
								</div>
								<div>
									<div v-if='!isMenuactive3Edit' class="memberbox clear memberbox1" v-for='(v,i) in unionList.rows' :key='i' @click="tolayer(1);isorg=v">
										<img class="member-img fl" :class="{'member-img1':menuactive==4}" :src="menuactive==3 ?v.unitLogo :menuactive==4 ?v.avatarUrl:v.orgUrl" alt="">
										<div class="member-right fl" :style="{'min-height':menuactive==4?'130px':menuactive==5?'100px':'none'}">
											<span style="font-size:16px;color:#333333;">{{menuactive==3?v.initiateUnits:menuactive==4?v.applyName:v.orgName}}  </span>
											<span style="font-size:14px;color:#999999;margin-left:12px" v-if="menuactive==4">{{v.orgPost}}  </span>
											<div v-if="menuactive==4">
												<span style="font-size:14px;color:#999999;" v-if="menuactive==4 && v.birthday">{{v.birthday}}</span>
												<span v-if='v.birthday&& v.address'>&nbsp;|&nbsp;</span>
												<span style="font-size:14px;color:#999999;" v-if="menuactive==4">{{v.address}}  </span>
											</div>
											<!-- 操作 -->
											<div v-show="isMenuactive3Edit">
												<div class="m-delete" @click.stop="deleteMember(v.id)"><img src="./../assets/img/icon-del.png" alt=""></div>
												<div class="m-delete1 m-delete" ><img src="./../assets/img/icon-move.png" alt=""></div>
											</div>
											<!-- 简介 -->
											<p style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;" v-html="v.unitIntroduce"></p>
											<div class="clear" v-show="menuactive==4" v-if="v.post">
												<img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/gwszsxh3.4@3x.png" alt="">
												<span class="member-txt fl">职务：{{v.post}}</span>
											</div>
											<div class="clear" v-show="menuactive==4" v-if="v.selfIntroduction">
												<img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/icon_jj.png" alt="">
												<span class="member-txt fl" >简介：</span>
												<div class="member-content fl" v-html="v.selfIntroduction"></div>
											</div>
											<p v-if="menuactive==5 && v.president" style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;">会长：{{v.president}}</p>
											<div v-if="menuactive==5 && v.orgIntroduce" style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;">简介：<span style="display:inline-block" v-html="v.orgIntroduce"></span></div>
										</div>
									</div>
									<div v-if='isMenuactive3Edit' style="cursor:pointer" class="memberbox clear memberbox1" v-for='(v,i) in unionList.rows' :key='i' v-dragging="{ item: v, list: unionList.rows,group:'unionListList'}" @click="tolayer(1);isorg=v">
										<img class="member-img fl" :class="{'member-img1':menuactive==4}" :src="menuactive==3 ?v.unitLogo :menuactive==4 ?v.avatarUrl:v.orgUrl" alt="">
										<div class="member-right fl" :style="{'min-height':menuactive==4?'130px':menuactive==5?'100px':'none'}">
											<span style="font-size:16px;color:#333333;">{{menuactive==3?v.initiateUnits:menuactive==4?v.applyName:v.orgName}}  </span>
											<span style="font-size:14px;color:#999999;margin-left:12px" v-if="menuactive==4">{{v.orgPost}}  </span>
											<div v-if="menuactive==4">
												<span style="font-size:14px;color:#999999;" v-if="menuactive==4 && v.birthday">{{v.birthday}}</span>
												<span v-if='v.birthday&& v.address'>&nbsp;|&nbsp;</span>
												<span style="font-size:14px;color:#999999;" v-if="menuactive==4">{{v.address}}  </span>
											</div>
											<!-- 操作 -->
											<div v-show="isMenuactive3Edit">
												<div class="m-delete" @click.stop="deleteMember(v.id)"><img src="./../assets/img/icon-del.png" alt=""></div>
												<div class="m-delete1 m-delete" ><img src="./../assets/img/icon-move.png" alt=""></div>
											</div>
											<!-- 简介 -->
											<p style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;" v-html="v.unitIntroduce"></p>
											<div class="clear" v-show="menuactive==4" v-if="v.post">
												<img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/gwszsxh3.4@3x.png" alt="">
												<span class="member-txt fl" >职务：{{v.post}}</span>
											</div>
											<div class="clear" v-show="menuactive==4" v-if="v.selfIntroduction">
												<img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/icon_jj.png" alt="">
												<span class="member-txt fl" >简介：</span>
												<div class="member-content fl" v-html="v.selfIntroduction"></div>
											</div>
											<p v-if="menuactive==5 && v.president" style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;">会长：{{v.president}}</p>
											<p v-if="menuactive==5 && v.orgIntroduce" style="font-size:16px;line-height:20px;color:#999999;margin-top:5px;padding-right: 24px;">简介：<span style="display:inline-block" v-html="v.orgIntroduce"></span></p>
										</div>
									</div>
								</div>
								<!-- 新增 -->
								<div class="btn fl" @click="layer=2;addInitiator={}" v-if="isMenuactive3Edit">
									<img class="btn-add" src="../assets/img/jia@3x.png" alt="">
									<span class="btn-txt">添加{{menuactive==3?'发起单位':menuactive==4?'理事会成员':'成员'}}</span>
								</div>
								<Page 
									v-if="unionList&&unionList.rows&& unionList.rows.length" 
									:current.sync="reqData.pageNumber" 
									style="text-align: right;margin-top: 20px;" 
									@on-change="getUnionList"
									show-elevator 
									:page-size="10" 
									:show-total="true" 
									:total="unionList.total" />
							</div>
							<!-- 详情页 -->
							<div class="rightcont1" v-show="(menuactive==3||menuactive==5)&& layer==1">
								<div class="rightcont-top clear">
										<div class="tit fl">
												{{menuactive==3?'发起单位':'成员'}}
										</div>
										<div class="item fr">
										<div class="addbtn" @click="tolayer(0)">返回</div>
										</div>
								</div>
								<div class="details">
										<div class="details-org clear">
												<img class="orgimg fl" :src="menuactive==3?isorg.unitLogo:isorg.orgUrl">
												<div class="details-name fl">{{menuactive==3?isorg.initiateUnits:isorg.orgName}}</div>
										</div> 
										<div class="details-txt" v-html='menuactive==3?isorg.unitIntroduce:isorg.orgIntroduce'></div>
								</div>
							</div>
							<!-- 添加  -->
							<div class="rightcont1" v-show="layer==2">
								<div class="rightcont-top clear">
									<div class="tit fl">
										添加{{menuactive==3?'发起单位':(menuactive==4?'联盟理事':'联盟成员')}}
									</div>
								</div>
								<div>
									<div class="clear">
											<Input :placeholder="menuactive==3?'请输入单位名称进行搜索':(menuactive==4?'请输入姓名或手机号进行搜索':'请输入商协会名称进行搜索')" class="search fl" v-model="name">
													<img src="../assets/img/zzgl6@2x.png" slot="prefix" alt="" style="16px">
											</Input>
											<div class="addbtn fl" style=" line-height:30px;height:30px;" @click="select(1)">搜索</div>
									</div>
									<div>
											<div v-if='list.length' class="tit" style="margin-top:30px;">搜索结果</div>
											<label v-if='list.length' v-for="(value,index) in list" :key="index" :for="'id'+index">
											<div class="list clear">
													<img v-if="menuactive==3 || menuactive==5" class="orgUrl fl" :src="value.orgUrl">
													<img v-if="menuactive==4" class="avatarUrl fl" :src="value.avatarUrl">
													<div v-if="menuactive==3 || menuactive==5" class="president fl">
															<div class="orgname">{{value.orgName}}</div>
															<div v-if="menuactive==3?value.userName:value.president" class="userName"><span style="color:#999999;">会长：</span>{{menuactive==3?value.userName:value.president}}</div>
															<!-- <div v-if='menuactive==5' class="userName"><span style="color:#999999;">{{value.chairman?'董事长：':(value.president?'会长：':'总经理：')}}</span>{{value.chairman?value.chairman:(value.president?value.president:value.generalManager)}}</div> -->
													</div>
													<div  v-if="menuactive==4" class="fl">
															<div>
																	<span class="realName">{{value.realName}}</span>
																	<span class="post">{{value.post}}</span>
															</div>
															<div style="margin:10px 0;">
																	<img class="icon" src="../assets/img/telphone.png" alt="">
																	<span class="list-txt">电话：{{value.telphone.substring(0,3)}}**** ****</span>
															</div>
															<div v-if='value.company'>
																	<img class="icon" src="../assets/img/company.png" alt="">
																	<span class="list-txt">公司：{{value.company}}</span>
															</div>
													</div>
													<div class="radio-box fr" :style="menuactive==4?'position: relative;top: 55px;':''">
														<input v-if="menuactive==4" class="ques-radio" type="radio" :value="index" :id="'id'+index" v-model="radioitem">
														<input  v-if="menuactive!=4" class="ques-radio" type="checkbox"  :id="'id'+index" :value="value" v-model="checkVal">
														<label :for="'id'+index" class="label"></label> 
													</div>
											</div>
												</label>
											<Page 
											v-if="list.length" 
											:current.sync="page" 
											style="text-align: right;margin-top: 20px;" 
											@on-change="select"
											show-elevator 
											:page-size="10" 
											:show-total="true" 
											:total="total" />
									</div>
									<div v-if='!list.length'>
										<img v-if="isempty==0" style="margin:140px 211px;" src="../assets/img/search1.png" alt="">
											<img v-if="isempty==1" style="margin:140px 211px;" src="../assets/img/search2.png" alt="">
									</div>
											<div class="btns clear">
														<div v-if="(menuactive==3 || menuactive==5 )&& list.length" class="savebtn fl" @click="save(checkVal)">发送邀请</div>
														<div v-if="menuactive==3" class="savebtn fl" @click="tolayer(3)">手动输入添加</div>
														<div v-if="menuactive==4 && list.length" class="savebtn fl" @click="director(1)">设置为理事长</div>
														<div v-if="menuactive==4 && list.length" class="savebtn fl" @click="director(2)">设置为理事</div>
														<div v-if="menuactive==4 && list.length" class="savebtn fl" @click="director(3)">设置为秘书长</div>
												</div>
								</div>
							</div>
							<!-- 手动添加 -->
							<div class="rightcont1" v-show="menuactive==3 && layer==3">
								<div class="rightcont-top clear">
									<div class="tit fl">
										添加发起单位
									</div>
								</div>
								<Form :label-width="100">
									<FormItem label="上传logo">
										<Upload
											@success="uporgUrl"
											:personalInfo="personalInfo"
											:mimeType="mimeType"
											@error="error"
										>
											<img
												v-if='addInitiator.orgUrl'
												class="upload_pic hand"
												:src="addInitiator.orgUrl"
												alt
											/>
											<span class="upload_btn1 hand">上传</span>
										</Upload>
										<!-- <div class="uploadpic_tips">建议上传400*400px尺寸图片</div> -->
									</FormItem>
									<FormItem label="名称" prop="orgName">
										<div style="width:350px">
											<Input
												v-model="addInitiator.orgName"
												placeholder="青岛市工商联"
												:maxlength="16"
											/>
										</div>
									</FormItem>
									<FormItem label="组织介绍">
										<Input
											type="textarea"
											style="background:#DDDDDD"
											v-model="addInitiator.orgIntroduce"
											:maxlength="1000"
											:autosize="{minRows: 9,}"
											placeholder="请填写组织介绍"
										/>
									</FormItem>
									<FormItem label="">
										<div class="btn" style="padding: 0 89px;font-size:14px;margin-top:16px" @click="save(addInitiator)">确定</div>
									</FormItem>
								</Form>
								
							</div>
					</div>
			</div>
			<!-- 头像裁剪 -->
			<div
				class="layer staffeit"
				v-if="layer==10"
				style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;z-index:10002">
				<div
					class="line"
					style="margin-left: 0px;margin-top: 0px;position: fixed;top: 50%; left: 15%;"
				>
					<div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
						<img src="./../assets/img/xxtz2@2x.png" @click="layer=0" alt="" style="position:absolute;right:-100px;top:-150px">
						<div class="cropper">
							<vueCropper
								ref="cropper"
								:img="option.img"
								:outputSize="option.size"
								:outputType="option.outputType"
								:info="true"
								:full="option.full"
								:canMove="option.canMove"
								:canMoveBox="option.canMoveBox"
								:original="option.original"
								:autoCrop="option.autoCrop"
								:autoCropWidth="option.autoCropWidth"
								:autoCropHeight="option.autoCropHeight"
								:fixedBox="option.fixedBox"
								@realTime="realTime"
							></vueCropper>
						</div>
						<div style="margin-left:20px;">
							<div
								class="show-preview"
								style="width:150px;'height':155px; 'overflow': 'hidden'; 'margin': '5px'}"
							>
								<div :style="previews.div" class="preview" :class="{'border-radius':menuactive ==0&&!isBanner}">
									<img :src="previews.url" :style="previews.img" />
								</div>
							</div>
							<input
								type="button"
								class="btn btn-blue"
								style="margin-top:30px;margin-left:40px;"
								value="上传头像"
								@click="finish"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
		import { VueCropper } from "vue-cropper";
		import * as qiniu from "qiniu-js";
		import E from "wangeditor";
		import space from "../assets/js/validator";
		export default {
			name: "union",
			components: {
				VueCropper
			},
			props: {
				defOrg: null, //切换组织后的信息
				personalInfo: null //登陆后 的用户信息
			},
			data() {
				return {
					menuactive: 0,
					formValue: {
						newsDigest: "",
						content: null
					},
					commerceIntroduce:{
						address:"",
						latitude:"",
						longitude:""
					},
					layer:0,
					name:'',
					page: 1,
					total: 0,
					list:[],
					isChairman:0,//理事长
					isDirector:0,//理事
					isSecretary:0,//秘书长
					radioitem:null,	
					isempty:0,
          			orgId:'',
          			isorg:{},
					reqData:{
						pageSize:10,
						pageNumber:1,
						orgId:'',
						unionId:'',
					},
					option: {
						img: "",
						size: 1, //剪切后的图片质量（0.1-1）
						full: true, //输出原图比例截图 props名full
						outputType: "png",
						canMove: true,
						original: false,
						canMoveBox: true,
						autoCrop: true,
						autoCropWidth: 150,
						autoCropHeight: 150,
						fixedBox: true
					},
					headImg:"",
      				previews: {},
					name:'',
					modelSrc: "",
					mimeType: ["image/png", "image/jpeg", "image/jpg"],
					addInitiator:{},
					unionList:{},
					isMenuactive3Edit:false,
					idList:[],
					preId:"",
					isdirector:true,
					del:[],
					checkVal:[],
				}
			},
			watch:{
				defOrg(res) {
					console.log(res.id,'刷新',this.preId)
					if(this.preId&&res.id != this.preId){
						console.log('刷新')
						location.reload();
          		this.getCommerceIntroduce(1);
					}
				},
				menuactive(n){
					if(n==3|| n==4|| n==5){
						this.getUnionList();
						this.isMenuactive3Edit = false;
						this.layer = 0;
					}
				}
			},
			mounted() {
				if(this.commerceIntroduce){
				}else{
				this.WangEditMethod(this.$refs.editor,0);
				this.WangEditMethod1();
				this.WangEditMethod2();
				}
				this.$dragging.$on('dragend', (value) => {
					var arr = [];
					for (var i = 0; i < this.unionList.rows.length; i++) {
						var a = new Object()
						a.id = this.unionList.rows[i].id
						arr.push(a)
					}
					this.idList = arr;
				})
			},
			methods:{
				tomenu(n) {
					this.menuactive = n;
					this.reqData.pageNumber = 1;
					if (n == 1) {
						if (this.defOrg.authStatus == 1) {
							this.certification = 2;
						}
					}
            this.layer = 0
            this.name=''
            this.list=[]
				},
				tolayer(n) {
					if(this.menuactive==4&&n==1){
						return
					}else{
						this.layer = n;
					}
				},
				director(n){
					if(this.isdirector){
						this.isdirector=false
						if(n==1){
							this.isChairman=1
							this.save(this.radioitem)
						}else if(n==2){
							this.isDirector=1
							this.save(this.radioitem)
						}else if(n==3){
							this.isSecretary=1
							this.save(this.radioitem)
						}
					}
				},
				// 保存介绍
				saveIntroduce(){
					if(this.menuactive==0){
						if(!this.commerceIntroduce.intro){
							layer.msg(`请输入联盟简介`)
							return
						}
					}else if(this.menuactive==1){
						if(!this.commerceIntroduce.rule){
							layer.msg("请输入联盟章程")
							return
						}
					}else if(this.menuactive==2){
						if(!this.commerceIntroduce.org){
							layer.msg("请输入联盟架构")
							return
						}
					}
					this.commerceIntroduce.id = this.defOrg.id;
					this.http.ajax({
						url: "webSite/businessGov/updateIntroduce",
						method: 'post',
						headers: {
							"Content-Type": " application/json"
						},
						data: {
              'id':this.commerceIntroduce.id,
              'intro':this.commerceIntroduce.intro,
              'rule':this.commerceIntroduce.rule,
              'org':this.commerceIntroduce.org,
              'telephone':'',
              'mail':'',
              'address':'',
              'fax':''
            }
					}).then( res =>{
						if (res.code == 200) {
							layer.msg("保存成功")
						}
					})

				},
				//商会介绍
				getCommerceIntroduce(val){
					this.http
						.ajax({
							url: "/webSite/businessGov/commerceIntroduce",
							method: "post",
							headers: {
								"Content-Type": " application/json"
							},
							data: {
								orgId: this.defOrg.id,
							}
						})
						.then(res => {
							// console.log(res)
							// layer.msg(res.msg)
							//展示组织用户的分頁數據
							if (res.code == 200) {
								this.commerceIntroduce = res.data
								if(res.data.chairman && res.data.chairman[0] && !this.isMember){
									// console.log(res.data.chairman && res.data.chairman[0] && !this.isMember,'赋值会长')
									this.pre = res.data.chairman[0];
									if(this.pre.birthday){
										this.pre.birthday = new Date(this.pre.birthday).Format("yyyy-MM-dd");
									}else{
										this.pre.birthday = "";
									}
								}
								if(!val){
										this.WangEditMethod(this.$refs.editor,0);
										this.WangEditMethod1();
										this.WangEditMethod2();
								}
							}
						});
				},
				//搜索
				select(page){
						var url = ''
						var data = {}
						if(this.menuactive==3){
								url = 'webSite/unionUnit/select'
								data={
										'name':this.name,
										'unionId':this.defOrg.id,
										"pageNumber": page,
										"pageSize": 10
								}
						}else if(this.menuactive==4){
								url = 'webSite/unionCouncil/select'
								data={
										'name':this.name,
										'unionId':this.defOrg.id,
										"pageNumber": page,
										"pageSize": 10
								}
						}else if(this.menuactive==5){
								url ='webSite/unionMember/searchAddUnionOrgPage'
								data={
										'orgName':this.name,
                    'type':1,
                    'unionId':this.defOrg.id,
										"pageNumber": page,
										"pageSize": 10
								}
						}
						this.http.ajax({
								url: url,
								method: 'post',
								headers: {
								"Content-Type": " application/json"
								},
								data: data
						}).then( res =>{
								if (res.code == 200) {
								if(res.data.rows.length){
									this.isempty=0
								}else{
									this.isempty=1
								}
								this.list = res.data.rows;
								this.total = res.data.total;
								}
						})
				},
				//保存
				save(n){
					console.log('多选',n)
					if(this.layer ==3 && this.menuactive==3){
						if(!(n&&n.orgUrl)){
							layer.msg("请上传logo")
							return
						}else if(!(n&&n.orgName)){
							layer.msg("请填写名称")
						}else if(!(n&&n.orgIntroduce)){
							layer.msg("请输入简介")
						}
						var row = n;
					}else{
						if(n==null){
							if(this.menuactive==3){
								layer.msg("请至少选择一个发起单位")
							}else if(this.menuactive==4){
								layer.msg("请至少选择一位人员")
							}else if(this.menuactive==5){
								layer.msg("请至少选择一商协会")
							}
							
							return
						}
						if(this.menuactive==3){
							var arr = []
							for(var i of n){
								let m ={}
								m.initiateUnits = i.orgName
								m.unitLogo = i.orgUrl
								m.unitIntroduce=i.orgIntroduce
								m.orgId=i.id
								arr.push(m)
							}
						}else if(this.menuactive==4){
							var row = this.list[n]
						}else if(this.menuactive==5){
							var brr = []
							for(var j of n){
								brr.push(j.id)
							}
						}
					}
					var url = ''
					var data = {}
					var that = this;
					if(this.menuactive==3){
							url = 'webSite/unionUnit/saveBatch'
							data={
								'unionId':this.defOrg.id,
								'units':arr
							}
					}else if(this.menuactive==4){
							url = 'webSite/unionCouncil/save'
							data={
									'unionId':this.defOrg.id,
									"directorUid": row.id,
									'isChairman':this.isChairman,
									'isDirector':this.isDirector,
									'isSecretary':this.isSecretary
							}
					}else if(this.menuactive==5){
							url ='webSite/unionMember/sendInvitations'
							data={
								'unionId':this.defOrg.id,
								'orgIds':brr
							}
					}
					this.http.ajax({
							url: url,
							method: 'post',
							headers: {
							"Content-Type": " application/json"
							},
							data: data
					}).then( res =>{
						if (res.code == 200) {
							this.radioitem=null;
							that.isChairman=0;
							that.isDirector=0;
							that.isSecretary=0;
							this.isdirector=true
							if(this.menuactive==4 || this.menuactive==5){
								layer.confirm('已经向该用户发送了邀请消息，请静候对方的审核和允许', {
									title: ['提示'],
									closeBtn: false,
									btnAlign: 'c',
									shadeClose: true,
									skin: 'yq-confirm',
									btn: ['确认'] //按钮
								}, function() {
									layer.closeAll();
									that.layer=0;
									});
							}else if(this.menuactive==3&&this.layer== 3){
								layer.msg("保存成功");
								that.addInitiator={};
								that.menuactive=3; 
								that.getUnionList();
                				that.layer=0;
							}else{
								that.layer=0;
								layer.msg("发送成功")
							}
							that.checkVal=[]
							that.isMenuactive3Edit = false;
							that.list=[];
							that.name='';
						}
					})
				},
				error(res) {
					layer.msg("文件类型不正确,请重新上传");
        },
          getToken(e){
            var that = this;
            if(e.target.type == 'file'){
              that.http.ajax({
                url: 'webSite/home/uploadApplication',
                method: 'post',
                data: {
                  uid: that.personalInfo.uid
                }
              }).then( res =>{
                that.QNtoken = res.data.upToken;
              })
            }
          },
				WangEditMethod(ref,n) {
					var editor = new E(ref);
					editor.customConfig.onchange = html => {
						let reg = new RegExp('<p></p>', 'g')
						html = html.replace(reg, '');
						if(n==0){
							this.commerceIntroduce.intro = html
						}else if(n==1){
							this.commerceIntroduce.rule = html
						}else if(n==2){
							this.commerceIntroduce.org = html  
						}
					};
					(editor.customConfig.menus = [
						"head", // 标题
						"bold", // 粗体
						"fontSize", // 字号
						"fontName", // 字体
						"italic", // 斜体
						"underline", // 下划线
						"strikeThrough", // 删除线
						"foreColor", // 文字颜色
						"backColor", // 背景颜色
						"link", // 插入链接
						"list", // 列表
						"justify", // 对齐方式
						"quote", // 引用
						"emoticon", // 表情
						"image", // 插入图片
						// 'table',  // 表格
						"video", // 插入视频
						// 'music',  // 插入音频
						// 'code',  // 插入代码
						"undo", // 撤销
						"redo" // 重复
					]),
						// 使用 base64 保存图片
						(editor.customConfig.uploadImgShowBase64 = false);
					// editor.customConfig.fontSize='normal'
					// editor.customConfig.pasteFilterStyle = true
					editor.customConfig.pasteIgnoreImg = false;

					editor.customConfig.pasteTextHandle = function(content) {
						// content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
						// console.log(content,'粘贴')
						if (content == "" && !content) return "";
						let str = content;
						//处理的标签里的多余代码
						str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
						str = str.replace('/(\\n|\\r| class=(")?Mso[a-zA-Z]+(")?)/g', "");
						let reg = new RegExp("<!--(.*?)-->", "g");
						str = str.replace(reg, "");
						str = str.replace(/<style>[\s\S]*?<\/style>/gi, "");
						// str = str.replace(/<\/?[^>]*>/g, '')
						// str = str.replace(/[ | ]*\n/g, '\n')
						// str = str.replace(/&nbsp;/ig, '')
						return str;
					};

					// 隐藏“网络图片”tab
					editor.customConfig.showLinkImg = false;
					editor.customConfig.colors = [
						"red",
						"black",
						"green",
						"yellow",
						"orange",
						"grey",
						"pink",
						"transparent"
					];

					// 允许上传到七牛云存储
					editor.customConfig.qiniu = true;
					editor.create();
					var box=document.getElementsByClassName("w-e-text");
					if(this.commerceIntroduce){
						if(n==0){
							// console.log(this.commerceIntroduce.intro,'n',n)
							if(this.commerceIntroduce.intro){
							//  editor.cmd.do('insertHTML', '<p>' + this.commerceIntroduce.intro + '</p>');
								editor.txt.append(`<p>${this.commerceIntroduce.intro}</p>`)

							}else{
								editor.txt.append(`<p><br></p>`)
							}     
						}else if(n==1){
							if(this.commerceIntroduce.rule){
								editor.txt.append(`<p>${this.commerceIntroduce.rule}</p>`);
							}else{
								editor.txt.append(`<p><br></p>`)
							}
							// editor.cmd.do("insertHTML", this.commerceIntroduce.rule);
						}else if(n==2){
							if(this.commerceIntroduce.org){
								editor.txt.append(`<p>${this.commerceIntroduce.org}</p>`);
							}else{
								editor.txt.append(`<p><br></p>`)
							}
							// editor.cmd.do("insertHTML", this.commerceIntroduce.org);
						}
					}
					this.uploadInit(editor);
					this.uploadInitVideo(editor);
					// this.uploadInitMusic(editor);
				},
				WangEditMethod1() {
					this.WangEditMethod(this.$refs.editor1,1);
				},
				WangEditMethod2() {
					this.WangEditMethod(this.$refs.editor2,2);
				},
				uploadInit(editor) {
					// 获取相关 DOM 节点的 ID
					var btnId = editor.imgMenuId;
					var containerId = editor.toolbarElemId;
					var textElemId = editor.textElemId;
					var index = "";
					var that = this;
					// 创建上传对象
					this.http
						.ajax({
							url: "webSite/home/uploadApplication",
							method: "post",
							data: {
								uid: this.personalInfo.uid
							}
						})
						.then(res => {
							this.QNtoken = res.data.upToken;
							var uploader = window.Qiniu.uploader({
								runtimes: "html5,flash,html4", //上传模式,依次退化
								browse_button: btnId, //上传选择的点选按钮，**必需**
								// uptoken: res.data.upToken,
								// uptoken: that.QNtoken,
								uptoken_func: function() {
									// 在需要获取uptoken时，该方法会被调用
									var uptoken = that.QNtoken;
									return uptoken;
								},
								get_new_uptoken: true,
								unique_names: true,
								// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
								domain: "https://img.yiqilaiwang.com/",
								container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
								max_file_size: "100mb", //最大文件体积限制
								region: "z1",
								filters: {
									mime_types: [
										//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
										{
											title: "图片文件",
											extensions: "jpg,gif,png,bmp,jpeg"
										}
									]
								},
								max_retries: 3, //上传失败最大重试次数
								dragdrop: true, //开启可拖曳上传
								drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
								chunk_size: "4mb", //分块上传时，每片的体积
								auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
								init: {
									UploadProgress: function(up, file) {
										// 显示进度条
										index = layer.load(0, { shade: false });
									},
									UploadComplete: function() {
										//队列文件处理完毕后,处理相关的事情
										// 隐藏进度条
										layer.close(index);
									},
									FileUploaded: function(up, file, info) {
										var domain = up.getOption("domain");
										var res = window.$.parseJSON(info);
										var sourceLink = domain + res.key; //获取上传成功后的文件的Urlkey

										// 插入图片到editor
										editor.cmd.do(
											"insertHtml",
											'<img  src="' +
												sourceLink +
												"?imageView2/1/q/30/format/jpg/ignore-error/1" +
												'" style="max-width:100%;"/>'
										);
									},
									Error: function(up, err, errTip) {
										// console.log(up,err,errTip)
										if(err.code == -601  && err.file.type.indexOf('video') ==-1){
											layer.msg("请选择jpg，gif，png，bmp，jpeg格式的图片上传")
										}else if(err.code != -601){
											layer.msg(errTip)
										}
									}
								}
							});
						});
				},
				uploadInitVideo(editor) {
					// 获取相关 DOM 节点的 ID
					var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[15];
					// var btnId = editor.imgMenuId;
					// console.log(editor.$toolbarElem[0],btnId)
					var containerId = editor.toolbarElemId;
					var textElemId = editor.textElemId;
					var that = this;
					var index = "";
					// 创建上传对象
					this.http
						.ajax({
							url: "webSite/home/uploadApplication",
							method: "post",
							data: {
								uid: this.personalInfo.uid
							}
						})
						.then(res => {
							// console.log(res)
							this.QNtoken = res.data.upToken;
							var uploader = window.Qiniu.uploader({
								runtimes: "html5,flash,html4", //上传模式,依次退化
								browse_button: btnId, //上传选择的点选按钮，**必需**
								// uptoken: res.data.upToken,
								// uptoken: that.QNtoken,
								uptoken_func: function() {
									// 在需要获取uptoken时，该方法会被调用
									var uptoken = that.QNtoken;
									return uptoken;
								},
								get_new_uptoken: true,
								unique_names: true,
								// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
								domain: "https://img.yiqilaiwang.com/",
								container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
								max_file_size: "100mb", //最大文件体积限制
								region: "z1",
								filters: {
									mime_types: [
										//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
										{
											title: "视频文件",
											// extensions: "jpg,gif,png,bmp,jpeg"
											// extensions: "avi,asf,wmv,mov,mp4,FLV"
											extensions: "mp4"
										}
									]
								},
								max_retries: 3, //上传失败最大重试次数
								dragdrop: true, //开启可拖曳上传
								drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
								chunk_size: "20mb", //分块上传时，每片的体积
								auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
								init: {
									UploadProgress: function(up, file) {
										// 显示进度条
										index = layer.load(0, { shade: false });
									},
									UploadComplete: function() {
										//队列文件处理完毕后,处理相关的事情
										// 隐藏进度条
										layer.close(index);
									},
									FileUploaded: function(up, file, info) {
										var domain = up.getOption("domain");
										var res = window.$.parseJSON(info);
										var sourceLink = domain + res.key; //获取上传成功后的文件的Url
										// 插入图片到editor
										editor.cmd.do(
											"insertHtml",
											"<video style='margin-top:5px;background:black' width='100%' height='214px' webkit-playsinline = 'true' playsinline = 'true' controls controlslist='nodownload' poster=" +
												sourceLink +
												"?vframe/jpg/offset/0/imageslim/imageView2/1/interlace/1/ignore-error/1 ><source src='" +
												sourceLink +
												"' type='video/mp4'></video>"
										);
									},
									Error: function(up, err, errTip) {
										// console.log(up,err,errTip)
										if(err.code == -601 && err.file.type.indexOf('image') ==-1){
											layer.msg("上传视频仅支持mp4格式")
										}else if(err.code != -601){
											layer.msg(errTip)
										}
									}
								}
							});
						});
				},
				// 获取发起单位，理事会，成员列表
				getUnionList(){
					var that =this;
					if(this.menuactive == 3){
						var url = 'webSite/unionUnit/list';
					}else if(this.menuactive == 4){
						var url = 'webSite/unionCouncil/list'
					}else if(this.menuactive == 5){
						var url = 'webSite/unionMember/unionMemberListPage';
					}
					this.reqData.orgId = this.defOrg.id;
					this.reqData.unionId = this.defOrg.id;
					this.http.ajax({
						url: url,
						method: "post",
						headers: {
							"Content-Type": " application/json"
						},
						data: this.reqData
					})
					.then(res => {
						// console.log(res)
						if (res.code == 200) {
							// 进行页面跳转
							that.unionList = res.data;
							var arr =[];
							for (var i = 0; i < that.unionList.rows.length; i++) {
								var a = new Object()
								a.id = that.unionList.rows[i].id
								arr.push(a)
							}
							that.idList = arr;
						} else {
							layer.msg(res.msg);
						}
					});
				},
				uporgUrl(e) {
					this.headImg = e.url;
					this.option.img = e.url;
					this.name = e.name;
					this.layer =10;
				},
				// 实时预览函数
				realTime(data) {
					// console.log("realTime", data);
					this.previews = data;
					this.$refs.cropper.getCropBlob(data => {
						this.modelSrc = data;
					});
				},
				changeScale(num) {
					num = num || 1;
					this.$refs.cropper.changeScale(num);
				},
				finish() {
					if(!this.modelSrc){
						layer.msg("再试一次")
						return 
					}
					var loading = layer.load(1, {
						shade: [0.1, "#fff"] //0.1透明度的白色背景
					});
					this.http
						.ajax({
							url: "webSite/home/uploadApplication",
							method: "post",
							data: {
								uid: this.personalInfo.uid
							}
						})
						.then(res => {
							var uptoken = res.data.upToken;
							var file = this.modelSrc; //Blob 对象，上传的文件

							var key = null; // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

							var region = res.data.region.split(".");
							let config = {
								useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
								region: qiniu.region[region[2]] // ,当为 null 或 undefined 时，自动分析上根据具体提示修改上传地区传域名区域
							};

							let putExtra = {
								fname: this.name, //文件原文件名
								params: {} //用来放置自定义变量
								// mimeLimit:"",
								// mimeLimit: this.mimeLimit,
								// mimeType: this.mimeType //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
							};
							var observable = qiniu.upload(file, key, uptoken, putExtra, config);
							observable.subscribe({
								next: result => {
									// 主要用来展示进度
								},
								error: errResult => {
									// 失败报错信息
									// console.log('异常类型')
									// this.file = null;
									// this.$refs.evfile
									// console.log(this.$refs.evfile.val());
									this.$refs.evfile.value = null;
									this.$emit("error", { errResult });
									layer.close(loading);
								},
								complete: result => {
									// console.log("result", result);
									layer.close(loading);
									this.layer = 3;
									this.addInitiator.orgUrl=res.data.qiniuDomain + "/" + result.key
								}
							});
						});
				},
				error(res) {
					layer.msg("文件类型不正确,请重新上传");
					// console.log(res);
				},
				deleteMember(id){
					var that=this
					if(this.menuactive==3){
						var text = '请确认是否删除该发起单位。'
					}else if(this.menuactive==4){
						var text = '请确认是否删除该理事成员。'
					}else if(this.menuactive==5){
						var text = '请确认是否删除该联盟成员，删除后该组织辖属所有人员都将移除联盟'
					}
					layer.confirm(text, {
						title: ['提示'],
						closeBtn: false,
						btnAlign: 'c',
						shadeClose: true,
						skin: 'yq-confirm',
						btn: ['再想想', '确认'] //按钮
					}, function() {
						layer.closeAll()
					}, function() {
						that.removeArray(that.unionList.rows,id);
						that.del.push(id);

						var preArr = [];
						that.unionList.rows.map((item,index)=>{
							preArr.push({
								id:item.id
							})
						})
						that.idList = preArr.filter((item)=>{
							return item.id != id
						})

						// that.dealList(1);
					});
				},
				// 修改删除列表
				dealList(type){
					var that = this;
					var ids = [];
					this.idList.map((item)=>{
						ids.push(item.id)
					})
					if(this.menuactive == 3){
						var url = 'webSite/unionUnit/updateBatch';
					}else if(this.menuactive == 4){
						var url = 'webSite/unionCouncil/updateBatch'
					}else if(this.menuactive == 5){
						var url = 'webSite/unionMember/editUnionMember';
					}
					this.http.ajax({
						url: url,
						method: 'post',
						headers: {
							"Content-Type": "application/json"
						},
						data: {
							unionId: this.defOrg.id,
							units:this.idList,
							councils:this.idList,
							ids:ids,
							del:this.del,
							deleteIds:this.del
						}
					}).then( res =>{
						if(res.code == 200){
							var text = type ==1 ?'删除成功':'保存成功'
							layer.msg(text);
							that.getUnionList();
						}
					})
				},
				saveEdit(){
					this.isMenuactive3Edit = !this.isMenuactive3Edit;
					if(!this.isMenuactive3Edit){
						this.dealList(2)
					}
				},
				//移除数组
				removeArray(_arr, _obj) {
					var length = _arr.length;
					for (var i = 0; i < length; i++) {
						if (_arr[i].id == _obj) {
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
			},
		created() {
			clearInterval(this.timer)
			this.timer=setInterval(()=>{
				if (this.defOrg) {
					this.orgId = this.defOrg.id;
					this.isOrg = this.defOrg.isOrg;
					this.getCommerceIntroduce();
					clearInterval(this.timer)
					this.preId = this.defOrg.id;
				}
			},10)
		},
}
</script>
<style lang="less">
.union {
	margin-bottom: 63px;
	.warp {
		.rightcont {
			width: 810px;
			float: right;
			padding-left: 40px;
			padding-right: 46px;
			padding-top: 25px;
			position: relative;
			min-height: 660px;
			.ivu-form .ivu-form-item-label {
        text-align: left;
      }
			.rightcont1{
				padding-bottom:20px;
				.ivu-select-dropdown{
						z-index: 10002;
				}
				.ivu-form-item {
						margin-bottom: 24px;
				}
				.tit{
					font-weight:500;
					font-size:16px;
        }
        .details{
          padding: 40px 0 0;
          .orgimg{
            width: 60px;
            height: 60px;
            border-radius: 30px;
            margin-right: 20px;
          }
          .details-name{
            font-size: 20px;
            color: #333333;
            margin-top: 16px;
          }
          .details-txt{
            font-size: 14px;
            color: #333333;
            margin-top: 20px;
          }
        }
				.btn{
					padding:0 44px;
					overflow: hidden;
					.btn-add{
						width: 18px;
						display: inline-block;
						vertical-align: middle;
						margin-top: -6px;
						margin-right: 2px;
					}
					.btn-txt{
						display: inline-block;
						vertical-align: middle;
						font-size:14px;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:rgba(255,255,255,1);
						line-height:20px;
					}
				}
				.second {
					.ivu-form-item-label {
						margin-top: 11px;
					}
				}
				.upload_pic {
					display: inline-block;
					vertical-align: middle;
					margin-right: 10px;
					width: 57px;
					height: 57px;
					-webkit-border-radius: 50%;
					-moz-border-radius: 50%;
					border-radius: 50%;
				}
			}
			.rightcont-top {
				margin-bottom: 20px;
			}
			.addbtn {
				height: 22px;
				border-radius: 14px;
				line-height: 22px;
				background: #2168eb;
				display: inline-block;
				text-align: center;
				-webkit-border-radius: 22px;
				-moz-border-radius: 22px;
				color: #ffffff;
				font-size: 12px;
				padding: 0 16px;
				cursor: pointer;
			}
			.search{
				width: 350px;
				margin-right: 13px;
				.ivu-input{
						height: 30px;
				}
				img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
			.radio-box{
				position: relative;
				top: 30px;
				cursor: pointer;
			}
			.ques-radio{
				width:16px;
				height:16px;
				opacity: 0;
				margin-right:8px;
			}
			input:checked+.label {
				background-color: #2168EB;
				border: 1px solid #2168EB;
			}
			.label {
				position: absolute;
				right:0;
				top: 0;
				width:16px;
				height:16px;
				border-radius: 50%;
				border: 1px solid #999;
				cursor: pointer;
			}
			input:checked+label::after {
				position: absolute;
				content: "";
				width: 6px;
				height: 10px;
				top: 0px;
				left:4px;
				border: 2px solid #fff;
				border-top: none;
				border-left: none;
				-webkit-transform: rotate(45deg);
				transform: rotate(45deg);
			}
			.memberbox{
				display: flex;
				align-items: center;
				padding: 13px;
				box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.09);
				margin-bottom: 20px;
				position:relative;
				.m-top{
					position:absolute;
					right:20px;
					top:14px;
					span{
						cursor:pointer;
					}
					.span2{
						color:#2168EB
					}
					.span1{
						color:#999999
					}
					.span3{
						color:#F81414
					}
				}
				.m-delete{
					position: absolute;
					top:0;
					right:0;
					padding:0 7px;
					margin:21px 20px 0 10px;
					color:#fff;
					border-radius: 30px;
					cursor:pointer;
					img{
						width:16px;
						height:15px;
					}
				}
				.m-delete1{
					top:0;
					right:32px;
				}
				.member-img{
					height: 130px;
					width: 94px;
					display: inline-block;
				}
				.member-right{
					margin-left: 16px;
					.member-name{
						font-size: 20px;
						line-height: 28px;
						font-weight: 400;
					}
					.member-txt{
						font-size: 14px;
						margin-top: 5px;
						margin-left: 5px;
					}
					.member-content{
						margin-top: 5px;
					}
				}
			}
			.memberbox1{
				.member-img{
					width:100px;
					height:100px;
					border-radius: 50%;
					min-width: 100px;
				}
				.member-img1{
					width:94px;
					height:130px;
					background:rgba(216,216,216,1);
					border-radius:4px;
				}
			}
			.editorHint {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(33, 104, 235, 1);
				line-height: 17px;
				min-width: 400px;
				margin-top: 9px;
			}
			.list{
        padding: 24px;
				box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.09);
				margin-top: 24px;
				border-radius: 8px;
				.orgUrl{
						height: 80px;
						width: 80px;
						border-radius: 40px;
						margin-right: 24px;
				}
				.avatarUrl{
					width: 94px;
					height: 130px;
					margin-right: 16px;
				 }
				.orgame{
						font-size: 18px;
						color: #333333;
						margin-bottom: 7px;
				}
				.userName{
						font-size: 16px;
						color: #333333;
				}
				.president{
					 margin-top: 10px;
				 }
				 .realName{
					 font-size: 20px;
					 color: #333333;
				 }
				 .post{
					 font-size: 14px;
					 color: #999999;
					 margin-left: 14px;
				 }
				 .icon{
					 width: 16px;
					 height: 16px;
					 
				 }
				 .list-txt{
					 font-size: 14px;
					 color: #333333;
					 margin-left: 6px;
				 }
				.savebtn{
						height: 48px;
						width: 162px;
						line-height: 48px;
						text-align: center;
						color: #ffffff;
						font-size: 14px;
						border-radius: 27px;
				}
			}
			.btns{
					margin-top: 40px;
			}
			.savebtn{
				height: 48px;
				width: 162px;
				line-height: 48px;
				text-align: center;
				color: #ffffff;
				font-size: 14px;
				border-radius: 27px;
				background: #2168eb;
				margin-right: 24px;
				cursor: pointer;
			}
			.upload_btn1 {
				// width:57px;
				// height:57px;
				// background:rgba(250,250,250,1);
				// border:1px solid rgba(221,221,221,1);
        // border-radius: 50%;
        // text-align: center;
        // line-height: 57px;
        // text-align: center;
        // vertical-align: middle;
				// display: inline-block;
				// font-size:14px;
				// font-family:PingFangSC-Regular,PingFang SC;
				// font-weight:400;
				// color:rgba(33,104,235,1);
				    width: 46px;
						height: 32px;
						background: #ebf2ff;
						border-radius: 16px;
						line-height: 32px;
						color: #2168eb;
						text-align: center;
						vertical-align: middle;
						font-size: 12px;
						display: inline-block;
      }
		}
	}
	.leftcont {
			float: left;
			width: 265px;
			border-right: 1px solid #eee;
			padding: 35px 0;
			.menu {
					width: 168px;
					display: block;
					margin: 0 auto;
					.item {
							height: 59px;
							line-height: 59px;
							border-bottom: 1px solid #eee;
							cursor: pointer;
					}

					.active {
							color: #2168eb;
							font-weight: 500;
					}
			}
	}
	// 裁剪
	.cropper-content {
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		-webkit-justify-content: flex-end;
		.cropper {
			width: 300px;
			height: 300px;
		}
		.show-preview {
			flex: 1;
			-webkit-flex: 1;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			-webkit-justify-content: center;
			.preview {
				overflow: hidden;
				border: 1px solid #cccccc;
				background: #cccccc;
				margin-left: 40px;
				margin-left: 0;
				width: 110px;
				height: 154px;
				border-radius: 5px;
			}
			.border-radius.preview{
				border-radius:50%;
			}
		}
	}
}
</style> 
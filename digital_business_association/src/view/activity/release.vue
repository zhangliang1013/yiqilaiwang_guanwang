<template>
	<div>
		<div class="w">
			<div class="position">活动发布
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
		<div class="w bg">
			<div class="release" v-if="formdate">
				<Form :label-width="100" :model="formdate" :rules="formdaterule" ref="formdaterule">
					<FormItem label="活动主图">
						<Upload @success="upactPoster" :mimeType="mimeType" @error="error">
							<div class="uploadpic">
								<img :src="formdate.actPoster" alt="">
							</div>
						</Upload>
						<div class="uploadpic_tips">建议上传750*416px尺寸图片</div>
					</FormItem>
					<FormItem label="发起组织" v-if="formdate.actClass!=1">
						<!-- <Select v-if="orgList" v-model="formdate.orgId" placeholder="选择组织" v-bind:disabled="disabledState">
							<Option :value="item.value" v-for="(item,index) in orgList" :key="index">{{item.orgName}}</Option>
						</Select> -->
						<Input disabled v-model="defOrg.orgName"/>
					</FormItem>
					<FormItem label="活动类型">
						<!-- <Select v-model="formdate.actType" placeholder="请选择活动类型" @on-change="changePay($event)" v-bind:disabled="disabledState">
							<Option :value="Number(item.dictValue)" v-for="(item,index) in actType" :key="index">{{item.dictName}}</Option>
						</Select> -->
						<Input disabled value="政府活动"/>
					</FormItem>
					<FormItem label="活动名称" prop="topic">
						<Input v-model="formdate.topic" placeholder="请输入活动名称" :maxlength="35"/>
					</FormItem>
					<div class="line"></div>
					<!-- {{formdate.actStartTime}} -->
					<FormItem label="开始时间" prop="actStartTime">
						<DatePicker format="yyyy-MM-dd HH:mm:ss" :start-date="new Date()" :options="dateoptions" @on-change="onactStartTime"
						 :value="formdate.actStartTime" type="datetime" placeholder="请选择开始时间" style="width: 100%;"></DatePicker>
					</FormItem>
					<FormItem label="结束时间" prop="actEndTime">
						<DatePicker class="actEndTime" format="yyyy-MM-dd HH:mm:ss" :start-date="new Date()" :options="dateoptionsEnd"
						 @on-change="onactEndTime" :value="formdate.actEndTime" type="datetime" placeholder="请选择结束时间" style="width: 100%;"></DatePicker>
					</FormItem>
					<FormItem label="地址">

						<span class="inputCopy" @click="tolayer(2)" v-if="formdate.actAddress==null||formdate.actAddress==''">例如:杭州市滨江区滨盛路12号</span>

						<Input v-model="formdate.actAddress" v-if="formdate.actAddress!=null&&formdate.actAddress!=''" placeholder="例如:杭州市滨江区滨盛路12号"/>
						<img src="../../assets/img/dddw.png" class="dddwicon" alt="" @click="tolayer(2)">
					</FormItem>
					<!-- <FormItem label="房间">
						<Input v-model="formdate.seat" placeholder="设置房间、桌等"></Input>
					</FormItem> -->

					<!-- <FormItem label="费用" v-if="formdate.actType==4 || formdate.actType==13" prop="chooseConsume">
						<Select id="chooseConsume" v-model="formdate.chooseConsume" placeholder="设置费用形式" v-bind:disabled="disabledofpeo">

							<Option :value="item.value" v-for="(item,index) in chooseConsume" :key="index" :checked="formdate.chooseConsume==item.value">{{item.name}}</Option>
						</Select>
					</FormItem> -->
					<!-- <FormItem label="请客人" v-if="formdate.chooseConsume==2" class="astar" prop="payer">
						<Input v-model="formdate.payer" placeholder="请输入请客人"/>
					</FormItem>
					<FormItem label="AA人均" v-if="formdate.chooseConsume==1" prop="perCapita" class="astar">
						<input class="aa" step="0.1" required="" v-model="formdate.perCapita" placeholder="请输入人均费用"/>
					</FormItem> -->
					<div class="line"></div>
					<FormItem label="活动简介" class="content">
						<!-- <Input v-model="formdate.activityProcess" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入活动简介..."></Input> -->

						<!--<Input v-model="formdate.activityProcess" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>-->
						<!-- <div ref="editor" style="z-index: 0;position: relative; text-align:left;width:520px;"></div> -->

						<div ref="editor" style="width:621px;text-align:left;position: relative;z-index: 0;word-break: break-all;" v-model="content" @click="getToken($event)"></div>
						<div class="editorHint">
							提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况
						</div>
						<!-- {{content}}{{formdate.activityProcess}} -->
					</FormItem>

					<div class="line"></div>
					<div class="input_label">
						<div class="mt">点击选择需要填写的信息 <div class="fr" style="color:#2168EB" @click="onisfieldsedit">{{isfieldsedit?'保存':'编辑'}}</div>
						</div>
						<div class="mc">
							<span :class="{active:formdate.isName}" @click="setformdate('isName')">姓名 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<span :class="{active:formdate.isTelphone}" @click="setformdate('isTelphone')">手机号 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<span :class="{active:formdate.isSex}" @click="setformdate('isSex')">性别 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<!-- 	<span :class="{active:formdate.isWechatNum}" @click="setformdate('isWechatNum')">微信号 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span> -->
							<span :class="{active:formdate.isIdcard}" @click="setformdate('isIdcard')">身份证号 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<!-- 	<span :class="{active:formdate.isAirpor}" @click="setformdate('isAirpor')">{{ formdate.isAirpor }}接机 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span> -->
							<span :class="{active:formdate.isCompany}" @click="setformdate('isCompany')">机构或公司名称 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<span :class="{active:formdate.isEnrollment}" @click="setformdate('isEnrollment')">填写随行人数 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<!-- <span :class="{active:formdate.isAddress}" @click="setformdate('isAddress')">地址 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span> -->
							<span :class="{active:formdate.isEmail}" @click="setformdate('isEmail')">邮箱 <img src="../../assets/img/xzdh@2x.png"
								 alt=""></span>
							<span :class="{active:formdate.extras.findIndex(d => d.fields === item.fields)>=0}" @click="pushextras(item)"
							 v-for="(item,index) in Fields" :key="index" v-if="fieldslist.findIndex(d => d === item.id)<0">
								{{item.fieldsName}} <img src="../../assets/img/xzdh@2x.png" alt="">
								<img src="../../assets/img/hd7@2x.png" alt="" v-if="isfieldsedit" @click="addfieldslist(item.id)" class="close">
							</span>
							<span class="btn" :class="{active:isfields}" v-if="!isfieldsedit" @click="onisfields(1)"><input ref="fields"
								 @blur="onisfields(0)" type="text"><b>+自定义</b></span>
						</div>
					</div>
					<div class="line"></div>
					<div class="radiobtn">
						<span :class="{active:formdate.isCheck}" @click="setformdate('isCheck',0)">需要审核 <img src="../../assets/img/xzdh@2x.png"
							 alt=""></span>
						<!-- <span :class="{active:formdate.signInWay==1}" @click="setformdate('signInWay')">需要签到 <img src="../../assets/img/xzdh@2x.png" -->
							 <!-- alt=""></span> -->
					</div>
					<div class="line"></div>
					<FormItem label="报名截止时间">
						<DatePicker type="datetime" :start-date="new Date()" :options="dateoptionsEnd" format="yyyy-MM-dd HH:mm:ss"
						 @on-change="onapplyEndTime" :value="formdate.applyEndTime" placeholder="请输入报名截止时间" style="width: 100%"></DatePicker>
					</FormItem>
					<FormItem label="发起人电话">
						<Input v-model="formdate.telphone" placeholder="输入电话或手机号码" :maxlength="11"/>
					</FormItem>
					<FormItem label="活动人数" prop="perUpperLimitT">
						<Input v-model="formdate.perUpperLimitT" placeholder="活动人数无上限"/>
					</FormItem>
					<FormItem label="邀请商协会" prop='actManageOrg'>
						<!-- <Select v-model="formdate.actManageOrg" multiple placeholder="请选择邀请商协会" :class="{ 'edit' :  disabledState }">
							<Option :value="item.value" v-for="(item,index) in StructureList" :key="index" :disabled="item.disabled">{{item.orgName}}</Option>
						</Select> -->
						<!-- &nbsp; -->
						<div class="select">
							<div class="select-choose clear" @click="tolayer(4)">
								<div class="item" v-for="(item,index) in chooseArr" :key="index" @click.stop="deleteStructureList(item)">
									<span>{{item.orgName}}</span>
									<img v-if="!item.disabled" src="./../../assets/img/close12@3x.png" alt="" >
								</div>
								<span v-show="!chooseArr.length" class="span fl">请选择邀请商协会</span>
								<i class="ivu-icon ivu-icon-ios-arrow-down fr"></i>
							</div>
						</div>

					</FormItem>
					<!-- <div class="switch">
						<span>推荐到平台展示<img @click="tolayer(1)" src="../../assets/img/ptzswh@2x.png" alt=""></span>
						<Switchs :value="formdate.isRecommend?true:false" @on-change="onisRecommend" />
					</div> -->
					<div class="line"></div>
					<div class="xy hand">
						<Checkbox v-model="isxy"> 我同意</Checkbox> 《<span style="color:#2168EB" @click="pop('https://www.yiqilaiwang.com/law/serviceagree.html','一起来往使用条款')">一起来往使用条款</span>》
					</div>
					<div class="formbtn" @click="onform">保存</div>
				</Form>
				<!-- 修改部门名称  弹窗 -->
				<div class="layer staffeit" v-if="layer==2">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="map">
						<!-- <iframe :src="'https://m.amap.com/picker/?key=12399ff0812339527e25693f6e3130ec'" style="width: 800px;height: 500px;"></iframe> -->
						<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResults"></el-amap-search-box>
						<span @click="makesure(mark[0])" class="btn" style="float: right;">确定</span>
						<el-amap ref="map" vid="amapDemo" :center="center" :zoom="12" :events="events" class="amap-demo" style="width: 800px;height: 500px;">
							<el-amap-marker v-for="(marker,index) in mark" :key="index" :position="marker"></el-amap-marker>
						</el-amap>
					</div>

					<!-- <el-amap vid="amapDemo" :zoom="zoom" :center="center"></el-amap> -->
				</div>

				<!-- 图片弹窗 -->
				<div class="layer staffeit tjpt hand " v-if="layer==3">
					<div class="mask" @click="tolayer(0)"></div>
					<div>
						<img :src="bigimgUrl" alt="" style="width: 326px">
					</div>

				</div>

				<div class="layer staffeit tjpt" v-if="layer==1">
					<div class="mask" @click="tolayer(0)"></div>
					<p>推荐到平台展示，在平台审核后，<br>
						所有的平台用户都可在首页的推荐中<br>
						查看并报名参加您发布的活动</p>
					<div class="btn hand" @click="onistjpt(1)">确定</div>
				</div>

				<!-- 邀请商协会 -->
				<div class="layer staffeit choose-org" v-if="layer==4">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="content content1" style="width:420px">
						<div class="title clear">
              <div class="fl t-left" @click="chooseGovOrg">
                <img class="img" v-show="!isChooseOrg" src="../../assets/img/zzgl12.png" alt="">
                <img class="img" v-show="isChooseOrg" src="../../assets/img/title-c.png" alt="">
                <span>快速选择辖属组织</span>
              </div>
              <div class="fr t-right">已选择：{{chooseArr.length}}组</div>
            </div>
						<div class="select-sort">
							<sort :structureList='StructureList' :oldParts='chooseArr' @onchange='updateList' @length='getStructureListLength'></sort>
						</div>
						<div class="btns clear">
              <div class="all fl" @click="chooseAll">
                <img class="img" v-show="!isChooseAll" src="../../assets/img/zzgl11@3x.png" alt="">
                <img class="img" v-show="isChooseAll" src="../../assets/img/zzgl10@3x.png" alt="">
                <span>全选</span>
              </div>
              <div class="btn2 fr" style="padding:0 17px;margin-right:20px" @click="tolayer(0)">确定（{{chooseArr.length}}/{{structureListLength}}）</div>
            </div>
					</div>
				</div>
				<!-- 头像裁剪 -->
        <div
          class="layer staffeit"
          v-if="layer==5"
          style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;z-index:10002"
          >
          <div
            class="line"
            style="margin-left: 0px;margin-top: 0px;position: fixed;top: 36%; left: 15%;"
          >
            <div class="cropper-content" style="margin-top:-60px;margin-left:90px;">
							<img src="../../assets/img/xxtz2@2x.png" @click="layer=0" alt="" style="position:absolute;right:-100px;top:-150px">
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
                  @imgLoad="imgLoad"
                ></vueCropper>
              </div>
              <div style="margin-left:20px;">
                <div
                  class="show-preview"
                  :style="{'width': '350px', 'height':'194px',  'overflow': 'hidden', 'margin': '5px'}"
                >
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
                <input
                  type="button"
                  class="btn btn-blue"
                  style="margin-top:56px;margin-left:113px;padding: 0 60px;"
                  value="上传"
                  @click="finish"
                />
              </div>
            </div>
          </div>
        </div>

			</div>
		</div>
	</div>
</template>

<script>
	import E from 'wangeditor';
	import sort from '../../components/sort';
	import { VueCropper } from "vue-cropper";
	import * as qiniu from "qiniu-js";
	export default {
		components: {
			sort,VueCropper
		},
		name: 'activityrelease',
		props: {
			personalInfo: null,
			defOrg: null
		},
		mounted() {
			if (this.editW) {
				this.WangEditMethod()
			} else {
			}

		},
		data() {
			let self = this;
			return {
				editW: true,
				startDate: '',
				content: "",
				changeImg: false,
				mimeType: ["image/png", "image/jpeg", "image/gif", 'image/jpg'],
				mark: [],
				fileCollection: [],
				fileCollection_old: [],
				// 活动人数临时字段
				perUpperLimit: '',
				center: [120.477396, 36.305191],
				address: '',
				events: {
					click(e) {

						self.center = [e.lnglat.lng, e.lnglat.lat]

						// return self.geocoder(self.center);
						// return console.log('geocoder',AMap);

						// 这里通过高德 SDK 完成。
						var geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all"
						});

						geocoder.getAddress(self.center, function(status, result) {
							if (status === 'complete' && result.info === 'OK') {
								// console.log("result", result)
								if (result && result.regeocode) {
									if (result.regeocode.aois.length == 0) {
										self.formdate.latitude = e.lnglat.lat
										self.formdate.longitude = e.lnglat.lng
										self.formdate.actAddress = result.regeocode.formattedAddress;
									} else {
										self.formdate.latitude = result.regeocode.aois[0].location.lat
										self.formdate.longitude = result.regeocode.aois[0].location.lng
										self.formdate.actAddress = result.regeocode.formattedAddress;

									}

									// console.log(self.address)
									self.mark = [self.center]
									// self.layer = 0
									// self.$nextTick();
								}
							}
						});
					}
				},
				lng: 0,
				lat: 0,
				searchOption: {
					city: '青岛',
					citylimit: false
				},
				onSearchResult: null,
				istjpt: false,
				disabledState: false,
				dateoptionsEnd: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				dateoptions: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				layer: 0,
				orgList: [],
				imgages: {
					'3': "",
					'4': "",
					'8': "",
					'13': "",
				},
				// 临时图片路径
				bigimgUrl: "",
				actType: [{
						"dictValue": "3",
						"dictName": "运动",
					},
					{
						"dictValue": "4",
						"dictName": "宴请"
					},
					{
						"dictValue": "8",
						"dictName": "会议"
					},
					{
						"dictValue": "13",
						"dictName": "生日活动",
					}
				],

				chooseConsume: [{
						value: '1',
						name: 'AA人均'
					},
					{
						value: '2',
						name: '请客'
					},
					{
						value: '3',
						name: '免费'
					},
				],
				/* 1：需要填写支付金额perCapita，2：需要填写请客人（payer）3：免费 4：礼金 5：慈善 6：无*/
				detail: null,
				Fields: null,
				isfields: false,
				isfieldsedit: false,
				fieldslist: [],
				formdaterule: {
					perUpperLimitT: [{
						validator: (rule, value, callback) => {
							if (value != "" && value != null) {
								var num = Number(value)

								if (num == NaN) {
									callback(new Error('请输入数字'))
								} else {
									if (num < 2) {
										callback(new Error('活动人数至少为2'))
									}
									callback()
								}
							} else {
								callback()
							}


						},
						trigger: 'change'

					}],
					perCapita: [{
						validator: (rule, value, callback) => {
							if (this.formdate.chooseConsume == 1) {

								if (value == NaN || value == "" || value == null) {
									// console.log(value == NaN || value == "" || value == null, "2fd22")
									callback(new Error('人均费用不能为空'))
								} else {
									callback()
								}
							} else {
								callback()
							}

						},
						trigger: 'change'

					}],
					payer: [{
						validator: (rule, value, callback) => {
							if (this.formdate.chooseConsume == 2) {

								if (value == NaN || value == "" || value == null) {
									callback(new Error('请客人不能为空'))
								} else {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'change'

					}],
					actStartTime: [{
						required: true,
						message: '请选择活动开始时间',
						trigger: 'blur'
					}],
					actEndTime: [{
						required: true,
						message: '请选择活动接收时间',
						trigger: 'blur'
					}],
					applyEndTime: [{
						required: true,
						message: '请选择活动报名截止时间',
						trigger: 'blur'
					}],
					topic: [{ 
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					chooseConsume: [{
						required: true,
						message: '请选择费用类用类型',
						trigger: 'blur'
					}],
					actManageOrg: [{ 
						required: true, 
						type: 'array', 
						min: 1, 
						message: '请选择邀请商协会', 
						trigger: 'change' 
					}],
				},
				formdate: {
					id: null,
					"actType": 10,
					"actTypeStr": "",
					"actPoster": "",
					"topic": "",
					"actStartTime": "",
					"actEndTime": "",
					"seat": "",
					"provinceId": "",
					"cityId": "",
					"districtId": "",
					"actAddress": "",
					"latitude": "",
					"longitude": "",
					"chooseConsume": "",
					"perCapita": '',
					"payer": "",
					"perUpperLimit": "",
					// 临时字段
					"perUpperLimitT": "",
					"regimentSize": -1,
					"invitationPeriod": -1,
					"applyEndTime": '',
					"isCheck": 0,
					"isName": 0,
					"isTelphone": 0,
					"isSex": 0,
					"isWechatNum": 0,
					"isIdcard": 0,
					"remark": "",
					"transportation": "",
					"signInWay": "0",
					"activityProcess": "",
					"payType": 0,
					"orUrl": "",
					"pictureUrl": "",
					"balance": 0,
					"status": 0,
					"delFlag": 0,
					"createUid": "",
					"createTime": "",
					"updateUid": "",
					"updateTime": "",
					"cancelUid": "",
					"cancelTime": "",
					"count": "",
					"name": "",
					"formId": "",
					"isAirpor": 0,
					"isCompany": 0,
					"isEnrollment": 0,
					"isAddress": 0,
					"isEmail": 0,
					"telphone": "",
					"company": "",
					"groupNotice": "",
					"posterUrl": [],
					"extras": [],
					"fields": [],
					"sourceType": 4,
					"actClass": 4,
					"orgId": "",
					"exitStatus": 0,
					"authStatus": 0,
					"share": 0,
					"parts": [],
					"checkStatus": 0,
					"authorityGroups": "",
					"isRecommend": 0,
					"recommendStatus": -1,
					"createUrl": "",
					"createName": "",
					"number": 1,
					"applyCount": 1,
					"check": 1,
					"noAdopt": 0,
					"noCheck": 0,
					"noJoin": 0,
					"signInNum": 1,
					"browseNum": 1,
					"isPrivate": 0,
					"totalMoney": 0,
					"refundMoney": 0,
					"list": [],
					"avatarUrls": [""],
					"signIn": -1,
					"joinType": 0,
					"timeStr": "",
					"isCollection": 0,
					"actStatus": 0,
					"entityId":'',
					actManageOrg:[],
				},
				oldParts: [], //在编辑情况下 邀请人数据
				StructureList: null, //邀请人组织id
				isxy: false,
				// 判断是否有人报名
				disabledofpeo: false,
				QNtoken:"",
				chooseArr:[],
				structureListLength:0,
				option: {
					img: "",
					size: 1, //剪切后的图片质量（0.1-1）
					full: true, //输出原图比例截图 props名full
					outputType: "png",
					canMove: true,
					original: false,
					canMoveBox: true,
					autoCrop: true,
					autoCropWidth: 350,
					autoCropHeight: 194,
					fixedBox: true
				},
				previews: {},
				headImg: "",
				name: "",
				modelSrc: "",
				isChooseAll:false,
      	isChooseOrg:false,
			}
		},
		watch: {
			disabledofpeo(val) {
				this.disabledofpeo = val
			},
			defOrg(res) {
				// console.log('defOrg 请求')
				if (res) {
					this.formdate.entityId = res.digitalCommerce
					this.getStructureList();
					this.getOrgList();
				}
			},
			// aa人均检测
			'formdate.perCapita': function(newVal, oldVal) {
				// newVal=parseInt(newVal)
				// if()
				// oldVal=parseInt(oldVal)
				if (oldVal == 0) {
					// console.log("newval", newVal)
					// console.log("000.", newVal != "0.")

					if (newVal >= 1) {
						this.formdate.perCapita = parseInt(newVal)
					}
				}

				if (newVal == "" || newVal == null) {
					return
				}
				// 解决数字键盘可以输入输入多个小数点问题
				// console.log('newVal', newVal)
				// console.log('oldVal', oldVal)
				if (!/^-?\d+\.?\d{0,2}$/.test(newVal)) {
					this.formdate.perCapita = oldVal;
					return
				}

				// if (oldVal.toString().indexOf('.') > 0) {
				// 	this.formdate.perCapita = 0;
				// 	return;
				// }
				// 保留两位小数
				if (newVal) {
					newVal = newVal.toString();
					var pointIndex = newVal.indexOf('.');
					if (pointIndex > 0 && (newVal.length - pointIndex) > 3) {
						this.formdate.perCapita = oldVal;
						return;
					}
				}
				// console.log(newVal, "低调低调")
				// 最大值
				if (newVal >= 500000) {
					this.formdate.perCapita = 500000;
					return;
				}

			},
			chooseArr(val){
				if(val.length == this.StructureList.length){
					this.isChooseAll = true;
					this.isChooseOrg = true;
				}else{
					this.isChooseAll = false;
				}
				
				var isAllOrg = true
				this.StructureList.forEach((item,index)=>{
					// if(Boolean(item.isGovOrg) && !item.choose&& !this.oldParts.length || Boolean(item.isGovOrg) && !item.disabled && this.oldParts.length){
					if(Boolean(item.isGovOrg) && !item.choose){
						isAllOrg = false
						return
					}
				})
				// console.log('isAllOrg:',isAllOrg)
				this.isChooseOrg = isAllOrg;
				this.formdate.actManageOrg = this.chooseArr.map(i => i.id);
			},
		},
		methods: {
			getLocation() {
				const self = this

				AMap.plugin('AMap.Geolocation', function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: 10000,
					})

					geolocation.getCurrentPosition()
					AMap.event.addListener(geolocation, 'complete', onComplete);
					AMap.event.addListener(geolocation, 'error', onError);

					function onComplete(data) {
						// data是具体的定位信息
						// console.log('定位成功信息：', data);
						self.center = [data.position.lng, data.position.lat]
						self.mark = [self.center]

					}

					function onError(data) {
						// 定位出错
						// console.log('定位失败错误：', data);
						// 调用ip定位
						self.getLngLatLocation();
					}
				})
			},
			getLngLatLocation() {
				var that = this;
				AMap.plugin('AMap.CitySearch', function() {
					var citySearch = new AMap.CitySearch();
					citySearch.getLocalCity(function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							// 查询成功，result即为当前所在城市信息
							that.center = result.rectangle.split(';')[0].split(',');
							that.mark = [that.center];
							// console.log('通过ip获取当前城市：', result)
							//逆向地理编码
							AMap.plugin('AMap.Geocoder', function() {
								var geocoder = new AMap.Geocoder({
									// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
									city: result.adcode
								})

								var lnglat = result.rectangle.split(';')[0].split(',');
								geocoder.getAddress(lnglat, function(status, data) {
									if (status === 'complete' && data.info === 'OK') {
										// result为对应的地理位置详细信息
										// console.log(data,"111111111111")
									}
								})
							})
						}
					})
				})
			},

			WangEditMethod() {
				var editor = new E(this.$refs.editor)
				editor.customConfig.onchange = (html) => {
					let reg = new RegExp('<p></p>', 'g')
					html = html.replace(reg, '');
					this.content = html
				}
				editor.customConfig.menus = [
						'head', // 标题
						'bold', // 粗体
						'fontSize', // 字号
						'fontName', // 字体
						'italic', // 斜体
						'underline', // 下划线
						'strikeThrough', // 删除线
						'foreColor', // 文字颜色
						'backColor', // 背景颜色
						'link', // 插入链接
						'list', // 列表
						'justify', // 对齐方式
						'quote', // 引用
						'emoticon', // 表情
						'image', // 插入图片
						// 'table',  // 表格
						'video',  // 插入视频
						// 'music',  // 插入音频
						// 'code',  // 插入代码
						'undo', // 撤销
						'redo' // 重复
					],
					// 使用 base64 保存图片
					editor.customConfig.uploadImgShowBase64 = false
				// editor.customConfig.fontSize='normal'
				// editor.customConfig.pasteFilterStyle = true
				editor.customConfig.pasteIgnoreImg = false

				editor.customConfig.pasteTextHandle = function(content) {
					// content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
					if (content == '' && !content) return ''
					let str = content;
					//处理的标签里的多余代码
					str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '');
					str = str.replace('/(\\n|\\r| class=(")?Mso[a-zA-Z]+(")?)/g', '');
					let reg = new RegExp('<!--(.*?)-->', 'g')
					str = str.replace(reg, '');
					str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
					// str = str.replace(/<\/?[^>]*>/g, '')
					// str = str.replace(/[ | ]*\n/g, '\n')
					// str = str.replace(/&nbsp;/ig, '')
					return str
				}


				// 隐藏“网络图片”tab
				editor.customConfig.showLinkImg = false
				editor.customConfig.colors = [
					'red',
					'black',
					'green',
					'yellow',
					'orange',
					'grey',
					'pink',
					'transparent',
				]

				// 允许上传到七牛云存储
				editor.customConfig.qiniu = true
				editor.create()
				if(this.content){
					editor.txt.append(`<p>${this.content}</p>`)
				}else{
					editor.txt.append(`<p><br></p>`)
				}
				// editor.cmd.do('insertHTML', this.content)
				this.uploadInit(editor);
				this.uploadInitVideo(editor);
				// this.uploadInitMusic(editor);
			},
			// 地图确定
			makesure(e) {
				if (e == "" || e == null) {
					e = this.center
				}
				var center = e

				// return self.geocoder(self.center);
				// return console.log('geocoder',AMap);

				// 这里通过高德 SDK 完成。
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				var self = this

				geocoder.getAddress(center, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						if (result && result.regeocode) {
							if (result.regeocode.aois.length == 0) {
								self.formdate.latitude = e[1]
								self.formdate.longitude = e[0]
								self.formdate.actAddress = result.regeocode.formattedAddress;
							} else {
								self.formdate.latitude = result.regeocode.aois[0].location.lat
								self.formdate.longitude = result.regeocode.aois[0].location.lng
								self.formdate.actAddress = result.regeocode.formattedAddress;
							}
							// console.log(self.address)
							self.layer = 0
							// self.$nextTick();
						}
					}
				});
			},
			test1(e) {
				layer.msg(e)
			},
			error(res) {
				layer.msg('文件类型不正确,请重新上传')
				// console.log(res);
			},
			// 附件上传
			// upcoverUrl(e) {
			// 	this.fileFname = e.qiniu.key
			// 	this.fileFurl = e.url
			// 	// this.fileCollection.push(e.url);
			// 	if (this.fileCollection_old.indexOf(e.url) == -1) {
			// 		this.fileCollection_old.push(e.url)
			// 		this.fileCollection.push(this.fileFurl)
			// 	}
			// 	// console.log(e)
			// },
			delFileCollection(key) {
				this.fileCollection_old.splice(key, 1)
				this.fileCollection.splice(key, 1)
			},
			// 地图搜索

			onSearchResults(pois) {
				let latSum = 0;
				let lngSum = 0;
				// console.log(pois)
				this.center = [pois[0].lng, pois[0].lat];
				this.mark = [this.center]
			},

			// 校验方法
			perUpperLimitMethod() {
				return true;
			},
			// 弹窗
			pop(url, tit) {
				layer.open({
					type: 2,
					title: tit,
					shadeClose: true,
					shade: 0.8,
					maxmin: true,
					area: ['1000px', '80%'],
					content: url, //iframe的url
				});
			},
			// events(e){
			// 	console.log('xxx',e)
			// },
			// 当前是否有人报名-可优化
			indisabledofpeo() {
				// console.log("this.formdate.applyCount")
				// console.log(this.formdate.applyCount)
				// console.log(this.formdate.applyCount > 1)
				// console.log("this.formdate.applyCount333333333333333333333333333333333333")

				if (this.formdate.applyCount > 1) {
					this.disabledofpeo == true
					switch (this.formdate.chooseConsume) {
						case 1:
							this.chooseConsume = [{
								value: '1',
								name: 'AA人均'
							}]
							break;
						case 2:
							this.chooseConsume = [{
								value: '2',
								name: '请客'
							}]
							break;
						case 3:
							this.chooseConsume = [{
								value: '3',
								name: '免费'
							}]
							break;
					}
					this.formdate.chooseConsume = this.chooseConsume[0].value
					return true
				} else {
					this.disabledofpeo == false
				}
				return false
			},
			geocoder(pos) {

				const geocoder = new AMap.Geocoder({
					radius: options.radius || 1000,
					extensions: options.extensions || "all"
				})
				// return console.log('xxx', geocoder)
				geocoder.getAddress(pos, function(status, result) {
					// console.log(status, result);
					// if (status === 'complete' && result.info === 'OK') {
					// 	options.success && options.success(result);
					// }else{
					// 	options.error && options.error(status,result);
					// }
				});
				// return console.log('pospos',new AMap.Geocoder());
				// var geocoder = new this.AMap.Geocoder();
				// return console.log(geocoder);
			},
			// 弹窗弹出
			tolayer(n) {
				// console.log('xxx', this.layer);
				this.layer = n
			},
			// 活动类型联动
			changePay(e) {

				if (!this.changeImg) {
					this.getImages(e);
				}

				if (e == 3 || e == 8) {
					this.formdate.chooseConsume = 3
				}
				switch (this.formdate.topic) {
					case "一起运动,能量翻倍":
						;
					case "一起吃饭,不见不散":
						;
					case "高谈雄辩,共商大事":
						;
					case "生日快乐,共祝此时":
						;
						switch (e) {
							case 3:
								this.formdate.topic = "一起运动,能量翻倍"
								break;
							case 4:
								this.formdate.topic = "一起吃饭,不见不散"
								break;
							case 8:
								this.formdate.topic = "高谈雄辩,共商大事"
								break;
							case 13:
								this.formdate.topic = "生日快乐,共祝此时"
								break;
						}
						break;
					default:

				}

			},
			getOrgList() {
				this.http.ajax({
					url: '../../webSite/orgList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"uid": ''
					}
				}).then(res => {
					if (res.code == 200) {
						// console.log(res)
						for (var i in res.data) {
							res.data[i].value = res.data[i].id
						}
						this.orgList = res.data;
					}
				})
			},
			getImages(type) {
				this.http.ajax({
					url: '../../webSite/image/list',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"type": type
					}
				}).then(res => {
					// console.log(res)
					if (res.code == 200) {
						this.formdate.actPoster = res.data[0].url;
					}
				})
			},
			getStructureList() {
				this.http.ajax({
					// url: '../../webSite/activity/getStructureList',
					url: '../../webSite/businessGov/getBusinessAssociationList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						entityId: this.defOrg.digitalCommerce,
						// "name": ''
					}
				}).then(res => {
					if (res.code == 200) {
						res.data.forEach((item) => {
							item.value = item.id;
							item.disabled = false;
							item.choose = false;
						})
						this.StructureList = res.data
						var i =0;
						var j =0;
						for(i in this.StructureList){
							let index = i;
							for(j in this.oldParts){
								if(this.StructureList[i].id == this.oldParts[j]){
									this.StructureList[i].disabled = true;
									this.StructureList[i].choose = true;
									this.chooseArr.push(
										this.StructureList[i]
									)
								}
							}
						}
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
				this.fieldslist.push(id)
			},
			onisfieldsedit() {
				if (this.isfieldsedit) {
					if (this.fieldslist.length > 0) {
						this.http.ajax({
							url: '../../webSite/userFields/deleteFields',
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
							this.isfieldsedit = 0
						})
					} else {
						this.isfieldsedit = 0
					}
				} else {
					this.isfieldsedit = 1
				}
			},
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
							url: '../../webSite/userFields/save',
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
							}
						})
					}
				}
			},
			setformdate(e) {
				this.formdate[e] == 1 ? this.formdate[e] = 0 : this.formdate[e] = 1
			},
			onactEndTime(e) {

				var start = new Date(this.formdate.actStartTime);
				var end = new Date(e);
				// console.log(end, "最终时间")
				this.dateoptionsEnd = {
					disabledDate: date => {
						var startday = new Date(start.getTime()).Format("yyyy-MM-dd");
						var m = (date.valueOf() < new Date(startday).getTime() - 86400000)
						if (date.valueOf() == new Date(startday + " 00:00:00").getTime()) {
							m = false
						}

						return date && m;
					}
				}
				if (start.getTime() >= end.getTime()) {
					layer.msg("结束时间不能早于开始时间")
					var Randnum=Math.floor(Math.random()*10+1);
					
					this.formdate.actEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3+Randnum*1000).Format(
						"yyyy-MM-dd hh:mm:ss");
					this.formdate.applyEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3+Randnum*1000).Format(
						"yyyy-MM-dd hh:mm:ss");
				} else {
					this.formdate.actEndTime = e;
					this.formdate.applyEndTime = e;
				}

				// this.compareTime();
			},
			onactStartTime(e) {
				this.formdate.actStartTime = e;
				var start = new Date(this.formdate.actStartTime);
				this.startDate = start
				this.dateoptionsEnd = {
					disabledDate: date => {

						return date && (date.valueOf() < start.getTime());
					}
				}
				this.compareTime();
			},
			onapplyEndTime(e) {
				this.formdate.applyEndTime = e;
			},
			compareTime() {
				var start = new Date(this.formdate.actStartTime);
				var end = new Date(this.formdate.actEndTime);

				// if (start.getTime() >= end.getTime()) {
				// 	this.formdate.actEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3 + 1000 * 60 * 10).Format(
				// 		"yyyy-MM-dd hh:mm:ss");
				// 	this.formdate.applyEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3 + 1000 * 60 * 10).Format(
				// 		"yyyy-MM-dd hh:mm:ss");
				// 	// layer.msg("活动开始时间不能大于结束时间");
				// }
				this.formdate.actEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3).Format(
					"yyyy-MM-dd hh:mm:ss");
				this.formdate.applyEndTime = new Date(start.getTime() + 1000 * 60 * 60 * 3).Format(
					"yyyy-MM-dd hh:mm:ss");
			},
			onisRecommend(e) {
				if (e) {
					this.istjpt = true;
				}
				this.formdate.isRecommend = e ? 1 : 0;
				this.istjpt = this.formdate.isRecommend;
				// this.layer = this.formdate.isRecommend;
				// console.log('!!!!!!!!!!!!!!!!',this.formdate.isRecommend);
			},
			onistjpt(e) {
				// console.log('@@@@@@@@@@@@@',e)
				// return;
				if (e == 1) {
					this.formdate.isRecommend = 1
				} else {
					if (this.istjpt) {
						this.formdate.isRecommend = 0
					}
				}
				this.istjpt = false;
				this.layer = 0
			},
			upactPoster(res) {
				// this.formdate.actPoster = res.url
				this.changeImg = true;
				this.option.img = res.url;
				this.name = res.name;
				this.layer =5;
			},
			// 实时预览函数
			realTime(data) {
				// console.log("realTime", data);
				this.previews = data;
				this.$refs.cropper.getCropBlob(data => {
					this.modelSrc = data;
				});
			},
			imgLoad(msg) {
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
						url: "../../webSite/home/uploadApplication",
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
								this.layer = false;
								// 接收成功后返回的信息
								// console.log("图片地址", res.data.qiniuDomain + "/" + result.key);
								this.formdate.actPoster=res.data.qiniuDomain + "/" + result.key
							}
						});
					});
			},
			getFields() {
				this.http.ajax({
					url: '../../webSite/userFields/getFields',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						uid: ""
					}
				}).then(res => {
					if (res.code == 200) {
						this.Fields = res.data
					}
				})
			},

			onform() {
				this.$refs["formdaterule"].validate((valid) => {
				});
				if(!this.formdate.topic){
					this.$Message.info('请输入活动名称');
					return
				}
				if(!this.formdate.actManageOrg.length){
					this.$Message.info('请选择邀请商协会');
					return
				}
				if (!this.isxy) {
					this.$Message.info('请阅读协议');
					return;
				}

				var starts = new Date(this.formdate.actStartTime);
				var ends = new Date(this.formdate.actEndTime);
				if (starts.getTime() >= ends.getTime()) {
					this.$Message.info('活动结束时间必须大于开始时间');
					return;
				}
				// if (this.formdate.chooseConsume == "") {
				// 	this.$Message.info('请选择费用类型');
				// 	document.documentElement.scrollTop = 380
				// 	return;
				// }
				// if (this.formdate.chooseConsume == 2 && (this.formdate.payer == null || this.formdate.payer == "")) {
				// 	this.$Message.info('请客人不能为空');
				// 	document.documentElement.scrollTop = 380
				// 	return;
				// }
				if (this.formdate.perUpperLimitT == "") {
					this.formdate.perUpperLimit = -1
				} else {
					this.formdate.perUpperLimit = this.formdate.perUpperLimitT
				}
				var num = Number(this.formdate.perUpperLimitT)
				if (this.formdate.perUpperLimit == -1) {
				} else {
					if (num == NaN) {
						this.$Message.info('请输入活动人数');
						this.formdate.perUpperLimit = ""
						return
					} else if (num < 2) {
						this.$Message.info('活动人数至少2人');
						// document.documentElement.scrollTop = 480
						this.formdate.perUpperLimit = ""
						return
					}
					this.formdate.perUpperLimit = num
				}
				this.formdate.posterUrl = this.fileCollection
				// if (this.formdate.chooseConsume == 1) {
				// 	if (this.formdate.perCapita == "" || this.formdate.perCapita == 0) {
				// 		this.$Message.info('请输入AA人均金额');
				// 		document.documentElement.scrollTop = 380
				// 		if (this.formdate.perUpperLimit == -1) {
				// 			this.formdate.perUpperLimit = ""
				// 		}
				// 		return
				// 	}
				// 	var perCapita = Number(this.formdate.perCapita)
				// 	if (perCapita <= 0) {
				// 		document.documentElement.scrollTop = 380
				// 		this.$Message.info('金额必须大于0');
				// 	}
				// }

				this.formdate.activityProcess = this.content
				delete this.formdate.chooseConsume;
				delete this.formdate.perCapita;
				if (this.$route.query.id) {
					this.http.ajax({
						url: '../../webSite/activity/updateActivity?id=' + this.$route.query.id,
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: this.formdate
					}).then(res => {
						if (res.code == 200) {
							this.$router.push('/activitylists')
							layer.msg("修改成功")
						} else {
							layer.msg(res.msg)
						}
					})
				} else {
					this.http.ajax({
						url: '../../webSite/activity/addActivity',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: this.formdate
					}).then(res => {
						if (res.code == 200) {
							this.$router.push('/activitylists')
						}
						layer.msg(res.msg)
					})
				}
				// console.log(this.formdate.actEndTime)
				//http://centling.com//webSite/activity/updateActivity?uid=63755c41127811e981b5fa163e4d6bc3
			},
			getactivityDetail() {
				var t = true
				if (this.editW) {
					this.editW = false
				} else {
					t = false
				}


				this.http.ajax({
					url: '../../webSite/activity/activityDetail',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"id": this.$route.query.id
					}
				}).then(res => {
					if (res.code == 200) {
						this.detail = res.data
						this.formdate = res.data;
						this.oldParts = this.formdate.actManageOrg;
						this.chooseArr.map((item,index)=>{
						if(item.id == fitem.id){
							this.chooseArr.splice(index,1)
						}
					})
						this.content = res.data.activityProcess
						// if (res.data.chooseConsume != null && res.data.chooseConsume != '') {
						// 	this.formdate.chooseConsume = this.chooseConsume[res.data.chooseConsume - 1].value
						// }
						this.fileCollection = res.data.posterUrl

						// this.disabledofpeo = this.indisabledofpeo()
						if (t) {
							this.WangEditMethod()
						}
						if (res.data.perUpperLimit == -1) {
							delete res.data.perUpperLimit;
						}
						//获取邀请人列表
						this.getStructureList();
					}
				})
			},
			// 获取选择的商协会
			updateList(data){
				// console.log('父组件',data);
				this.chooseArr = data;
				this.formdate.actManageOrg = data.map(i => i.id);
			},
			getStructureListLength(length){
				this.structureListLength = length
			},
			deleteStructureList(fitem){
				if(!fitem.disabled){
					fitem.choose = !fitem.choose;
					this.chooseArr.map((item,index)=>{
						if(item.id == fitem.id){
							this.chooseArr.splice(index,1)
						}
					})
					this.formdate.actManageOrg = this.chooseArr.map(i => i.id);
				}
			},
			chooseGovOrg(){
				// 双重保护
				if(this.oldParts.length){
					var isAllOrg = true
					this.StructureList.forEach((item,index)=>{
						if(Boolean(item.isGovOrg) && !item.disabled){
							isAllOrg = false
							return
						}
					})
					if(isAllOrg){
						return
					}
				}
				// console.log(1,this.isChooseOrg)
				this.isChooseOrg = !this.isChooseOrg;
				// console.log(2,this.isChooseOrg)
				this.chooseArr = [];
				if(this.isChooseOrg){
					// console.log('this.isChooseOrg为true')
					this.StructureList.forEach((item,index,arr)=>{
						item.choose =  item.isGovOrg ==1?true:false;
						if(item.isGovOrg ==1){
							this.chooseArr.push(item)
						}
					})
				}else if(this.isChooseAll){
					// console.log('this.isChooseAll为true')
					this.chooseArr = [];
					this.StructureList.forEach((item,index,arr)=>{
						item.choose = false;
						if(!Boolean(item.isGovOrg)&& !this.oldParts.length || (!Boolean(item.isGovOrg) || item.disabled) && this.oldParts.length){
							item.choose = true;
							this.chooseArr.push(item)
						}
					})
				}else{
					// console.log('else')
					this.StructureList.forEach((item,index,arr)=>{
						item.choose = false;
					})
					this.chooseArr = [];
				}
			},
			chooseAll(){
				if(this.oldParts.length){
					var all = true;
					this.StructureList.forEach((item,index)=>{
						if(!item.disabled){
							all = false;
							return
						}
					})
					if(all){
						// console.log('return')
						return
					}
				}
				this.isChooseAll = !this.isChooseAll;
				if(this.isChooseAll){
					this.chooseArr = [];
					this.StructureList.forEach((item,index)=>{
						item.choose = true;
						this.chooseArr.push(item)
					})
				}else if(!this.oldParts.length){
					this.StructureList.forEach((item,index)=>{
						item.choose = false;
					})
					this.chooseArr = [];
				}else{
					this.chooseArr = [];
					this.StructureList.forEach((item,index)=>{
						if(!item.disabled){
							item.choose = false;
						}
						if(item.choose){
							this.chooseArr.push(item)
						}
					})
				}
			},

			// 获取七牛云token
			getToken(e){
				var that = this;
				if(e.target.type == 'file'){
					that.http.ajax({
						url: '../../webSite/home/uploadApplication',
						method: 'post',
						// data: {
						// 	uid: that.personalInfo.uid
						// }
					}).then( res =>{
						that.QNtoken = res.data.upToken;
					})
				}
			},
			uploadInit(editor) {
				// 获取相关 DOM 节点的 ID
				var btnId = editor.imgMenuId
				var containerId = editor.toolbarElemId
				var textElemId = editor.textElemId
				var index='';
				var that = this;
				// 创建上传对象
				this.http.ajax({
					url: '../../webSite/home/uploadApplication',
					method: 'post',
					// data: {
					// 	uid: ""
					// }
				}).then(res => {
					// console.log('此处为七牛云获取参数',res)
					this.QNtoken = res.data.upToken;
					var uploader = window.Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
						   var uptoken = that.QNtoken
						   return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: 'https://img.yiqilaiwang.com/',
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '100mb', //最大文件体积限制
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
						chunk_size: '4mb', //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							'UploadProgress': function(up, file) {
								// 显示进度条
								index = layer.load(0, {shade: false});
							},
							 'UploadComplete': function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							'FileUploaded': function(up, file, info) {
								var domain = up.getOption('domain')
								var res = window.$.parseJSON(info)
								var sourceLink = domain + res.key //获取上传成功后的文件的Url

								// 插入图片到editor
								editor.cmd.do('insertHtml', '<img  src="' + sourceLink +
									'?imageView2/1/q/30/format/jpg/ignore-error/1' + '" style="max-width:100%;" />')
							},
							'Error': function(up,err,errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601  && err.file.type.indexOf('video') ==-1){
									layer.msg("请选择jpg，gif，png，bmp，jpeg格式的图片上传")
								}else if(err.code != -601){
									layer.msg(errTip)
								}
							},
						}
					})
				})
			},
			uploadInitVideo(editor) {
				// 获取相关 DOM 节点的 ID
				var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[15]
				// var btnId = editor.imgMenuId;
				// console.log(editor.$toolbarElem[0],btnId)
				var containerId = editor.toolbarElemId
				var textElemId = editor.textElemId
				var that = this;
				var index='';
				// 创建上传对象
				this.http.ajax({
					url: '../../webSite/home/uploadApplication',
					method: 'post',
					// data: {
					// 	uid: this.personalInfo.uid
					// }
				}).then(res => {
					this.QNtoken = res.data.upToken;
					// console.log('上传时',this.QNtoken);
					var uploader = window.Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						// uptoken: res.data.upToken,
						// uptoken: that.QNtoken,
						uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
						   var uptoken = that.QNtoken
						   return uptoken;
						},
						get_new_uptoken: true,
						unique_names: true,
						// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
						domain: 'https://img.yiqilaiwang.com/',
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '100mb', //最大文件体积限制
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
						chunk_size: '20mb', //分块上传时，每片的体积
						auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
						init: {
							'UploadProgress': function(up, file) {
								// 显示进度条
								index = layer.load(0, {shade: false});
							},
							 'UploadComplete': function() {
								//队列文件处理完毕后,处理相关的事情
								// 隐藏进度条
								layer.close(index);
							},
							'FileUploaded': function(up, file, info) {
								var domain = up.getOption('domain')
								var res = window.$.parseJSON(info)
								var sourceLink = domain + res.key //获取上传成功后的文件的Url
								// 插入图片到editor
								editor.cmd.do('insertHtml', "<video style='margin-top:5px;background:black' width='100%' height='214px' webkit-playsinline = 'true' playsinline = 'true' controls controlslist='nodownload' poster=" + sourceLink + "?vframe/jpg/offset/0/imageslim/imageView2/1/interlace/1/ignore-error/1 ><source src='" + sourceLink + "' type='video/mp4'></video>")
							},
							'Error': function(up,err,errTip) {
								// console.log(up,err,errTip)
								if(err.code == -601 && err.file.type.indexOf('image') ==-1){
									layer.msg("上传视频仅支持mp4格式")
								}else if(err.code != -601){
									layer.msg(errTip)
								}
							},
						}
					})
				})
			},
			// uploadInitMusic(editor) {
			// 	// 获取相关 DOM 节点的 ID
			// 	var btnId = editor.$toolbarElem[0].getElementsByClassName("w-e-menu")[16]
			// 	// var btnId = editor.imgMenuId;
			// 	// console.log(editor.$toolbarElem[0],btnId)
			// 	var containerId = editor.toolbarElemId
			// 	var textElemId = editor.textElemId
			// 	var that = this;
			// 	// 创建上传对象
			// 	this.http.ajax({
			// 		url: '../../webSite/home/uploadApplication',
			// 		method: 'post',
			// 		data: {
			// 			uid: this.personalInfo.uid
			// 		}
			// 	}).then(res => {
			// 		var uploader = window.Qiniu.uploader({
			// 			runtimes: 'html5,flash,html4', //上传模式,依次退化
			// 			browse_button: btnId, //上传选择的点选按钮，**必需**
			// 			// uptoken: res.data.upToken,
			// 			uptoken: that.QNtoken,
			// 			uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
			// 			   var uptoken = that.QNtoken
			// 			   return uptoken;
			// 			},
			// 			get_new_uptoken: true, 
			// 			unique_names: true,
			// 			// domain: 'http://come2me2.centling.cn/', //bucket 域名，下载资源时用到，**必需**
			// 			domain: 'https://img.yiqilaiwang.com/',
			// 			container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
			// 			max_file_size: '100mb', //最大文件体积限制
			// 			region: "z1",
			// 			filters: {
			// 				mime_types: [
			// 					//只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
			// 					{
			// 						title: "音频文件",
			// 						// extensions: "jpg,gif,png,bmp,jpeg"
			// 						// extensions: "avi,asf,wmv,mov,mp4,FLV"
			// 						extensions: "mp3,ogg,wav"
			// 					}
			// 				]
			// 			},
			// 			max_retries: 3, //上传失败最大重试次数
			// 			dragdrop: true, //开启可拖曳上传
			// 			drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			// 			chunk_size: '10mb', //分块上传时，每片的体积
			// 			auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			// 			init: {
			// 				'FileUploaded': function(up, file, info) {
			// 					var domain = up.getOption('domain')
			// 					var res = window.$.parseJSON(info)
			// 					var sourceLink = domain + res.key //获取上传成功后的文件的Url
			// 					// 插入图片到editor
			// 					editor.cmd.do('insertHtml','<audio controls controlslist="nodownload" style="max-width:100%; width:100%"> <source   src="' + sourceLink + '?imageslim/imageView2/1/interlace/1/ignore-error/1"/></audio> ' )
			// 				}
			// 			}
			// 		})
			// 	})
			// },
		},
		created() {
			this.formdate.actEndTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 3 + 1000 * 60 * 10).Format(
				"yyyy-MM-dd hh:mm:ss");
			this.formdate.actStartTime = new Date(new Date().getTime() + 1000 * 60 * 10).Format("yyyy-MM-dd hh:mm:ss");
			this.formdate.applyEndTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 3 + 1000 * 60 * 10).Format(
				"yyyy-MM-dd hh:mm:ss");
			this.startDate = new Date()
			this.getImages(10);
			this.mark = [this.center]

			if (this.$route.query.actClass) {
				this.formdate.actClass = this.$route.query.actClass
			}
			if (this.$route.query.id) {
				this.disabledState = true;
				this.getactivityDetail();

			} else {
				//获取邀请人列表
			}
			this.getFields();
			if (this.defOrg) {
				this.formdate.entityId = this.defOrg.digitalCommerce
				this.getOrgList();
				if(!this.$route.query.id){
					this.getStructureList();
				}
				// this.getImages(4)
			}
			setTimeout(this.getLocation(),300)
			// console.log(this.mark)
		}
	}
</script>

<style lang="less">
	.release {
		.ivu-select-dropdown {
			max-height: 300px;
		}
		.inputCopy {
			display: inline-block;
			width: 100%;
			height: 40px;
			line-height: 1.5;
			padding: 3% 7px;
			font-size: 14px;
			border: 1px solid #C7C7C7;
			border-radius: 2px;
			color: #c5c8ce;
			background-color: #fff;
			background-image: none;
			position: relative;
			cursor: text;
		}
	
		.mapbtn {
			float: right;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			position: relative;
			cursor: pointer;
		}
	
		.aa {
			display: inline-block;
			width: 100%;
			height: 40px;
			line-height: 1.5;
			padding: 4px 7px;
			font-size: 14px;
			border: 1px solid #C7C7C7;
			border-radius: 2px;
			color: #515a6e;
			background-color: #fff;
			background-image: none;
			position: relative;
			cursor: text;
			-webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
			transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
			transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
			transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
		}
		.imgFileList {
			li {
				margin-right: 15px;
				text-decoration: none;
				list-style: none;
				float: left;
				border: 1px solid #eee;
				border-radius: 5px;
				position: relative;

				.img {
					width: 92px;
					height: 92px;
					display: block;
				}

				.close {
					display: block;
					position: absolute;
					// top:0;
					// right:0;
					// display: block;
					width: 20px;
					// position: absolute;
					z-index: 99;
					right: -10px;
					top: -8px;
					// background:url('../../assets/img/hd7@2x.png') no-repeat fixed top;
				}
			}
		}

		.map {
			background: #ffffff;
			width: 800px;
			-webkit-box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			border-radius: 15px;
			position: fixed;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			z-index: 999;
			overflow: hidden;
			border: 5px solid #2168EB;
		}

		.tjpt {
			width: 326px;
			height: 185px;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
			border-radius: 8px;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 999;

			p {
				padding-top: 34px;
				font-size: 14px;
				line-height: 20px;
				text-align: center;
			}

			.btn {
				text-align: center;
				color: #ffffff;
				width: 90px;
				height: 28px;
				background: rgba(33, 104, 235, 1);
				border-radius: 14px;
				line-height: 28px;
				font-size: 14px;
				display: block;
				margin: 0 auto;
				margin-top: 29px;
			}
		}
		.w-e-toolbar {
			flex-wrap: wrap;
		}

		.w-e-toolbar .w-e-menu:nth-child(1) {
			z-index: 10115 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(2) {
			z-index: 10114 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(3) {
			z-index: 10113 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(4) {
			z-index: 10112 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(5) {
			z-index: 10111 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(6) {
			z-index: 10110 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(7) {
			z-index: 10109 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(8) {
			z-index: 10108 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(9) {
			z-index: 10107 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(10) {
			z-index: 10106 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(11) {
			z-index: 10105 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(12) {
			z-index: 10104 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(13) {
			z-index: 10102 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(14) {
			z-index: 10102 !important;
		}

		.w-e-toolbar .w-e-menu:nth-child(15) {
			z-index: 10101 !important;
		}

		padding-bottom: 47px;
		padding-top: 46px;
		width: 800px;
		margin: 0 auto;

		.dddwicon {
			position: absolute;
			top: 10px;
			right: -30px;
			cursor: pointer;
		}

		.posterUrl {
			width: 30px;
			height: 30px;
			border-style: ridge;
			margin-right: 10px;
		}

		.uploadpic {
			width: 350px;
			height: 194px;
			cursor: pointer;

			img {
				width: 350px;
				height: 194px;
				-webkit-border-radius: 5px;
				-moz-border-radius: 5px;
				border-radius: 5px;
			}

			background:#FAFAFA url("../../assets/img/pz@2x.png") no-repeat center center;
			border-radius:5px;
			border:1px solid #ddd;
		}

		.uploadpic_tips {
			font-size: 12px;
			color: #999999;
		}
		.cropper-content {
			display: flex;
			display: -webkit-flex;
			justify-content: flex-end;
			-webkit-justify-content: flex-end;
			.cropper {
				width: 380px;
				height: 380px;
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
					border-radius: 5px;
					border: 1px solid #cccccc;
					background: #cccccc;
					// margin-left: 40px;
				}
			}
		}
		.switch {
			justify-content: space-between;
			margin: 0 175px;
			display: flex;
			margin-bottom: 55px;

			img {
				vertical-align: middle;
				cursor: pointer;
				margin:-2px 0 0 4px;
			}
		}

		.formbtn {
			width: 205px;
			height: 48px;
			background: rgba(33, 104, 235, 1);
			border-radius: 27px;
			text-align: center;
			color: #ffffff;
			line-height: 48px;
			font-size: 14px;
			display: block;
			margin: 0 auto;
			margin-top: 24px;
			cursor: pointer;
		}

		.xy {
			text-align: center;
		}

		.radiobtn {
			text-align: center;
			font-size: 0;
			margin-bottom: 24px;

			img {
				display: none;
			}

			.active {
				border: 1px solid #2168eb;

				img {
					display: inline-block;
				}
			}

			span {
				cursor: pointer;
				font-size: 14px;
				display: inline-block;
				width: 442px;
				height: 36px;
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(199, 199, 199, 1);
				text-align: center;

				line-height: 36px;
				margin: 0 16px;
			}
		}

		.ivu-form-item-label {
			padding: 13px 12px 13px 0;
			text-align: left;
		}

		.input_label {
			margin: 0 175px;
			margin-bottom: 24px;


			.mc {
				.active {
					border-color: #2168eb;
					color: #2168eb;
					padding-right: 12px;

					img {
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
						position: absolute;
						z-index: 99;
						right: -15px;
						top: -8px;
					}

					img {
						display: none;
					}

					padding: 0 16px;
					padding-right: 32px;
					border: 1px solid #eee;
					-webkit-border-radius: 38px;
					-moz-border-radius: 38px;
					border-radius: 38px;
					height: 38px;
					line-height: 38px;
					text-align: center;
					margin: 7px;
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

			.mt {
				height: 20px;
				font-size: 14px;
				line-height: 20px;
				color: #999999;
				margin-bottom: 20px;

				.btn {
					float: right;
					// color: #2168eb;
				}
			}
		}

		.ivu-form-item {
			margin-left: 127px;
			margin-right: 175px;
		}

		.line {
			border-bottom: 1px dotted #DDDDDD;
			margin-bottom: 24px;
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
		.select{
			// position:relative;
			// z-index:100;
			.select-choose{
				width:398px;
				min-height:38px;
				border:1px solid rgb(220, 222, 226);
				padding: 0 24px 0 8px;
				position:relative;
				cursor:pointer;
				.item{
					float:left;
					padding: 0 0 0 8px;
					height:22px;
					line-height:22px;
					border: 1px solid #e8eaec;
					border-radius: 3px;
					background: #f7f7f7;
					margin: 3px 4px 3px 0;
					cursor:pointer;
					span{
						// margin-right:6px;
						display:inline-block;
						font-size:12px;
						color:#333333;
						max-width:350px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-right:6px;
					}
					img{
						height: 21px;
    				padding: 6px 6px 6px 0;
					}
				}
				.span{
					height: 38px;
					line-height: 38px;
					color: #c5c8ce;
					font-size: 14px;
				}
				.ivu-icon-ios-arrow-down{
					position: absolute;
					top: 37%;
					right:10px;
				}
			}
		}
	}
	.search-box {
		display: inline-block;
		position: absolute;
		// top: 15px;
		// left: 20px;
		border-style: solid
	}

	.amap-page-container {
		position: relative;
	}

	.btn {
		cursor: pointer;
	}
	.edit{
		.ivu-tag-text{
			margin-right:0 !important;
		}
		.ivu-icon-ios-close{
			display: none !important;
		}
	}
	.staffeit {
		.select-sort{
			position:relative;
			// top:40px;
			left:0;
			// width:398px;
			// height:382px;
			// border:1px solid rgb(220, 222, 226);
			background:#fff;
		}
		.tips {
			margin-top: 45px;
			text-align: center;
			font-size: 14px;
			color: #333333;
		}

		.btns {
			text-align: center;
			font-size: 0;
			padding-top: 20px;
			margin-bottom: 20px;

			.btn1 {
				border: 1px solid #999999;

			}

			.btn2 {
				border: 1px solid #2168EB;
				background: #2168eb;
				color: #ffffff;
			}

			.btn1,
			.btn2 {
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 16px;
				height: 28px;
				line-height: 28px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

		}

		.mc {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #eee;
			margin: 0 15px;
			display: flex;
			position: relative;

			.label {
				margin-left: 11px;
			}

			.right .label {
				float: left;
				margin-left: 0;
			}

			.ivu-checkbox-checked .ivu-checkbox-inner {
				background: #2d8cf0;
			}

			.ivu-checkbox-inner:after {
				transform: rotate(45deg) scale(1);
			}

			.ivu-checkbox-inner {
				-webkit-border-radius: 50%;
				-moz-border-radius: 50%;
				border-radius: 50%;
				background: #eeeeee;
				transform: scale(1.15);
			}

			.ivu-checkbox-wrapper {
				width: 100%;
			}

			.right .ivu-checkbox {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
			}

			.getcode {
				width: 30%;
				text-align: center;
				line-height: 40px;
				background: #2168eb;
				color: #fff;
			}
		}

		.mt {
			font-size: 16px;
			font-weight: bold;
			line-height: 16px;
			margin-top: 15px;
			margin-left: 15px;
			margin-bottom: 5px;
		}

		.username {
			width: 294px;
			height: 38px;
			background: #fafafa;
			display: block;
			margin: 0 auto;
			text-indent: 15px;
			line-height: 38px;
			margin-top: 11px;
		}

		.content {
			overflow: hidden;
			width:332px;
		}

		.title {
			height: 70px;
			background: #2168eb;
			font-size: 20px;
			color: #ffffff;
			line-height: 70px;
			text-align: center;
		}
		.bg{
			width:100%;
			height:28px;
			line-height:28px;
			text-align:center;
			background:rgba(251,251,251,1);
		}
	}
  .choose-org{
    .title{
      height:70px;
      .t-left{
        background:#1268EB;
        width:269px;
        cursor: pointer;
        text-align:left;
        .img{
          width:18px;
          height:18px;
          display: inline-block;
          vertical-align: middle;
          margin: 0 10px 0 20px;
        }
        span{
          display: inline-block;
        }

      }
      .t-right{
        background:#0E53BC;
        width:151px;
      }
    }
    .all{
      margin-left:20px;
      margin-top: 5px;
      cursor: pointer;
      .img{
        width:18px;
        height:18px;
        display: inline-block;
        vertical-align: middle;
        margin-right:9px;
      }
      span{
        display: inline-block;
        font-size:20px;
        vertical-align: middle;
        color:#333;
      }
    }
  }
</style>

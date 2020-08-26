<template>
	<div>
		<div class="w">
			<div class="position">人员管理
				<span @click="$router.back(-1)">返回</span>
			</div>

		</div>
		<div class="w bg staff" style="margin-top:1px;">
			<div class="warp staff" style="margin-top:1px;">
				<div class="leftcont">
					<Input placeholder="搜索" class="search" v-model="name">
						<img src="../assets/img/zzgl6@2x.png" slot="prefix" alt="" style="16px">
					</Input>
					<div class="menu">
						<div class="item " @click="tomenu(0)" :class="{active:menuactive==0}" v-if="adminNum!=4&& adminNum!=3">
							组织架构
						</div>
						<div class="item " @click="tomenu(4)" :class="{active:menuactive==4}" v-if="adminNum!=0&& adminNum!=3">
							组织架构
						</div>
						<div class="item " @click="tomenu(3)" :class="{active:menuactive==3}" v-if="adminNum!=0&& adminNum!=4">
							组织架构
						</div>
						<div class="item n" @click="tomenu(1)" :class="{active:show}">
							人员管理
						</div>
						<dl class="child" v-if="show">
							<dd :class="{active:!freezeshow}" @click="changeFreeze(false)">
								<span>成员列表</span>
							</dd>
							<dd :class="{active:freezeshow}" @click="changeFreeze(true)">
								<span>冻结用户</span>
							</dd>
						</dl>
						<div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">
							邀请加入
						</div>
					</div>
				</div>

				<!-- 从管理员添加界面跳转来的的组织架构，仅为添加管理员 -->
				<!--管理员添加跳转的组织架构-->
				<div class="rightcont" v-if="menuactive==4">
					<div class="tit">组织架构</div>
					<div class="table">
						<div class="mt">
							<div class="item">
								<input type="checkbox" v-model="allAdminAdd">
							</div>
							<div class="item" style="width: 240px">姓名</div>
							<div class="item" style="width: 140px">手机</div>
							<div class="item" style="width: 100px">部门</div>
							<div class="item" style="width: 100px">职务</div>

							<div class="item" style="width: 300px">
								<div class="addbtn" @click="tolayer(11)">添加用户</div>
							</div>
						</div>
						<!-- 暂时取消拖拽 -->
						<!-- 		<div class="mc" v-for="(value,index) in allusers.rows" style="overflow: hidden" v-dragging="{ item: value, list: allusers.rows, group: 'color' }"
					 :key="value.id"> -->

						<div class="mc" v-for="(value,index) in commonAdmin.rows" :key="index" style="overflow: hidden">
							<div class="item"><input type="checkbox" :value="value.id " v-model="adminAdd"/></div>
							<div class="item" style="width: 240px">{{ value.userName }}</div>
							<div class="item" style="width: 140px">{{ value.telphone }}</div>
							<div class="item" :title="value.identityAuthName" style="width: 100px">{{ value.identityAuthName }}</div>
							<div class="item" style="width: 100px">{{ value.orgPositions }}</div>

							<div class="item" style="width: 300px">
								<!-- <span class="link" @click="edittolayer(value)">编辑</span>
							<span class="link" @click="editpower(value)">权限设置</span>
							<span class="link" v-if="value.isFreeze==0||value.isFreeze==''||value.isFreeze==null" @click="freeze(value)">冻结</span>
							<span class="link" v-if="value.isFreeze==1" @click="freeze(value)">解冻</span>
							<span class="link" @click="getout(value)">移出组织</span> -->
							</div>
						</div>
						<Page v-if="commonAdmin.rows" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="commonAdmin.total"
						 @on-change="addcommonadmin" show-elevator :page-size="pageSize" :show-total="true" />
						<div class="addbtn saveBtn" @click="tolayer(14)">提交管理员名单</div>

					</div>

				</div>




				<!-- 从管理员添加界面跳转来的的组织架构，仅为添加  主 管理员 -->
				<!--管理员添加跳转的组织架构-->
				<div class="rightcont" v-if="menuactive==3">
					<div class="tit">组织架构</div>
					<div class="table">
						<div class="mt">
							<div class="item">
								<!-- <input type="checkbox" v-model="allAdminAdd"> -->
							</div>
							<div class="item" style="width: 240px">姓名</div>
							<div class="item" style="width: 140px">手机</div>
							<div class="item" style="width: 100px">部门</div>
							<div class="item" style="width: 100px">职务</div>

							<div class="item" style="width: 300px">
								<!-- 	<div class="btn">
								<router-link to="/tolead">
									<span class="link" style="color: white;">导入</span>
								</router-link>
							</div>
							<div class="btn">
								<router-link to="/everywhere">
									<span class="link" style="color: white;">导出</span>
								</router-link>
							</div> -->
								<div class="addbtn" @click="tolayer(12)">添加用户</div>
							</div>
						</div>
						<!-- 暂时取消拖拽 -->
						<!-- 		<div class="mc" v-for="(value,index) in allusers.rows" style="overflow: hidden" v-dragging="{ item: value, list: allusers.rows, group: 'color' }"
					 :key="value.id"> -->

						<div class="mc" v-for="(value,index) in mainAdmin.rows" :key="index" style="overflow: hidden">
							<div class="item"><input type="radio" :value="value.id " v-model="adminAdd"></div>
							<div class="item" style="width: 240px">{{ value.userName }}</div>
							<div class="item" style="width: 140px">{{ value.telphone }}</div>
							<div class="item" style="width: 100px" :title="value.identityAuthName">{{ value.identityAuthName }}</div>
							<div class="item" style="width: 100px">{{ value.orgPositions }}</div>

							<div class="item" style="width: 300px">
								<!-- <span class="link" @click="edittolayer(value)">编辑</span>
							<span class="link" @click="editpower(value)">权限设置</span>
							<span class="link" v-if="value.isFreeze==0||value.isFreeze==''||value.isFreeze==null" @click="freeze(value)">冻结</span>
							<span class="link" v-if="value.isFreeze==1" @click="freeze(value)">解冻</span>
							<span class="link" @click="getout(value)">移出组织</span> -->
							</div>
						</div>
						<Page v-if="mainAdmin.rows" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="mainAdmin.total"
						 @on-change="addMainadmin()" show-elevator :page-size="pageSize" :show-total="true" />
						<div class="addbtn saveBtn" @click="openlayer(adminAdd)">提交主管理员</div>

					</div>

				</div>

				<!-- 组织架构-->
				<div class="rightcont" v-if="menuactive==0">
					<h2 v-if="step==2" style="color:black">{{ position.structure }}</h2>
					<a src="javascript/viod(0)" @click="setStep(1)" v-if="step==2">{{ currentOrgName  }}</a> <span v-if="step==2">{{'>' + position.structure }}</span>
					<div v-if="menuactive==0&&step==1">
						<div class="tit">部门设置</div>
						<div class="table">
							<div class="mt">
								<div class="item">序号</div>
								<div class="item" style="width: 540px">部门</div>
								<div class="item">
									<div class="addbtn" @click="tolayer(6)">添加部门</div>
								</div>
							</div>

							<div class="mc hand" v-for="(value,index) in orgStructureListDtos" :key="index" style=" overflow:hidden" v-dragging="{ item: value, list: orgStructureListDtos, group:'orgStructureListDtos'}">
								<div>
									<div class="item" @click="getUser( value )">{{ index+1 }}</div>
									<div class="item" @click="getUser( value )" style=" overflow:hidden">{{ value.structure }} ({{ value.structureNumber }})
									</div>
									<div class="item">
										<span class="edit" @click="editname( value )"><img src="../assets/img/zzgl7@2x.png" alt=""></span>

										<span class="del" @click="dellayer(value)"><img src="../assets/img/zzgl8@2x.png" alt=""></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="menuactive==0&&step==2">
						<div class="tit">职务设置</div>
						<div class="table">
							<div class="mt">
								<div class="item">序号</div>
								<div class="item" style="width: 140px;text-align: center">姓名</div>
								<div class="item" style="width: 140px;text-align: center">手机号</div>
								<div class="item" style="width: 165px;text-align: left">职务</div>
								<div class="item">
									<div class="btnD hand" @click="editname( position )" style="color: black;width:60px">设置部门</div>
									<div class="addbtn" @click="tolayer(8)">添加人员</div>
								</div>
							</div>
							<div class="mc" v-if="users.length==0">
								<div class="item" style="width: 440px">
									暂无数据
								</div>
							</div>
							<div class="mc" v-for="(user,index) in users" :key='index'>
								<div class="item">{{ (pageNumber-1)*10+index }}</div>
								<div class="item" style="width: 140px;text-align: center">{{ user.userName }}</div>
								<div class="item" style="width: 140px;text-align: center">{{ user.telphone }}</div>
								<div class="item" style="width: 200px;text-align: left">{{ user.orgPositions }}</div>
								<div class="item">

									<span class="link" @click="edittolayer(user)">编辑</span>
									<span class="link" @click="getout(user)" v-if="user.isSupervisor!=1">移出组织</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--人员管理-->
				<div class="rightcont" v-if="menuactive==1">
					<div v-if="!freezeshow && layer!=1">
						<div class="rightcont-top clear">
							<div class="tit fl">人员列表</div>
							<div class="item fr" style="width: 430px;text-align: right;line-height: 40px;">
								<div class="btnD">
									<router-link :to="{path: '/tolead', query: {path:'/staff/1'}}" style="color: #333333;display:inline-block;">
										<span class="link">批量导入</span>
									</router-link>
								</div>
								<div class="btnD">
									<router-link :to="{path: '/everywhere', query: {path:'/staff/1'}}" style="color: #333333;display:inline-block;">
										<span class="link">批量导出</span>
									</router-link>
								</div>
								<div class="addbtn" @click="tolayer(8)">添加</div>
							</div>
						</div>
						<div class="table">
							<div class="mt" style="padding-right:0px">
								<div class="item" style="min-width:45px;width:45px">序号</div>
								<div class="item" style="width: 60px">姓名</div>
								<div class="item" style="width: 100px">手机号</div>
								<div class="item" style="min-width:54px;width:54px">性别</div>
								<div class="item" style="width: 67px">部门</div>
								<div class="item" style="width: 106px">身份证号</div>
								<div class="item" style="width: 89px">社团职务</div>
								<div class="item" style="width: 144px">所属企业</div>
								<div class="item" style="min-width:45px;width:45px">操作</div>
								<!-- <div class="item" style="width: 430px;text-align: right;">
									<div class="btnD">
										<router-link :to="{path: '/tolead', query: {path:'/staff/1'}}">
											<span class="link" style="color: black;display:inline-block;">批量导入</span>
										</router-link>
									</div>
									<div class="btnD">
										<router-link :to="{path: '/everywhere', query: {path:'/staff/1'}}">
											<span class="link" style="color: black;display:inline-block;">批量导出</span>
										</router-link>
									</div>
									<div class="addbtn" @click="tolayer(8)" style="text-align: right;padding-left: 20px;padding-right: 20px;margin-bottom: 3px;">添加</div>
								</div> -->
							</div>

							<div class="mc hand" v-for="(value,index) in allusers.rows" style="overflow: hidden;padding-right: 0px; "
							 v-dragging="{ item: value, list: allusers.rows,group:'alluserslist'}" :key="value.id">
								<!-- <div class="mc" v-for="(value,index) in allusers.rows" style="overflow: hidden"> -->
								<div class="item hand" style="min-width:45px;width:45px" @dblclick="test(index)" title="双击修改序号">{{value.sort}}</div>
								<div class="item" style="width: 60px" :title="value.userName">{{ value.userName }}</div>
								<div class="item color" style="width: 100px" :title="value.telphone">{{ value.telphone }}</div>
								<div class="item color" style="min-width:54px;width:54px" :title="value.sexName">{{ value.sexName }}</div>
								<div class="item color" style="width: 67px" :title="value.identityAuthName">{{ value.identityAuthName }}</div>
								<div class="item color" style="width: 106px" :title="value.idCard">{{ value.idCard1 }}</div>
								<div class="item color" style="width: 89px" :title="value.orgPositions">{{ value.orgPositions }}</div>
								<div class="item color" style="width: 144px" :title="value.company">{{ value.company }}</div>
								<div class="item color" style="min-width:45px;width:45px">

									<span class="link" style="display:inline">
										<Poptip  placement="bottom-end">
											更多
											<div slot="content">
												<span class="link" @click="getDetail(value)" v-if="value.isFreeze!=1">查看更多</span>
												<span class="link" @click="edittolayer(value)" v-if="value.isFreeze!=1">编辑成员</span>
												<span class="link" @click="editpowerMsg(value)" v-if="value.isSupervisor!=1&&value.isFreeze!=1">权限设置</span>
												<span class="link" v-if="value.isSupervisor!=1&&value.isFreeze!=1" @click="freeze(value)">冻结</span>
												<span class="link" v-if="value.isFreeze==1" @click="freeze(value)">解冻</span>
												<span class="link" @click="getout(value)" v-if="value.isSupervisor!=1">移出组织</span>
											</div>
										</Poptip>
									</span>
									<!-- <span class="link" @click="edittolayer(value)" v-if="value.isFreeze!=1">编辑成员</span>
									<span class="link" @click="editpowerMsg(value)" v-if="value.isSupervisor!=1&&value.isFreeze!=1">权限设置</span>
									<span class="link" v-if="value.isSupervisor!=1&&value.isFreeze!=1" @click="freeze(value)">冻结</span>
									<span class="link" v-if="value.isFreeze==1" @click="freeze(value)">解冻</span>
									<span class="link" @click="getout(value)" v-if="value.isSupervisor!=1">移出组织</span> -->
								</div>
							</div>
							<div style="font-size:12px;margin-top:5px;color:#999999;">您的组织通过手机端进行认证后，可以在导入成员名单时批量建立会员企业</div>
							<Page v-if="allusers.rows" :current.sync="pageNumber" style="text-align: right;margin-top: 10px;" :total="allusers.total"
							 @on-change="tomenu(1)" show-elevator :page-size="pageSize" :show-total="true" />
						</div>
					</div>
					<!-- 编辑成员 -->
					<div v-if="!freezeshow && layer==1">
						<div class="tit">编辑成员</div>
						<div class="mc useredit-box clear">
							<div class="mt fl useredit-title">用户名</div>
							<Input type="text" class="useredit" placeholder="请填写姓名" v-model="groupNickname"/>
						</div>
						<!-- <div class="mc clear useredit-box">
							<div class="mt fl useredit-title">企业名称</div>
							<Input type="text" class="useredit" placeholder="请填写" v-model="company"/>
						</div>
						<div class="mc clear useredit-box">
							<div class="mt fl useredit-title">企业职务</div>
							<Input type="text" class="useredit" placeholder="请填写" v-model="companyPositions"/>
						</div> -->
						<div class="line"></div>
						<div class="mc clear useredit-box">
							<div class="mt fl useredit-title">{{defOrg.orgType ==1?'商会部门':(defOrg.orgType ==2?'协会部门':'部门设置')}}</div>

							<span v-if="EdStructureList.length==0">暂无部门</span>
							<div  style="height: 120px; width:350px; overflow-y: auto;color:#000" v-if="EdStructureList.length!=0">
								<div class="mc usereditmc" v-for="(v,i) in EdStructureList" v-if="i >= 0" :key='i' style="border-bottom: 1px solid #eeeeee;margin:0 15px 0;">
									<Checkbox class="right" v-model="EdStructureList[i].checked" label="">{{v.structure}}</Checkbox>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="mc clear useredit-box">
							<div class="mt fl useredit-title">{{defOrg.orgType ==1?'商会职务':(defOrg.orgType ==2?'协会职务':'职务设置')}}</div>
							<Input type="text" class="useredit" v-model="structurePositions">{{ staff.orgPositions }}</Input>
						</div>
						<div class="line"></div>
						<div class="mt">
						<span class="mt-left" style="color:#333333;padding-right:30px;">手机号隐藏</span> 
						<Switchs :value="isHideTel?true:false" @on-change="changePhone" size="small"/>
						</div>
						<div class="mc-phone">
							<div class="text">开启后，手机号对除组织管理员外的所有成员</div>
						</div>
						<div class="usereditbtns">
							<div class="usereditbtn1" @click="tolayer(0)">取消</div>
							<div class="usereditbtn2" @click="editstaff()">确定</div>
						</div>
					</div>
					<div v-if="freezeshow">
						<div class="tit">冻结列表</div>
						<div class="table">
							<div class="mt">
								<div class="item">序号</div>
								<div class="item" style="width: 106px">姓名</div>
								<div class="item" style="width: 170px">手机号</div>
								<div class="item" style="width: 100px">性别</div>
								<div class="item" style="width: 60px">部门</div>
								<div class="item" style="width: 270px">身份证号</div>
								<div class="item" style="width: 280px">社团职务</div>
								<!-- <div class="item" style="width: 300px">
								</div> -->
							</div>
							<!-- 暂时取消拖拽 -->
							<!-- 		<div class="mc" v-for="(value,index) in allusers.rows" style="overflow: hidden" v-dragging="{ item: value, list: allusers.rows, group: 'color' }"
					 :key="value.id"> -->
					 		<div class="mc">
								<div class="item" style="width: 670px;text-align:center" v-if="allfreezeusers.total==0">暂无数据</div>
							 </div>
							<div class="mc" v-for="(value,index) in allfreezeusers.rows" :key="index" style="overflow: hidden" v-if="allfreezeusers.total!=0">
								<div class="item">{{value.sort}}</div>
								<div class="item" style="width: 70px">{{ value.userName }}</div>
								<div class="item" style="width: 120px">{{ value.telphone }}</div>
								<div class="item" style="width: 60px" :title="value.sexName">{{ value.sexName }}</div>
								<div class="item" style="width: 70px" :title="value.identityAuthName">{{ value.identityAuthName }}</div>
								<div class="item" style="width: 180px">{{ value.idCard }}</div>
								<div class="item" style="width: 70px">{{ value.orgPositions }}</div>
								<div class="item" style="width: 120px">
									<!-- <span class="link" @click="edittolayer(value)">编辑</span>
							<span class="link" @click="editpower(value)">权限设置</span> -->
									<span class="link" v-if="value.isFreeze==0||value.isFreeze==''||value.isFreeze==null" @click="freeze(value)">冻结</span>
									<span class="link" v-if="value.isFreeze==1" @click="freeze(value)">解冻</span>
									<span class="link" @click="getout(value)">移出组织</span>
								</div>
							</div>
							<Page v-if="allfreezeusers.rows" :current.sync="freezepageNumber" style="text-align: right;margin-top: 20px;"
							 :total="allfreezeusers.total" @on-change="ChangefreezeUsers(1)" show-elevator :page-size="freezepageSize"
							 :show-total="true" />
						</div>
					</div>
				</div>
				<!--邀请加入-->
				<div class="rightcont" v-if="menuactive==2">
					<div class="tit">填写邀请信息</div>
					<div class="share_t2">邀请将通过短信的形式发送给被邀请人</div>
					<div class="share_tips">
						<div class="t">短信效果图 </div>
						<img src="../assets/img/dxzs@2x.png" alt="" class="pic" style="width:160px">
					</div>
					<Form :model="formItem" :rules="formdaterule" class="form" :label-width="130">
						<FormItem label="被邀请人姓名：" prop="name">
							<Input placeholder="请填姓名" v-model="formItem.name" :maxlength="12">{{ formItem.name }} </Input>
						</FormItem>
						<FormItem label="被邀人手机号：" prop="telphone">
							<Input placeholder="请填手机号" v-model="formItem.telphone" :maxlength="11">{{ formItem.telphone }}</Input>
						</FormItem>
						<FormItem label="邀请文案：">
							<Input type="textarea" :autosize="{minRows: 4,maxRows: 8}" readonly="readonly" placeholder="#管理员姓名#邀请你加入#青岛浙江商会#组织，请尽快完成一起来往App下载，并用您的“1658****888”手机号登录激活。"></Input>
						</FormItem>
						<FormItem>
							<div class="btn" @click="invitation()">邀请</div>
						</FormItem>
					</Form>

				</div>
				<div class="cl"></div>
			</div>
			<!-- 添加部门  弹窗 -->
			<div class="layer staffeit" v-if="layer==6">

				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">添加部门</div>
					<!-- <div class="mt">部门设置</div> -->

					<div class="mt" style="margin: 20px;">

						<p>*</p>部门名称
					</div>
					<div class="mc">
						<Input v-model="structure" placeholder="请填部门名称" :maxlength="12"/>
					</div>
					<div class="mc">
						<Checkbox v-model="isChat">
							<span>是否为此部门单独设立群聊</span>
						</Checkbox>
					</div>
					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="submit(6)">确定</div>
					</div>
				</div>
			</div>


			<!-- 修改部门名称  弹窗 -->
			<div class="layer staffeit" v-if="layer==7">

				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">修改部门</div>
					<div class="mt">部门设置</div>
					<div class="mt">
						<p>*</p>部门名称
					</div>
					<div class="mc">
						<Input v-model="structure" placeholder="请填部门名称"></Input>
					</div>
					<div class="mc">
						<Checkbox class="right" v-model="isChat">
							<span class="label">是否为此单独设立群聊</span>
						</Checkbox>
					</div>
					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="edits()">确定</div>
					</div>
				</div>
			</div>

			<!-- 添加用户  弹窗 -->
			<div class="layer staffeit" v-if="layer==8">
				<!-- <div class="mask" @click="tolayer(0)"></div> -->
				<div class="content" style="height: auto;min-height: 60px; width:300px">
					<div class="title">添加成员</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>姓名
						</div>
						<Input placeholder="请填写姓名" v-model="adduser.applyName"/>
					</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>手机号
						</div>
						<Input placeholder="手机号" v-model="adduser.applyTel"/>
					</div>
					<div class="mt" style="width: 90px;font-size: 13px;">

					</div>
					<div class="mc right" style="height:auto;min-height:40px;">
						<div class="text-label" style="text-align: right;">
							<p></p>设置部门
						</div>
						<Select multiple v-model="adduser.structureList" style="overflow-y: auto;max-height: 164px;">
							<!-- <Option :value="position.id" selected="true" >{{ position.structure }}</Option> -->
							<Option :value="item.id" v-for="(item,index) in orgStructureListDtos" :key="index">
								{{ item.structure }}
							</Option>
						</Select>
					</div>

					<div class="mc">
						<div class="text-label" style="text-align: right;">
							<p></p>设置职务
						</div>
						<Input placeholder="请输入职务（例：秘书长）" v-model="adduser.orgPositions"/>
					</div>

					<div class="mc">
						<div class="text-label" style="text-align: right;">
							<p></p>所属企业
						</div>
						<Input placeholder="" v-model="adduser.company"/>
					</div>

					<span style="margin-left: 16px;font-size:12px;font-family:'PingFangSC-Regular,PingFang SC';color:#999999;font-weight:400;display: inline-block;">
						标记
						<p style="display:inline-block;color:#DC1A00;font-size:16px;vertical-align: middle;">*</p>
						为必填内容
					</span>

					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="makeadduser()">保存</div>

					</div>
				</div>
			</div>


			<!--弹框-->
			<!-- <div class="layer staffeit" v-if="layer==1">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">编辑成员</div>
					<div class="mt">用户名</div>
					<div class="mc">
						<Input type="text" class="useredit" placeholder="请填写姓名" v-model="groupNickname"/>
					</div>
					<div class="mt">企业名称</div>
					<div class="mc">
						<Input type="text" class="useredit" placeholder="请填写" v-model="company"/>
					</div>
					<div class="mt">企业职务</div>
					<div class="mc">
						<Input type="text" class="useredit" placeholder="请填写" v-model="companyPositions"/>
					</div>
					<div class="mt">{{defOrg.orgType ==1?'商会部门':(defOrg.orgType ==2?'协会部门':'部门设置')}}</div>

					<div class="mc" v-if="EdStructureList.length==0">
						<span>暂无部门</span>
					</div>
					<div style="height: 120px; overflow-y: auto;color:#000" v-if="EdStructureList.length!=0">
						<div class="mc" v-for="(v,i) in EdStructureList" v-if="i >= 0" :key='i' style="border-bottom: 1px solid #eeeeee;margin:0 15px 0;">
							<Checkbox class="right" v-model="EdStructureList[i].checked" label="">{{v.structure}}</Checkbox>
						</div>
					</div>


					<div class="mt">{{defOrg.orgType ==1?'商会职务':(defOrg.orgType ==2?'协会职务':'职务设置')}}</div>
					<div class="mc">
						<Input type="text" class="useredit" v-model="structurePositions">{{ staff.orgPositions }}</Input>
					</div>
					<div class="mt">
						<span class="mt-left">手机号隐藏</span> 
						<Switchs :value="isHideTel?true:false" @on-change="changePhone" size="small"/>
					</div>
					<div class="mc-phone">
						<div class="text">开启后，手机号对除组织管理员外的所有成员</div>
					</div>
					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="editstaff()">确定</div>
					</div>
				</div>
			</div> -->



			<div class="layer staffeit" v-if="layer==2">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">权限设置</div>
					<div class="username">
						用户名：{{ uMsg.userName }}
					</div>
					<div style="height: 210px; overflow-y: auto;">

						<div class="mc">
							<Checkbox v-model="allpowerss">全部权限</Checkbox>
						</div>
						<div class="mc" v-for="(v,i) in powers" v-if="i>=0">
							<Checkbox v-model="powers[i].checked" label="" @on-change="closeAllPowers">{{v.name}}</Checkbox>
						</div>

					</div>



					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="makepower()">确定</div>
					</div>
				</div>
			</div>



			<!-- 删除部门 -->

			<div class="layer staffeit" v-if="layer==9">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">删除部门</div>
					<div class="tips">确认将该部门从组织中移出吗</div>
					<div class="btns">
						<div class="btn1" @click="del(delPartMgs)">确认移出</div>
						<div class="btn2" @click="tolayer(0)">我再想想</div>
					</div>
				</div>
			</div>
			<!-- 编辑序号 -->
			<div class="layer staffeit" v-if="layer==10">
				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">修改序号</div>
					<div class="tips">要修改{{ sortsetObj.userName }}的序号由{{ sortsetObj.sort}}改为
						<div class="mc">
							<input class="sortnum" step="0.1" required="" v-model="newsort"></input>
						</div>

					</div>
					<div class="btns">

						<div class="btn1" @click="tolayer(0)">我再想想</div>
						<div class="btn2" @click="save()">确认修改</div>
					</div>
				</div>
			</div>

			<!-- 添加组织外的管理员 -->
			<div class="layer staffeit" v-if="layer==11">

				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">添加组织外管理员</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>用户姓名
						</div>
						<Input placeholder="请填写姓名" v-model="adduser.applyName" :maxlength="11"></Input>
					</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>手机号
						</div>
						<Input placeholder="手机号" v-model="adduser.applyTel" :maxlength="11"></Input>
					</div>


					<div class="mt" style="width: 90px;font-size: 13px;">

					</div>
					<div class="mc" style="height:auto;min-height:40px;">
						<div class="text-label">
							<p></p>部门设置
						</div>
						<Select multiple v-model="adduser.structureList" style="overflow-y: auto;max-height: 164px;">
							<!-- <Option :value="position.id" selected="true" >{{ position.structure }}</Option> -->
							<Option :value="item.id" v-for="(item,index) in orgStructureListDtos" :key="index">
								{{ item.structure }}
							</Option>
						</Select>
					</div>
					<div class="mc">
						<div class="text-label">
							<p></p>职务设置
						</div>
						<Input placeholder="职务" :maxlength="14" v-model="adduser.orgPositions"></Input>
					</div>
					<div class="btns">
						<div class="btn1" @click="tolayer(0)">取消</div>
						<div class="btn2" @click="makeaddadmin()">确定</div>
					</div>
				</div>
			</div>


			<!-- 更换组织外的管理员 -->
			<div class="layer staffeit" v-if="layer==12">

				<div class="mask" @click="tolayer(0)"></div>
				<div class="content">
					<div class="title">添加组织外主管理员</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>用户姓名
						</div>
						<Input placeholder="请填写姓名" v-model="adduser.applyName" :maxlength="12"></Input>
					</div>
					<div class="mc">
						<div class="text-label">
							<p>*</p>手机号
						</div>
						<Input placeholder="手机号" v-model="adduser.applyTel" :maxlength="11"></Input>
					</div>
					<d<div class="mt" style="width: 90px;font-size: 13px;">

				</div>
				<div class="mc" style="height:auto;min-height:40px;">
					<div class="text-label">
						<p></p>部门设置
					</div>
					<Select multiple v-model="adduser.structureList" style="overflow-y: auto;max-height: 164px;">
						<!-- <Option :value="position.id" selected="true" >{{ position.structure }}</Option> -->
						<Option :value="item.id" v-for="(item,index) in orgStructureListDtos" :key="index">
							{{ item.structure }}
						</Option>
					</Select>

				</div>
				<div class="mc">
					<div class="text-label">
						<p></p>职务设置
					</div>
					<Input placeholder="职务" :maxlength="14" v-model="adduser.orgPositions"></Input>
				</div>
				<div class="mc">
					<div class="text-label">
						<p>*</p>验证码
					</div>
					<Input type="text" v-model="verificationCode" placeholder="请输入验证码" style="width: 70%" :maxlength="6"> </Input>
					<div class="getcode" @click="getCode">{{isGetting?time+'s':'发送验证码'}}</div>
				</div>
				<div class="btns">
					<div class="btn1" @click="tolayer(0)">取消</div>
					<div class="btn2" @click="addadmin()">确定</div>
				</div>
			</div>
		</div>
		<!-- 主管理员安全认证，认证组织内的用户 手机验证 -->
		<div class="layer staffeit" v-if="layer==13">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title">安全认证</div>
				<div class="mt">
					<p>*</p>手机号
				</div>
				<div class="mc">
					{{ AdminUser.telphone }}

				</div>
				<div class="mt">
					<p>*</p>验证码
				</div>
				<div class="mc">
					<Input type="text" v-model="verificationCode" placeholder="请输入验证码" style="width: 229px;"> </Input>
					<div class="getcode hand" @click="getCode">{{isGetting?time+'s':'发送验证码'}}</div>
				</div>
				<div class="btns">
					<div class="btn1" @click="addAdminInOrg()">提交</div>
					<div class="btn2" @click="tolayer(0)">我再想想</div>
				</div>
			</div>
		</div>


		<!-- 添加二次确认，管理员确认 -->
		<div class="layer staffeit" v-if="layer==14">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title">安全提示</div>
				<div class="tips">确认将选中的用户更改为 <p v-if="menuactive==3">主</p>管理员吗 </div>
				<div class="btns">
					<div class="btn1" @click="submitAddAdmin()">确定</div>
					<div class="btn2" @click="tolayer(0)">我再想想</div>
				</div>
			</div>
		</div>

		<!-- 添加二次确认，更改权限 -->
		<div class="layer staffeit" v-if="layer==15">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title">安全提示</div>
				<div class="tips">更改权限会将选中的用户更改为 <p v-if="menuactive==3">主</p>管理员,是否继续</div>
				<div class="btns">
					<div class="btn1" @click="editpower(uMsg)">继续</div>
					<div class="btn2" @click="tolayer(0)">我再想想</div>
				</div>
			</div>
		</div>

		<!-- 查看更多  弹窗 -->
		<div class="layer staffeit" v-if="layer==16">
			<div class="content" style="height: auto;min-height: 60px;">
				<div class="title">序号{{itemDetail.sort}}</div>
				<div class="layer-top">姓名：{{itemDetail.userName}}</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">手机号</div>
					<div class="layer-cont-r fl">{{itemDetail.telphone}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">性别</div>
					<div class="layer-cont-r fl">{{itemDetail.sexName}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">部门</div>
					<div class="layer-cont-r fl">{{itemDetail.identityAuthName}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">社团职务</div>
					<div class="layer-cont-r fl">{{itemDetail.orgPositions}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">身份证号</div>
					<div class="layer-cont-r fl">{{itemDetail.idCard}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">邮箱</div>
					<div class="layer-cont-r fl">{{itemDetail.mail}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">单位名称</div>
					<div class="layer-cont-r fl">{{itemDetail.company}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl height">成员到期时间</div>
					<div class="layer-cont-r fl">{{itemDetail.expireDate? itemDetail.expireDate.substring(0,10).replace(/-/g, ".") :''}}</div>
				</div>
				<div class="layer-cont clear">
					<div class="layer-cont-l fl">生日</div>
					<div class="layer-cont-r fl">{{itemDetail.birthday? itemDetail.birthday.substring(0,10).replace(/-/g, ".") : ''}}</div>
				</div>
				<!-- <div class="mc">
					<div class="text-label">
						<p>*</p>姓名
					</div>
					<Input placeholder="请填写姓名" v-model="adduser.applyName"></Input>
				</div>
				<div class="mc">
					<div class="text-label">
						<p>*</p>手机号
					</div>
					<Input placeholder="手机号" v-model="adduser.applyTel"></Input>
				</div>
				<div class="mt" style="width: 90px;font-size: 13px;">

				</div> -->
				<!-- <div class="mc right" style="height:auto;min-height:40px;">
					<div class="text-label" style="text-align: right;">
						<p></p>设置部门
					</div>
					<Select multiple v-model="adduser.structureList" style="overflow-y: auto;max-height: 164px;"> -->
						<!-- <Option :value="position.id" selected="true" >{{ position.structure }}</Option> -->
						<!-- <Option :value="item.id" v-for="item in orgStructureListDtos">
							{{ item.structure }}
						</Option>
					</Select>


				</div> -->
				<!-- <div class="mc">
					<div class="text-label" style="text-align: right;">
						<p></p>设置职务
					</div>
					<Input placeholder="职务" v-model="adduser.orgPositions"></Input>
				</div> -->
				<!-- <span style="margin-left: 16px;font-size:12px;font-family:'PingFangSC-Regular,PingFang SC';color:#999999;font-weight:400;display: inline-block;">标记<p
						style="display:inline-block;color:#DC1A00;font-size:16px;vertical-align: middle;">*</p>为必填内容</span> -->

				<div class="btns new">
					<div class="btn2" @click="tolayer(0)">确定</div>
					<!-- <div class="btn2" @click="makeadduser()">保存</div> -->

				</div>
			</div>
		</div>



		<div class="layer staffeit" v-if="layer==3">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title">移出组织</div>
				<div class="tips">确认将{{ staff.userName }}从{{ defOrg.orgName }}组织中移出</div>
				<div class="btns">
					<div class="btn1" @click="makegetout()">确认移出</div>
					<div class="btn2" @click="tolayer(0)">我再想想</div>
				</div>
			</div>
		</div>
		<div class="layer staffeit" v-if="layer==4">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content" v-if="staff.isFreeze==0||staff.isFreeze==''||staff.isFreeze==null">
				<div class="title">冻结成员账号</div>
				<div class="tips">冻结成功后，该成员不可访问该组织任何页面</div>
				<div class="btns">
					<div class="btn1" @click="tolayer(0)">我再想想</div>
					<div class="btn2" @click="makefreeze(1)">确认冻结</div>
				</div>
			</div>
			<div class="content" v-if="staff.isFreeze==1">
				<div class="title">解冻成员账号</div>
				<div class="tips">解冻成功后，该成员可访问改组织任何页面</div>
				<div class="btns">
					<div class="btn1" @click="tolayer(0)">我再想想</div>
					<div class="btn2" @click="makefreeze(2)">确认解冻</div>
				</div>
			</div>
		</div>

		<div class="layer staffeit" v-if="layer==5">
			<div class="mask" @click="tolayer(0)"></div>
			<div class="content">
				<div class="title">无法访问</div>
				<div class="tips" style="width: 154px;margin: 0 auto;margin-top: 33px;">您的组织身份已被冻结，
					请联系组织管理员处理。</div>
				<div class="btns">
					<div class="btn2" @click="tolayer(0)">我已知晓</div>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
	export default {
		name: 'organizeManage',

		mounted() {
            // 页面table的拖拽
            this.$dragging.$on('dragged', ({
                value
            }) => {
                //                 console.log("----------------1------------------------------------------")
                //                 console.log(value)
                //                 console.log("-----------------2-----------------------------------------")
                //                 // 新的页面数据
                // 
                //                 // 将新页面数据，按照当前顺序，依次修改orgUserList的id，保持sort不变 字段可能不对
                // 
                //                 var arr = []
                //                 for (var i = 0; i < value.list.length; i++) {
                //                     // 新的id
                //                     // 原来的序号
                //                     var a = new Object()
                //                     a.id = value.list[i].id
                //                     a.sort = this.orgUserList[i].sort
                //                     arr.push(a)
                //                 }
                // 
                //                 // 循环新的列表,发送给后台
                //                 this.orgUserList = arr
                //                 // this.setSorts()
                //                 console.log("----------------dayinshuju ------------------------------")
                //                 console.log(arr)
                //                 console.log("----------------dayinshhuju--------------------------------")
            })
            this.$dragging.$on('dragend', (value) => {
                // this.flash(1)
                if(value.group == 'alluserslist'){
                    var arr = []
                    for (var i = 0; i < this.allusers.rows.length; i++) {
                        // 新的id
                        // 原来的序号
                        var a = new Object()
                        a.id = this.allusers.rows[i].id
                        a.sort = this.orgUserList[i].sort
                        arr.push(a)
                    }
                    // 循环新的列表,发送给后台
                    this.orgUserList = arr
                    this.setSorts()
                }else if(value.group == 'orgStructureListDtos'){
                    var arr = [];
                    for( var item of this.orgStructureListDtos){
                        arr.push(item.id)
                    }
                    this.http.ajax({
                        url: 'webSite/orgStructure/orgStructureMove',
                        method: 'post',
                        headers: {
                            'Content-Type': ' application/json'
                        },
                        data: {
                            "structureList": arr
                        }
 
                    }).then(res => {
                        layer.msg(res.msg)
                        this.flash(1)
                    })
                }
            })
        },
		data() {
			return {
				// 表单校验规则
				formdaterule: {
					name: [{
						required: true,
						message: '被邀人姓名不能为空',
						trigger: 'blur|change'
					}],
					telphone: [{
						required: true,
						message: '被邀人手机号不能为空！',
						trigger: 'blur|change'
					}]
				},
				// 二级菜单展示
				show: false,
				// 组织架构显示页面重构
				//部门显示--------部门人员显示---添加该部门所属人员
				// step==1表示显示部门      2人员
				step: 1,
				// 部门名称
				positionName: "",
				currentOrgName: "",
				// 更换主管理员
				// 验证码
				verificationCode: '',
				// 倒计时
				time: 60,
				// 是否获取到验证码
				isGetting: false,
				// 用户信息保存在adduser中

				allAdminAdd: false,
				// 添加管理员数组
				adminAdd: [],
				// 区分为正常人员跳转还是管理员添加跳转
				adminNum: 0,
				// 序号临时保存
				sortsetObj: {
					newsort: ''
				},
				// 临时序号
				newsort: '',
				//表单
				formItem: {
					name: "",
					telphone: ""
				},
				//部门信息
				orgStructureListDtos: [],
				menuactive: 0,
				layer: 0,
				//添加用户
				adduser: {
					'company':'',
					"applyTel": "",
					"applyName": "",
					"structureList": [],
					"orgPositions": "职员"
				},
				//部门名称
				structure: "",
				//是否开启群聊
				isChat: 0,

				//组织id
				orgId: null,
				//部门用户
				users: [],
				//组织用户
				allusers: {
					total: 1,
					"rows": [{
						// "id": "f37e5eacdea511e9945200163e05ff66",
						// "telphone": "18563959737",
						// "userId": "6268ba417dc611e99d3100163e05ff66",
						// "userName": "Eden",
						// "avatarUrl": "https://come2me2.centling.cn/FlKEJUbcV0b2RQz-qlXA0DJRuamB",
						// "calorificValue": 8874,
						// "identityAuthName": "测试部门",
						// "orgPositions": "",
					}]
				},
				//组织用户---编辑信息，
				staff: null,
				//组织用户---临时名字字段，
				groupNickname: "",
				//公司名称
				company:'',
				//公司职务
				companyPositions:'',
				// 組織用戶臨時部門
				structureList: [],
				// 组织用户临时职位
				structurePositions: "",
				//组织的用户信息组
				structureMsg: null,
				// 组织用户临时手机号隐藏否
				isHideTel:false,
				//人员管理------------
				//搜索条件
				name: "",
				//分页
				pageNumber: 1,
				pageSize: 10,
				//分页
				freezepageNumber: 1,
				freezepageSize: 10,
				// 判断是否触发allpowerss监听事件
				allpowers: false,
				allpowerss: false,
				// 部门
				EdStructureList: [],
				//权限 
				powers: [{
						name: '邀请加入',
						checked: false,
					},
					{
						name: '发通知',
						checked: false,
					},
					{
						name: '发资讯',
						checked: false,
					},
					{
						name: '发资源',
						checked: false,
					},
					{
						name: '组织架构',
						checked: false,
					},
					{
						name: '发活动',
						checked: false,
					},
					{
						name: '生日管理',
						checked: false,
					},
					{
						name: '成员管理',
						checked: false,
					},
					{
						name: '组织认证',
						checked: false,
					},
					{
						name: '小组管理',
						checked: false,
					},
					{
						name: '编辑组织认证详情',
						checked: false,
					},
					{
						name: '发党建',
						checked: false,
					}
				],
				// 临时用户的信息------编辑权限
				uMsg: null,
				// 排序编辑---用户id与排序序号
				orgUserList: [],
				// 临时删除部门id
				delPartMgs: null,
				// 临时主管理员列表
				mainAdmin: [],
				// 临时主管理员信息
				AdminUser: {},
				// 临时普通管理员列表
				commonAdmin: [],
				// 冻结人员列表
				allfreezeusers: null,
				// 是否展示冻结人员 f不展示，t展示
				freezeshow: false,
				itemDetail:"",//临时存放人员详情
			}
		},
		props: {
			msg: String,
			defOrg: null,
			personalInfo: null
		},
		watch: {
			defOrg(res) {
				if (res) {

					this.orgId = res.id;
					this.currentOrgName = res.orgName;
					this.getOrgStructureList();
					this.getOrgUserPage();
					this.addcommonadmin();
					this.addMainadmin();
				}
			},
			name: function(val, oldval) {
				// 如果搜索框发生变化，调用人员
				this.pageNumber = 1;
				this.getOrgUserPage()
			},
			allpowerss: function(n, o) {

				if (n) {
					this.powers.forEach((v, i) => {

						this.powers[i].checked = true;

					})
					this.allpowers = false
				} else {
					if (this.allpowers) {
						this.allpowers = false
					} else {
						// console.log(n)
						if (n) {

							this.powers.forEach((v, i) => {

								this.powers[i].checked = true;
							})
						} else {

							this.powers.forEach((v, i) => {

								this.powers[i].checked = false;
							})
						}
					}
				}


			},
			allAdminAdd: function(val, oldval) {

				// console.log(val)
				if (val) {
					// console.log(this.allusers.rows)

					for (var i = 0; i < this.commonAdmin.rows.length; i++) {
						// console.log("数组元素：")
						this.adminAdd.push(this.commonAdmin.rows[i].id)
					}
					// console.log(this.adminAdd)

				} else {
					this.adminAdd = []
				}
			},
			newsort: function(val, oldval) {
				var reg = /^[1-9]\d*$/

				if (val == 0) {
					this.newsort = ""
					this.sortsetObj.newsort = ""
					return
				}
				if (val == "" || val == null) {
					this.newsort = ""
					this.sortsetObj.newsort = ""
					return
				}
				if (reg.test(val)) {
					if (val > 99999) {
						val = 99999
					}
					var m = val
					this.newsort = m
					this.sortsetObj.newsort = m
					return
				} else {
					if (oldval != null && oldval != '') {
						this.newsort = oldval
						this.sortsetObj.newsort = oldval
					} else {
						this.newsort = 1
						this.sortsetObj.newsort = 1
					}
				}

			},

			menuactive: function(val, oldval) {
				this.step = 1
				if (val == 1) {
					this.show = true
				} else {
					this.show = false
				}
				if (val == 1 && this.orgId != null) {

					this.getOrgUserPage();
				} else if (val == 0 && this.orgId != null) {
					//加载部门信息
					this.getOrgStructureList();

				} else if (val == 3 && this.orgId != null) {
					// 主管理员
					this.addMainadmin();
				} else if (val == 4 && this.orgId != null) {
					this.addcommonadmin();
				}
			}

		},
		created() {
			this.menuactive = this.$route.params.page
			this.currentOrgName = this.local.fetch("currentOrgName")
			// console.log(this.local.fetch("currentOrgName"))
			if (this.defOrg) {
				this.orgId = this.defOrg.id;
				this.getOrgStructureList();
				this.getOrgUserPage();
				this.addcommonadmin();
				this.addMainadmin();
				this.ChangefreezeUsers();
			}
			// console.log("------------------------------")
			// console.log(this.personalInfo)
			// console.log("------------------------------")

			if (this.menuactive == 4) {
				this.adminNum = 4

			} else if (this.menuactive == 3) {
				this.adminNum = 3

			}

		},
		methods: {



			// 全选
			closeAllPowers() {
				var t = true
				this.powers.forEach((v, i) => {

					if (!v.checked) {
						// console.log(v)
						t = false
					}
				})
				if (t) {
					// this.allpowers = true
					this.allpowerss = true
				} else {
					this.allpowerss = false
					// 中间变量，为true时不触发allpowerss的监听
					this.allpowers = true
				}
			},


			// 改变freezeshow
			changeFreeze(n) {
				this.freezeshow = n
			},
			// 
			setStep(n) {
				this.step = n
			},

			// 获取冻结人员列表
			ChangefreezeUsers() {
				this.http.ajax({
					url: 'webSite/getOrgUserFrozenPage',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"pageNumber": this.freezepageNumber,
						"pageSize": this.freezepageSize,
						"name": this.name
					}

				}).then(res => {
					// console.log(res)
					//展示组织用户的分頁數據
					if (res.code != 500) {
						this.allfreezeusers = res.data
					} else {
						layer.msg(res.msg)
					}



				})
			},

			// 加载添加主管理员时的人员信息
			addMainadmin() {
				this.http.ajax({
					url: 'webSite/getUpdateAdminUserOrgUserPage',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"pageNumber": this.pageNumber,
						"pageSize": 10
					}

				}).then(res => {

					this.mainAdmin = res.data
				})
			},
			// 添加普通管理员时的人物信息
			addcommonadmin() {
				this.http.ajax({
					url: 'webSite/getAddAdminUserOrgUserPage',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"pageNumber": this.pageNumber,
						"pageSize": 10
					}

				}).then(res => {

					this.commonAdmin = res.data
				})
			},


			// 主管理员安全验证弹窗
			openlayer(e) {
				if (e == "") {
					layer.msg('请选择一个用户');
					return
				}

				this.layer = 13

				for (var i = 0; i < this.mainAdmin.rows.length; i++) {
					if (this.mainAdmin.rows[i].id == e) {
						this.AdminUser = this.mainAdmin.rows[i]
						break;
					}
				}


			},


			// 获取验证码
			getCode() {
				var telp
				if (this.AdminUser.telphone == null) {

					if (this.adduser.applyTel == '') {
						layer.msg('手机号码不能为空');
						return;
					}
					if (!/^1[3456789]\d{9}$/.test(this.adduser.applyTel)) {
						layer.msg('手机号码格式不正确');
						return
					}
					telp = this.adduser.applyTel

				} else {
					telp = this.AdminUser.telphone
				}


				if (this.isGetting) return
				this.http.ajax({
					url: 'webSite/verificationCode',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						type: "20",
						telPhone: telp
					}

				}).then(res => {

				})
				this.isGetting = true
				//请求验证码

				//调用定时器 d
				var timer = setInterval(() => {
					if (this.time <= 0) {
						clearInterval(timer)
						timer = null
						this.time = 60
						this.isGetting = false
					} else {
						this.time--
					}
				}, 1000)
			},
			// 添加主管理的组织内
			addAdminInOrg() {
				if (this.adminAdd.length == 0) {
					layer.msg("请选择一个用户")
					return
				}

				this.http.ajax({
					url: 'webSite/newReplaceSupervisor',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"orgUserId": this.adminAdd,
						"applyTel": this.AdminUser.telphone,
						"applyName": this.AdminUser.userName,
						"code": this.verificationCode,
						"structureList": []
					}
				}).then(res => {

					this.adduser = {}
					this.layer = 0
					if (res.code == 200) {
						this.$router.push({
							path: '/'
						})
						this.$emit('signout');
					}

					layer.msg(res.msg)
				})

			},


			// addadmin添加主管理员，组织外
			addadmin() {

				if (!this.regPhone(this.adduser.applyTel)) {
					return
				}
				this.http.ajax({
					url: 'webSite/newReplaceSupervisor',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"orgUserId": "",
						"applyTel": this.adduser.applyTel,
						"applyName": this.adduser.applyName,
						"code": this.verificationCode,
						"structureList": this.structureList
					}
				}).then(res => {
					this.adduser = {}
					this.layer = 0
					if (res.code == 200) {
						this.$router.push({
							path: '/'
						})
						this.$emit('signout');
					}

					layer.msg(res.msg)
				})
			},
			// 添加管理员提交
			submitAddAdmin() {
				if (this.adminAdd.length == 0) {
					layer.msg("请选择至少一个用户")
					return
				}
				this.http.ajax({
					url: 'webSite/orgStructure/newAddAdmin',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						orgId: this.orgId,
						orgOut: [],
						"onOrgList": this.adminAdd
					}
				}).then(res => {
					// console.log(res)
					this.$router.push({
						path: '/organizationset/3'
					})
					layer.msg(res.msg)


				})
			},
			// 点击区域外保存
			save(e) {
				// this.allusers.rows[e].makesort = false

				if (/^[1-9]\d*$|^$/.test(this.sortsetObj.newsort)) {
					if (this.sortsetObj.newsort > 99999) {
						layer.msg("输入数字不能超过5位")
						return
					}

					this.setSort(this.sortsetObj.id, this.sortsetObj.newsort, this.sortsetObj.sort)
					return
				}
				layer.msg("请输入大于0的数字")


			},
			// 
			test(e) {

				this.sortsetObj = this.allusers.rows[e]

				this.sortsetObj.newsort = ""
				// console.log(this.sortsetObj.newsort)
				this.layer = 10
			},
			//获取组织在机构的列表
			getOrgStructureList() {
				this.http.ajax({
					url: 'webSite/orgStructure/list',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						orgId: this.orgId
					}
				}).then(res => {
					// console.log(res)
					var list = []
					this.orgStructureListDtos = res.data.orgStructureListDtos
					for (var i = 0; i < this.orgStructureListDtos.length; i++) {
						var m = {
							structure: this.orgStructureListDtos[i].structure,
							id: this.orgStructureListDtos[i].id,
							checked: false
						}
						list.push(m)

					}
					this.EdStructureList = list



				})
			},

			// 刷新页面
			flash(e) {
				if (e == 0) {
					// 刷新部门
					this.getOrgStructureList();
				} else if (e == 1) {
					this.getOrgUserPage();
					this.ChangefreezeUsers();
				}
			},
			//获取人员列表
			getOrgUserPage() {
				this.http.ajax({
					url: 'webSite/getOrgUserPage',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"pageNumber": this.pageNumber,
						"pageSize": this.pageSize,
						"name": this.name
					}
				}).then(res => {
					// console.log(res)
					// layer.msg(res.msg)
					//展示组织用户的分頁數據
					if (res.code == 200) {
						this.allusers = res.data
						this.orgUserList = []
						for (var i = 0; i < res.data.rows.length; i++) {
							var userObj = new Object()
							userObj.orgUserId = res.data.rows[i].id
							userObj.sort = res.data.rows[i].sort
							this.orgUserList.push(userObj)
							var length = res.data.rows[i].idCard.length;
							if(res.data.rows[i].idCard){
								res.data.rows[i].idCard1 = res.data.rows[i].idCard.substring(0,3) + '***' + res.data.rows[i].idCard.substring(length-3,length) 
							}
						}
					}
				})
			},
			// 群体排序
			setSorts() {
				this.http.ajax({
					url: 'webSite/updateOrgUserMoveSort',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgUserList": this.orgUserList
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					// this.orgUserList = []
					this.sortList = []
					this.flash(1)
				})
			},

			// 单独排序--序号修改
			setSort(orgUserId, newSort, oldSort) {
				if (newSort == "") {
					layer.msg("序号不能为空")
					return
				}
				this.http.ajax({
					url: 'webSite/updateOrgUserSort',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"orgUserId": orgUserId,
						"newSort": newSort,
						"oldSort": oldSort
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
					this.newsort = null
					// console.log("xuhao",this.newsort)
					// this.sortsetObj.newsort=null
					this.flash(1)
				})
			},
			// 确定修改权限
			makepower() {
				var authList = []
				for (var i = 0; i < this.powers.length; i++) {
					if (this.powers[i].checked == true) {
						authList.push((i + 1) + "")
					}
				}
				this.http.ajax({
					url: 'webSite/orgStructure/settingOrgUserAuth',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						orgId: this.orgId,
						orgUserId: this.uMsg.id,
						userId: this.uMsg.userId,
						authList: authList
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
				})
			},
			dellayer(e) {
				this.layer = 9
				this.delPartMgs = e

			},
			// 删除部门
			del(value) {

				this.http.ajax({
					url: 'webSite/orgStructure/newRemoveOrgStructure',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"id": value.id
					}
				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
					this.flash(0)

				})
			},
			invitation() {
				if (this.formItem.name == "") {
					layer.msg("请填写被邀请人姓名")
					return
				}
				if (!this.regPhone(this.formItem.telphone)) {
					return
				}

				this.http.ajax({
					url: 'webSite/invite',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						name: this.formItem.name,
						telphone: this.formItem.telphone,
						orgId: this.orgId
					}

				}).then(res => {
					layer.msg(res.msg)
					if (res.code == 200) {
						this.tomenu(1)
					}


					//邀请加入
				})
			},
			// 确认添加管理员
			makeaddadmin(e) {
				if (this.adduser.applyName == "") {
					layer.msg("请填写用户姓名")
					return
				}
				if (!this.regPhone(this.adduser.applyTel)) {
					return
				}

				this.http.ajax({
					url: 'webSite/orgStructure/judgeOrgAdmin',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"managerPhone": this.adduser.applyTel
					}

				}).then(res => {
					// console.log(res)
					//添加管理员用户
					if (res.code == 200) {
						this.http.ajax({
							url: 'webSite/orgStructure/newAddAdmin',
							method: 'post',
							headers: {
								'Content-Type': 'application/json'
							},
							data: {
								"orgOut": [{
									"orgId": this.orgId,
									"applyTel": this.adduser.applyTel,
									"applyName": this.adduser.applyName,
									"orgPositions": this.adduser.orgPositions,
									"structureList": this.adduser.structureList,
								}],
								"orgId": this.orgId,
								"onOrgList": []
							}

						}).then(res => {


							// this.$router.push("页面跳转---回到过去")
							this.$router.push({
								path: '/organizationset/3'
							})
							layer.msg(res.msg)
						})
					} else {
						// console.log("2")
						layer.msg(res.msg)
					}

				})
			},
			regPhone(num) {
				if (num == '') {
					layer.msg('手机号码不能为空');
					return false;
				}
				if (!/^1[3456789]\d{9}$/.test(num)) {
					layer.msg('手机号码格式不正确');
					return false
				}
				return true
			},

			// 确认添加用户
			makeadduser() {

				if (this.step == 2) {
					if (this.adduser.applyName == null || this.adduser.applyName == "") {
						layer.msg("请输入用户姓名")
						return
					}
					if (!this.regPhone(this.adduser.applyTel)) {
						return
					}
					// 部门内添加用户
					this.http.ajax({
						url: 'webSite/webSiteAddUser',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"uid": this.personalInfo.id,
							"orgId": this.orgId,
							"applyTel": this.adduser.applyTel,
							"applyName": this.adduser.applyName,
							"structureList": this.adduser.structureList,
							"orgPositions": this.adduser.orgPositions,
						}

					}).then(res => {
						layer.msg(res.msg)
						this.getOrgStructureList();
						this.getUser(this.position)
						this.layer = 0
						// console.log(res)
					})
				} else {
					if (this.adduser.applyName == null || this.adduser.applyName == "") {
						layer.msg("请输入用户姓名")
						return
					}
					if (!this.regPhone(this.adduser.applyTel)) {
						return
					}
					// 先校验用户是否存在再添加用户
					this.http.ajax({
						url: 'webSite/checkWebOrgUser',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"applyTel": this.adduser.applyTel
						}

					}).then(res => {
						// console.log(res)
						//添加新用户
						if (res.code == 200) {
							this.http.ajax({
								url: 'webSite/webSiteAddUser',
								method: 'post',
								headers: {
									'Content-Type': ' application/json'
								},
								data: {
									"uid": this.personalInfo.id,
									"orgId": this.orgId,
									"applyTel": this.adduser.applyTel,
									"applyName": this.adduser.applyName,
									"structureList": this.adduser.structureList,
									"orgPositions": this.adduser.orgPositions,
									'company':this.adduser.company
								}

							}).then(res => {
								layer.msg(res.msg)
								this.flash(1)
								this.layer = 0
								// console.log(res)
							})
						} else {
							this.flash(1)
							this.layer = 0
							layer.msg(res.msg)
						}

					})

				}

			},
			tomenu(n) {
				// this.$route.push()
				// this.$router.push('/staff/' + n);
				this.menuactive = n;
				//获取组织用户
				if (n == 1) {
					if (this.show) {
						this.show = false
					} else {
						this.show = true
					}
					this.http.ajax({
						url: 'webSite/getOrgUserPage',
						method: 'post',
						headers: {
							'Content-Type': ' application/json'
						},
						data: {
							"orgId": this.orgId,
							"pageNumber": this.pageNumber,
							"pageSize": this.pageSize,
							"name": this.name
						}

					}).then(res => {
						// console.log(res)
						//展示组织用户的分頁數據
						if (res.code != 500) {
							this.allusers = res.data
						} else {
							layer.msg(res.msg)
						}



					})
				}

			},
			// 移除组织弹窗
			getout(value) {
				this.layer = 3
				this.staff = value
			},
			//确认移除组织
			makegetout() {
				this.http.ajax({
					url: 'webSite/removeUser',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"id": this.staff.id,
						"orgId": this.orgId,
						"userId": this.staff.userId
					}

				}).then(res => {
					layer.msg(res.msg)
					// console.log(res)
					this.layer = 0
					// console.log("--------------231-------")
					// console.log(this.menuactive)
					if (this.menuactive == 0) {
						// console.log("--------------231-------")
						this.getUser(this.position)
					}
					this.flash(1)
				})

			},
			// 显示部门的相关职务
			getUser(value) {
				// console.log(value)
				this.position = value;
				this.step = 2
				this.http.ajax({
					url: 'webSite/orgStructure/newOrgStructureInfo',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"structureId": value.id
					}

				}).then(res => {
					// console.log(res)
					this.users = res.data
				})
			},
			// 冻结弹出框
			freeze(value) {
				// console.log(value)
				this.staff = value
				if (value.isSureFreeze == 1 && value.isFreeze == 0) {
					let _t = this;
					layer.confirm('该用户正在参加活动暂时无法被冻结', {
						title: ['冻结成员账号'],
						closeBtn: false,
						btnAlign: 'c',
						shadeClose: true,
						skin: 'yq-confirm',
						btn: ['我在想想', '活动结束后自动冻结'] //按钮
					}, function() {
						layer.closeAll()
					}, function() {
						_t.makefreeze(1)

					});
				} else {
					this.layer = 4

				}

			},
			//确认冻结成员账号-
			makefreeze(type) {
				this.http.ajax({
					url: 'webSite/freeze',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgUserId": this.staff.id,
						"orgId": this.staff.orgId,
						"type": type
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.user = res.data
					this.layer = 0
					this.flash(1)
					// this.ChangefreezeUsers();
				})
			},
			editpowerMsg(value) {
				this.uMsg = value
				this.layer = 15
			},
			// 弹窗弹出
			tolayer(n) {
				if (n == 0) {
					this.structureMsg = null
					this.structure = null
					this.isChat = 0
					this.structure = ''
					var list = this.EdStructureList
					for (var i = 0; i < this.EdStructureList.length; i++) {
						if (this.EdStructureList[i].checked) {
							list[i].checked = false
						}
					}
					this.EdStructureList = list
					this.powers.forEach((v, i) => {

						this.powers[i].checked = false;
					})

				}
				this.adduser = {
					"applyTel": "",
					"applyName": "",
					"structureList": [],
					"orgPositions": "职员"
				}
				if (this.step == 2 && this.menuactive == 0) {
					this.adduser.structureList = this.position.id
				}

				if (n == 14) {
					if (this.adminAdd.length == 0 && this.menuactive == 4) {
						layer.msg("请选择至少一个用户")
						return
					}
				}

				this.layer = n
			},
			// 人员管理-编辑弹出框
			edittolayer(value) {
				// console.log(value.isHideTel)
				this.staff = value
				this.structureList = value.structure


				var list = this.EdStructureList
				for (var i = 0; i < this.EdStructureList.length; i++) {
					for (var j = 0; j < value.structure.length; j++) {
						if (this.EdStructureList[i].id == value.structure[j]) {
							list[i].checked = true
						}
					}

				}
				this.EdStructureList = list
				// console.log(this.EdStructureList.length)
				// var list=[]
				// 
				// for(var i=0;i<this.orgStructureListDtos.length;i++){
				// 	list.push(this.orgStructureListDtos[i].id)
				// }
				// this.structureList= list
				this.structurePositions = value.orgPositions;
				this.groupNickname = value.userName;
				this.companyPositions= value.companyPositions;
				this.company=value.company;
				this.layer = 1;
				this.isHideTel = value.isHideTel;
			},
			getDetail(value){
				this.itemDetail = value;
				this.layer = 16;
			},
			// 人员管理-编辑-确定修改
			editstaff(value) {
				var list = []
				for (var i = 0; i < this.EdStructureList.length; i++) {
					if (this.EdStructureList[i].checked) {
						list.push(this.EdStructureList[i].id)
					}
				}
				this.structureList = list
				this.http.ajax({
					url: 'webSite/orgStructure/editStructurePeople',
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"structureList": this.structureList,
						"orgUserId": this.staff.id,
						"orgPositions": this.structurePositions,
						"orgId": this.orgId,
						"groupNickname": this.groupNickname,
						"isHideTel":this.isHideTel,
						'company':this.company,
						'companyPositions':this.companyPositions
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
					var list = this.EdStructureList
					for (var i = 0; i < this.EdStructureList.length; i++) {
						if (this.EdStructureList[i].checked) {
							list[i].checked = false
						}
					}
					this.EdStructureList = list
					this.flash(1)
				})
			},
			// 修改部门名称
			edits(n) {
				// console.log("orgId:" + this.structureMsg.orgId + "-------------id:" + this.structureMsg.id +
				// 	"----------------structure:" + this.structure)
				// console.log("this.isChat", this.isChat)
				var imIsOpen = 0
				if (this.isChat) {
					imIsOpen = 1
				}

				this.http.ajax({
					url: 'webSite/orgStructure/newUpdateOrgStructure',
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"orgId": this.structureMsg.orgId,
						"structure": this.structure,
						"id": this.structureMsg.id,
						"imIsOpen": imIsOpen
					}

				}).then(res => {
					// console.log(res)
					layer.msg(res.msg)
					this.layer = 0
					this.flash(0)


				})
			},


			// 修改权限--弹出框---回显现在具有的权限
			editpower(value) {


				this.allpowerss = false
				// console.log(value)
				this.http.ajax({
					url: 'webSite/orgStructure/orgManagerAuthList',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						"orgId": this.orgId,
						"orgUserId": value.id
					}

				}).then(res => {
					// console.log("【【【【【【【【【【【【【】】】】】】】】】】】】】】")
					// console.log(res)
					var list = []
					this.powers.forEach((v, i) => {
						var temp = {
							name: null,
							checked: false
						}
						temp.name = v.name
						list.push(temp)
					})
					// console.log('diyici',list.length)
					for (var i = 0; i < res.data.length; i++) {
						// p.push(res.data[i].authVal)
						var num = res.data[i].authVal
						list[num - 1].checked = true;
					}
					// console.log('第二次',list.length)
					// console.log("list[1]", list[1])
					var t = true
					var n = 0
					list.forEach((v, i) => {
						// console.log("第三次循环", v, i)
						if (!v.checked) {
							t = false
							n++
						}
					})
					// console.log('最后一次',list.length)
					// console.log(n)
					// console.log("powersde 值是", this.powers)
					if (n == 0) {
						this.allpowerss = true
					} else {
						this.allpowerss = false
					}

					this.powers = list
					this.layer = 2
				})


			},
			// 修改部门名称--弹出框
			editname(value) {
				// console.log(value)
				this.layer = 7
				this.structureMsg = value
				this.structure = value.structure
				this.isChat = (value.isChat == 1)

			},
			// 添加部门
			submit(n) {
				if (this.structure == "" || this.structure == null) {
					layer.msg("部门不能为空")
					return
				}
				var isChatimIsOpen = 0
				if (this.isChat) {
					isChatimIsOpen = 1
				}
				this.http.ajax({
					url: 'webSite/orgStructure/newAddOrgStructure',
					method: 'post',
					headers: {
						'Content-Type': ' application/json'
					},
					data: {
						structure: this.structure,
						imIsOpen: isChatimIsOpen,
						orgId: this.orgId


					}

				}).then(res => {
					layer.msg(res.msg)
					this.structure = null
					this.layer = 0
					this.flash(0)

				})
				// console.log(this.structure + "-----------" + this.isChat)
				// console.log(this.defOrg.id)


			},
			changePhone(e){
				this.isHideTel = e ? 1 : 0;
				// console.log("切换",e,this.isHideTel)
			}
		}



	}
</script>

<style lang="less">
	// .ivu-poptip-popper{
	// 	top:130px !important;
	// }
	.ivu-poptip-rel{
		height:38px;
	}
	.staffeit .mc .ivu-select-dropdown {
		will-change: unset !important;
	}
	.right .ivu-select-placeholder{
		text-align: right;
	}

	.sortnum {
		display: inline-block;
		width: 100%;
		// height: 40px;
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
	}


	.staffeit {
		.tips {
			margin-top: 45px;
			text-align: center;
			font-size: 14px;
			color: #333333;
		}

		.btns {
			text-align: center;
			font-size: 0;
			padding-top: 37px;
			margin-bottom: 21px;

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
				padding: 0 22px;
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
			// border-bottom: 1px solid #eee;
			margin: 15px;
			// padding:0 15px 0 10px;
			display: flex;
			position: relative;
			font-family: 'PingFangSC-Regular,PingFang SC';

			// float:left;
			// width:75%;
			.text-label {
				width: 100px;
				display: flex;
				line-height: 40px;

				p {
					color: #DC1A00;
				}

				// 
			}
			
			.label {
				margin-left: 11px;
			}

			input.ivu-input {
				text-align: right;
			}

			.ivu-select-selection {
				min-height: 40px;
				padding: 4px 24px 4px 4px;
			}

			.ivu-select-dropdown {
				max-height: 164px;
				will-change: auto;
			}

			.ivu-select-placeholder {
				height: 26px;
				line-height: 26px;
			}

			.right .label {
				float: left;
				margin-left: 0;
			}

			.ivu-checkbox {
				margin-left: 15px;
				margin-right: 15px;
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

			p {
				color: red;
				display: contents;
			}
			.mt-left{
				margin-right:182px;
			}
			.ivu-switch-small{
				width:32px; 
			}
			.ivu-switch-small.ivu-switch-checked:after {
				left: 16px;
			}
		}

		.mc-phone{
			margin:0 16px 7px;
			.text{
				font-size:12px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(136,136,136,1);
				line-height:17px;
			}
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
		}

		.title {
			height: 70px;
			background: #2168eb;
			font-size: 20px;
			color: #ffffff;
			line-height: 70px;
			text-align: center;
		}
		.layer-top{
			margin:13px 16px;
			width:294px;
			height:38px;
			background:rgba(250,250,250,1);
			padding-left:15px;
			line-height:38px;
		}
		.layer-cont{
			margin:0 17px 14px;
			.layer-cont-l{
				width:68px;
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:32px;
			}
			.layer-cont-r{
				width:222px;
				min-height:32px;
				border:1px solid rgba(221,221,221,1);
				padding:7px 11px;
				text-align: right;
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:17px;
			}
			.height{
				line-height:16px;
			}
		}
		.new{
			padding-top:14px;
			margin-bottom: 27px;
			.btn2{
				width:104px;
				height:28px;
				background:rgba(33,104,235,1);
				border-radius:14px;
			}
		}

	}

	.staff {
		margin-top: 69px;
		margin-bottom: 63px;

		.warp {
			.rightcont {
				.share_tips {
					position: absolute;
					width: 160px;
					right: 71px;
					top: 110px;

					.t {
						font-size: 14px;
						margin-bottom: 26px;

					}

					.btn {
						cursor: pointer;
					}

				}

				.form {
					margin-right: 288px;
					margin-top: 24px;



					.btn {
						width: 205px;
						height: 48px;
						line-height: 48px;
						text-align: center;
						color: #ffffff;
						background: #2168eb;
						font-size: 14px;
						-webkit-border-radius: 48px;
						-moz-border-radius: 48px;
						border-radius: 48px;
						cursor: pointer;
					}
				}

				.share_t2 {
					font-size: 14px;
					color: #999999;
					border-bottom: 1px solid #eee;
					padding-bottom: 19px;
					line-height: 14px;
				}

				width: 815px;
				float: right;
				padding-left: 40px;
				padding-right: 46px;
				padding-top: 10px;
				position: relative;
				min-height: 660px;

				.tit {
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					font-weight: bold;
					color: #333333;
				}
				.btnD {
					// height:22px;
					background:rgba(255,255,255,1);
					border-radius:14px;
					border:1px solid rgba(151,151,151,1);
					color: #333333;
					padding: 0px 15px;
					text-align: center;
					line-height: 20px;
					display: inline-block;
					font-size: 12px;
					margin-right: 5px;
				}
				.addbtn {
					height:22px;
					border-radius:14px;
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
				.table {
					.link {
						cursor: pointer;
						color: #2168eb;
						margin: 0 4px;
						font-size: 10px;
					}


					.color{
						color:#999999
					}

					.btn {
						padding: 0 10px;
						text-align: center;
						line-height: 22px;
						display: inline-block;
						font-size: 12px;
						margin: 0 5px;
						height: 22px;
						border-radius: 14px;
						border: 1px solid rgba(151, 151, 151, 1);

						span {
							font-size: 1px;
						}
					}

					.edit,
					.del {
						font-size: 0;
						width: 20px;
						margin: 0px 10px;
						position: relative;
						display: inline-block;
						height: 100%;
						cursor: pointer;

						img {
							vertical-align: middle;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
					}

					.ivu-input-wrapper {
						width: 100%;

						input {
							border: none;
						}
					}

					.saveBtn {
						height: 40px;
						line-height: 40px;
						padding: 0 15px;
						cursor: pointer;
					}

					.mc {
						border-bottom: 1px solid #eee;
					}

					.mt,
					.mc {
						display: flex;
						justify-content: space-between;
						padding-left: 12px;
						// padding-right: 20px;
						text-align: left;
						font-family: "PingFangSC-Regular,PingFang SC";


						.item {
							text-align: left;
							height: 60px;
							line-height: 60px;
							display: inline-block;
							min-width: 60px;
							-webkit-box-sizing: border-box;
							-moz-box-sizing: border-box;
							box-sizing: border-box;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.mt {
						background: #f8f8f8;

						.item {
							height: 40px;
							line-height: 40px;
						}
					}
				}
			}

			.leftcont {
				float: left;
				width: 265px;
				border-right: 1px solid #eee;
				padding: 35px 0;

				.search {
					width: 168px;
					display: block;
					margin: 0 auto;

					img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.menu {
					width: 168px;
					display: block;
					margin: 0 auto;

					.item {
						cursor: pointer;
						height: 59px;
						line-height: 59px;
						border-bottom: 1px solid #eee;
					}

					.active {
						color: #2168eb;
						font-weight: 500;
					}

					.child {
						span {
							line-height: 40px;
							padding-left: 15px;
							cursor: pointer;
						}
					}

					.n {
						background: url("../assets/img/zk2@2x.png") no-repeat right center;
					}

					.n.active {
						color: #515a6e;
						background: url("../assets/img/zk3@2x.png") no-repeat right center;
					}
				}
			}
		}
	}

	.staff .warp .rightcont .table .edit,
	.staff .warp .rightcont .table .del {
		display: none;
	}

	.staff .warp .rightcont .table .hand:hover .edit,
	.staff .warp .rightcont .table .hand:hover .del {
		display: inline-block;
	}

	// .staff .warp .rightcont .table .mc .item .link {
	// 	display: none;
	// }

	// .staff .warp .rightcont .table .mc:hover .item .link {
	// 	display: inline-block !important;
	// }
	.useredit-box{
		margin-bottom: 12px;
		color: #333333;
		.useredit-title{
			width: 100px;
			line-height: 34px;
		}
		.useredit{
			width: 350px;
		}
	}
	.usereditmc {
		height: 40px;
		line-height: 40px;
		margin: 15px;
		display: flex;
		position: relative;
		font-family: 'PingFangSC-Regular,PingFang SC';
		.ivu-select-selection {
			min-height: 40px;
			padding: 4px 24px 4px 4px;
		}

		.ivu-select-dropdown {
			max-height: 164px;
			will-change: auto;
		}

		.ivu-select-placeholder {
			height: 26px;
			line-height: 26px;
		}
		.right .label {
			float: left;
			margin-left: 0;
		}
		.ivu-checkbox {
			margin-left: 15px;
			margin-right: 15px;
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
			color: #333333;
		}

		.right .ivu-checkbox {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translate(0, -50%);
		}
	}
	.mc-phone{
		margin:10px 0 7px;
			.text{
				font-size:12px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(136,136,136,1);
				line-height:17px;
			}
	}
	.usereditbtns {
			text-align: center;
			font-size: 0;
			padding-top: 37px;
			margin-bottom: 21px;

			.usereditbtn1 {
				border: 1px solid #999999;
			}

			.usereditbtn2 {
				border: 1px solid #2168EB;
				background: #2168eb;
				color: #ffffff;
			}

			.usereditbtn1,
			.usereditbtn2 {
				cursor: pointer;
				display: inline-block;
				font-size: 12px;
				padding: 0 22px;
				width: 140px;
				height: 48px;
				line-height: 48px;
				-webkit-border-radius: 28px;
				-moz-border-radius: 28px;
				border-radius: 28px;
				margin: 0 10px;
			}

		}
	.useredit .ivu-input{
		height: 34px;
	}
	 .line {
        border-bottom: 1px dashed #dddddd;
        margin: 20px 0;
      }
</style>

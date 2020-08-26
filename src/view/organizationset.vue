<template>
  <div>
    <div class="w">
      <div class="position">
        组织设置
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg organizationset">
      <div class="warp">
        <div class="leftcont">
          <div class="menu">
            <div class="item" @click="tomenu(0)" :class="{active:menuactive==0}">组织资料</div>
            <div class="item" @click="tomenu(1)" :class="{active:menuactive==1}">组织认证</div>
            <!-- <div class="item" @click="tomenu(2)" :class="{active:menuactive==2}">
            助理设置
            </div>-->
            <div class="item" @click="tomenu(3)" :class="{active:menuactive==3}">管理员设置</div>
            <div v-if="defOrg&&defOrg.orgType ==1 || defOrg&&defOrg.orgType ==2" class="item n" @click="tomenu(4)" :class="{active:menuactive==4}">{{defOrg&&defOrg.orgType ==1?'商':'协'}}会介绍</div>
            <dl class="child" v-show="menuactive==4">
              <dd :class="{active:synopsis==0}" @click="synopsisbtn(0)">
                <span>{{defOrg&&defOrg.orgType ==1?'商':'协'}}会简介</span>
              </dd>
              <dd :class="{active:synopsis==1}" @click="synopsisbtn(1)">
                <span>章程</span>
              </dd>
              <dd :class="{active:synopsis==2}" @click="synopsisbtn(2)">
                <span>组织机构</span>
              </dd>
              <dd :class="{active:synopsis==4&&!isMember}" @click="synopsisbtn(4)">
                <span>会长</span>
              </dd>
              <dd :class="{active:synopsis==3 || synopsis==4 && isMember}" @click="synopsisbtn(3)">
                <span>会员风采</span>
              </dd>
              <dd :class="{active:synopsis==5}" @click="synopsisbtn(5)">
                <span>{{defOrg&&defOrg.orgType ==1?'商':'协'}}会荣誉</span>
              </dd>
            </dl>
          </div>
        </div>
        <div class="rightcont rightcont1">
          <div class="form" v-if="menuactive==0">
            <div class="title">组织资料设置</div>
            <Form v-if="defOrg" :label-width="100" :rules="formdaterule" :model="defOrg">
              <FormItem label="组织名称" prop="orgName">
                <div @click="isAuthStatus">
                  <Input
                    v-model="defOrg.orgName"
                    placeholder="组织名称（2-16个字）"
                    :maxlength="16"
                    :disabled="defOrg&&defOrg.authStatus==1"
                  />
                </div>
              </FormItem>
              <FormItem label="组织logo" class="second">
                <Upload
                  @success="uporgUrl"
                  :personalInfo="personalInfo"
                  :mimeType="mimeType"
                  @error="error"
                >
                  <img class="upload_pic hand" v-if="logourl!=null&&logourl!=''" :src="logourl" alt />
                  <img
                    class="upload_pic hand"
                    v-if="logourl==null||logourl==''"
                    :src="defOrg.orgUrl"
                    alt
                  />

                  <span class="upload_btn hand">上传</span>
                </Upload>
                <div class="uploadpic_tips">建议上传400*400px尺寸图片</div>
              </FormItem>
              <!-- <div class="line line1"></div> -->
              <FormItem label="封面图" :prop="defOrg&&defOrg.orgType ==1 || defOrg&&defOrg.orgType ==2? '':'coverUrl'">
                <Upload
                  @success="upcoverUrl"
                  :personalInfo="personalInfo"
                  :mimeType="mimeType"
                  @error="error"
                >
                  <div class="uploadpic hand">
                    <img :src="defOrg.coverUrl" alt />
                    <p class="up-btn up-btn1">上传</p>
                  </div>
                </Upload>
                <div class="uploadpic_tips">建议上传750*416px尺寸图片</div>
              </FormItem>
              <FormItem label="组织介绍" v-if="defOrg&&defOrg.orgType !=1 && defOrg&&defOrg.orgType !=2">
                <Input
                  type="textarea"
                  v-model="defOrg.orgIntroduce"
                  :maxlength="140"
                  :autosize="{minRows: 5,maxRows: 8}"
                  placeholder="请填写组织介绍"
                />
              </FormItem>
              <FormItem label>
                <div class="btn" @click="onupdateOrg">保存</div>
              </FormItem>
            </Form>
          </div>
          <!-- 认证成功 -->

          <div class="certification stars" v-if="menuactive==1">
            <div class="setinfo" v-if="defOrg&&defOrg.authStatus==2">
              <div class="title" style="background:#ffffff;">组织认证</div>
              <div class="tit">
                <img src="../assets/img/zzgl10@2x.png" />
                <span>恭喜该组织已完成认证</span>
              </div>
              <ul style="list-style-type:none" v-if="defOrg&&defOrg.orgType==1">
                <li>
                  组织名称：
                  <span>{{ defOrg.orgName }}</span>
                </li>
                <li>
                  组织类型：
                  <span>{{defOrg.orgTypeName}}</span>
                </li>
                <li>
                  证件架构代码：
                  <span>{{defOrg.orgCode}}</span>
                </li>
                <li>
                  证件所在城市：
                  <span>{{defOrg.orgProvince}} {{ defOrg.orgCity }}</span>
                </li>
                <li>
                  社会团体法人登记证书：
                  <span
                    class="hand"
                    @click="pop(defOrg.legalPersonCertificate,'社会团体法人登记证书')"
                    style="color:#2168eb;"
                  >查看</span>
                </li>
              </ul>

              <!-- 非商会 -->
              <ul style="list-style-type:none" v-if="defOrg&&defOrg.orgType!=1">
                <li>
                  组织名称 ：
                  <span>{{ defOrg.orgName }}</span>
                </li>
                <li>
                  组织类型 ：
                  <span>{{defOrg.orgTypeName}}</span>
                </li>
                <li>
                  姓名：
                  <span>{{defOrg.linkName}}</span>
                </li>
                <li>
                  身份证号码：
                  <span>{{defOrg.idcard}}</span>
                </li>
                <li>
                  身份证照片：
                  <span
                    @click="pop(defOrg.idcardPositive,'正面')"
                    style="color:#2168eb;"
                    class="hand"
                  >查看正面</span>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    class="hand"
                    @click="pop(defOrg.idcardBack,'反面')"
                    style="color:#2168eb;"
                  >查看反面</span>
                </li>
              </ul>
            </div>

            <!-- 认证失败 -->
            <div class="certification" v-if="menuactive==1">
              <div class="setinfo" v-if="defOrg&&defOrg.authStatus==3">
                <div class="title" style="background:#ffffff;">组织认证</div>
                <div class="tit">
                  <img src="../assets/img/1.png" />
                  <span>抱歉，该组织认证失败</span>
                </div>
                <ul class style="list-style-type:none" v-if="defOrg&&defOrg.orgType==1">
                  <li>
                    组织名称 ：
                    <span>{{ defOrg.orgName }}</span>
                  </li>
                  <li>
                    组织类型 ：
                    <span>{{defOrg.orgTypeName}}</span>
                  </li>
                  <li>
                    证件架构代码：
                    <span>{{defOrg.orgCode}}</span>
                  </li>
                  <li>
                    证件所在城市：
                    <span>{{defOrg.orgProvince}}&nbsp;&nbsp;{{ defOrg.orgCity }}</span>
                  </li>
                  <li>
                    社会团体法人登记证书：
                    <span
                      @click="pop(defOrg.legalPersonCertificate,'社会团体法人登记证书')"
                      style="color:#2168eb;"
                      class="hand"
                    >查看</span>
                  </li>
                </ul>

                <!-- 非商会 -->
                <ul style="list-style-type:none" v-if="defOrg&&defOrg.orgType!=1">
                  <li>
                    组织名称 ：
                    <span>{{ defOrg.orgName }}</span>
                  </li>
                  <li>
                    组织类型 ：
                    <span>{{defOrg.orgTypeName}}</span>
                  </li>
                  <li>
                    姓名：
                    <span>{{defOrg.linkName}}</span>
                  </li>
                  <li>
                    身份证号码：
                    <span>{{defOrg.idcard}}</span>
                  </li>
                  <li>
                    身份证照片：
                    <span
                      style="color:#2168eb;"
                      class="hand"
                      @click="pop(defOrg.idcardPositive,'身份证照片正面')"
                    >正{{defOrg.idcardPositive}}</span>
                    <span
                      class="hand"
                      style="color:#2168eb;"
                      @click="pop(defOrg.idcardBack,'身份证照片反面')"
                    >反{{defOrg.idcardBack}}</span>
                  </li>
                </ul>
                <div class="btn" @click="setauthStatus()">重新认证</div>
              </div>
            </div>
            <!-- 商协会 -->
            <!-- 组织认证非商协会-->

            <div class="setinfo" v-if="menuactive==1&&defOrg&&defOrg.authStatus!=2&&defOrg.authStatus!=3">
              <div class="title" style="background:#ffffff;">组织认证</div>

              <div
                class="loading"
                :class="{active3:certification==2,active2:certification==1,active1:certification==0}"
              >
                <div class="box">
                  <span></span>
                </div>
                <div class="text text1">
                  <span>1</span>
                  <p v-if="defOrg&&defOrg.orgType!=1">身份认证</p>
                  <p v-if="defOrg&&defOrg.orgType==1">组织认证</p>
                </div>
                <div class="text text2">
                  <span>2</span>
                  <p>关系认证</p>
                </div>
                <div class="text text3">
                  <span>3</span>
                  <p>认证审核</p>
                </div>
              </div>
              <Form
                :model="formorgAuthentication"
                :rules="formorgAuthenticationRules"
                :label-width="100"
                v-if="certification==0&&defOrg&&defOrg.authStatus==0&&defOrg&&defOrg.orgType==3"
              >
                <FormItem label="姓名" prop="linkName">
                  <Input v-model="formorgAuthentication.linkName" placeholder="请输入姓名" />
                </FormItem>
                <FormItem label="身份证号" prop="idcard">
                  <Input v-model="formorgAuthentication.idcard" placeholder="请输入身份证" />
                </FormItem>
                <FormItem label class="uploadpic hand" prop="idcardBack">
                  <div class="item hand">
                    <Upload
                      @success="upidcardPositive"
                      :personalInfo="personalInfo"
                      :mimeType="mimeType"
                      @error="error"
                      type='file'
                    >
                      <div
                        v-if="!formorgAuthentication.idcardPositive||formorgAuthentication.idcardPositive==''"
                      >
                        <span class="pic" style="background-size:170px; border-radius:0"></span>
                        <p>上传</p>
                      </div>

                      <div
                        v-if="formorgAuthentication.idcardPositive&&formorgAuthentication.idcardPositive!=''"
                      >
                        <img
                          :src="formorgAuthentication.idcardPositive"
                          alt
                          class="pic2"
                          style="background-size:170px; border-radius:0"
                        />
                        <p>重传</p>
                      </div>
                    </Upload>
                  </div>
                  <div class="item" style="margin-right: 7px;">
                    <Upload
                      @success="upidcardBack"
                      :personalInfo="personalInfo"
                      :mimeType="mimeType"
                      @error="error"
                      type='file'
                    >
                      <div
                        v-if="!formorgAuthentication.idcardBack||formorgAuthentication.idcardBack==''"
                      >
                        <span class="pic2" style="background-size:170px; border-radius:0"></span>
                        <p>上传</p>
                      </div>

                      <div
                        v-if="formorgAuthentication.idcardBack&&formorgAuthentication.idcardBack!=''"
                      >
                        <img
                          :src="formorgAuthentication.idcardBack"
                          alt
                          class="pic"
                          style="background-size:170px; border-radius:0"
                        />
                        <p>重传</p>
                      </div>
                    </Upload>
                  </div>
                </FormItem>
                <FormItem label>
                  <div class="btn" @click="onorgAuthentication">保存</div>
                </FormItem>
              </Form>

              <!-- 商协会第一步认证 -->
              <Form
                :label-width="165"
                :model="formorgAuthentication"
                :rules="formorgAuthenticationRules"
                v-if="certification==0&&defOrg&&defOrg.authStatus==0&&defOrg&&defOrg.orgType!=3"
              >
                <FormItem label="组织名称" prop="authenticatedName">
                  <Input v-model="formorgAuthentication.authenticatedName" placeholder="请输入组织名称" />
                </FormItem>
                <FormItem label="组织机构代码" prop="orgCode">
                  <Input v-model="formorgAuthentication.orgCode" placeholder="请输入组织机构代码" />
                </FormItem>
                <FormItem label="证件所在城市" prop="orgProvince" style="width:600px;">
                  <!-- <Input v-model="formorgAuthentication.orgProvince" placeholder="请填写地址"></Input> -->

                  <select
                    v-model="formorgAuthentication.province"
                    @change="changeProvince(formorgAuthentication.province)"
                    style="display: inline-block;height:40px;width:170px;overflow:hiddenline-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff; background-image: none;position: relative;cursor: text;"
                  >
                    <option :value="1" style="color: #b6b6b6" disabled selected>请选择省级</option>
                    <option v-for="(t,i) in province" :key="i" :value="t">{{t.name}}</option>
                  </select>
                  <select
                    v-model="formorgAuthentication.orgCity"
                    style="display: inline-block;height:40px;width:170px;overflow:hiddenline-height: 1.5;padding: 4px 7px;font-size: 14px;border: 1px solid #C7C7C7;border-radius: 2px;color: #515a6e;background-color: #fff; background-image: none;position: relative;cursor: text;margin-left:10px;"
                  >
                    <option :value="1" style="color: #b6b6b6" disabled selected>请选择</option>
                    <option v-for="(c,i) in city" :key="i" :value="c.name">{{c.name}}</option>
                  </select>
                </FormItem>
                <FormItem label="社会团体法人登记证书" class="uploadpic" prop="legalPersonCertificate">
                  <div class="item" style="margin-right: 7px;width:270px;">
                    <Upload
                      @success="uplegalPersonCertificate"
                      :personalInfo="personalInfo"
                      :mimeType="mimeType"
                      @error="error"
                    >
                      <div
                        v-if="!formorgAuthentication.legalPersonCertificate||formorgAuthentication.legalPersonCertificate==''"
                      >
                        <span
                          class="pic pic1 hand"
                          style="width: 154px; height: 204px;background-size:154px 204px; border-radius:0"
                        ></span>
                        <p class="hand">上传</p>
                      </div>
                      <div
                        v-if="formorgAuthentication.legalPersonCertificate&&formorgAuthentication.legalPersonCertificate!=''"
                      >
                        <img
                          :src="formorgAuthentication.legalPersonCertificate"
                          alt
                          class="pic hand"
                          style="width: 270px; height: 338px;background-size:270px 338px; border-radius:0"
                        />
                        <p class="hand">重传</p>
                      </div>
                    </Upload>
                  </div>
                </FormItem>
                <FormItem label>
                  <div class="btn" @click="onorgAuthentication">保存</div>
                </FormItem>
              </Form>

              <Form style="margin-left: 20px;" :label-width="116" v-if="certification==1">
                <FormItem label="官方认证申请公函" class="download">
                  <a class="down-btn" :href="downloadUrl" download="" title="下载模板" mce_href="#">下载模板</a>
                </FormItem>
                <FormItem label="上传申请公函" class="uploadpic">
                  <div class="item" style="margin-right: 7px;">
                    <Upload
                      @success="uplegalPersonFile"
                      :personalInfo="personalInfo"
                      :mimeType="mimeType"
                      @error="error"
                      type='file'
                    >
                      <!-- <div class="tips">如在职证明等，并需要加盖红色公章</div> -->
                      <div
                        v-if="!formorgAuthentication.legalPersonFile||formorgAuthentication.legalPersonFile==''"
                      >
                        <span
                          class="pic3 hand"
                          style="background-size:154px 204px; border-radius:0"
                        ></span>
                        <p class="hand" style="width:156px">上传</p>
                      </div>

                      <div
                        v-if="formorgAuthentication.legalPersonFile&&formorgAuthentication.legalPersonFile!=''"
                      >
                        <img
                          class="hand"
                          :src="formorgAuthentication.legalPersonFile"
                          style="  width: 154px; height:204px;border-radius: 10px;overflow: hidden;border:1px solid #ccc"
                          alt
                        />
                        <p class="hand" style="width:156px">重传</p>
                      </div>
                    </Upload>
                  </div>
                </FormItem>
                <div
                  class="btn"
                  style="margin-top: 36px;margin-left: 120px;"
                  @click="onorgAuthentication"
                >保存</div>
              </Form>
              <div
                style="font-size: 14px;padding-left: 20px;margin-top: 60px;"
                v-if="certification==2&&defOrg&&defOrg.authStatus==1"
              >{{defOrg&&defOrg.authStatus==1?'恭喜，已完成资料上传，人工审核中，请耐心等待':'恭喜，认证通过！'}}</div>
            </div>
          </div>
          <!-- <div class="zzsetup" v-if="menuactive==2">
						<div class="table">
							<div class="mt">
								<div class="item" style="width: 98px;">姓名</div>
								<div class="item" style="width: 500px;">手机号</div>
								<div class="item" style="text-align: right;float: right;">
									<div class="btn">添加</div>
								</div>
							</div>
							<div class="mc">
								<div class="item" style="width: 98px;">张豆豆</div>
								<div class="item" style="width: 500px;">13899899239</div>
								<div class="item">
									<span class="edit"><img src="../assets/img/zzgl7@2x.png" alt=""></span>
									<span class="del"><img src="../assets/img/zzgl8@2x.png" alt=""></span>
								</div>
							</div>
							<div class="mc">
								<div class="item" style="width: 98px;"><Input placeholder="请输入姓名" /></div>
								<div class="item" style="width: 500px;"><Input placeholder="请输入手机号" /></div>
								<div class="item">
									<span class="edit"><img src="../assets/img/zzgl7@2x.png" alt=""></span>
									<span class="del"><img src="../assets/img/zzgl8@2x.png" alt=""></span>
								</div>
							</div>
						</div>
						<div class="addbtn">保存</div>
          </div>-->
          <div class="setadmin" v-if="menuactive==3">
            <div class="tit">主管理员</div>
            <div class="table">
              <div class="mt">
                <div class="item" style="width: 198px;">姓名</div>
                <div class="item" style="width: 250px;text-align: center;">手机号</div>
                <div class="item" style="width: 200px;text-align: right;float: right;">操作</div>
              </div>
              <div class="mc">
                <div class="item" style="width: 198px;">{{supervisor.manager}}</div>
                <div
                  class="item"
                  style="width: 250px;text-align: center;"
                >{{supervisor.managerPhone}}</div>
                <div class="item handle" style="width: 200px;">
                  <span @click="tolayer(1)" v-if="isOrg==5">更换</span>
                </div>
              </div>
            </div>

            <div class="tit" style="margin-top: 30px;">
              管理员
              <span class="add" @click="addAdmin()" v-if="isOrg==5">添加管理员</span>
            </div>
            <div class="table">
              <div class="mt">
                <div class="item" style="width: 198px;">姓名</div>
                <div class="item" style="width: 250px;text-align: center;">手机号</div>
                <div class="item handle" style="width: 200px;">操作</div>
              </div>
              <div class="mc" v-for="(v,i) in manage.list" :key="i" v-if="v.isSupervisor==0">
                <div class="item" style="width: 198px;">{{v.manager}}</div>
                <div class="item" style="width: 250px; text-align: center;">{{v.managerPhone}}</div>
                <div class="item handle" style="width: 200px;">
                  <span @click="setOrgManageList(v)" v-if="isOrg==5">权限设置</span>
                  <span @click="delOrgManage(v)" v-if="isOrg==5">移除管理员</span>
                </div>
              </div>
            </div>
            <Page
              v-if="manage.list.length>0"
              :current.sync="manage.page"
              style="text-align: right;margin-top: 20px;"
              :total="manage.total==0?0:manage.total-1"
              @on-change="getOrgManagerList"
              show-elevator
              :page-size="10"
              :show-total="true"
            />
          </div>
          <!--商会简介-->
          <div class="rightcont1" v-show="menuactive==4&&synopsis==0">
            <div>
              <div class="rightcont-top clear">
                <div class="tit fl">{{defOrg&&defOrg.orgType ==1?'商':'协'}}会简介</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="authbox fl">{{defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
                <div class="item fr">
                  <div v-if='defOrg&&defOrg.authStatus==2' class="addbtn" @click="saveIntroduce">保存</div>
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="addbtn addbtn1">保存</div>
                </div>
              </div>
              <Form ref="formValidate" :label-width="100" :model="formValue">
                <FormItem label="内容" class="editor">
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                  <div ref="editor" v-model="commerceIntroduce.intro" @click="getToken($event)"></div>
                  <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                  <!-- {{content}} -->
                </FormItem>
                <div class="line"></div>
                <div style="margin-bottom:20px;">
                  联系资料
                  <span style="color:#999999;">（选填）</span>
                </div>
                <FormItem label="电话">
                  <Input style="width:100px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="5" v-model="commerceIntroduce.area" />
                  <span style="width:40px;margin:0 5px;border-bottom:1px solid #c7c7c7;display: inline-block;"></span>
                  <Input style="width:200px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="11" v-model="commerceIntroduce.telephone1" />
                </FormItem>
                <FormItem label="传真">
                  <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="commerceIntroduce.fax" />
                </FormItem>
                <FormItem label="电子邮箱">
                  <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="commerceIntroduce.mail" />
                </FormItem>
                <FormItem label="地址">
                  <Input
                    v-model="commerceIntroduce.address"
                    :disabled="defOrg&&defOrg.authStatus!=2"
                    style="width:350px;"
                    placeholder="例如:杭州市滨江区滨盛路12号"
                  />
                  <img
                    src="../assets/img/dddw.png"
                    class="dddwicon"
                    style="vertical-align:middle;cursor:pointer;padding:10px 16px"
                    alt
                    @click="defOrg&&defOrg.authStatus!=2?'':tolayer(3)"
                  />
                </FormItem>
              </Form>
            </div>
          </div>
          <!--商会章程-->
          <div class="rightcont1" v-show="menuactive==4&&synopsis==1">
            <div>
              <div class="rightcont-top clear">
                <div class="tit fl">{{defOrg&&defOrg.orgType ==1?'商':'协'}}会章程</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="authbox fl">{{defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
                <div class="item fr">
                  <div v-if='defOrg&&defOrg.authStatus==2' class="addbtn" @click="saveIntroduce">保存</div>
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="addbtn addbtn1">保存</div>
                </div>
              </div>
              <Form ref="formValidate" :label-width="100" :model="formValue">
                <FormItem label="内容" class="editor">
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                  <div ref="editor1" v-model="commerceIntroduce.rule" @click="getToken($event)"></div>
                  <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                  <!-- {{content}} -->
                </FormItem>
              </Form>
            </div>
          </div>
          <!--组织机构-->
          <div class="rightcont1" v-show="menuactive==4&&synopsis==2">
            <div>
              <div class="rightcont-top clear">
                <div class="tit fl">组织机构</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="authbox fl">{{defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
                <div class="item fr">
                  <div v-if='defOrg&&defOrg.authStatus==2' class="addbtn" @click="saveIntroduce">保存</div>
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="addbtn addbtn1">保存</div>
                </div>
              </div>
              <Form ref="formValidate" :label-width="100" :model="formValue">
                <FormItem label="内容" class="editor">
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                  <div ref="editor2" v-model="commerceIntroduce.org" @click="getToken($event)"></div>
                  <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                  <!-- {{content}} -->
                </FormItem>
              </Form>
            </div>
          </div>
           <!--会员风采-->
          <div class="rightcont1" v-show="menuactive==4&&synopsis==3">
            <div>
              <div class="rightcont-top clear">
                <div class="tit fl">会员风采</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="authbox fl">{{defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
                <div class="item fr">
                  <div v-if='defOrg&&defOrg.authStatus==2' class="addbtn" @click="addPre">新增</div>
                  <div v-if='defOrg&&defOrg.authStatus!=2' class="addbtn addbtn1">新增</div>
                </div>
              </div>
              <div>
                <div class="memberbox clear" v-for='(v,i) in commerceIntroduce.member' :key='i'>
                  <img class="member-img fl" :src="v.photo" alt="">
                  <div class="member-right fl">
                    <p style="font-size:20px;color:#333333;">{{v.name}}  </p>
                    <div class="m-delete" @click.stop="deleteMember(v.id)"><img src="./../assets/img/szsshbj2@3x.png" alt=""></div>
                    <div class="m-delete1 m-delete" @click.stop="toMemberPage(v)"><img src="./../assets/img/szsshbj1@3x.png" alt=""></div>
                    <p style="font-size:14px;line-height:20px;color:#999999;margin-top:5px;"><span v-if='v.nation' style="padding-right:10px; margin-right:10px; border-right:1px solid #999999;">{{v.nation}}</span><span>{{v.birthdayStr}}</span><span v-if='v.birthplace' style="margin-left:10px;padding-left:10px;border-left:1px solid #999999;">{{v.birthplace}}</span></p>
                    <div class="clear">
                      <img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/gwszsxh3.4@3x.png" alt="">
                      <span class="member-txt fl">现任职务：</span>
                      <div class="member-content fl"><p v-for="(item,index) in v.position" :key="index">{{item}}</p></div>
                    </div>
                    <div class="clear">
                      <img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/gwszsxh3.5@3x.png" alt="">
                      <span class="member-txt fl">历任职务：</span>
                      <div class="member-content fl"><p v-for="(item,index) in v.prevPosition" :key="index">{{item}}</p></div>
                    </div>
                    <div class="clear">
                      <img style='width:16px;height:16px;float:left;margin-top:7px;' src="../assets/img/gwszsxh3.6@3x.png" alt="">
                      <span class="member-txt fl">主要成就：</span>
                      <div class="member-content fl" style="width:450px;word-wrap:break-word;word-break:break-all;" v-html="v.achievement"></div>
                    </div>
                  </div>
                </div>
                <div v-if='!commerceIntroduce.member'>
									<img style="margin:140px 211px;" src="../assets/img/search2.png" alt="">
								</div>
              </div>
            </div>
          </div>
          <!-- 会长、会员 -->
          <div class="rightcont1" v-show="menuactive==4&&synopsis==4">
            <div class="rightcont-top clear">
              <div class="tit fl" style="line-height: 40px;">{{isMember?'会员风采':'会长'}}</div>
              <div v-if='defOrg&&defOrg.authStatus!=2' style="margin-top:7px;" class="authbox fl">{{defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
            </div>
            <Form ref="formValidate" :label-width="100" :model="pre" :rules="preRules"> 
              <FormItem label="姓名" prop="name">
                <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="11" v-model="pre.name" />
              </FormItem>
              <FormItem label="个人照片" class="clear img" prop="img">
                <div class="clear" style="position:relative">
                    <div v-if='defOrg&&defOrg.authStatus!=2' style="width: 110px;height: 154px;background: rgba(238, 238, 238, 0.04);position: absolute;cursor: no-drop;left: 0;top: 0;z-index: 99999;"></div>
                    <Upload @success="upImagesSuccess" @error="upImagesError" :personalInfo="personalInfo" :mimeType="mimeType" class="fl">
                        <div v-if="!pre.photo" style="width: 110px;height: 154px;padding: 63px 39px;border:1px solid #DDD;border-radius: 5px;background:#FAFAFA;">
                            <img src="../assets/img/pz@3x.png" alt="" style="width: 100%;height: auto;">
                        </div>
                        <img :src="pre.photo" v-else class="img">
                        <p class="up-btn" >上传</p>
                    </Upload>
                </div>
                <!-- <div class="remark">建议上传750*750px尺寸图片</div> -->
              </FormItem>
              <div class="line"></div>
              <FormItem label="民族">
                <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="pre.nation" />
              </FormItem>
              <FormItem label="出生地">
                <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="pre.birthplace" />
              </FormItem>
              <FormItem label="出生日期">
                <DatePicker :disabled="defOrg&&defOrg.authStatus!=2" class="actEndTime" format="yyyy-MM-dd" :start-date="new Date()" @on-change="getBirth" :value="pre.birthday" type="date" placeholder="选择日期" style="width: 350px;"></DatePicker>
              </FormItem>
              <div class="line"></div>
              <FormItem label="现任职务" class="position">
                <div class="add-btn" :style="defOrg&&defOrg.authStatus!=2?'background:#bbbbbb;color:#ffffff;cursor: no-drop;':''" @click="addPosition('position')" v-if="pre.position.length < 10">添加现任职务</div>
                <div class="input-position" v-for="(item,index) in pre.position" :key="index">
                  <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="pre.position[index]" />
                  <input type="button" :disabled="defOrg&&defOrg.authStatus!=2" class="pos-btn" value="删除" @click="removeArray(pre.position,pre.position[index])"/>
                </div>
              </FormItem>
              <div class="line"></div>
              <FormItem label="历任职务" class="position">
                <div class="add-btn" :class="pre.prevPosition.length<1? 'add-btn1':''" :style="defOrg&&defOrg.authStatus!=2?'background:#bbbbbb;color:#ffffff;cursor: no-drop;':''" @click="addPosition('prevPosition')"  v-if="pre.prevPosition.length < 10">添加历任职务</div>
                <div class="input-position" v-for="(item,index) in pre.prevPosition" :key="index">
                  <Input style="width:350px;" :disabled="defOrg&&defOrg.authStatus!=2" :maxlength="35" v-model="pre.prevPosition[index]" />
                  <input type="button" :disabled="defOrg&&defOrg.authStatus!=2" class="pos-btn" value="删除" @click="removeArray(pre.prevPosition,pre.prevPosition[index])"/>
                </div>
              </FormItem>
              <div class="line line1"></div>
              <FormItem label="主要成就" class="editor" v-show="!isMember">
                <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                <div ref="editor3" v-model="pre.achievement" @click="getToken($event)"></div>
                <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                <!-- {{content}} -->
              </FormItem>
              <FormItem label="主要成就" class="editor" v-show="isMember && !editMember">
                <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                <div ref="editor4" v-model="pre.achievement1" @click="getToken($event)"></div>
                <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                <!-- {{content}} -->
              </FormItem>
              <FormItem label="主要成就" class="editor" v-if="isMember&&editMember">
                <div v-if='defOrg&&defOrg.authStatus!=2' class="mantle"></div>
                <div ref="editor5" v-model="pre.achievement2" @click="getToken($event)"></div>
                <div class="editorHint">提示：请直接在本地图库上传图片，以避免图片在分享后不显示的情况</div>
                <!-- {{content}} -->
              </FormItem>
              <FormItem label>
                <div v-if='defOrg&&defOrg.authStatus==2' class="btn" @click="savePre">保存</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="btn" style="background:#bbbbbb;color:#ffffff;cursor: no-drop;">保存</div>
              </FormItem>
            </Form>
          </div>
          <!--商会荣誉-->
          <div v-show="menuactive==4&&synopsis==5">
            <div class="rightcont-top clear">
              <div class="tit fl">{{defOrg&&defOrg.orgType ==1?'商':'协'}}会荣誉</div>
              <div v-if='defOrg&&defOrg.authStatus!=2' class="authbox fl">{{defOrg&&defOrg.authStatus==0?'您的组织尚未认证，请先前往APP在组织内进行认证':'您的组织正在认证审核中，请耐心等待'}}</div>
              <div class="item fr" style="width: 300px;text-align: right;">
                <div v-if='defOrg&&defOrg.authStatus==2' class="addbtn" @click="toPage">发布{{defOrg&&defOrg.orgType ==1?'商':'协'}}会荣誉</div>
                <div v-if='defOrg&&defOrg.authStatus!=2' class="addbtn addbtn1">发布{{defOrg&&defOrg.orgType ==1?'商':'协'}}会荣誉</div>
              </div>
            </div>
            <div class="table">
              <div class="mt" style="padding-right:0px">
                <div class="item" style="width: 303px">发布人</div>
                <div class="item" style="width: 164px">主题</div>
                <div class="item" style="width: 153px">时间</div>
                <div class="item" style="min-width: 44px;text-align:left">操作</div>
              </div>
              <div class="mc" v-if="!allusers.data || !allusers.data.length">
                <div class="item" style="text-align: center; width:800px">暂无数据</div>
              </div>
              <div v-if="allusers.data">
                <div class="mc hand" v-for="(value,index) in allusers.data" style="overflow: hidden;padding-right: 0px; " :key="index">
                    <div class="item" style="width: 303px;padding-right:10px" :title="value.creatorName">{{value.creatorName?value.creatorName:' '}}</div>
                    <div class="item" style="width: 168px;padding-right:10px;color:#999999;" :title="value.title">{{value.title?value.title:' '}}</div>
                  <div class="item" style="width: 143px;color:#999999;">{{value.createdDate?new Date(value.createdDate).Format("yyyy-MM-dd hh:mm"):'' }}</div>
                  <div class="item" style="min-width: 44px" v-if="defOrg&&defOrg.isOrg==1|| defOrg&&defOrg.isOrg==5">
                    <span class="link" @click="getDetail(value)">删除</span>
                  </div>
                </div>
                <Page v-if="allusers.data" :current.sync="pageNumber" style="text-align: right;margin-top: 20px;" :total="allusers.totalElements"
                  @on-change="getOrgUserPage()" show-elevator :page-size="pageSize" :show-total="true" />
              </div>
            </div>
          </div>
        </div>
        <div class="cl"></div>
        <!-- 头像裁剪 -->
        <div
          class="layer staffeit"
          v-if="layer==4"
          style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);position: fixed;top: 0;left: 0;z-index:10002"
          >
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
                  @imgLoad="imgLoad"
                ></vueCropper>
              </div>
              <div style="margin-left:20px;">
                <div
                  class="show-preview"
                  :style="{'width': menuactive ==0&&isBanner?'300px':'150px', 'height':menuactive ==0&&isBanner?'166px':'155px',  'overflow': 'hidden', 'margin': '5px'}"
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

        <!-- 权限设置 -->

        <div class="layer layerView" v-if="layer==2">
          <div class="mask" @click="tolayer(0)"></div>
          <div class="content">
            <div class="title">权限设置</div>
            <div class="username">用户名：{{ edituserName }}</div>
            <div class="mc">
              <!-- <span class="label">全部权限</span> -->
              <!-- <input type="checkbox" value="0" v-model="allpowers"> -->
              <Checkbox v-model="allpowerss">全部权限</Checkbox>
            </div>
            <!-- {{powers}} -->
            <div class="mc" v-for="(v,i) in powers" :key="i" v-if="i>=0">
              <Checkbox v-model="powers[i].checked" label @on-change="closeAllPowers">{{v.name}}</Checkbox>
              <!-- <Checkbox v-model="powers[i].checked" label="" :onchange="s()">{{v.name}}</Checkbox> -->
            </div>
            <div class="btns">
              <div class="btn1" @click="tolayer(0)">取消</div>
              <div class="btn2" @click="makepower()">确定</div>
            </div>
          </div>
        </div>
        <!-- 地址  弹窗 -->
        <div class="layer staffeit" v-if="layer==3">
          <div class="mask" @click="tolayer(0)"></div>
          <div class="map">
            <!-- <iframe :src="'https://m.amap.com/picker/?key=12399ff0812339527e25693f6e3130ec'" style="width: 800px;height: 500px;"></iframe> -->
            <el-amap-search-box
              class="search-box"
              :search-option="searchOption"
              :on-search-result="onSearchResults"
            ></el-amap-search-box>
            <span @click="makesure(mark[0])" class="btn" style="float: right;">确定</span>
            <el-amap
              ref="map"
              vid="amapDemo"
              :center="center"
              :zoom="12"
              :events="events"
              class="amap-demo"
              style="width: 800px;height: 500px;"
            >
              <el-amap-marker v-for="(marker,index) in mark" :key="index" :position="marker"></el-amap-marker>
            </el-amap>
          </div>

          <!-- <el-amap vid="amapDemo" :zoom="zoom" :center="center"></el-amap> -->
        </div>
        <!-- layer更换主管理员 -->
        <div class="layer layerView" v-if="layer==1">
          <div class="mask" @click="tolayer(0)"></div>
          <div class="content">
            <div class="title">短信校验</div>
            <div style="display: flex;margin-top: 15px;">
              <div class="label" style="width: 20%;line-height: 40px;padding-left: 10px;">验证码</div>
              <Input
                type="text"
                v-model="verificationCode"
                placeholder="请输入验证码"
                style="width: 50%;"
                :maxlength="6"
              ></Input>
              <div
                class="getcode hand"
                style="width: 30%;text-align: center;line-height: 40px;background: #2168eb;color:#fff;margin-right: 10px;"
                @click="getCode"
              >{{isGetting?time+'s':'发送验证码'}}</div>
            </div>
            <div class="btns">
              <div class="btn1" @click="tolayer(0)">取消</div>
              <div class="btn2" @click="changeAdmin()">确定</div>
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
  name: "organizationset",
  components: {
    VueCropper
  },
  props: {
    defOrg: null, //切换组织后的信息
    personalInfo: null //登陆后 的用户信息
  },
  mounted() {
    if(this.commerceIntroduce){
    }else{
      this.WangEditMethod(this.$refs.editor,0);
      this.WangEditMethod1();
      this.WangEditMethod2();
      this.WangEditMethod3();
      this.WangEditMethod4();
    }
  },
  data() {
    let self = this;
    return {
      logourl: "",
      formorgAuthenticationRules: {
        linkName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        idcard: [
          {
            required: true,
            message: "身份证号不能为空",
            trigger: "blur"
          }
        ],
        idcardBack: [
          {
            required: true,
            message: "请上传证件照",
            trigger: "blur"
          }
        ],
        orgCode: [
          {
            required: true,
            message: "组织机构代码不能为空",
            trigger: "blur"
          }
        ],
        authenticatedName: [
          {
            required: true,
            message: "组织名称不能为空",
            trigger: "blur"
          }
        ],
        legalPersonCertificate: [
          {
            required: true,
            message: "请上传社会团体法人登记证书",
            trigger: "blur"
          }
        ],
        orgProvince: [
          {
            required: true,
            message: "证件所在地不能为空",
            trigger: "blur"
          }
        ]
      },

      // 表单规则校验
      formdaterule: {
        orgName: [
          {
            required: true,
            message: "请输入组织名称",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value.length < 2 || value.length > 16) {
                callback(new Error("长度必须为2-16个字符以内"));
              } else {
                var reg = new RegExp(
                  "[`~!@#$^&*()=|{}':',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
                );
                if (reg.test(value)) {
                  callback(new Error("不能含有特殊字符"));
                } else {
                  callback();
                }
              }
            },
            trigger: "change"
          }
        ],
        orgUrl: [
          {
            required: true,
            message: "请上传组织logo",
            trigger: "blur"
          }
        ],
        coverUrl: [
          {
            required: true,
            message: "请上传组织封面图",
            trigger: "blur"
          }
        ],
        orgIntroduce: [
          {
            required: true,
            message: "请填写组织介绍",
            trigger: "blur"
          }
        ]
      },
      // 当前用户是否为主管理员0普通1主管理员
      isSupervisor: 0,
      // 主管理员的信息
      admin: null,
      // 验证码
      verificationCode: "",
      // 倒计时
      time: 60,
      // 是否获取到验证码
      isGetting: false,
      // 判断是否触发allpowerss监听事件
      allpowers: false,
      allpowerss: false,
      // 地图
      maps: null,
      // province,city
      province: null,
      city: null,
      // 权限集合
      powers: [
        {
          name: "邀请加入",
          checked: false
        },
        {
          name: "发通知",
          checked: false
        },
        {
          name: "发资讯",
          checked: false
        },
        {
          name: "发资源",
          checked: false
        },
        {
          name: "组织架构",
          checked: false
        },
        {
          name: "发活动",
          checked: false
        },
        {
          name: "生日管理",
          checked: false
        },
        {
          name: "成员管理",
          checked: false
        },
        {
          name: "组织认证",
          checked: false
        },
        {
          name: "小组管理",
          checked: false
        },
        {
          name: "编辑组织认证详情",
          checked: false
        },
        {
          name: "发党建",
          checked: false
        }
      ],
      // powers1:false,
      menuactive: 3,
      certification: 0,
      setadmin: 1,
      layer: 0,
      formorgAuthentication: {
        legalPersonFile: "",
        linkName: "",
        idcard: "",
        idcardBack: "",
        idcardPositive: "",
        legalPersonCertificate: ""
      }, //组织认证
      mimeType: ["image/png", "image/jpeg", "image/jpg"],
      manage: {
        list: [],
        page: 1,
        total: 0
      },
      setManageUser: {
        user: ""
      },
      orgType: 0,
      orgUserList: [],
      radioAdminUserId: null,
      // 管理员临时信息保存
      adminUser: null,
      // 判断是否是主管理员 5是
      isOrg: 0,
      supervisor: {
        isSupervisor: 1,
        manager: "",
        managerPhone: ""
      },
      edituserName: "",
      synopsis: 0,
      content: "",
      content1: "",
      content2: "",
      formValue: {
        newsDigest: "",
        content: null
      },
      searchOption: {
        city: "青岛",
        citylimit: false
	    },
      events: {
        click(e) {
          // console.log(self)
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
              // console.log("result", result,self)
              if (result && result.regeocode) {
                if (result.regeocode.aois.length == 0) {
                  self.commerceIntroduce.latitude = e.lnglat.lat
                  self.commerceIntroduce.longitude = e.lnglat.lng
                  self.commerceIntroduce.address = result.regeocode.formattedAddress;
                } else {
                  self.commerceIntroduce.latitude = result.regeocode.aois[0].location.lat
                  self.commerceIntroduce.longitude = result.regeocode.aois[0].location.lng
                  self.commerceIntroduce.address = result.regeocode.formattedAddress;

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
      center: [120.477396, 36.305191],
      mark: [],
      commerceIntroduce:{
        address:"",
        latitude:"",
        longitude:""
      },
      pre:{
        name:"",
        nation:"",//民族
        birthplace:"",//出生地
        position:[],//现任职务
        prevPosition:[],//历任职务
        achievement:"",//主要成就
        achievement1:"",//主要成就
        birthday:"",//生日
        photo:"",
      },   //会长及会员
      preRules:{
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        position:[
          {
            required: true,
            // message: "姓名不能为空",
            // trigger: "blur"
          }
        ],
        img:[
          {
            required: true,
            // message: "姓名不能为空",
            // trigger: "blur"
          }
        ],
      },
      isMember:false,
      option: {
        img: "",
        size: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 110,
        autoCropHeight: 154,
        fixedBox: true
      },
      previews: {},
      headImg: "",
      name: "",
      modelSrc: "",
      isBanner:false,
      editMember:false,
      editor:null,
      downloadUrl:"",
      //组织用户
      allusers: {
        total: 1,
      },
      //分页
      pageNumber: 1,
      pageSize: 10,
    };
  },
  watch: {
    "formorgAuthentication.province": function(n, o) {
      // console.log(n)
      if (n != 1) {
        this.changeProvince(n);
      } else {
        this.formorgAuthentication.orgProvince = "";
      }
    },
    allpowerss: function(n, o) {
      if (n) {
        this.powers.forEach((v, i) => {
          this.powers[i].checked = true;
        });
        this.allpowers = false;
      } else {
        if (this.allpowers) {
          this.allpowers = false;
        } else {
          // console.log(n)
          if (n) {
            this.powers.forEach((v, i) => {
              this.powers[i].checked = true;
            });
          } else {
            this.powers.forEach((v, i) => {
              this.powers[i].checked = false;
            });
          }
        }
      }
    },
    // powers:function(n,o){
    // 	console.log("-----323------------")
    // 	n.
    // },
    selectAdminUserId: function(a, b) {
      this.$refs.selectMc.height = "240px";
      // console.log(this.$refs.selectMc.height)
      // console.log(a, b, this.selectAdminUserId);
    },
    defOrg(res) {
      // console.log(res,'defOrg')
      this.updateOrg = res;
      this.orgId = res.id;
      this.isOrg = res.isOrg;

      if (res.isOrg == 5) {
        this.isSupervisor = 1;
      }
      this.getOrgManagerList(this.manage.page);
      this.getOrgUserPage();
      this.getCommerceIntroduce();
    },
    synopsis(val,oldval){
      this.pageNumber =1;
      if(val==5 && oldval !=5){
        if(this.defOrg.authStatus==2){
          this.getHonor();
        }
      }
    },
  },
  created() {
    this.synopsis = this.$route.query.synopsis?this.$route.query.synopsis:0;
    this.orgType = this.local.fetch("orgType");
    this.menuactive = this.$route.params.page;
    if (this.defOrg) {
      this.orgId = this.defOrg.id;
      this.isOrg = this.defOrg.isOrg;
      this.logourl = this.defOrg.orgUrl;
      this.getOrgManagerList(this.manage.page);
      this.getOrgUserPage();
      this.getCommerceIntroduce();
    }
    // 获取省市列表
    this.getAddressByApi();
    this.mark = [this.center];
    setTimeout(this.getLocation(),300)
    
    // 官网获得认证公函下载连接
    this.download();
  },
  methods: {
    // 获取七牛云token
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
    // 省市联动
    changeProvince(v) {
      // console.log(v)
      this.formorgAuthentication.orgProvince = v.name;
      if (v != null) {
        this.city = v.list;
        this.formorgAuthentication.orgCity = v.list[0].name;
      }
    },
    // 获取省市列表
    getAddressByApi() {
      this.http
        .ajax({
          url: "webSite/areaList?uid=" + this.personalInfo.id,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            areaCode: 0
          }
        })
        .then(res => {
          // console.log(res)
          if (res.code == 200) {
            this.maps = res.data;
            this.province = res.data;
            this.formorgAuthentication.province = res.data[0];
            // console.log(res.data[0])
            // console.log(res.data[0].list[0].name)
            this.changeProvince(res.data[0]);
            this.formorgAuthentication.orgCity = res.data[0].list[0].name;
          }
        });
    },
    //商会简介
    synopsisbtn(n) {
      this.synopsis = n;
      this.isMember = false;
      if(this.commerceIntroduce.chairman && this.commerceIntroduce.chairman.length){
        this.pre = this.commerceIntroduce.chairman[0];
        if(this.pre.birthday){
          this.pre.birthday = new Date(this.pre.birthday).Format("yyyy-MM-dd");
        }else{
          this.pre.birthday = "";
        }
      }
    },
    // 地图搜索

    onSearchResults(pois) {
      let latSum = 0;
      let lngSum = 0;
      // console.log(pois)
      this.center = [pois[0].lng, pois[0].lat];
      this.mark = [this.center];
    },
    // 地图确定
    makesure(e) {
      if (e == "" || e == null) {
        e = this.center;
      }
      var center = e;

      // return self.geocoder(self.center);
      // return console.log('geocoder',AMap);

      // 这里通过高德 SDK 完成。
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      var self = this;

      geocoder.getAddress(center, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.regeocode) {
            if (result.regeocode.aois.length == 0) {
              self.commerceIntroduce.latitude = e[1];
              self.commerceIntroduce.longitude = e[0];
              self.commerceIntroduce.address = result.regeocode.formattedAddress;
            } else {
              self.commerceIntroduce.latitude = result.regeocode.aois[0].location.lat;
              self.commerceIntroduce.longitude = result.regeocode.aois[0].location.lng;
              self.commerceIntroduce.address = result.regeocode.formattedAddress;
            }
            // console.log(self.address)
            self.layer = 0;
            // self.$nextTick();
          }
        }
      });
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
    getLocation() {
      const self = this;
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
    closeAllPowers() {
      var t = true;
      this.powers.forEach((v, i) => {
        if (!v.checked) {
          // console.log(v)
          t = false;
        }
      });
      if (t) {
        // this.allpowers = true
        this.allpowerss = true;
      } else {
        this.allpowerss = false;
        // 中间变量，为true时不触发allpowerss的监听
        this.allpowers = true;
      }
    },

    s() {
      var i = true;
      this.powers.forEach((v, i) => {
        if (!this.powers[i].checked) {
          i = false;
        }
      });
      this.allpowers = i;
    },

    // 重新认证
    setauthStatus() {
      this.defOrg.authStatus = 0;
    },
    // 确认验证码进行页面跳转
    changeAdmin() {
      if (this.verificationCode == "") {
        layer.msg("请输入验证码");
        return;
      }
      this.http
        .ajax({
          url: "webSite/verificationAdmin",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            telPhone: this.supervisor.managerPhone,
            // telPhone: this.admin.managerPhone,
            code: this.verificationCode
          }
        })
        .then(res => {
          // console.log(res)
          if (res.code == 200) {
            // 进行页面跳转
            this.$router.push({
              path: "/staff/3"
            });
          } else {
            layer.msg(res.msg);
          }
        });
    },
    // 获取验证码
    getCode() {
      if (this.isGetting) return;
      this.http
        .ajax({
          url: "webSite/verificationCode",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            type: "20",
            // telPhone: this.admin.managerPhone
            telPhone: this.supervisor.managerPhone
          }
        })
        .then(res => {
          // console.log(res)
          // console.log(this.personalInfo)
        });
      this.isGetting = true;
      //请求验证码

      //调用定时器 d
      var timer = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(timer);
          timer = null;
          this.time = 60;
          this.isGetting = false;
        } else {
          this.time--;
        }
      }, 1000);
    },

    // 确定修改权限
    makepower() {
      // console.log(this.powers)
      // console.log(this.adminUser)

      // console.log(this.powers)
      var p = [];
      for (var i = 0; i < this.powers.length; i++) {
        if (this.powers[i].checked == true) {
          p.push(i + 1 + "");
        }
      }
      // this.powers=p

      this.http
        .ajax({
          url: "webSite/orgStructure/addOrgManagerAuth",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            managerId: this.adminUser.id,
            authList: p
          }
        })
        .then(res => {
          // console.log(res)
          layer.msg(res.msg);
          this.layer = 0;
        });
    },
    // 添加管理员
    addAdmin() {
      // 通过路由跳转到人员管理界面，对人员管理的组织架构进行筛选管理员
      this.$router.push({
        path: "/staff/4",
        query: {
          menuactive: 4
        }
      });
    },
    //管理员权限设置
    setOrgManageList(e) {
      // console.log('@@@@@@@@',e.manager);
      this.edituserName = e.manager;
      this.allpowerss = false;
      this.http
        .ajax({
          url: "app/structure/orgManagerAuthList?uid=" + this.personalInfo.id,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            managerId: e.id
          }
        })
        .then(res => {
          // console.log(res)
          // layer.msg(res.msg)
          if (res.code == 200) {
            var list = [];
            this.powers.forEach((v, i) => {
              var temp = {
                name: null,
                checked: false
              };
              temp.name = v.name;
              // temp.checked = false;
              // console.log("v 值是",temp)
              list.push(temp);
            });

            // console.log("list 值是",list)

            for (var i = 0; i < res.data.length; i++) {
              // p.push(res.data[i].authVal)
              // console.log('@@@@@@@',v,v.authVal);
              // console.log("重复",i)
              var num = res.data[i].authVal;
              list[num - 1].checked = true;
            }
            // console.log("list[1]",list[1])
            var t = true;
            var n = 0;
            list.forEach((v, i) => {
              // console.log("第三次循环",v,i)
              if (!v.checked) {
                t = false;
                n++;
              }
            });
            // console.log(n)
            // console.log("powersde 值是",this.powers)
            if (n == 0) {
              this.allpowerss = true;
            } else {
              this.allpowerss = false;
            }

            this.powers = list;
            // console.log(this.powers)
            // this.powers = p
          }
        });
      // console.log(e)
      this.adminUser = e;
      this.layer = 2;
    },
    submit() {
      this.http
        .ajax({
          url:
            "webSite/app/org/newReplaceSupervisor?uid=" + this.personalInfo.id,
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            orgId: this.orgId,
            orgUserId: this.radioAdminUserId
            // "name": this.name
          }
        })
        .then(res => {
          // console.log(res)
          // layer.msg(res.msg)
          if (res.code == 200) {
          }
        });
    },
    setOrgManage(row) {},
    delOrgManage(row) {
      // console.log(row);
      // this.layer =1;
      // this.
      let _t = this;
      layer.confirm(
        '您确认要将<span style="color:red;">' +
          row.manager +
          "</span>移除管理员吗??",
        {
          title: ["移除管理员"],
          closeBtn: false,
          btnAlign: "c",
          shadeClose: true,
          skin: "yq-confirm",
          btn: ["取消", "确认"] //按钮
        },
        function() {
          layer.closeAll();
        },
        function() {
          _t.http
            .ajax({
              url: "webSite/orgStructure/removeOrgManager",
              method: "post",
              headers: {
                "Content-Type": " application/json"
              },
              data: {
                id: row.id
              }
            })
            .then(res => {
              if (res.code == 200) {
                layer.msg("移除成功");
                _t.getOrgManagerList(_t.manage.page);
              }
            });
        }
      );
    },
    //获取人员列表
    getOrgUserPage() {
      this.http
        .ajax({
          url: "webSite/getOrgUserPage",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            orgId: this.orgId,
            pageNumber: 1,
            pageSize: 99
            // "name": this.name
          }
        })
        .then(res => {
          // console.log(res)
          // layer.msg(res.msg)
          //展示组织用户的分頁數據
          if (res.code == 200) {
            this.orgUserList = res.data.rows;
          }
        });
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
            orgId: this.orgId,
          }
        })
        .then(res => {
          // console.log(res)
          // layer.msg(res.msg)
          //展示组织用户的分頁數據
          if (res.code == 200) {
            this.commerceIntroduce = res.data
            if(this.commerceIntroduce.telephone && this.commerceIntroduce.telephone.indexOf("-")!=-1){
              this.commerceIntroduce.area=this.commerceIntroduce.telephone.split('-')[0]
              this.commerceIntroduce.telephone1=this.commerceIntroduce.telephone.split('-')[1]
            }
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
              // if(this.menuactive==4&&this.synopsis==0){
                // console.log("商会1",this.$refs.editor)
                this.WangEditMethod(this.$refs.editor,0);
              // }else if(this.menuactive==4&&this.synopsis==1){
                this.WangEditMethod1();
              // }else if(this.menuactive==4&&this.synopsis==2){
                this.WangEditMethod2();
              // }else if(this.menuactive==4&&this.synopsis==4){
                this.WangEditMethod3();
                this.WangEditMethod4();
              // }
              // else if(res.data.member && res.data.member[0] && this.isMember){
              //   this.pre = res.data.member[0];
              // }
            }
          }
        });
    },
    error(res) {
      layer.msg("文件类型不正确,请重新上传");
      // console.log(res);
    },
    tomenu(n) {
      this.menuactive = n;
      if (n == 1) {
        if (this.defOrg.authStatus == 1) {
          this.certification = 2;
        }
      }
    },
    tolayer(n) {
      this.layer = n;
      if (n == 0) {
        this.powers.forEach((v, i) => {
          this.powers[i].checked = false;
        });
      }
    },
    uporgUrl(e) {
      this.option.autoCropWidth = 150;
      this.option.autoCropHeight = 150;
      this.headImg = e.url;
      this.option.img = e.url;
      this.name = e.name;
      this.layer =4;
      this.isBanner = false;
      // console.log(e)
    },
    upcoverUrl(e) {
      // this.defOrg.coverUrl = e.url;
      this.option.autoCropWidth = 300;
      this.option.autoCropHeight = 166;
      this.headImg = e.url;
      this.option.img = e.url;
      this.name = e.name;
      this.layer =4;
      this.isBanner = true;
    },
    upidcardBack(e) {
      this.formorgAuthentication.idcardBack = e.url;
      // console.log(e)
    },
    uplegalPersonCertificate(e) {
      this.formorgAuthentication.legalPersonCertificate = e.url;
      // this.formorgAuthentication.legalPersonCertificate = e.url
      // console.log(e)
    },
    upidcardPositive(e) {
      this.formorgAuthentication.idcardPositive = e.url;
      // console.log(e, '2222222')
    },
    uplegalPersonFile(e) {
      this.formorgAuthentication.legalPersonFile = e.url;
      // console.log(e)
    },

    onorgAuthentication() {

      if (this.orgType == 3) {
        if (this.formorgAuthentication.linkName == "") {
          layer.msg("请输入姓名");
          return;
        }

        if (this.formorgAuthentication.idcard == "") {
          layer.msg("请输入身份证号");
          return;
        }

        // 身份证号校验
        if (!this.validId(this.formorgAuthentication.idcard)) {
          return;
        }

        if (
          this.formorgAuthentication.idcardPositive != "" &&
          this.formorgAuthentication.idcardBack != ""
        ) {
          if (this.certification == 0) {
            this.certification = 1;
            return;
          }
        } else {
          layer.msg("请上传身份证文件照片");
          return;
        }
      } else {
        if (
          this.formorgAuthentication.authenticatedName == "" ||
          this.formorgAuthentication.orgCode == "" ||
          this.formorgAuthentication.orgProvince == "" ||
          this.formorgAuthentication.authenticatedName == null ||
          this.formorgAuthentication.orgCode == null ||
          this.formorgAuthentication.orgProvince == null ||
          this.formorgAuthentication.legalPersonCertificate == null
        ) {
          layer.msg("请输入相关信息");
          return;
        }
      }

      if (this.certification == 1) {
        if (this.formorgAuthentication.legalPersonFile == "") {
          layer.msg("请上传申请公函");
          return;
        }
      }

      if (this.certification == 0) {
        this.certification = 1;
        return;
      }

      this.http
        .ajax({
          url: "webSite/orgAuthentication",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            id: this.defOrg.id,
            authenticationStep: this.certification + 1,
            ...this.formorgAuthentication
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.certification = 2;
            this.$emit("getdefOrg", this.defOrg.id);
          }
        });
    },
    onupdateOrg() {
      if (this.defOrg.orgName == "") {
        layer.msg("请输入组织名称");
        return;
      }
      if (this.defOrg.orgName.length < 2 || this.defOrg.orgName.length > 16) {
        layer.msg("请输入正确的组织名称");
        return;
      }
      if (this.defOrg.coverUrl == "" && this.defOrg && this.defOrg.orgType !=1 && this.defOrg.orgType !=2) {
        layer.msg("请上传组织封面图");
        return;
      }
      // if (this.defOrg.orgIntroduce == "") {
      // 	layer.msg("请填写组织介绍")
      // 	return
      // }
      if (
        (this.logourl == "" || this.logourl == null) &&
        (this.defOrg.orgUrl == "" || this.defOrg.orgUrl == null)
      ) {
        layer.msg("请上传组织logo");
        return;
      }
      if (this.logourl == "" || this.logourl == null) {
        this.logourl = this.defOrg.orgUrl;
      }

      // 组织名称校验
      this.http
        .ajax({
          url: "webSite/checkAddOrg",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            orgName: this.defOrg.orgName,
            orgId: this.orgId
          }
        })
        .then(res => {
          if (res.code == 200 && res.data.orgId == "") {
            var t = false;
            this.http
              .ajax({
                url: "webSite/updateOrg",
                method: "post",
                headers: {
                  "Content-Type": " application/json"
                },
                data: {
                  id: this.defOrg.id,
                  coverUrl: this.defOrg.coverUrl,
                  orgIntroduce: this.defOrg.orgIntroduce,
                  orgUrl: this.logourl,
                  orgName: this.defOrg.orgName
                }
              })
              .then(res => {
                if (res.code == 200) {
                  t = true;
                  var _self = this;
                  layer.msg("更新成功！", { time: 500 }, function() {
                    _self.$router.go(0);

                    _self.logourl = _self.defOrg.orgUrl;
                  });

                  // layer.msg('更新成功！')
                }
              });

            // layer.msg(res.msg)
          } else {
            var _self = this;
            layer.msg("组织名已存在", { time: 500 }, function() {
              _self.$router.go(0);
            });
          }
        });
    },
    pop(url, tit) {
      if(!url){
        layer.msg('暂未上传')
        return
      }
      var img_infor = "<img src='" + url + "' />";
      layer.open({
        type: 1,
        title: tit,
        shadeClose: true,
        shade: 0.8,
        maxmin: false,
        area: ["auto", "80%"],
        content: img_infor //iframe的url
      });
    },
    getOrgManagerList(page) {
      // console.log('xxxxxxxxxxxxxxxxxxxxxxx');
      this.http
        .ajax({
          url: "webSite/orgStructure/orgManagerList",
          method: "post",
          headers: {
            "Content-Type": " application/json"
          },
          data: {
            pageSize: "10",
            pageNumber: page,
            orgId: this.orgId
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.manage.list = res.data.orgManagerEntityPage.rows;
            this.manage.total = res.data.orgManagerEntityPage.total;
            // console.log("----------------------")
            // console.log(res)
            //主管理员信息
            // this.admin = res.data.supervisor
            this.supervisor = res.data.supervisor;

            if (this.orgId == 5) {
              this.isSupervisor = 1;
            }
            // console.log(this.manage.list)
          }
        });
    },
    //校验身份证号码的主调用

    validId(obj) {
      var powers = new Array(
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2",
        "1",
        "6",
        "3",
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2"
      );
      var parityBit = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );

      var _id = obj;
      if (_id == "") return;
      var _valid = false;
      if (_id.length == 15) {
        _valid = this.validId15(_id);
      } else if (_id.length == 18) {
        _valid = this.validId18(_id);
      }
      if (!_valid) {
        layer.msg("身份证号码有误,请检查!");
      }

      return _valid;
    },
    //校验18位的身份证号码

    validId18(_id) {
      var powers = new Array(
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2",
        "1",
        "6",
        "3",
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2"
      );
      var parityBit = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      _id = _id + "";
      var _num = _id.substr(0, 17);
      var _parityBit = _id.substr(17);
      var _power = 0;
      for (var i = 0; i < 17; i++) {
        //校验每一位的合法性

        if (_num.charAt(i) < "0" || _num.charAt(i) > "9") {
          return false;
          break;
        } else {
          //加权

          _power += parseInt(_num.charAt(i)) * parseInt(powers[i]);
          //设置性别
        }
      }
      //取模

      var mod = parseInt(_power) % 11;
      if (parityBit[mod] == _parityBit) {
        return true;
      }
      return false;
    },
    //校验15位的身份证号码

    validId15(_id) {
      var powers = new Array(
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2",
        "1",
        "6",
        "3",
        "7",
        "9",
        "10",
        "5",
        "8",
        "4",
        "2"
      );
      var parityBit = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      _id = _id + "";
      for (var i = 0; i < _id.length; i++) {
        //校验每一位的合法性

        if (_id.charAt(i) < "0" || _id.charAt(i) > "9") {
          return false;
          break;
        }
      }
      var year = _id.substr(6, 2);
      var month = _id.substr(8, 2);
      var day = _id.substr(10, 2);
      var sexBit = _id.substr(14);
      //校验年份位

      if (year < "01" || year > "90") return false;
      //校验月份

      if (month < "01" || month > "12") return false;
      //校验日

      if (day < "01" || day > "31") return false;

      return true;
    },
    // 认证中禁用提示
    isAuthStatus() {
      if (this.defOrg.authStatus == 1) {
        layer.open({
          type: 0,
          title: "提示",
          btnAlign: "c",
          closeBtn: 0,
          content: "组织正在认证审核中，名称暂时无法修改"
        });
      }
    },
    WangEditMethod(ref,n) {
      var editor = new E(ref);
      if(n== 5){
        this.editor = new E(ref);
      }
      editor.customConfig.onchange = html => {
        let reg = new RegExp('<p></p>', 'g')
				html = html.replace(reg, '');
        if(n==0){
          this.commerceIntroduce.intro = html
        }else if(n==1){
          this.commerceIntroduce.rule = html
        }else if(n==2){
          this.commerceIntroduce.org = html  
        }else if(n==3){
          this.pre.achievement = html    
        }else if(n==4){
          this.pre.achievement1 = html    
        }else if(n==5){
          this.pre.achievement2 = html    
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
        }else if(n==3){
          if(this.pre.achievement){
            editor.txt.append(`<p>${this.pre.achievement}</p>`);
          }else{
            editor.txt.append(`<p><br></p>`)
          }
          // editor.cmd.do("insertHTML", this.pre.achievement);
        }else if(n==4){
          if(this.pre.achievement1){
            editor.txt.append(`<p>${this.pre.achievement1}</p>`);
          }else{
            editor.txt.append(`<p><br></p>`)
          }
          // editor.cmd.do("insertHTML", this.pre.achievement);
        }else if(n==5){
          if(this.pre.achievement2){
            editor.txt.append(`<p>${this.pre.achievement2}</p>`);
          }else{
            editor.txt.append(`<p><br></p>`)
          }
          // editor.cmd.do("insertHTML", this.pre.achievement);
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
    WangEditMethod3() {
      this.WangEditMethod(this.$refs.editor3,3);
    },
    WangEditMethod4() {
      this.WangEditMethod(this.$refs.editor4,4);
    },
    WangEditMethod5() {
      this.WangEditMethod(this.$refs.editor5,5);
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
                var sourceLink = domain + res.key; //获取上传成功后的文件的Url

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
    upImagesSuccess(e) {
      this.headImg = e.url;
      this.option.img = e.url;
      this.name = e.name;
      this.layer =4;
      this.option.autoCropWidth = 110;
      this.option.autoCropHeight = 154;
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
              this.layer = false;
              // 接收成功后返回的信息
              // console.log("图片地址", res.data.qiniuDomain + "/" + result.key);
              if(this.menuactive ==0 && !this.isBanner){
                this.logourl=res.data.qiniuDomain + "/" + result.key
              }else if(this.menuactive ==0 && this.isBanner){
                this.defOrg.coverUrl=res.data.qiniuDomain + "/" + result.key
              }else{
                this.pre.photo=res.data.qiniuDomain + "/" + result.key
              }
            }
          });
        });
    },
    upImagesError(e) {
      // console.log('图片上传失败',e)
    },
    getBirth(e){
      // console.log(e);
      this.pre.birthday = e;
    },
    addPosition(name){
      if(this.defOrg.authStatus!=2){
        return
      }else{
        this.pre[name].push('');
      }
    },
    //移除数组
    removeArray(_arr, _obj) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
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
    // 新增会员会长
    savePre(){
      if(!this.pre.name){
        layer.msg("请输入姓名")
        return
      }
      if(!this.pre.photo){
        layer.msg("请上传个人照片")
        return
      }

      for(var item of this.pre.position){
        if(!item){
          layer.msg("现任职务有未填写内容")
          return
        }
      }
      for(var item of this.pre.prevPosition){
        if(!item){
          layer.msg("历任职务有未填写内容")
          return
        }
      }
      if(this.pre.birthday){
        this.pre.birthday = new Date(this.pre.birthday).getTime() + "";
      }else{
        this.pre.birthday = "";
      }

      Object.assign(this.pre,{
        orgId:this.defOrg.id,
        inx:this.isMember?'1':'0'
      })
      if(this.isMember&& !this.editMember){
        this.pre.achievement = this.pre.achievement1
      }else if(this.isMember&& this.editMember){
        this.pre.achievement = this.pre.achievement2
      }
      var url = '';
      if((!this.commerceIntroduce.chairman || !this.commerceIntroduce.chairman.length)&& !this.isMember ||  this.isMember&&!this.editMember){
        // console.log("shouci")
        url= "webSite/businessGov/savePerson";
      }else{
        url= "webSite/businessGov/updatePerson";
      }
      this.http.ajax({
        url: url,
        method: 'post',
        headers: {
          "Content-Type": " application/json"
        },
        data: this.pre
      }).then( res =>{
        if (res.code == 200) {
          layer.msg("保存成功")
          this.getCommerceIntroduce(1);
          if(this.editMember || this.isMember){
            this.synopsis = 3;
          }
          this.editMember = false;
        }
      })
    },
    //跳会员页
    addPre(){
      this.menuactive=4;
      this.synopsis=4;
      this.isMember = true;
      this.editMember = false;
      this.pre = {
        name:"",
        nation:"",//民族
        birthplace:"",//出生地
        position:[],//现任职务
        prevPosition:[],//历任职务
        achievement:"",//主要成就
        achievement1:"",//主要成就
        birthday:"",//生日
        photo:"",
      }
    },
    // 保存组织介绍
    saveIntroduce(){
      let c = this.commerceIntroduce
      if(this.menuactive==4&&this.synopsis==0){
        if(c.area){
          c.telephone =c.area +'-'+ c.telephone1
        }
        if(!this.commerceIntroduce.intro){
          layer.msg(`请输入${defOrg.orgType ==1?'商':'协'}会简介`)
          return
        }
      }else if(this.menuactive==4&&this.synopsis==1){
        if(!this.commerceIntroduce.rule){
          layer.msg("请输入章程")
          return
        }
      }else if(this.menuactive==4&&this.synopsis==2){
        if(!this.commerceIntroduce.org){
          layer.msg("请输入组织机构")
          return
        }
      }
      // var data = {
      //   "id":this.ordId,
      //   "intro":this.commerceIntroduce.intro,
      //   "rule":this.commerceIntroduce.rule,
      //   "org":this.commerceIntroduce.org,
      //   "telephone":"4",
      //   "mail":"5",
      //   "address":"6",
      //   "fax":"7"
      // }
      this.commerceIntroduce.id = this.orgId;
      c.id = this.orgId;
      this.http.ajax({
        url: "webSite/businessGov/updateIntroduce",
        method: 'post',
        headers: {
          "Content-Type": " application/json"
        },
        data: c
      }).then( res =>{
        if (res.code == 200) {
          layer.msg("保存成功")
          // this.pre = {
          //   name:"",
          //   nation:"",//民族
          //   birthplace:"",//出生地
          //   position:[],//现任职务
          //   prevPosition:[],//历任职务
          //   achievement:"",//主要成就
          //   birthday:"",//生日
          //   photo:"",
          // }
        }
      })

    },
    toMemberPage(item){
      // console.log(item)
      this.pre = item;
      this.pre.birthday =  new Date(this.pre.birthday).Format("yyyy-MM-dd");
      this.pre.achievement2 = this.pre.achievement;
      this.isMember = true;
      this.menuactive = 4;
      this.synopsis = 4;
      this.editMember = true;
      // var editor = new E(this.$refs.editor5);
      setTimeout(()=>{
        this.WangEditMethod5();
      },500)
    },
    deleteMember(id){
      var that=this
				layer.confirm('您确认要删除吗？删除将无法恢复！', {
					title: ['安全警告'],
					closeBtn: false,
					btnAlign: 'c',
					shadeClose: true,
					skin: 'yq-confirm',
					btn: ['取消', '确认'] //按钮
				}, function() {
          layer.closeAll()
        }, function() {
          that.http.ajax({
            url: 'webSite/businessGov/delPerson',
            method: 'post',
            headers: {
              "Content-Type": " application/json"
            },
            data: {
              id: id
            }
          }).then( res =>{
            if(res.code == 200){
              layer.msg("删除成功");
              that.getCommerceIntroduce(1);
            }
          })
        });
    },
    download(){
      this.http.ajax({
        url: 'webSite/officialletter/downloadUrl?uid='+ this.personalInfo.id,
        method: 'post',
        headers: {
          "Content-Type": " application/json"
        },
        data: {}
      }).then( res =>{
        if(res.code == 200){
          // layer.msg("删除成功");
          this.downloadUrl = res.data;
        }
      })
    },
    toPage(){
      this.$router.push({
        path: "/addBusiness?type=honor",
      });
    },
    // 下架
    getDetail(value){
      
      // return
      this.http.ajax({
        url: 'webSite/businessGov/updateChannelActivityStatus',
        method: 'post',
        headers: {
          'Content-Type': ' application/json'
        },
        data:{
          id:value.id,
          status:this.menuactive==2?'1':'0'
        }
      }).then(res => {
        //展示组织用户的分頁數據
        if (res.code == 200) {
          this.getHonor()
        }
      })
    
    },
    //获取荣誉列表
    getHonor() {
      this.http.ajax({
        url: 'webSite/businessGov/searchBusinessActivity?pageNumber=' + this.pageNumber + "&size=" + this.pageSize,
        method: 'post',
        headers: {
          'Content-Type': ' application/json'
        },
        data: {
          // type:1500,
          type:2100,
          orgId:this.orgId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          status:this.menuactive==2?'0':'1'
        }
      }).then(res => {
        //展示组织用户的分頁數據
        if (res.code == 200) {
          this.allusers = res.data;
        }
      })
    },
  }
};
</script>

<style lang="less">
.organizationset {
  margin-bottom: 63px;
  .setinfo {
    .tit {
      margin: 10px 0;
      font-size:16px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:22px;
      img {
        display: inline-block;
        float: left;
      }

      span {
        padding-left: 5px;
      }
    }

    ul li {
      line-height: 35px;

      span {
        font-weight: 700;
      }
    }

    .btn {
      letter-spacing: 4px;
      padding: 0 16px 0 20px;
      margin-top: 15px;
    }
    .download{
      .ivu-form-item-label{
        width:140px !important;
      }
      .ivu-form-item-content{
        text-align: right;
      }
      .down-btn{
        display: inline-block;
        height:30px;
        line-height:30px;
        background:rgba(235,242,255,1);
        border-radius:15px;
        padding:0 14px;
        font-size:13px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(33,104,235,1);
        cursor: pointer;
      }
    }
  }

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
      .ivu-form-item {
        margin-bottom: 12px;
      }
      .rightcont-top {
        margin-bottom: 20px;
      }
      .memberbox{
        padding: 13px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.09);
        margin-bottom: 10px;
        position:relative;
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
      .mantle{
        width: 100%;
        height: 93%;
        background:rgba(238,238, 238, 0.4);
        position: absolute;
        cursor: no-drop;
        left: 0;
        top:0;
        z-index: 999999999;
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
      .line {
        border-bottom: 1px dotted #dddddd;
        margin-bottom: 17px;
      }
      .line1{
        // margin-top: 12px;
        margin-bottom: 23px;
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
      .addbtn1{
        background: #bbbbbb;
        color: #ffffff;
        cursor: no-drop;
      }
      .search-box {
        display: inline-block;
        position: absolute;
        // top: 15px;
        // left: 20px;
        border-style: solid;
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

      .upload_tips {
        font-size: 12px;
        color: #999999;
      }

      .upload_btn {
        width: 46px;
        height: 32px;
        background: rgba(235, 242, 255, 1);
        border-radius: 16px;
        text-align: center;
        line-height: 32px;
        color: #2168eb;
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
        display: inline-block;
      }

      .setadmin {
        .tit {
          height: 40px;
          line-height: 40px;
          font-size: 16px;

          .add {
            float: right;
            background: #2168eb;
            color: #fff;
            font-size: 14px;
            border-radius: 50px;
            padding: 0 15px;
            line-height: 30px;
            cursor: pointer;
          }
        }

        .handle {
          text-align: right;
          float: right;

          span {
            color: #2168eb;
            margin-left: 15px;
            cursor: pointer;
          }
        }

        .tips {
          padding-left: 100px;
          font-size: 12px;
          color: #999999;
          width: 500px;
          margin-bottom: 52px;
        }

        padding-top: 24px;

        .getcode {
          display: inline-block;
          width: 90px;
          height: 40px;
          background: rgba(235, 242, 255, 1);
          color: #2168eb;
          font-size: 13px;
          border-radius: 2px;
          margin-left: 2px;
          text-align: center;
          line-height: 40px;
        }

        .btn {
          color: #ffffff;
          width: 205px;
          height: 48px;
          line-height: 48px;
          background: rgba(33, 104, 235, 1);
          border-radius: 27px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }

        .time {
          display: block;
          position: absolute;
          width: 80px;
          height: 40px;
          line-height: 40px;
          background: rgba(216, 216, 216, 0.3);
          border-radius: 27px;
          right: -95px;
          font-size: 13px;
          text-align: center;
          top: 0;
        }

        .title {
          width: 722px;
          height: 40px;
          background: rgba(248, 248, 248, 1);
          padding-left: 22px;
          font-size: 16px;
          line-height: 40px;
        }

        .ivu-form {
          margin-right: 378px;
          margin-top: 40px;
        }
      }

      .zzsetup {
        margin-top: 24px;

        .addbtn {
          width: 205px;
          height: 48px;
          background: rgba(33, 104, 235, 1);
          border-radius: 27px;
          line-height: 48px;
          text-align: center;
          color: #ffffff;
          cursor: pointer;

          display: block;
          margin: 0 auto;
          margin-top: 43px;
        }

        .table {
          .link {
            color: #2168eb;
            margin: 0 7px;
            font-size: 12px;
          }

          .btn {
            width: 56px;
            height: 22px;
            background: rgba(33, 104, 235, 1);
            border-radius: 14px;
            color: #ffffff;
            text-align: center;
            line-height: 22px;
            vertical-align: middle;
            margin-top: 9px;
            cursor: pointer;
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

          .addbtn {
            height: 22px;
            line-height: 22px;
            vertical-align: middle;
            background: #2168eb;
            display: inline-block;
            text-align: center;
            -webkit-border-radius: 22px;
            -moz-border-radius: 22px;
            border-radius: 22px;
            color: #ffffff;
            font-size: 12px;
            padding: 0 10px;
            cursor: pointer;
          }

          .mc {
            border-bottom: 1px solid #eee;
          }

          .mt,
          .mc {
            padding-left: 20px;
            padding-right: 20px;
            text-align: left;

            .item {
              text-align: left;
              height: 60px;
              line-height: 60px;
              display: inline-block;
              min-width: 60px;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
              vertical-align: middle;
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

      .certification {
        .ivu-form {
          padding-top: 50px;
          margin-right: 276px;

          li {
            line-height: 35px;
          }

          .btn {
            width: 205px;
            height: 48px;
            background: rgba(33, 104, 235, 1);
            border-radius: 27px;
            line-height: 48px;
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            margin-bottom: 30px;
          }

          .uploadpic {
            img {
              width: 170px;
              height: 110px;
              display: inline-block;
            }

            .item {
              .tips {
                margin-bottom: 6px;
              }

              display: inline-block;

              .pic,
              .pic2 {
                width: 170px;
                height: 110px;
                display: block;
                background: url("../assets/img/zzrzsh1@2x.png");
                overflow: hidden;
                border-radius: 10px;
              }

              .pic2 {
                background: url("../assets/img/zzrzsh2@2x.png");
              }

              .pic3 {
                width: 154px;
                height: 204px;
                display: block;
                border-radius: 6px;

                background: url("../assets/img/szsxhgw2@3x.png");
              }

              .pic1 {
                background: url("../assets/img/zzrzsh4@2x.png");
              }

              p {
                font-size: 14px;
                color: #2168eb;
                text-align: center;
                line-height: 14px;
                margin-top: 15px;
                width: 240px;
              }
            }
          }
        }

        .loading {
          margin-top: 70px;
          margin-left: 74px;

          .box {
            width: 285px;
            height: 2px;
            background: #dddddd;

            span {
              width: 50%;
              display: block;
              height: 2px;
              background: #2168eb;
            }
          }

          .text {
            display: inline-block;
            margin-right: 100px;
            width: 100px;
            text-align: center;
            margin-left: -50px;
            margin-top: -15px;

            span {
              display: block;
              width: 32px;
              height: 32px;
              background: #eeeeee;
              text-align: center;
              line-height: 32px;
              font-size: 24px;

              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;

              margin: 0 auto;
            }

            p {
              margin-top: 21px;
              font-size: 14px;
            }
          }
        }

        .active1 {
          .box {
            span {
              width: 0%;
            }
          }

          .text1 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }
        }

        .active2 {
          .box {
            span {
              width: 50%;
            }
          }

          .text1 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }

          .text2 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }
        }

        .active3 {
          .box {
            span {
              width: 100%;
            }
          }

          .text1 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }

          .text2 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }

          .text3 {
            span {
              background: #2168eb;
              color: #ffffff;
            }
          }
        }

        .title {
          width: 722px;
          height: 40px;
          background: rgba(248, 248, 248, 1);
          padding-left: 22px;
          font-size: 16px;
          line-height: 40px;
        }
      }

      .form {
        .ivu-form {
          margin-right: 270px;
        }

        .btn {
          width: 205px;
          height: 48px;
          line-height: 48px;
          background: rgba(33, 104, 235, 1);
          border-radius: 27px;
          color: #ffffff;
          text-align: center;
          font-size: 14px;
          margin-bottom: 30px;
        }

        .title {
          height: 40px;
          line-height: 40px;
          padding-left: 22px;
          background: #f8f8f8;
          margin-bottom: 34px;
          margin-top: 24px;
          font-size: 16px;
        }

        .uploadpic1 {
          position: relative;

          span {
            top: 0;
            bottom: 0;
            left: 0;
            right: -5px;
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
          }

          img {
            width: 57px;
            height: 57px;
            -webkit-border-radius: 57px;
            -moz-border-radius: 57px;
            border-radius: 57px;
          }

          width: 57px;
          height: 57px;
          text-align: center;
          line-height: 57px;
          color: #2168eb;
          background: rgba(250, 250, 250, 1);
          border: 1px solid rgba(221, 221, 221, 1);
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
        }

        .uploadpic {
          width: 350px;
          height: 153px;
          background: #fafafa url("../assets/img/pz@2x.png") no-repeat center
            center;
          border-radius: 5px;
          border: 1px solid #ddd;

          img {
            width: 100%;
            max-height: 100%;
          }
        }

        .uploadpic_tips {
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .rightcont1{
      .ivu-select-dropdown{
        z-index: 10002;
      }
      .ivu-form-item {
        margin-bottom: 24px;
      }

      .img {
        width:110px;
        height:154px;
        border-radius: 5px;
        min-height:100%;
      }
      .up-btn{
        position: absolute;
        top:0px;
        left:70px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        color:rgba(33,104,235,1);
        line-height:20px;
        cursor: pointer;
        padding:6px;
        width: 40px;
      }
      .up-btn1{
        left: 306px;
      }
      .position{
        padding-top: 6px;
        margin-bottom:0; 
        .ivu-form-item-label{
          padding: 4px 12px 10px 0;
        }
        .add-btn{
          width:98px;
          height:22px;
          line-height:22px;
          background:rgba(33,104,235,1);
          border-radius:14px;
          text-align: center;
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          color:rgba(255,255,255,1);
          margin-bottom:12px;
          cursor: pointer;
        }
        .add-btn1{
          margin-bottom:22px; 
        }
        .input-position{
          margin-bottom:22px;
        }
        .pos-btn{
          background:#fff;
          height:26px;
          line-height:26px;
          border-radius:15px;
          border:1px solid rgba(248,20,20,1);
          font-size:12px;
          font-family:PingFangSC-Regular,PingFang SC;
          color:rgba(248,20,20,1);
          line-height:17px;
          padding:0 7px;
          margin-left:20px;
          cursor: pointer;
        }
        .pos-btn:focus{
          outline: none;
          outline: 0;
          outline-style: none;
        }
      }
      .btn {
        color: #ffffff;
        width: 205px;
        height: 48px;
        line-height: 48px;
        background: rgba(33, 104, 235, 1);
        border-radius: 27px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        margin:35px 0 28px
      }
      .tit{
        font-weight:500;
        font-size:16px;
      }
      .authbox{
        width: 316px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        margin-left: 35px;
        color:#FF0000;
        font-size: 12px;
        background: #FFF6F6;
        border:1px solid #FFA4A4;
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
        z-index: 10002;
        overflow: hidden;
        border: 5px solid #2168eb;
        .search-box {
          display: inline-block;
          border-style: solid
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
    .child {
      dd {
        margin-left: 15px;
        border-bottom: 1px solid #eeeeee;
        span {
          line-height: 40px;
          cursor: pointer;
        }
      }
    }
    .n {
      background: url("../assets/img/zk2@2x.png") no-repeat right center;
    }

    .n.active {
      background: url("../assets/img/zk3@2x.png") no-repeat right center;
    }
  }
}

.layerView {
  .tips {
    margin-top: 45px;
    text-align: center;
    font-size: 14px;
    color: #333333;
  }

  .btns {
    text-align: center;
    font-size: 0;
    padding-top: 30px;
    margin-bottom: 30px;
    cursor: pointer;

    .btn1 {
      border: 1px solid #999999;
      cursor: pointer;
    }

    .btn2 {
      border: 1px solid #2168eb;
      background: #2168eb;
      color: #ffffff;
      cursor: pointer;
    }

    .btn1,
    .btn2 {
      display: inline-block;
      font-size: 12px;
      padding: 0 22px;
      height: 28px;
      line-height: 28px;
      -webkit-border-radius: 28px;
      -moz-border-radius: 28px;
      border-radius: 28px;
      margin: 0 10px;
      cursor: pointer;
    }
  }

  .ivu-radio-wrapper {
    width: 90%;
    overflow: hidden;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    margin: 0 15px;
    position: relative;
  }

  .mc {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    margin: 0 15px;

    position: relative;

    .label {
      margin-left: 11px;
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
    display: block;
  }

  .mt {
    position: relative;
    height: 42px;
    padding-left: 96px;
    margin-bottom: 18px;

    .getcode {
      position: absolute;
      left: 334px;
      width: 60px;
      background: #ebf2ff;
      border-radius: 2px;
      top: 0;
      height: 42px;
      line-height: 42px;
      text-align: center;
      font-size: 13px;
      color: #2168eb;
      cursor: pointer;
    }

    .label {
      position: absolute;
      left: 0;
      height: 42px;
      line-height: 42px;
      text-align: right;
      width: 60px;
      font-size: 14px;
    }
  }

  .title {
    height: 70px;
    background: #2168eb;
    font-size: 20px;
    color: #ffffff;
    line-height: 70px;
    text-align: center;
  }
}
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
.stars .ivu-form-item-required .ivu-form-item-label:before{
  content:'';
}
</style>

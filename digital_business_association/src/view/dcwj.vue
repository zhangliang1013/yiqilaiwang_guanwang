<template>
  <div>
    <div class="w">
      <div class="position">
        {{page == 3?'调查问卷详情':'发布问卷调查'}}
        <!-- <span @click="$router.back(-1)">返回</span> -->
      </div>
    </div>
    <div class="w bg" style="margin-bottom: 73px;">
      <!-- 问卷详情 -->
      <div class="detail" v-if="page==3">
        <div class="title">{{formdate.questionTitle}}</div>
        <div class="wel">欢迎语：<span style="color:#2168EB;">{{formdate.welcomeWords}}</span></div>
        <div class="line"></div>
        <div class="question" v-for="(item,index) in formdate.subjects" :key="index">
          <div class="ques-select" v-if="item.type ==1">
            <div class="q-i-title clear">
              <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}（{{item.multipleChoice==1?'多':'单'}}选）</div>
            </div>
            <div style="border:1px solid #EEEEEE;margin:14px 0 28px 0;">
              <label class='ques-item-select-box' v-for="(sItem,sIndex) in item.options" :key="sIndex" :for="index+'-'+sIndex">
                <div v-if="item.multipleChoice ==0">
                  <input class="ques-radio" type="radio" :name="index"  :id="index+'-'+sIndex" >
                  <label :for="index+'-'+sIndex" class="label"></label>{{sItem.option}} 
                </div>
                <div v-if="item.multipleChoice ==1">
                  <input class="ques-radio" type="checkbox" :name="sIndex"  :id="index+'-'+sIndex">
                  <label :for="index+'-'+sIndex" class="label"></label>{{sItem.option}} 
                </div>
              </label>
            </div>
          </div>

          <div class="ques-textarea" v-if="item.type ==2">
            <div class="q-i-title clear">
              <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}{{item.type ==1?`（${item.multipleChoice==1?'多':'单'}选）`:''}}</div>
            </div>  
            <div style="position:relative;margin:14px 0 28px 0;">
              <Input type="textarea" :maxlength="100" :autosize="{minRows: 4,maxRows: 4}" v-model="describe" disabled/>
              <div class="length">（{{describe.length}}/100）</div>
            </div>
          </div>

          <div class="ques-rate" v-if="item.type ==3">
            <div class="q-i-title clear">
              <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}{{item.type ==1?`（${item.multipleChoice==1?'多':'单'}选）`:''}}</div>
            </div>
            <div style="border:1px solid #EEEEEE;margin:14px 0 28px 0;">
              <div class='ques-rate-item' v-for="(sItem,sIndex) in item.options" :key="sIndex">
                <div>{{sItem.option}}</div>
                <Rate clearable :count='sItem.optionScore' @on-change="toRate($event,sIndex)"/>
              </div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="wel">结束语：<span style="color:#2168EB;">{{formdate.endWords}}</span></div>
        <div class="submit">
          <div class="btn btn3" @click="$router.back(-1)">返回</div>
        </div>
      </div>
      <!-- 发起问卷 -->
      <div class="dcwj" v-if='page==1'>
        <Form :label-width="100" :rules="formdaterule">
          <FormItem label="问卷标题" class="width450">
            <Input placeholder="" :maxlength="35" v-model="formdate.questionTitle" />
          </FormItem>
          <FormItem label="欢迎语" class="width450" style="position:relative">
            <Input placeholder="感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧" :autosize="{minRows: 4,maxRows: 4}" :maxlength="50" v-model="formdate.welcomeWords"  type="textarea"/>
            <div class="length">（{{formdate.welcomeWords.length}}/50）</div>
          </FormItem>
          <FormItem label="选择问卷下达的商协会" class="width350">
            <div class="select">
              <div class="select-choose clear" @click="tolayer(1)">
                <div class="item" v-for="(item,index) in chooseArr" :key="index" @click.stop="deleteStructureList(item)">
                  <span>{{item.orgName}}</span>
                  <img v-if="!item.disabled" src="./../assets/img/close12@3x.png" alt="" >
                </div>
                <span v-show="!chooseArr.length" class="span fl">请选择问卷下达的商协会</span>
                <i class="ivu-icon ivu-icon-ios-arrow-down fr"></i>
              </div>
            </div>
          </FormItem>
          <div class="line"></div>
          <!-- 自定义 -->
          <div class="question" v-for="(item,index) in formdate.subjects" :key="index" >
            <div class="ques-select" v-if="item.type ==1">
              <div class="q-i-title clear">
                <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}（{{item.multipleChoice==1?'多':'单'}}选）</div>
                <div class="right fr">
                  <span class="span2" :class="{'span1':index==0}" @click="swapArray(index,2)">上移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span2" :class="{'span1':index==formdate.subjects.length -1}" @click="swapArray(index,1)">下移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span3" @click="tolayer(3,item)">删除</span>
                </div>
              </div>
              <div style="border:1px solid #EEEEEE;margin:14px 0 28px 0;">
                <label class='ques-item-select-box' v-for="(sItem,sIndex) in item.options" :key="sIndex" :for="index+'-'+sIndex">
                  <div v-if="item.multipleChoice ==0">
                    <input class="ques-radio" type="radio" :name="index"  :id="index+'-'+sIndex">
                    <label class="label" :for="index+'-'+sIndex"></label>{{sItem.option}}
                  </div>
                  <div v-if="item.multipleChoice ==1" >
                    <input class="ques-radio" type="checkbox" :name="sIndex"  :id="index+'-'+sIndex">
                    <label :for="index+'-'+sIndex" class="label"></label>{{sItem.option}} 
                  </div>
                </label>
              </div>
            </div>

            <div class="ques-textarea" v-if="item.type ==2">
              <div class="q-i-title clear">
                <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}{{item.type ==1?`（${item.multipleChoice==1?'多':'单'}选）`:''}}</div>
                <div class="right fr">
                  <span class="span2" :class="{'span1':index==0}" @click="swapArray(index,2)">上移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span2" :class="{'span1':index==formdate.subjects.length -1}" @click="swapArray(index,1)">下移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span3" @click="tolayer(3,item)">删除</span>
                </div>
              </div>
              <div style="position:relative;margin:14px 0 28px 0;">
                <Input type="textarea" :maxlength="100" :autosize="{minRows: 4,maxRows: 4}" v-model="describe" disabled/>
                <div class="length">（{{describe.length}}/100）</div>
              </div>
            </div>

            <div class="ques-rate" v-if="item.type ==3">
              <div class="q-i-title clear">
                <div class="left fl"><span style="color:#F81414">{{item.mustAnswer==1?'*':''}}</span>{{index+1}}. {{item.questionSubject}}{{item.type ==1?`（${item.multipleChoice==1?'多':'单'}选）`:''}}</div>
                <div class="right fr">
                  <span class="span2" :class="{'span1':index==0}" @click="swapArray(index,2)">上移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span2" :class="{'span1':index==formdate.subjects.length -1}" @click="swapArray(index,1)">下移</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span class="span3" @click="tolayer(3,item)">删除</span>
                </div>
              </div>
              <div style="border:1px solid #EEEEEE;margin:14px 0 28px 0;">
                <div class='ques-rate-item' v-for="(sItem,sIndex) in item.options" :key="sIndex">
                  <div>{{sItem.option}}</div>
                  <Rate clearable :count='sItem.optionScore' @on-change="toRate($event,sIndex)"/>
                </div>
              </div>
            </div>
          </div>
          <div class="line" v-if="formdate.subjects.length"></div>
          <div @click="tolayer(2)" class="add-question">+添加题目</div>
          <div class="line"></div>
          <FormItem label="问卷填写结束时间" class="width450"> 
            <DatePicker format="yyyy-MM-dd HH:mm" :start-date="new Date()" :options="dateoptions" @on-change="onEndTime"
            :value="formdate.endTime" type="datetime" placeholder="请选择时间" style="width: 100%;"></DatePicker>
          </FormItem>
          <div class="line"></div>
          <FormItem label="结束语" class="width450">
            <Input :autosize="{minRows: 4,maxRows: 4}" placeholder="您已经完成本次问卷，感谢您的帮助与支持" :maxlength="50" v-model="formdate.endWords"  type="textarea"/>
            <div class="length">（{{formdate.endWords.length}}/50）</div>
          </FormItem>
          
        </Form>
        <div class="submit">
          <div class="btn" @click="save(0)">保存到草稿</div>
          <div class="btn1 btn" @click="save(1)">发布</div>
        </div>
        <!-- 邀请商协会 -->
        <div class="layer staffeit choose-org" v-if="layer==1">
          <div class="mask" @click="tolayer(0)"></div>  
          <div class="content content1" style="width:420px">
            <div class="title clear">
              <div class="fl t-left" @click="chooseGovOrg">
                <img class="img" v-show="!isChooseOrg" src="./../assets/img/zzgl12.png" alt="">
                <img class="img" v-show="isChooseOrg" src="./../assets/img/title-c.png" alt="">
                <span>快速选择辖属组织</span>
              </div>
              <div class="fr t-right">已选择：{{chooseArr.length}}组</div>
            </div>
            <div class="select-sort">
              <sort :structureList='StructureList' :oldParts='chooseArr' @onchange='updateList' @length='getStructureListLength'></sort>
            </div>
            <!-- <div class="bg">已选择：{{chooseArr.length}}组</div> -->
            <div class="btns clear">
              <div class="all fl" @click="chooseAll">
                <img class="img" v-show="!isChooseAll" src="./../assets/img/zzgl11@3x.png" alt="">
                <img class="img" v-show="isChooseAll" src="./../assets/img/zzgl10@3x.png" alt="">
                <span>全选</span>
              </div>
              <div class="btn2 fr" style="padding:0 17px;margin-right:20px" @click="tolayer(0)">确定（{{chooseArr.length}}/{{structureListLength}}）</div>
            </div>
          </div>
        </div>
        <!-- 添加题目  弹窗 -->
				<div class="layer staffeit" v-if="layer==2">
					<div class="mask" @click="tolayer(0)"></div>
					<div class="content">
            <div class="title">选择题目类型</div>
            <div class="content-item">
              <div @click="toPage(1,2)" v-back-top>选择题</div>
              <div @click="toPage(2,2)" v-back-top>填空题</div>
              <div @click="toPage(3,2)" v-back-top>打分题</div>
            </div>
            <div class="btns">
							<div class="btn1" @click="tolayer(0)">取消</div>
						</div>
					</div>
				</div>
      </div>
      <div class="layer staffeit" v-if="layer==3">
        <div class="mask" @click="tolayer(0)"></div>
        <div class="content">
          <div class="title">删除题目</div>
          <div class="tips">请确认是否删除该{{page==1?'题目':'选项'}}</div>
          <div class="btns">
            <div class="btn1" v-if="page==1" @click="removeArray(formdate.subjects,presentQuestion);tolayer(0)">确认</div>
            <div class="btn1" v-if="page==2" @click="removeArray(subjects.options,presentQuestion);tolayer(0)">确认</div>
            <div class="btn2" @click="tolayer(0)">再想想</div>
          </div>
        </div>
      </div>
      <div class="layer staffeit" v-if="layer==4">
        <div class="mask" @click="tolayer(0)"></div>
        <div class="content">
          <div class="title">删除题目</div>
          <div class="tips">您设置的题目尚未保存，请确认是否离开</div>
          <div class="btns">
            <div class="btn1" @click="toPage(type,1,'cancel');tolayer(0)">确认</div>
            <div class="btn2" @click="tolayer(0)">再想想</div>
          </div>
        </div>
      </div>
      <!-- 题目选择 -->
      <div class="dcQuestions" v-if="page==2">
        <Form :label-width="100" :rules="subjectsRules">
          <h4 style="margin-bottom:24px;">{{type==1?'选择题':type==2?'填空题':'打分题'}}</h4>
          <FormItem label="题目名称" style="text-align:center;" class="width450">
            <Input placeholder="" :maxlength="35" v-model="subjects.questionSubject"/>
          </FormItem>
          <div class="line"></div>
          <!-- 选择题 -->
          <div v-if="type==1">
            
            <div v-for="(item,index) in subjects.options" :key="index">
              <FormItem :label="'选项'+ parseInt(index+1)" >
                <Input placeholder="点击编辑选项" v-model="item.option"/>
                <div class="remove" @click="tolayer(3,item)" v-if="index>1">删除</div>
              </FormItem>
            </div>
            <div  @click="addQuestion" class="add-question">+添加选项</div>
          </div>
          <!-- 填空题 -->
          <div v-if="type == 2">
            <FormItem label="">
              <Input type="textarea" disabled :maxlength="100" :autosize="{minRows: 4,maxRows: 4}"/>
            </FormItem>
          </div>
          <!-- 打分题 -->
          <div v-if="type==3">
            <div v-for="(item,index) in subjects.options" :key="index">
              <FormItem :label="'选项'+ parseInt(index+1)">
                <Input placeholder="点击编辑选项" :maxlength="40" v-model="item.option"/>
                <div class="remove" @click="tolayer(3,item)" v-if="index>0">删除</div>
                <div>
                  <Rate clearable :count='item.optionScore' @on-change="toRate($event,index)"/>
                </div>
              </FormItem>
            </div>
            <!-- <div class="addQuestion" @click="addQuestion"> -->
              <div  @click="addQuestion" class="add-question">+添加选项</div>
            <!-- </div> -->
          </div>

          <div class="line"></div>
          <h4>题目设置</h4>
          <!-- <label for="">此题必答</label> -->
          <div class="switch">
						<label for="must">此题必答</label>
						<Switchs id="must" zoom='1' :value="subjects.mustAnswer==1?true:false" @on-change="onIsMust($event,1)" />
					</div>
          <div class="switch" v-if="type==1">
						<label for="must">此题可多选</label>
						<Switchs id="must" :value="subjects.multipleChoice==1?true:false" @on-change="onIsMust($event,2)" />
					</div>
        </Form>
        <div class="submit">
          <div class="btn btn2" @click="tolayer(4)">取消</div>
          <div class="btn1 btn" @click="toPage(type,1)">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
import sort from '../components/sort';
import Bus from "./../modules/bus.js";
export default {
  name:'dcwj',
  components: {
    sort,
  },
  props:{
    defOrg: null,
  },
  
  data(){
    return{
      page:1,
      id:"",
      //发起问卷 
      formdate:{
        id:"",
        entityId:'',
        questionTitle:"",
        welcomeWords:'',
        endWords:'',
        startTime:'',
        endTime:"",
        status:null,
        orgList:[],
        subjects:[],
      },
      formdaterule: {
        orgList: [{ 
          required: true, 
          type: 'array', 
          min: 1, 
          message: '请选择邀请商协会', 
          trigger: 'change' 
        }],
      },
      chooseArr:[],
      oldParts:[],
      StructureList:null,
      layer:0,
      structureListLength:0,
      subjects:[],

      // 题目选择
      type:1,
      subjectsRules:{
      },
      subjects:{
        type:1,
        mustAnswer:1,
        questionSubject:"",
        multipleChoice:0,
        options:[]
      },
      describe:'',
      presentQuestion:[],
      // 字典项
      quesType:[],
      dateoptions:{
        disabledDate(date){
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      stop:false,
      isChooseAll:false,
      isChooseOrg:false,
    }

  },
  watch:{
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
      this.formdate.orgList = this.chooseArr.map(i => i.id);
    },
    defOrg(res) {
      if (res) {
        this.getStructureList();
      }
    },
  },
  methods:{
    getStructureList() {
      this.http.ajax({
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
    deleteStructureList(fitem){
      if(!fitem.disabled){
        fitem.choose = !fitem.choose;
        this.chooseArr.map((item,index)=>{
          if(item.id == fitem.id){
            this.chooseArr.splice(index,1)
          }
        })
      }
    },
    tolayer(n,item) {
      if(item){
        this.presentQuestion = item;
      }
      this.layer = n
    },
    // 获取选择的商协会
    updateList(data){
      // console.log('父组件',data);
      this.chooseArr = data;
      this.formdate.orgList = data.map(i => i.id);
    },
    getStructureListLength(length){
      this.structureListLength = length
    },
    // 交换数组
    swapArray(index1,type) {
      if(type ==2&& index1 ==0 || type==1&&index1==this.formdate.subjects.length -1){
        return
      }
      var arr = this.formdate.subjects;
      var index2 = type==1 ? index1 + 1 : index1 - 1
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    deleteItem(item){
      // this.layer = 0;
      this.tolayer(0);
      // console.log(item)

    },
    toRate(e,value){
      // console.log(e,value)
    },
    onEndTime(e){
      if(e){
        this.formdate.endTime = e + ':00';
        // console.log(this.formdate.endTime)
      }
    },
    // 获取题目类型
    getActType(e) {
      this.http.ajax({
        url: '../../webSite/listBydictType',
        method: 'post',
        headers: {
          'Content-Type': ' application/json'
        },
        data: {
          "dictType": "QUESTION_TYPE"
        }
      }).then(res => {
        if (res.code == 200) {
          this.quesType = res.data
        }
      })
    },
    save(type,auto){
      if(type){
        if(!this.formdate.questionTitle.trim()){
          layer.msg('请输入问卷标题');
          return
        }
        if(!this.formdate.orgList.length){
          layer.msg('请选择问卷下达的商协会');
          return
        }
        if(!this.formdate.subjects.length){
          layer.msg('请至少设置一道题目');
          return
        }
        if(!this.formdate.endTime){
          layer.msg('请选择问卷填写结束时间');
          return
        }
      }
      this.formdate.entityId = this.defOrg.digitalCommerce;
      this.formdate.startTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
      this.formdate.status = type;
      if(!this.formdate.endWords.trim() && type == 1){
        this.formdate.endWords = '您已经完成本次问卷，感谢您的帮助与支持';
      }
      if(!this.formdate.welcomeWords.trim() && type == 1){
        this.formdate.welcomeWords = '感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧';
      }
      if(this.formdate.id){
        var url = '../../webSite/questionMain/update'
      }else{
        var url = '../../webSite/questionMain/save'
      }
      if(type == 1){
        this.stop = true;
      }
      //0草稿； 1;发布；
      this.http.ajax({
        url: url,
        method: "post",
        headers: {
          'Content-Type': ' application/json'
        },
        data: this.formdate
      })
      .then(res => {
        if(res.code == 200){
          if(res.data&&res.data.id){
            this.formdate.id = res.data.id;
            this.formdate.subjects = res.data.subjects;
          }
          if(!auto){
            layer.msg("保存成功");
            if(type ==1){
              this.$router.push("/managearticlelist?messageType=16")
            }
            if(type ==0){
              this.$router.push("/gslDraft?messageType=2")
            }
          }
        }else{
          layer.msg(res.msg);
        }
      });
    },
    addQuestion(){
      if(this.type == 3){
        this.subjects.options.push({
          option:'',
          optionScore:5
        })
      }else{
        this.subjects.options.push({
          option:'',
        })
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
    onIsMust(e,type){
      if(type == 1){
        this.subjects.mustAnswer = e?1:0
      }else{
        this.subjects.multipleChoice = e?1:0
      }
    },
    toRate(e,index){
      // console.log(e,index)
    },
    back(type){
      // this.$router.push('/dcwj')
      if(type){
        this.$router.push({
          path:'/dcwj',
          query:{
            subjects:JSON.stringify(this.subjects)
          }
        })
      }else{
        this.$router.push('/dcwj')
      }
    },
    toPage(n,page,cancel){
      this.type = n;
      this.layer = 0;
      if(page ==1 && cancel == 'cancel'){
        this.page = page;
      }else if(page ==1 && !cancel){
        if(!this.subjects.questionSubject){
          layer.msg("请输入题目名称")
          return
        }
        var next = false;
        for (var i = 0; i < this.subjects.options.length; i++){
          let index = i;
          if(!this.subjects.options[index].option){
            next = true;
            layer.msg(`请输入选项${index+1}`)
            return
          }
        }
        if(!next){
          this.page = page;
          this.layer = 0
          this.formdate.subjects.push(this.subjects)
        }
      }
      if(page ==2){
        this.page = page;
        this.subjects = {
          type:n,
          mustAnswer:1,
          questionSubject:"",
          multipleChoice:0,
          options:[]
        }
        if(n ==1){
          this.subjects.options = [{option:''},{option:''}]
        }else if(n ==3){
          this.subjects.options = [{option:'', optionScore:5}]
        }
      }
    },
    getDetail(){
      this.http.ajax({
        url: '../../webSite/questionMain/info',
        method: 'post',
        headers: {
          'Content-Type': ' application/json'
        },
        data: {
          "id": this.id
        }
      }).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.formdate = res.data;
          this.oldParts = this.formdate.orgList;
          // this.actType = res.data
        }
      })
    },
    chooseGovOrg(){
      // 编辑时
      // if(this.oldParts.length && this.isChooseOrg){
      //   console.log('return')
      //   return
      // }
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
  },
  created(){
    this.getActType();
    if(this.$route.query.id){
      this.id = this.$route.query.id;
      this.getDetail();
      if(this.$route.query.type && this.$route.query.type==2){
        this.page = 3;
      }
    }
    this.getStructureList();
  },
  mounted() {
    if(this.page == 3){
    }else{
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.formdate.questionTitle || this.formdate.orgList.length || this.formdate.subjects.length || this.formdate.endTime || this.formdate.endWords || this.formdate.welcomeWords) {
          if(!this.stop){
            this.save(0,'auto');
          }
        }
      }, 20000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }

}
</script>
<style lang="less">
  .ivu-form .ivu-form-item-label {
    text-align: left;
    color: #333;
  }
  .ivu-form{
    padding-left:20px;
  }
  .width450{
    width:450px;
  }
  .length{  
    position:absolute;bottom:0;right:0;
    padding: 0 9px 9px 0;
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(136,136,136,1);
    line-height:17px;
  }
  .submit{
    text-align: center;
    margin-top:69px;
    .btn{
      width:140px;
      height:48px;
      line-height:48px;
      text-align: center;
      background:rgba(255,255,255,1);
      border-radius:27px;
      border:1px solid rgba(33,104,235,1);
      color:#2168EB;
      font-size:14px;
    }
    .btn1,.btn3{
      background:#2168EB;
      color: rgba(255,255,255,1);
      margin-left:39px;
    }
    .btn2{
      background:rgba(255,255,255,1);
      color: #999999;
      margin-left:39px;
      border:1px solid #999999;
    }
    .btn.btn3{
      width:206px;
      margin-left:0;
      padding:0;
    }

  }
  .add-question{
    cursor: pointer;
    width:98px;
    height:22px;
    background:rgba(33,104,235,1);
    border-radius:14px;
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:22px;
    text-align: center;
    margin-bottom:24px;
  }
  .line {
    border-bottom: 1px dashed #DDDDDD;
    margin-bottom: 24px;
    // width: 100%;
    // height: 1px;
    // background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
    // background-size: 8px 1px;
    // background-repeat: repeat-x;
  }
  .detail{
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:400;
    padding: 48px 90px 60px;
    .title{
      font-size:24px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:33px;
      margin-bottom:26px;
    }
    .wel{
      font-size:14px;
      font-weight:500;
      color:#333333;
      line-height:20px;
      margin-bottom:28px;
    }
    .question{
      padding-right:166px;
    }
  }
  .dcwj{
    padding: 64px 160px 60px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:20px;
    
    
    // .ivu-rate{
    //   display: block;
    // }
  }

  .dcQuestions{
    padding: 64px 160px 60px;
    .ivu-form-item{
      .ivu-input-wrapper{
        width: 350px;
      }
      .remove{
        display: inline-block;
        vertical-align: middle;
        padding: 0 33px;
        cursor: pointer;
        // width:24px;
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(248,20,20,1);
      }
    }
    .addQuestion{
      cursor:pointer;
      img{
        display: inline-block;
        vertical-align: middle;
        width:20px;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
    }
    .switch {
			display: flex;
      margin:22px 0 11px;
      label{
        width:134px;
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:20px;
      }
			#must{
        zoom:1;
      }
		}
  }

  .question{
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:#333333;
    line-height:20px;
    .q-i-title{
      .right{
        font-size:12px;
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
    }
    .ques-item-select-box{
      display: flex;
      align-items:center;
      position: relative;
      border-bottom:1px solid #EEEEEE;
      padding:8px;
      position: relative;
      // input[type="radio"]{
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
        left: 8px;
        top: 10px;
        width:16px;
        height:16px;
        border-radius: 50%;
        border: 1px solid #999;
      }
      input:checked+label::after {
        position: absolute;
        content: "";
        width: 6px;
        height: 10px;
        top: 0px;
        left: 4px;
        border: 2px solid #fff;
        border-top: none;
        border-left: none;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
    .ques-item-select-box:last-child,.ques-rate-item:last-child{
      border-bottom:none;
    }
    .ques-rate-item{
      border-bottom:1px solid #EEEEEE;
      padding:7px;
    }
    
  }
  .select{
    // position:relative;
    // z-index:100;
    .select-choose{
      width:350px;
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
      margin-top: 25px;
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
        color:#999999;
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
        padding: 0 38px;
        height: 28px;
        line-height: 28px;
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
        margin: 0 10px;
      }

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
    .content-item{
      padding:0 23px;
      div{
        text-align: center;
        border-bottom:1px solid #EEEEEE;
        height:47px;
        line-height:47px;
        cursor:pointer;
      }
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
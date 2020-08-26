<template>
  <div>
    <div class="w">
			<div class="position">{{type==1?'选择题':type==2?'填空题':'打分题'}}
				<span @click="$router.back(-1)">返回</span>
			</div>
		</div>
    <div class="w bg" style="margin-bottom: 73px;">
      <div class="dcQuestions">
        <Form :label-width="100" :rules="subjectsRules">
          <FormItem label="题目名称">
            <Input placeholder="点击编辑题目名称" :maxlength="40" v-model="subjects.questionSubject"/>
          </FormItem>
          <!-- 选择题 -->
          <div v-if="type==1">
            <div class="line"></div>
            <div v-for="(item,index) in subjects.options" :key="index">
              <FormItem :label="'选项'+ parseInt(index+1)">
                <Input placeholder="点击编辑选项" :maxlength="40" v-model="item.option"/>
                <img class="remove" @click="removeArray(subjects.options,subjects.options[index])" v-if="index>1" src="./../assets/img/zzgl8@3x.png" alt="">
              </FormItem>
            </div>
            <div class="addQuestion" @click="addQuestion">
              <img src="./../assets/img/zk4@2x.png" alt="">
              <span>选项</span>
            </div>
          </div>
          <!-- 填空题 -->
          <div v-if="type == 2">
            <Input type="textarea" :maxlength="500"/>
          </div>
          <!-- 打分题 -->
          <div v-if="type==3">
            <div v-for="(item,index) in subjects.options" :key="index">
              <FormItem :label="'选项'+ parseInt(index+1)">
                <Input placeholder="点击编辑选项" :maxlength="40" v-model="item.option"/>
                <img class="remove" @click="removeArray(subjects.options,subjects.options[index])" v-if="index>0" src="./../assets/img/zzgl8@3x.png" alt="">
                <Rate clearable :count='item.optionScore' @on-change="toRate($event,index)"/>
              </FormItem>
            </div>
            <div class="addQuestion" @click="addQuestion">
              <img src="./../assets/img/zk4@2x.png" alt="">
              <span>选项</span>
            </div>
          </div>

          <div class="line"></div>
          <h4>题目设置</h4>
          <!-- <label for="">此题必答</label> -->
          <div class="switch">
						<label for="must">此题必答</label>
						<Switchs id="must" :value="subjects.mustAnswer==1?true:false" @on-change="onIsMust($event,1)" />
					</div>
          <div class="switch" v-if="type==1">
						<label for="must">此题可多选</label>
						<Switchs id="must" :value="subjects.multipleChoice==1?true:false" @on-change="onIsMust($event,2)" />
					</div>
        </Form>
        <div class="submit">
          <div class="btn" @click="back(0)">取消</div>
          <div class="btn" @click="back(1)">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"dcQuestions",
  props:{
    defOrg: null,
  },
  data(){
    return{
      type:1,
      subjectsRules:{
      },
      subjects:{
        type:1,
        mustAnswer:1,
        questionSubject:"",
        multipleChoice:1,
        options:[]
      }
    }
  },
  methods:{
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
    }
  },
  created(){
    
    this.type = this.$route.query.type;
    this.subjects.type = this.$route.query.type;
    if(this.type ==1){
      this.subjects.options = [{option:''},{option:''}]
    }else if(this.type ==3){
      this.subjects.options = [{option:'', optionScore:5}]
    }
  },
}
</script>
<style lang="less" scoped>
  .dcQuestions{
    padding-top: 64px;
    padding-right: 130px;
    padding-bottom: 30px;
    padding-left: 130px;
    .line {
			border-bottom: 1px dashed #DDDDDD;
      margin-bottom: 24px;
      // width: 100%;
      // height: 1px;
      // background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
      // background-size: 8px 1px;
      // background-repeat: repeat-x;
    }
    .ivu-form-item{
      .ivu-input-wrapper{
        width: 90%;
      }
      .remove{
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        padding: 6px;
        cursor: pointer;
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
			// justify-content: space-between;
			// margin: 0 175px;
			display: flex;
			margin-bottom: 5px;

			img {
				vertical-align: middle;
				cursor: pointer;
				margin:-2px 0 0 4px;
			}
		}
  }
</style>
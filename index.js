window.onload = function(){  

    var vm = new Vue({
        el: "#play",
        data:{
            
                userName:window.sessionStorage.user? JSON.parse(window.sessionStorage.user).username : "",
                img:window.sessionStorage.user? JSON.parse(window.sessionStorage.user).img : "",
                position: "20%",
                show:true,
                cont:"",    //输入内容
                wst:null,   //定义websockt
                value:[],   //消息容器
                openEmoji:false,
                openPhoto:false,
                picArr:[
                    {
                        id:1,
                        url:'./images/emoji/daxiao.png',
                        icon:"[大笑]"
                    },
                    {
                        id:2,
                        url:'./images/emoji/mianwubiaoqing.png',
                        icon:"[面无表情]"
                    },
                    {
                        id:3,
                        url:'./images/emoji/ganga.png',
                        icon:"[尴尬]"
                    },
                    {
                        id:4,
                        url:'./images/emoji/xiaochulei.png',
                        icon:"[笑出泪]"
                    },
                    {
                        id:5,
                        url:'./images/emoji/feiwen.png',
                        icon:"[飞吻]"
                    },
                    {
                        id:6,
                        url:'./images/emoji/yun-2.png',
                        icon:"[晕]"
                    },   
                    {
                        id:7,
                        url:'./images/emoji/bizui.png',
                        icon:"[闭嘴]"
                    },
                    {
                        id:8,
                        url:'./images/emoji/ziya.png',
                        icon:"[龇牙]"
                    },
                    {
                        id:9,
                        url:'./images/emoji/ku.png',
                        icon:"[酷]"
                    },
                    {
                        id:10,
                        url:'./images/emoji/liulei.png',
                        icon:"[流泪]"
                    },
                    {
                        id:11,
                        url:'./images/emoji/shuizhuo.png',
                        icon:"[睡着]"
                    },
                    {
                        id:12,
                        url:'./images/emoji/shimo.png',
                        icon:"[我的天呐]"
                    },
                    {
                        id:13,
                        url:'./images/emoji/heng.png',
                        icon:"[怒]"
                    },
                    {
                        id:14,
                        url:'./images/emoji/liubixie.png',
                        icon:"[流鼻血]"
                    },
                    {
                        id:15,
                        url:'./images/emoji/santiaoxian.png',
                        icon:"[无语]"
                    },
                    {
                        id:16,
                        url:'./images/emoji/yiwen.png',
                        icon:"[疑问]"
                    },
                    {
                        id:17,
                        url:'./images/emoji/xingxingyan.png',
                        icon:"[放光]"
                    },
                    {
                        id:18,
                        url:'./images/emoji/tiaopi.png',
                        icon:"[调皮]"
                    },
                    {
                        id:19,
                        url:'./images/emoji/biti.png',
                        icon:"[鼻涕]"
                    },
                    {
                        id:20,
                        url:'./images/emoji/xinsui.png',
                        icon:"[心碎]"
                    },
                    {
                        id:21,
                        url:'./images/emoji/aixin-4.png',
                        
                        icon:"[爱心]"
                    },
                    {
                        id:22,
                        url:'./images/emoji/zhadan.png',
                        icon:"[炸弹]"
                    },
                    {
                        id:23,
                        url:'./images/emoji/shuai.png',
                        icon:"[衰]"
                    },
                ],          //表情数组
                isChoose1:true,
                isChoose2:false,
                isChoose3:false,
                unfold:true,        //向下展开
                heightRecord:"",    
                aboutMeScroll:"",

                showSysMessage:false,  //显示系统消息
                message :{},    //websocket获得消息
                message1 :"",   //系统消息分割
                message2 :"",   //系统消息分割
                showLogin:false,  //展示登录
                phoneNum:"",//手机号
                sysCode:"", //验证码
                liveInfo:{},//直播详情
                annoInfo:{},//直播信息
                annoXqInfo:{},//直播详情
                annoLcInfo:{},//活动流程
                annoJbInfo:{},//活动嘉宾
                liveList:[],//直播列表
                videoSource:"./video/bb.mp4",//播放源
                clickTVBOx:false,
        },
        created() {
            // this.uploadImg();
            this.knowMe();
            this.recommend();
            //判断当前浏览器是否支持WebSocket
            if('WebSocket' in window){
                this.wst = new WebSocket("ws://47.92.109.229:8848/ws/12/" + window.sessionStorage.abscess);
                this.wst.onopen=function(){
                    console.log("连接成功");
                }
                var that = this;
                this.wst.onmessage=function(evt){
                    console.log(evt.data)
                    that.message = JSON.parse(evt.data);
                    // console.log(that.message)

                    //获取系统消息
                    if(that.message.system){
                        that.showSysMessage = true;
                        that.message.message.split(':');
                        that.message1 = that.message.message.split(':')[0];
                        that.message2 = that.message.message.split(':')[1].replace(")加入房间","");
                        clearTimeout(timer); 
                        var timer = setTimeout(() =>{
                            that.showSysMessage = false;
                        },5000)
                    }else {//获取别人消息
                        that.value.push(that.message);

                        var ul = document.getElementById('ul');

                        var oLi=document.createElement("li");
                        oLi.setAttribute("class","clear");

                        var oAva= document.createElement("div");
                        oAva.setAttribute("class","ava fl");

                        var oImg= document.createElement("img");
                        oImg.setAttribute("src",that.message.icon);
                        oAva.appendChild(oImg);

                        var oLabel= document.createElement("div");
                        oLabel.setAttribute("class","label fl");

                        var oName= document.createElement("div");
                        oName.setAttribute("class","name");
                        oName.innerHTML = that.message.nickName;
                        oLabel.appendChild(oName);
                        if(that.message.publisher){
                            var oSpan= document.createElement("span");
                            oSpan.innerHTML = '官方';
                            oName.appendChild(oSpan);
                        }
                        var oCont= document.createElement("div");
                        oCont.setAttribute("class","cont left");
                        oLabel.appendChild(oCont);

                        var oMessage= document.createElement("p");
                        oMessage.setAttribute("class","message");
                        oMessage.setAttribute("style","word-break:break-all;");
                        oMessage.innerHTML = that.message.message;
                        oCont.appendChild(oMessage);

                        oLi.appendChild(oAva);
                        oLi.appendChild(oLabel);

                        ul.appendChild(oLi);

                    }
                }
                this.wst.onclose=function(){
                    console.log(3,"guanbi")
                };
                //检测自动关闭窗口
                window.onbeforeunload = function(){
                    this.wst.close();
                }
            }
            else{
                alert('Not support websocket')
            }
        },
        mounted() {
            this.uploadImg();
            var that = this;
            var player = new Aliplayer({
                "id": "player-con",
                // "source": "./video/bb.mp4",
                "source": that.videoSource,
                "width": "100%",
                "height": "92%",
                "autoplay": true,
                "isLive": false,
                "rePlay": true,
                "playsinline": true,
                "preload": true,
                "controlBarVisibility": "hover",
                "useH5Prism": true
            }, function (player) {
                // console.log("The player is created");
            });

        },
        methods: {
            changeStyle(val){
                if(val == 1){
                    this.show = true;
                    this.position = '20%';
                }
                if(val == 2){
                    this.show = false;
                    this.position = '70%';
                    this.$nextTick(() => {
                        this.initSwiper();
                        this.heightRecord = this.$refs.activ.offsetHeight;
                    })
                }
            },
            openLogin(){
                this.showLogin = true;
                setTimeout(function () {
                    document.body.classList.add('on-start');
                }, 100);
                
                setTimeout(function () {
                    document.body.classList.add('document-loaded');
                }, 1800);
            },
            //获取焦点检查登录状态
            checkLogin(){
                if(!window.sessionStorage.abscess){
                    //消息提示
                    spop({
                        template: '请登录后发言',
                        position  : 'top-center',
                        style: 'error',
                        autoclose: 3000
                    });
                    this.openLogin();
                }
            },
            //发送消息
            send(){
                if(!this.cont){
                    return
                }
                this.wst.send(this.ReCont(this.cont));

                var ul = document.getElementById('ul');

                var oLi=document.createElement("li");
                oLi.setAttribute("class","self");

                var oAva= document.createElement("div");
                oAva.setAttribute("class","ava");
                oAva.setAttribute("style","margin: 18px 14px 0 4px;");

                var oLabel= document.createElement("div");
                oLabel.setAttribute("class","label fl");

                var oName= document.createElement("div");
                oName.setAttribute("class","name");
                oName.setAttribute("style","text-align: right");
                oLabel.appendChild(oName);
                oName.innerHTML = this.userName;
                if(this.message.publisher){
                    var oSpan= document.createElement("span");
                    oSpan.innerHTML = '官方';
                    oName.appendChild(oSpan);  
                }
                var oCont= document.createElement("div");
                oCont.setAttribute("class","cont right fr");
                oLabel.appendChild(oCont);

                var oMessage= document.createElement("p");
                oMessage.setAttribute("class","message clear");
                oMessage.setAttribute("style","word-break:break-all;");
                oMessage.innerHTML = this.ReCont(this.cont);
                oCont.appendChild(oMessage);

                var oImg= document.createElement("img");
                oImg.setAttribute("src",this.message.icon);
                oAva.appendChild(oImg);

                oLi.appendChild(oAva);
                oLi.appendChild(oLabel);

                ul.appendChild(oLi);
                this.cont = "";
                this.$refs.ol.scrollTop = this.$refs.ul.offsetHeight;
            },
            //图片与文字拼接
            ReCont(strCont) {
                for (var i in this.picArr) {        
                    var item = this.picArr[i];
                    var strimg=" <img src="+item.url+" width='28' height='28'>";
                    var reg=new RegExp("\\"+item.icon,"g");
                    // alert(reg);
                    strCont=strCont.replace(reg, strimg);
                    //alert(strCont);
                }    
                return strCont;
            },
            unfoldEmoji(){
                this.openEmoji=!this.openEmoji;
                if(this.openEmoji){
                    this.openPhoto = false;
                }
            },
            unfoldPhoto(){
                this.openPhoto = !this.openPhoto;
                if(this.openPhoto){
                    this.openEmoji = false;
                }
            },
            choose(id){
                // console.log(id)
                var newObj = this.picArr.filter((item) => {
                    return item.id == id
                })
                this.cont += newObj[0].icon;
                document.getElementById('inputId').focus()
            },
            isActive(val){
                if(val == 1){
                    this.isChoose1 = true;
                    this.isChoose2 = false;
                    this.isChoose3 = false;
                }
                if(val == 2){
                    this.isChoose2 = true;
                    this.isChoose1 = false;
                    this.isChoose3 = false;
                }
                if(val == 3){
                    this.isChoose3 = true;
                    this.isChoose1 = false;
                    this.isChoose2 = false;
                }
                this.$nextTick(() => {
                    this.heightRecord = this.$refs.activ.offsetHeight;
                })
            },
            openMore(){
                this.unfold = false;
            },
            closeMore(){
                this.unfold = true;
            },
            aboutMeHeight(){
                this.aboutMeScroll = this.$refs.adoutMeRef.scrollTop;
                if(this.heightRecord > 322 && this.aboutMeScroll < 80){
                    this.unfold = true;
                }
            },
            //轮播图初始化
            initSwiper(){
                var mySwiper = new Swiper ('.aboutMe .activeBox .swiper-container', {
                    loop: true, // 循环模式选项
                    grabCursor : true,
                    autoplay:true,
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                        type : 'bullets',
                        dynamicBullets: true,
                    },
                }) 
            },
            //http请求
            uploadImg(){
                // let client = new OSS({
                //     regin:'cn-qingdao',
                //     endpoint='http://oss-cn-qingdao.aliyuncs.com',
                //     accessKeyId: 'LTAI1Ed4ew3DFriW',
                //     accessKeySecret: 'Ff1bbe3auuQNUVhpea2GqYu6Dq6s5R',
                //     bucket: 'haier123test'
                // });

                // console.log(axios)
                // axios({
                //     url:"http://47.92.204.84:8081/oss/auth",
                //     method:"post",
                //     // headers: {
                //     //     'Content-Type': 'application/x-www-form-urlencoded',
                //     //     'Access-Control-Allow-Origin':'*'
                //     // },
                //     data:{
                //         // type:1
                //     }
                // }).then((res) => {
                //     console.log(res)
                // }).catch((error) => {
                //     console.log(error)
                // })
            },
            //了解我
            knowMe(){
                var token = window.sessionStorage.abscess;
                axios({
                    url:"http://47.92.109.229:8081/api/queryDetailByStreamId",
                    method:"get",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token':token ? token :"", 
                    },
                    params:{streamId:"12"}
                }).then((res) => {
                    // console.log(res)
                    if(res.status == 200){
                        this.annoInfo = res.data.annoInfo;
                        this.annoInfo.actTags = res.data.annoInfo.actTags.split(',');
                        this.liveInfo = res.data.liveInfo;
                        this.annoXqInfo = res.data.annoXqInfo;
                        this.annoLcInfo = res.data.annoLcInfo;
                        this.annoJbInfo = res.data.annoJbInfo;
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            //相关推荐
            recommend(){
                var token = window.sessionStorage.abscess;
                axios({
                    url:"http://47.92.109.229:8081/api/queryAllLives",
                    method:"get",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token':token ? token :"", 
                    },
                    params:{}
                }).then((res) => {
                    console.log(res)
                    if(res.status == 200){
                        this.liveList = res.data.lives;
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            //获取验证码
            getCode(){
                if(!this.phoneNum){
                    spop({
                        template: '请输入手机号',
                        position  : 'top-center',
                        autoclose: 3000
                    });
                    return
                }
                axios({
                    method:'post',
                    url:"http://47.92.109.229:8081/api/smsCode",
                    data:'phoneNum=' + this.phoneNum
                }).then((res) =>{
                    if(res.data.code == 0){
                        //消息提示
                        spop({
                            template: '发送成功,请注意查收',
                            position  : 'top-center',
                            style: 'success',
                            autoclose: 3000
                        });
                    }else if(res.data.code == 500){
                        this.phoneNum = "";
                        //消息提示
                        spop({
                            template: '您的操作过于频繁，请稍后再试',
                            position  : 'top-center',
                            style: 'error',
                            autoclose: 3000
                        });
                    }
                })
            },
            //登录
            submit(){
                if(!this.phoneNum){
                    spop({
                        template: '请输入手机号',
                        position  : 'top-center',
                        autoclose: 3000
                    });
                    return
                }
                if(!this.sysCode){
                    spop({
                        template: '请输入验证码',
                        position  : 'top-center',
                        autoclose: 3000
                    });
                    return
                }
                axios({
                    method:'post',
                    url:"http://47.92.109.229:8081/api/appLoginBySms",
                    data:"phoneNum=" + this.phoneNum + "&smsCode=" + this.sysCode
                }).then((res) =>{
                    if(res.data.code == 0 && res.data.msg == "success"){
                        this.showLogin = false;//关闭登录页
                        window.sessionStorage.abscess = res.data.token;
                        window.sessionStorage.user = JSON.stringify(res.data.userEntity);
                        this.userName = res.data.userEntity.username;
                        this.img = res.data.userEntity.img;
                        //消息提示
                        spop({
                            template: '欢迎您 ' + res.data.userEntity.username + "！",
                            position  : 'top-center',
                            style: 'success',
                            autoclose: 4000
                        });
                    }else{
                        this.sysCode = "";
                        //消息提示
                        spop({
                            template: res.data.msg,
                            position  : 'top-center',
                            style: 'error',
                            autoclose: 3000
                        });

                    }
                })
            },
            //关闭蒙层
            closeDialog(e){
                if(e.target == this.$refs.dialog){
                    this.showLogin = false;
                }
            },
            //播放当前视频
            watchVideo(url){
                // console.log(url)
                this.videoSource = url;
            },
        },
        
    })






}


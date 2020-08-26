$(function(){
	layer.open({
		type:2,
		title: ['加载中', 'color: #eee;font-size:20px']
	});
	var params = getQueryParams();
	var org_id = params["orgId"], org_type = params["type"];
	var verInfo = detectVersion();
	var telphone = null, requesting = false;
	var getCodeTimer = -1;
	var leadName = '';
	var layer1 = '';

	var title = "";
	if(org_type == 1){
		org_type = 2;
		title = "商会";
		$(".org-list .list-title").text('已加入的会员企业');//组织名称
		
	} else if(org_type == 2){
		org_type = 1;
		title = "企业";
		$(".org-list .list-title").text('热门推荐');
	} else if(org_type == 3){
		title = "组织";
		$(".org-list .list-title").text('热门推荐');
		$(".leader-item-grade").text('').removeClass("leader-item-grade");//组织名称
		document.title = '一起来往 . 组织';
	} else if(org_type == 9){
		title = "联盟";
		$(".org-list .list-title").text('已加入的成员单位');//组织名称
		document.title = '一起来往 . 联盟号';
		$(".dlg-e-info").addClass('dlg-e-info1')
	}
	//下拉箭头
	$(".down-arrow").on("click", function(){
		$(".desc").css({'max-height':"none"});
		$(".lg-cover").addClass("hide");
		$(this).addClass("hide");
		$(".desc").removeClass('elip');
	});
	function fillOrg(rsp){//填充数据
		if(rsp.data){
			layer.closeAll()
			$(".body").removeClass("hide");  
		}
		var org = rsp.data;

		orgName = org.orgName;
		$(".bg .org").attr("id", org.orgId);
		$(".org-info .org-name").text(org.orgName);//组织名称
		$(".org img").attr("src", org.orgUrl);//组织logo
		$(".desc-text .org-nm").text(org.orgName);//组织名称
		// $(".desc-text .org-master").text(org.createName + '理事长');//理事长
		if(org_type==9){
			$(".desc-text .orgType9").removeClass("hide");
			$(".desc-text .orgType").addClass("hide");
		}
		$(".desc-text .org-tp").text(org_type==2?'商会':org_type==1?'企业':org_type==3?'组织':'联盟');
		
		// org.newOrgLeaderDtoList = [];
		var newOrgList = org.orgLeaderDtoList;
		if (org.orgLeaderDtoList.length > 0) {//领导列表

			//过滤掉不是领导的人
			for (var i=0; i<org.orgLeaderDtoList.length; i++) {
				// org.newOrgLeaderDtoList.push(org.orgLeaderDtoList[i])
				if(org_type ==3){
					var rg = new RegExp("主管理员", "gi");
				}else if(org_type ==9){
					var rg = new RegExp("理事长|秘书长|理事", "gi");
				}else{
					var rg = new RegExp("会长|副会长|秘书长|董事长|总裁|总经理|副总|总监|CEO|CFO|CTO|COO|CIO|CMO|CHO", "gi");
				}
				if (rg.test(org.orgLeaderDtoList[i].leaderName) == false) {
					org.orgLeaderDtoList.splice(i, 1);//删除不是领导的
					i--;
				}
			}
			if(org.orgLeaderDtoList.length){
				//把boss放到第一位
				var ln = org_type == 2 ? "会长" : org_type == 1 ?"总经理":org_type == 9? '理事长':'主管理员';
				var isLeader = false;
				for (var i in org.orgLeaderDtoList) {
					if (org.orgLeaderDtoList[i].leaderName == ln) {
						isLeader = true;
						if (i != 0) {//不是第一个
							var ld = org.orgLeaderDtoList[i];
							org.orgLeaderDtoList.splice(i, 1);//从原位置删除
							org.orgLeaderDtoList.splice(0, 0, ld);//插入到第一位
						}
						break;
					}
	
				}
				var leader = org.orgLeaderDtoList[0];
				ln = leader.leaderName;
				leadName = leader.userName;
				if(org_type == 2 || org_type == 9){
					if(isLeader){
						$(".org-info .master").text(ln + "：" + leader.userName);
					}else{
						if(org_type == 9){
							$(".org-info .master").text("理事长：未设置");
						}else{
							$(".org-info .master").text("会长：未设置"); 
						}
					} 

					$(".desc-text .org-master").text(leader.userName + ln);
				}else{
					$(".org-info .master").text('热度 ' + org.calorificValue);
				}
					
					
				var items = $(".leader .leader-item");
				var sps = $(".leader .leader-item-sp");
				for (var i = 0; i < 3; i++) {//最多3个
					if (i >= org.orgLeaderDtoList.length) break;
	
					var it = items.eq(i);
					var ld = org.orgLeaderDtoList[i];
	
					ln = ld.leaderName;
					if (ln=="") ln = "未知";
		
					it.removeClass("hide");
					sps.eq(i).removeClass("hide");
					it.children().children("img").attr("src", ld.headImgUrl);//头像
					it.children().children(".leader-item-grade").text(ln);//职务
					// it.children(".leader-item-name").text(ld.userName);//姓名
					it.children().children(".leader-item-name").text(ld.userName);//姓名
					if(org.orgLeaderDtoList.length ==2){
						items.css({ 'max-width': "130px" });
					}else if(org.orgLeaderDtoList.length ==1){
						items.css({ 'max-width': "180px" });
					}
				}
	
				var cnt = org.orgLeaderDtoList.length;
				if (cnt > 3) cnt = 3;
				//计算间隔的宽度
				var w = $(".leader").width(), iw = items.eq(0).width(),iw2 = items.eq(1).width(),iw3 = items.eq(2).width();
				sps.css({ width: (w - (iw + iw2 + iw3)) / (cnt + 1) + "px" });

			}else{
				var items = $(".leader .leader-item");
				$(".desc .org-master").text("***总经理");
				// $(".leader .leader-item").addClass("hide");
				// $(".leader .leader-none").text("完善人员职务信息，体验平台更多精彩");
				if(org_type == 9){
					$(".org-info .master").text("理事长：未设置");
					$(".desc-text .org-master").text("***理事长");
					items.children().children(".leader-item-name").text('理事长姓名 (未设置)');//姓名
					items.children().children(".leader-item-grade").text('职务:理事长');//职务
				}else{
					$(".org-info .master").text("会长：未设置");
					$(".desc-text .org-master").text("***会长");
					items.children().children(".leader-item-grade").text('职务:会长');//职务
					items.children().children(".leader-item-name").text('会长姓名 (未设置)');//姓名
				}
				items.children().children("img").attr("src", './images/mrtx.png');//头像
				items.eq(0).css({ 'max-width': "180px" });
				items.css('margin-top','5px');
				items.children().children(".leader-item-grade").removeClass('hide');
				items.children().children(".leader-item-name").css('margin-top','0');
				items.children('.leader-item-left').children(".leader-item-grade").addClass('hide');
				items.children().children(".leader-item-name").css({ 'max-width': "180px" });
				items.children().children(".leader-item-grade").css({ 'max-width': "180px" });
				var w = $(".leader").width(), iw = items.eq(0).width();
				$(".leader .leader-item-sp").css({ width: (w - iw * 1) /2 + "px" });
			}

		}else{//没有领导列表，则隐藏相关元素
			var items = $(".leader .leader-item");
			$(".org-info .master").text("会长：未设置");
			$(".desc .org-master").text("***总经理");
			// $(".leader .leader-item").addClass("hide");
			// $(".leader .leader-none").text("完善人员职务信息，体验平台更多精彩");
			if(org_type == 9){
				$(".org-info .master").text("理事长：未设置");
				$(".desc-text .org-master").text("***理事长");
				items.children().children(".leader-item-name").text('理事长姓名 (未设置)');//姓名
				items.children().children(".leader-item-grade").text('职务:理事长');//职务
			}else{
				$(".org-info .master").text("会长：未设置");
				$(".desc-text .org-master").text("***会长");
				items.children().children(".leader-item-grade").text('职务:会长');//职务
				items.children().children(".leader-item-name").text('会长姓名 (未设置)');//姓名
			}
			items.children().children("img").attr("src", './images/mrtx.png');//头像
			items.eq(0).css({ 'max-width': "180px" });
			items.css('margin-top','5px');
			items.children().children(".leader-item-grade").removeClass('hide');
			items.children().children(".leader-item-name").css('margin-top','0');
			items.children('.leader-item-left').children(".leader-item-grade").addClass('hide');
			items.children().children(".leader-item-name").css({ 'max-width': "180px" });
			items.children().children(".leader-item-grade").css({ 'max-width': "180px" });
			var w = $(".leader").width(), iw = items.eq(0).width();
			$(".leader .leader-item-sp").css({ width: (w - iw * 1) /2 + "px" });

		}
		if(org.orgIntroduce){
			$(".desc").html(org.orgIntroduce);//组织名称
		}else{
			if(org_type==9){
				// $(".desc").html(`${orgName}已经在“一起来往”商务社交平台入驻了，这是在平台上开设的联盟号，${leadName.length ? leadName:'***'}理事长诚邀您莅临指导，与众位企业家一起共商盛举`);
				$(".desc").html(`<i class="org-nm" style='font-style:normal'>${orgName}</i>已经在“一起来往”商务社交平台入驻了，这是在平台上开设的<span class="org-tp">联盟</span>号，
				<i class="org-master" style='font-style:normal'>${leadName.length ? leadName:'***'}理事长</i>诚邀您莅临指导，与众位企业家共商盛举。`)
				
				$('.desc').css('height','auto')
			}else{
				$(".desc").addClass("desc-none");
				$(".desc").text("快去完善组织信息吧");//组织名称
			}
		}
		// 判断隐藏下拉箭头
		if($(".desc").length && $(".desc")[0].offsetHeight < 130){
			$(".down-arrow").remove();
		}

		// org.headImgs = [];
		if (org.headImgs.length > 0) {//会员列表
			var items = $(".member img");

			for (var i = 0; i < 6; i++) {//最多6个
				if (i >= org.headImgs.length) break;

				var it = items.eq(i);
				var url = org.headImgs[i];

				it.removeClass("hide");
				it.attr("src", url);//头像
			}
			if(org_type == 9){
				$(".member span").text("成员单位" + org.userCount);
			}else{
				$(".member span").text("活跃成员" + org.userCount);
			}
		}else{
			if(org_type == 9){
				$(".member i").text("（成员单位logo列表）");
			}else{
				$(".member i").text("（会员头像列表）");
			}
			$(".member img").eq(0).attr("src",'./images/member (1).png');
			if(org_type == 9){
				$(".member span").text("成员单位0");
			}else{
				$(".member span").text("活跃成员0");
			}
		}
		// org.shareRecommendOrgDtoList =[];
		if (org.shareRecommendOrgDtoList.length > 0) {//已入驻企业、推荐企业
			var items = $(".org-list .list-item");
			var it = null;

			for (var i = 0; i < org.shareRecommendOrgDtoList.length; i++) {
				var or = org.shareRecommendOrgDtoList[i];

				if (i == 0) it = items.eq(0);
				else {
					it = items.eq(0).clone();//克隆一个
					$(".org-list").append(it);
				}

				it.attr("aid", or.orgId);
				it.children("img").attr("src", or.orgUrl);
				it.find(".e-name").text(or.orgName);
				if(org_type == 2){
					it.find(".e-master").text(`${or.userName} ${or.userOrgPosition? or.userOrgPosition:'总经理'}`);
				}else{
					it.find(".e-master").text(`${or.userName} ${or.userOrgPosition? or.userOrgPosition:'会长'}`);

				}
			}
		}else{
			if(org_type == 9){
				$(".org-list .e-name").text('虚位以待第一位成员单位'); 
				$(".org-list .list-item img").attr("src",'./images/member (1).png');
			}else{
				$(".org-list .e-name").text('虚位以待第一位会员企业');
			}
			$('.list-item-img').css('border-radius','0');
			$(".org-list .e-master").text(`${org_type==2?'会长':org_type==1?'总经理':org_type==9?'负责人':''}：***`);
		}

		var title = org.orgName;
		var imgUrl = org.orgUrl;
		if(window.location.href.indexOf('Info') == -1){
			// 邀请加入
			var desc = org.orgName + '邀请您入驻数字商协会平台';
		}else{
			var desc = '来自数字商协会平台的内容分享';
		}
		// console.log(title, imgUrl, desc)
		setWxShare(title, imgUrl, desc);
		setQYWxShare(title, imgUrl, desc);
	}

	function getVerifyCode(){//获
		if (requesting){
			alert("上一个请求还没完成，请稍后再试");
			return;
		}

		var inputs = $(".dlg-e-info .dlg-input-item input");

		var phone = $.trim(inputs.eq(1).val());
		// console.log(phone)
		if (phone.length>0){
			var reg = /^1[2|3|4|5|6|7|8|9][0-9]{9}$/;
			if(reg.test(phone)==false){
				alert('请输入有效的手机号码！');
				return;
			}

			telphone = phone;//记录下来，防止用户手动修改
			requesting = true;

			$.ajax({
				url: BASE_URL + "webSite/verificationCode",
				headers: {"api-version":VRESION,"api-client":judgeApiClient('webSite')},
				contentType: "application/json; charset=utf-8",
				type: "POST",
				data: JSON.stringify({"telPhone":phone,"type":"12"}),
				dataType: "json",
				success: function(rsp){
					requesting = false;

					if (rsp.code==200){
						var gc = $(".dlg-e-info .get-code").css({background:"lightgrey",color:"grey"});
						gc.text("60s");

						var s = 60;
						var func = function(){
							if (s>0){
								gc.text((--s)+"s");
								getCodeTimer = setTimeout(func, 1000);
							}else{
								gc.text("获取验证码");
								gc.css({background:"rgb(33, 100, 235)",color:"white"});
							}
						};
						getCodeTimer = setTimeout(func, 1000);
					}else alert("获取验证码失败："+rsp.msg);
				},
				error: function(xhr, msg){
					requesting = false;
					alert("错误："+msg);
				}
			});
		}else{
			alert("请输入手机号");
		}
	}

	function createEnterprice(){//创建企业
		if (requesting){
			alert("上一个请求还没完成，请稍后再试");
			return;
		}

		var inputs = $(".dlg-e-info .dlg-input-item input");

		var ename = $.trim(inputs.eq(0).val());
		var bossName = $.trim(inputs.eq(2).val());
		var vc = $.trim(inputs.eq(3).val());

		if (ename.length==0){
			if(org_type == 9){
				var text = '请输入单位名称'
			}else{
				var text = '请输入企业名称 (全称)'
			}
			layer.open({
				content: text,
				skin: 'msg',
				time: 3 //2秒后自动关闭
			});
			return;
		}
		if (bossName.length==0 && org_type != 9){
			layer.open({
				content: '请输入姓名',
				skin: 'msg',
				time: 3 //2秒后自动关闭
			});
			return;
		}
		if (telphone==null){
			layer.open({
				content: '请先输入手机号并且取验证码',
				skin: 'msg',
				time: 3 //2秒后自动关闭
			});
			return;
		}
		if (vc.length==0){
			layer.open({
				content: '请输入验证码',
				skin: 'msg',
				time: 3 //2秒后自动关闭
			});
			return;
		}
		
		org_id = params["orgId"];//恢复组织id
		requesting = true;
		if(org_type == 9){
			var url = 'h5/org/invitationJoinUnion';
		}else{
			var url = 'h5/org/invitationJoin';
		}
		layer1 = layer.open({
			type:2,
		});
		//提交请求
		$.ajax({
			url: BASE_URL + url,
			headers: {"api-version":VRESION,"api-client":judgeApiClient('webSite')},
			contentType: "application/json; charset=utf-8",
			type: "POST",
			data: JSON.stringify({
				"orgName": ename,
				"userName": bossName,
				"telphone": telphone,
				"orgId": org_id,
				"verificationCode": vc,
				'applyTel':telphone,
				'unionId':org_id,
				'orgType':selectValue
			}),
			dataType: "json",
			success: function(rsp){
				requesting = false;
				
				if (rsp.code==200){
					if(org_type == 9){
						// 如果用户不是所填单位的管理员
						if(rsp.data==1){
							$(".dlg-join-success .dlg-join-span").text(`你不是所填单位的管理员，不能代替组织申请加入联盟`)
						}
						if(rsp.data==2){
							$(".dlg-join-success .dlg-join-span").text(`您已提交申请，请耐心等待`)
						}
						//如果用户是平台新用户
						if(rsp.data==3){
							$(".dlg-join-success .dlg-join-span").text(`已成功创建了您的${selectValue ==1?'商会号':selectValue ==2?'协会号':'企业号'}，并且提交了申请，请打开一起来往App查看详情`)
						}
						if(rsp.data==4){
							$(".dlg-join-success .dlg-join-span").text(`该组织名已存在`)
						}
						if(rsp.data==5){
							$(".dlg-join-success .dlg-join-span").text(`您的组织已提交过加入联盟申请，请耐心等待`)
						}
					}else{
						$(".dlg-join-success .dlg-join-span").text(`已成功创建了您的企业号，并且加入了“${orgName}”。请打开一起来往APP查看详情。`);
					}
					$(".dlg-e-info").addClass("hide");
					$(".dlg-join-success").removeClass("hide");
					//重置输入数据
					inputs.val("");
				}else {
					layer.open({
						content: rsp.msg,
						skin: 'msg',
						time: 3 //2秒后自动关闭
					});
				}
				layer.close(layer1);
				inputs.val("");
				//恢复验证码按钮
				telphone = null;

				if (getCodeTimer!=-1){
					clearTimeout(getCodeTimer);
					getCodeTimer = -1;
				}

				var gc = $(".dlg-e-info .get-code");
				gc.text("获取验证码");
				gc.css({ background: "rgb(33, 100, 235)", color: "white" });
			},
			error: function(xhr, msg){
				layer.close(layer1);
				requesting = false;
				alert("错误："+msg);
			}
		});
	}

	//立即加入按钮
	$(".join-btn").on("touchend", function(){
		if(org_type == 9){
			$(".modal-layer .dlg-title").text("请输入成员单位信息");
			$(".modal-layer .dlg-input-item").eq(1).removeClass("hide");
			$(".modal-layer .dlg-input-item span").eq(0).text("单位名称");
			$(".modal-layer .dlg-input-item input").eq(0).attr('placeholder','填写真实名称');
			$(".modal-layer .dlg-input-item span").eq(2).text("手机号");
			$(".modal-layer .name").addClass("hide");
			$(".modal-layer .create-btn").text("申请加入联盟");
		}

		$(".modal-layer").removeClass("hide");
		$(".dlg-e-info").removeClass("hide");
	});
	var selectValue = $('.dlg-input-item-select').val();
	$('.dlg-input-item-select').on('change',function(){
		selectValue = $('.dlg-input-item-select').val();
		// console.log($('.dlg-input-item-select').find("option:selected").text())
	})
	//打开app按钮
	$(".open-btn").on("click", function(){
		if ($(this).hasClass("join-btn") || $(this).hasClass("create-btn")) return;

		var dlg = $(this).parent();
		if (dlg.hasClass("dlg-open-app")==false){//不是打开推荐列表中的组织
			org_id = params["orgId"];//恢复组织id
		}

		if (verInfo.isAndroid){
			//window.location.href = "yiqilaiwang://www.yiqilaiwang.com/open";
			openApp("yiqilaiwang://www.yiqilaiwang.com/open", verInfo);
		}else if (verInfo.isIOS9){
			openApp("https://apps.apple.com/cn/app/id1473793767", verInfo);
		}else if (verInfo.isIOS){
			openApp("https://apps.apple.com/cn/app/id1473793767", verInfo);
		}
	});
	//已入驻企业列表
	$(".org-list").on("click", ".list-item", function(){
		$(".modal-layer").removeClass("hide");
		$(".dlg-open-app").removeClass("hide");

		org_id = $(this).attr("aid");//点击的企业id
	});
	//关闭对话框按钮
	$(".modal-layer .close-dlg").on("click", function(){
		$(".modal-layer").addClass("hide");
		$(".dlg-open-app").addClass("hide");
		$(".dlg-e-info").addClass("hide");
		$(".dlg-join-success").addClass("hide");
	});
	//取验证码按钮
	$(".dlg-e-info .get-code").on("touchend", function(){
		if ($(this).text()=="获取验证码"){
			getVerifyCode();
		}
	});
	//创建企业
	$(".dlg-e-info .create-btn").on("click", function(){
		var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
		createEnterprice();
	});

	requesting = true;
	//加载商协会号
	$.ajax({
		url: BASE_URL + "h5/org/shareOrg", 
		headers: {"api-version":VRESION,"api-client":judgeApiClient('webSite')},
		contentType: "application/json; charset=utf-8",
		type: "POST",
		data: JSON.stringify({"orgId":org_id, "orgType":org_type}),
		// 测试
		// data: JSON.stringify({"orgId":org_id, "orgType":2}),
		dataType: "json",
		success: function(rsp){
			requesting = false;

			if (rsp.code==200) fillOrg(rsp);
			else alert("读取数据失败："+rsp.msg);
		},
		error: function(xhr, msg){
			requesting = false;
			alert("错误："+msg);
		}
	});

	// 软键盘不能弹起问题
	useEffect();
	function useEffect(){
		// 软键盘收起事件处理
    const onFocusout = () => {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      let wechatInfo = u.match(/MicroMessenger\/([\d\.]+)/i); // WeChat
      let wechatVersion = wechatInfo[1];
  
      if (isiOS && wechatVersion >= '6.7.4') {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
      }
    }

    // 加载组件添加事件监听
    document.body.addEventListener('focusout', () => { onFocusout() });
    
    // 卸载组件清除事件监听
    return () => {
      document.body.removeEventListener('focusout', () => { onFocusout() });
    }
  }


});
# 一起来往

版本变化：
全局搜索旧版本号，替换为新版本号，重新编译。注：仅修改ajax中的版本号
访问服务器路径替换：
需要替换两处：
come_and_go_together\src\assets\js\ajax.js  15行baseURL：XXXX
come_and_go_together\src\view\tolead.vue     114行  this.instance.post("https://test.yiqilaiwang.com/webSite/importUser?orgId=" + this.orgId, formData).then((res) => {
                                                        将post路径换为指定路径即可
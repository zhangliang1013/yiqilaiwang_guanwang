<template>
  <div>

    <div class="w bg page_news_article" v-if="detail">
      <div class="page_news_article_title">{{detail.newsDigest}}</div>
      <div class="page_news_article_s">一起来往 {{detail.createTime}}</div>
      <div class="page_news_article_content" v-html="detail.content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'news_article',
  props: {
    msg: String
  },
    data(){
      return{
          detail:null
      }
    },
		// watch: {
		// 	'$route': function(to, from) {
		// 		document.body.scrollTop = 0
		// 		document.documentElement.scrollTop = 0
		// 	}
		// },
  created() {
		
      this.http.ajax({
          url:'webSite/home/newsDetail',
          method: 'post',
          headers:{
              'Content-Type':' application/json'
          },
          data: {
              "id":this.$route.query.id
          }
      }).then(res=>{
          if(res.code==200){
              this.detail=res.data
							this.detail.createTime=res.data.createTime.substr(0,10)
              // console.log(res)
							// window.scroll(0, 0);
							
          }
      })
  }
}
</script>

<style lang="less">
  .page_news_article{ margin-top: 39px;margin-bottom: 56px;}
  .page_news_article_title{
    padding-top: 58px;
    text-align: center;
    font-size: 24px;
		font-weight: bold;
		color: #333333;
  }
  .page_news_article_s{
    margin-top: 11px;
    color: #666666;
    font-size: 13px;
    text-align: center;
  }
  .page_news_article_content{
		color:#333;
    font-size: 16px;
    margin: 0 148px;
    margin-top: 52px;
    padding-bottom: 63px;
    img{
      max-width: 100%;
      max-height: 100%;
      height: 100% !important;
      display: block;
      margin: 20px auto;

    }

  }
</style>

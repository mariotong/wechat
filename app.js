'use strict'

var Koa =require('koa')
var wechat =require('./wechat/g.js')
var Wechat = require('./wechat/wechat.js')
var app =new Koa
var config =require('./config')
var reply =require('./wx/reply')
console.log(reply.reply)
var ejs=require('ejs')
var crypto =require('crypto')
var heredoc=require('heredoc')
var tpl =heredoc(function(){
	/*
<!DOCTYPE html>
<html>
  <head>
    <title>搜电影</title>
    <meta name='Viewport' content='initial-scale=1,maximum-scale=1,minimum-scale=1'>
  </head>
  <body>
    <h1>点击标题，开始录音翻译</h1>
    <p id='title'></p>
    <div id='director'></div>
    <div id='year'></div>
    <div id='poster'></div>
  </body>
  <script src="http://zeptojs.com/zepto-docs.min.js"></script>
  <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<script>
	 wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: 'wx2ab2cbb86fe1cdec', // 必填，公众号的唯一标识
			timestamp: '<%= timestamp %>' , // 必填，生成签名的时间戳
			nonceStr: '<%= 	noncestr %>', // 必填，生成签名的随机串
			signature: '<%= signature %>',// 必填，签名，见附录1
			jsApiList: ['previewImage','onMenuShareAppMessage','startRecord','stopRecord','onVoiceRecordEnd','translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
    wx.ready(function(){
      wx.checkJsApi({
            jsApiList: ['previewImage','onVoiceRecordEnd','translateVoice','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
              console.log(res)
          }
      });
      var shareContent={
      title: '分享标题',
      desc: '我搜出来了' ,// 分享描述
      link: 'www.zhengleishuai.site/movie', // 分享链接
      imgUrl: '' ,// 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
           window.alert('分享成功')
          // 用户确认分享后执行的回调函数
      },
      cancel: function () {
          window.alert('分享失败')
          // 用户取消分享后执行的回调函数
       }
     };
      wx.onMenuShareAppMessage(shareContent);
      var isRecording = false;
      var slides;
      $('#poster').on('tap',function(){
          wx.previewImage(slides)
      })
      $('h1').on('tap',function(){
        if(!isRecording){
            isRecording=true
            wx.startRecord({
              cancel:function(){
              window.alert('那就不能搜了哦')
            }
          })
          return
        }
        isRecording = false
        wx.stopRecord({
           success:function(res){
           var localId=res.localId
           wx.translateVoice({
               localId:localId,
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var result= res.translateResult
                    $.ajax({
                    type:'get',
                    url:'https://api.douban.com/v2/movie/search?q='+result,
                    dataType:'jsonp',
                    jsonp:'callback',
                    success:function(data){
                        var subject=data.subjects[0];
                        $('#title').html(subject.title);
                        $('#year').html(subject.year);
                        $('#director').html(subject.directors[0].name);
                        $('#poster').html('<img src="'+subject.images.large+'"/>');
                        shareContent={
                            title: subject.title, // 分享标题
                            desc: '我搜出来了'+subject.title, // 分享描述
                            link: 'www.zhengleishuai.site/movie', // 分享链接
                            imgUrl: subject.images.large, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                 window.alert('分享成功')
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                window.alert('分享失败')
                                // 用户取消分享后执行的回调函数
                            }
                        }
                        slides={
                            current:subject.images.large,
                            urls:[],
                        }
                        data.subjects.forEach(function(item){
                            slides.urls.push(item.images.large)
                       })

                        wx.onMenuShareAppMessage(shareContent);
                     }
                  })
                }
            });
         }
        })
      })
  })


	</script>
</html>
	*/
})
var createNonce = function(){
	return Math.random().toString(36).substr(2,15)
}
var createTimestamp = function(){
	return parseInt(new Date().getTime()/1000, 10) + ''
}
var _sign =function(noncestr,ticket,timestamp,url){
	var params=[
		'noncestr='+noncestr,
		'jsapi_ticket='+ticket,
		'timestamp='+timestamp,
		'url='+url,
	]
	var str=params.sort().join('&')
	var shasum=crypto.createHash('sha1')
	shasum.update(str)
	return shasum.digest('hex')
}
function sign(ticket,url){
	var noncestr=createNonce()
	var timestamp =createTimestamp()
	var signature = _sign(noncestr,ticket,timestamp,url)
	return {
		noncestr:noncestr,
		timestamp:timestamp,
		signature:signature
	}
}

app.use(function *(next){
  if(this.url.indexOf('/movie')>-1){
		var wechatApi = new Wechat(config.wechat)
		var data =yield wechatApi.fetchAccessToken()
		var access_token = data.access_token
		var ticketData =yield wechatApi.fetchTicket(access_token)
		var ticket =ticketData.ticket
		var url=this.href.replace('node','www.zhengleishuai.site')
    console.log(url)
		var params=sign(ticket,url)
    this.body=ejs.render(tpl,params)
    return next
  }
  yield next
})
app.use(wechat(config.wechat,reply.reply))

app.listen(1234)
console.log('listeng:success')

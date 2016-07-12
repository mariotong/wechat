'use strict'
var wx =require('../../wx/index')
var util=require('../../libs/util')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var Movie=require('../api/movie')
var koa_request = require('koa-request')

exports.guess =function *(next){
  var wechatApi = wx.getWechat()
  var data =yield wechatApi.fetchAccessToken()
  var access_token = data.access_token
  var ticketData =yield wechatApi.fetchTicket(access_token)
  var ticket =ticketData.ticket
  var url=this.href.replace('node','www.zhengleishuai.site')
  var params=util.sign(ticket,url)
  yield this.render('wechat/game', params)
}

exports.find =function *(next){
  var code =  this.query.code //微信返回来的时候带的参数code

  var openUrl ='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+
   wx.wechatOptions.wechat.appID+'&secret='+wx.wechatOptions.wechat.appSecret+'&code='+code+'&grant_type=authorization_code'

  var response = yield koa_request({url:openUrl})

  var body = JSON.parse(response.body)
  var openid = body.openid
  var user = yield User.findOne({openid:openid}).exec()
  if(!user){
    user = new User({
      openid:openid,
      password:'zhenglei',
      name: Math.random().toString(36).substr(2)
    })
    user = yield user.save()
  }
  this.session.user=user
  this.locals.user=user

  var id =this.params.id
  var wechatApi = wx.getWechat()
  var data =yield wechatApi.fetchAccessToken()
  var access_token = data.access_token
  var ticketData =yield wechatApi.fetchTicket(access_token)
  var ticket =ticketData.ticket
  var url=this.href.replace('node','www.zhengleishuai.site')
  var params=util.sign(ticket,url)
  var movie = yield Movie.searchById(id)
  params.movie=movie
  yield this.render('wechat/movie',params)
}


exports.jump=function *(next){
  //https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
  var movieId = this.params.id
  var redirect = 'http://www.zhengleishuai.site/wechat/movie/'+movieId
  var url ='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+
   wx.wechatOptions.wechat.appID+'&redirect_uri='+redirect+'&response_type=code&scope=snsapi_base&state='+ movieId
   this.redirect(url)
}

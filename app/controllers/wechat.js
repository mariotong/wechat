'use strict'

var wechat = require('../../wechat/g.js')
var reply= require('../../wx/reply')
var wx=require('../../wx/index')
var wechatOptions = wx.wechatOptions

exports.hear=function *(next){
  this.middle=wechat( wechatOptions.wechat,reply.reply)
  yield this.middle(next)
}

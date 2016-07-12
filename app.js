'use strict'

var Koa =require('koa')
var crypto =require('crypto')
var mongoose = require('mongoose')
var fs = require('fs')
var moment = require('moment')
var dbUrl = 'mongodb://localhost/imooc'


mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)
var menu = require('./wx/menu.js')
var wx = require('./wx/index.js')
var wechatApi= wx.getWechat()
wechatApi.deleteMenu().then(function(){
	wechatApi.createMenu(menu)
	console.log(menu)
}).then(function(msg){
	console.log(msg)
})

var app =new Koa()
var Router = require('koa-router')
var router = new Router()
var views =require('koa-views')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var User=mongoose.model('User')


app.use(views(__dirname+'/app/views',{
  map: {
   html: 'jade'
 },
 locals:{
   moment:moment
 }
}))

app.keys = ['zhenglei']
app.use(session(app))
app.use(bodyParser())
app.use(function *(next){
  var user=this.session.user
  if(user&&user._id){
    this.session.user = yield User.findOne({_id:user._id}).exec()
    this.locals.user = this.session.user
  }else {
    this.locals.user = null
  }
  yield next
})
require('./config/routes.js')(router)
app.use(router.routes()).use(router.allowedMethods())


app.listen(1234)
console.log('listeng:success')

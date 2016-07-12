var path =require('path')
var util =require('../libs/util.js')
var Wechat = require('../wechat/wechat.js')
var wechat_file=path.join(__dirname,'../config/wechat.txt')
var wechat_ticket_file=path.join(__dirname,'../config/wechat_ticket.txt')
var config= {
	wechat:{
		appID:'wx2ab2cbb86fe1cdec',
		appSecret:'3e7224e8fd60a4ac6766a8971e3d203c',
		token:'wojiaozhenglei',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken:function(data){
            data=JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
		},
		getTicket:function(){
			return util.readFileAsync(wechat_ticket_file)
		},
		saveTicket:function(data){
						data=JSON.stringify(data)
						return util.writeFileAsync(wechat_ticket_file,data)
		}
	}
}
exports.wechatOptions = config
exports.getWechat=function(){
  var wechatApi = new Wechat (config.wechat)
  return wechatApi
}

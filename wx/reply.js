'use strict'
var config = require('../config.js')
var Wechat = require('../wechat/wechat.js')
var menu = require('./menu.js')
var wechatApi = new Wechat (config.wechat)
var path = require('path')
var fs =require('fs')

wechatApi.deleteMenu().then(function(){
	wechatApi.createMenu(menu)
	console.log(menu)
}).then(function(msg){
	console.log(msg)
})

exports.reply =function* (next){
	var message =this.weixin
	console.log(message)
	if(message.MsgType === 'event'){
		if( message.Event === 'subscribe'){
			if( message.EventKey){
				console.log('扫二维码进来:'+message.EventKey+' '+message.ticket)
			}
			console.log('welcome')
			this.body='哈哈，你订阅了个号\r\n'+'消息ID：'+message.MsgId
		}else if(message.Event === 'unsubscribe'){
			console.log('无情取关')
			this.body=''
		}else if(message.Event === 'LOCATION'){
			this.body='您上报的位置是：'+message.Latitude+
			'/'+message.Longitude+'-'+message.Precision
		}else if (message.Event === 'CLICK'){
			this.body='您点击了菜单'+  message.EventKey
		}else if (message.Event === 'SCAN'){
			console.log('关注后二维码'+ message.EventKey+' '+message.Ticket)
			this.body ='看到你扫了一下哦'
		}else if (message.Event ==='VIEW'){
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='scancode_push'){
			console.log(message.ScanCodeInfo)
			console.log(message.ScanResult)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='scancode_waitmsg'){
			console.log(message.ScanCodeInfo)
			console.log(message.ScanResult)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='pic_sysphoto'){
			console.log(message.SendPicsInfo.PicList)
			console.log(message.SendPicsInfo.Count)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='puc_photo_or_album'){
			console.log(message.SendPicsInfo.PicList)
			console.log(message.SendPicsInfo.Count)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='pic_weixin'){
			console.log(message.SendPicsInfo.PicList)
			console.log(message.SendPicsInfo.Count)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}else if(message.Event=='location_select'){
			console.log(message.SendLocationInfo.Location_X)
			console.log(message.SendLocationInfo.Location_X)
			console.log(message.SendLocationInfo.Scale)
			console.log(message.SendLocationInfo.Label)
			this.body = '您点击了菜单中的链接: '+ message.EventKey
		}
	}else if(message.MsgType === 'text'){
		var content = message.Content
		var reply = '额，你说的'+message.Content+'太复杂了无法回复你想要的内容'
		if (content === '1') {
			reply = '我是谁'
		}else if (content === '2'){
			reply = '我叫郑磊'
		}else if (content === '3'){
			reply = '是全世界最帅的男人'
		}else if (content === '4'){
			reply = [{
				title:'技术改变世界',
				description: '知识改变未来',
				picUrl:'http://picture.youth.cn/dmzb/201305/W020130514542662922703.jpg',
				url :'https://www.baidu.com'
			},{
				title:'我是谁',
				description: '我叫郑磊，是全世界最帅的男人',
				picUrl:'http://imgsrc.baidu.com/forum/pic/item/b8389b504fc2d562b2c0aa4ce71190ef77c66c42.jpg',
				url : 'http://github.com/mariotong'
			}]
		}else if(content==='5'){
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname,'../2.jpg'))
			console.log(data)
			reply= {
				type: 'image',
				mediaId: data.media_id
			}
		}else if (content==='6'){
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname,'../6.mp4'))
			reply= {
				type: 'video',
				mediaId: data.media_id,
				title: '回复一下视频',
				description:'这是一个关于打篮球的视频'
			}
		}else if(content==='7'){
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname,'../6.mp4'))
			reply= {
				type: 'music',
				title: '回复一下音乐',
				description:'听一下音乐放松一下被',
				musicUrl:'http://sc1.111ttt.com/2015/1/07/01/100011033543.mp3',
				mediaId: data.media_id
			}
		}else if (content === '8'){
			//测试永久素材上传
			var data = yield wechatApi.uploadMaterial('image',path.join(__dirname,'../2.jpg'),{type:'image'})
			reply= {
				type: 'image',
				mediaId: data.media_id
			}
		}else if (content === '9'){
			//测试永久素材上传
			var data = yield wechatApi.uploadMaterial('video',path.join(__dirname,'../2.jpg'),{type:'video',description:'{"title":"Really a nice place","introduction":"Never say Never"}'})
			reply= {
				type: 'video',
				mediaId: data.media_id,
				title: '回复一下视频',
				description:'这是一个关于打篮球的视频'
			}
		}else if(content === '10'){
			//var picData=yield wechatApi.uploadMaterial('image',__dirname+'/2.jpg',{})

		/*	var media={
				articles: [{
				     title: '新增图文消息',
				     thumb_media_id: picData.media_id,
				     author: '郑磊',
				     digest: '我是全世界最牛的人',
				     show_cover_pic: 1,
				     content: 'lalalalalalalal我叫郑磊是全世界最帅的男人',
				     content_source_url: 'https://www.baidu.com'
				  }]
			}
			data=yield wechatApi.uploadMaterial('news',media,{})
			      console.log('uploadnewsdata',data)*/
			data=yield wechatApi.fetchMaterial('X0Nkx8SvCoka6pfFHaMTNxk3UkCQ7s7IHrM6dWjrhEY','news',{})

						console.log('fetchnewsdata',data)

			var items=data.news_item
			var news=[]
			var item=items.forEach(function(item){
				news.push({
					title:item.title,
				    picUrl:item.thumb_media_id,
				    description:item.digest,
				    url:item.url,
				})
			})
			reply=news
			/*
			<ArticleCount><%= content.length %></ArticleCount>
					<Articles>
					<% content.forEach(function(item){ %>
					<item>
						<Title><![CDATA[<%= item.title %>]]></Title>
						<Description><![CDATA[<%= item.description %>]]></Description>
						<PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
						<Url><![CDATA[<%= item.url %>]]></Url>
					</item>
					<% }) %>
					</Articles>
			*/

		}else if(content === '11'){
			var counts=yield wechatApi.countMaterial()
			console.log(JSON.stringify(counts))
			var results=yield[
				wechatApi.batchMaterial({
					type:'image',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'video',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'voice',
					offset:0,
					count:10
				}),
				wechatApi.batchMaterial({
					type:'news',
					offset:0,
					count:10
				})
			]
			console.log('results',JSON.stringify(results))
			reply='1'
		}else if(content==='12'){
			var group =yield wechatApi.createGroup('wechat2')
			console.log('new group wechat')
			console.log(group)

			var groups =yield wechatApi.fetchGroup()
			console.log('add new group wechat after')
			console.log(groups)

			var group2 =yield wechatApi.checkGroup(message.FromUserName)
			console.log('check where is my group ')
			console.log(group2)

			var result =yield wechatApi.moveGroup(message.FromUserName,105)
			console.log('move you to other group')
			var group3=yield wechatApi.checkGroup(message.FromUserName)
			console.log('check where is my group now')
			console.log(group3)

			var result2 =yield wechatApi.moveGroup(message.FromUserName,105)
			console.log('move yours to other group')
			var group4=yield wechatApi.fetchGroup()
			console.log('check the status of group')
			console.log(group4)


			var result3=yield wechatApi.updateGroup(105,'zhenglei')
			console.log('modify the name of 101 group')
			var group5=yield wechatApi.fetchGroup()
			console.log('the status of group')
			console.log(group5)

			var result4=yield wechatApi.deleteGroup(105)
			console.log('delete 101',result4)
			var group6=yield wechatApi.fetchGroup()
			console.log('now group', group6)
			reply='move Group done'
		}else if(content==='13'){
			var user =yield wechatApi.fetchUsers(message.FromUserName,'en')
			console.log(user)
			var openId=[
				{
					openid:message.FromUserName,
					lang:'en'
				}
			]
			var users=yield wechatApi.fetchUsers(openId)
			reply=JSON.stringify(user)
		}else if(content=='14'){
			var userlist=yield wechatApi.listUsers()
			console.log(userlist)
			reply=userlist.total
		}else if(content=='15'){
			var mpnews={
				media_id:'X0Nkx8SvCoka6pfFHaMTNxk3UkCQ7s7IHrM6dWjrhEY'
			}
			var text={
				content:'my name is zhenglei'
			}
			var msgData=yield wechatApi.sendByGroup('text',text)
			console.log(msgData)
			reply='yeah'
		}else if(content=='16'){
			var text={
				content:'hello wechat'
			}
			var mpnews={
				media_id:'X0Nkx8SvCoka6pfFHaMTNxk3UkCQ7s7IHrM6dWjrhEY'
			}
			var msgData=yield wechatApi.previewMass('mpnews',mpnews,message.FromUserName)
			console.log(msgData)
		}else if(content=='17'){
			var msgData=yield wechatApi.checkMass('1000000004')
			console.log(msgData)
		}else if(content=='18'){
			var tempQr={
				expire_seconds:4000,
				action_name:'QR_SCENE',
				action_info:{
					scene:{
						scene_id:123
					}
				}
			}
			var permQr={
				action_name:'QR_LIMIT_SCENE',
				action_info:{
					scene:{
						scene_id:123
					}
				}
			}
			var permStrQr={
				action_nameS:'QR_LIMIT_STR_SCENE',
				action_info:{
					scene:{
						scene_str:'abc'
					}
				}
			}
			var qr1=yield wechatApi.createQrcode(tempQr)
			var qr2=yield wechatApi.createQrcode(permQr)
			var qr3=yield wechatApi.createQrcode(permStrQr)
			var url= wechatApi.showQrcode(qr1.ticket)
			console.log(url)
			reply='yeah hah'
		}else if(content==='19'){
			var longUrl='http://www.zhengleishuai.site'
			var shortDate= yield wechatApi.createShorturl(null,longUrl)
			reply=shortData.short_url
		}else if(content=='20'){
			var postData={
				query:'寻龙诀',
				city:'北京',
				category:'movie',
				uid:message.FromUserName
			}
			var _postData=yield wechatApi.semantic(postData)
			reply=JSON.stringify(_postData)
		}
		this.body=reply
	}
    yield next
}

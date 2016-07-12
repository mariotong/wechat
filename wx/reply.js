'use strict'
var path=require('path')
var wx = require('./index')
var Movie = require('../app/api/movie')
var wechatApi= wx.getWechat()
var help='亲爱的，欢迎关注电影世界\n'+
					'回复1~3,测试文字回复\n'+
					'回复4，测试图文回复\n '+
					'回复 首页，进入电影首页\n '+
					'回复 游戏，进入游戏页面\n'+
					'回复 电影名字，查询电影信息\n'+
					'也可以点击<a href="http://www.zhengleishuai.site/movie">语音查询电影</a>'
exports.reply =function* (next){
	var message =this.weixin
	console.log(message)
	if(message.MsgType === 'event'){
		if( message.Event === 'subscribe'){
			this.body=help
		}else if (message.Event === 'CLICK'){
			 var news = []
			 if(message.EventKey === 'movie_hot'){
				 var movies = yield Movie.findHotMovies(-1,10)
				 movies.forEach(function(movie){
					 news.push({
							title: movie.title,
							description: movie.title,
							picUrl: movie.poster,
							url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
				  	})
				 })
			 }else if(message.EventKey === 'movie_cold'){
				 var movies = yield Movie.findHotMovies(1,10)
				 	movies.forEach(function(movie){
						news.push({
							 title: movie.title,
							 description: movie.title,
							 picUrl: movie.poster,
							 url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
						 })
					})
			 }else if(message.EventKey === 'movie_crime'){
				 	var cat = yield Movie.findMoviesByCate('犯罪')
						cat.movies.forEach(function(movie){
							news.push({
								 title: movie.title,
								 description: movie.title,
								 picUrl: movie.poster,
								 url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
							 })
						})
			}else if(message.EventKey === 'movie_cartoon'){
				 var cat = yield Movie.findMoviesByCate('动画')
				  cat.movies = cat.movies.slice(0,10)
					 cat.movies.forEach(function(movie){
						 news.push({
								title: movie.title,
								description: movie.title,
								picUrl: movie.poster,
								url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
							})
					 })
			  }else if (message.EventKey === 'help'){
					var news= help
		  	}
			this.body = news
		}
 }else if(message.MsgType === 'voice'){
		var voiceText=message.Recognition
		var movies =yield Movie.searchByName(voiceText)
		if(!movies || movies.length ===0 ){
			movies = yield Movie.searchByDouban(voiceText)
		}
		if( movies && movies.length>0 ){
			reply=[]
			//图文最多只能十条
			movies=movies.slice(0,10)
			movies.forEach(function(movie){
				 reply.push({
					 title: movie.title,
					 description: movie.title,
					 picUrl: movie.poster,
					 url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
				 })
			})
		}else{
			reply='没有查询到与'+content+'匹配的电影，要不要换一个电影试试'
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
		}else{
			var movies =yield Movie.searchByName(content)
			if(!movies || movies.length ===0 ){
				movies = yield Movie.searchByDouban(content)
			}
			if( movies && movies.length>0 ){
				reply=[]
				//图文最多只能十条
				movies=movies.slice(0,10) //并不会修改数组，而是返回一个子数组
				movies.forEach(function(movie){
					 reply.push({
						 title: movie.title,
						 description: movie.title,
						 picUrl: movie.poster,
						 url :'http://www.zhengleishuai.site/wechat/jump/'+ movie._id
					 })
				})
			}else{
				reply='没有查询到与'+content+'匹配的电影，要不要换一个电影试试'
			}
		}
		this.body=reply
	}
    yield next
}

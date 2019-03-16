var utils = {

	/**
	 * 获取cookie
	 * @param {String} cookie名
	 * @returns {String/null} 返回取到的cooke
	 */
	getCookie: function (name) { 
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	
		if(arr=document.cookie.match(reg))
	
			return unescape(arr[2]); 
		else 
			return null; 
	},

	/**
	 * 删除cookie
	 * @param {String} cookie名
	 */
	delCookie: function (name) { 
		var exp = new Date(); 
		exp.setTime(exp.getTime() - 1); 
		var cval = utils.getCookie(name); 
		if(cval!=null) 
			document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
	},

	/**
	 * 设置cookie
	 * @param {String} cookie名
	 * @param {String} cookie内容
	 */
	setCookie: function (name,value) { 
		var Days = 1; 
		var exp = new Date(); 
		exp.setTime(exp.getTime() + Days*24*60*60*1000); 
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + 'path=/'; 
	},

	/**
	 * 解析时间
	 * @param {Date/String} paseStr 需要解析的时间串
	 * @param {String} format 返回格式
	 * @return {String} 返回解析后的时间格式
	 */
	paseDate: function (paseStr, format) {

		if (paseStr === '0001-01-01T00:00:00') {
			return '-';
		}

		format = format || 'yyyy-MM-dd';
		var flag = /\d{2}T\d{2}/.test(paseStr); // 是否为UTC格式的时间
		var timeOffset = new Date().getTimezoneOffset() * 60000; // 获取本地时间与格林威治时间差（毫秒）;
		var date;

		try {
			if (flag) {
				// 如果UTC时间 没有Z后缀 加上Z后缀
				!/Z$/.test(paseStr) ? paseStr += 'Z' : null;
				date = new Date(new Date(paseStr) * 1 + timeOffset);
			}
			else {
				date = paseStr ? new Date(paseStr) : new Date();
			}
			
			var dict = {
				"yyyy": date.getFullYear(),
				"M": date.getMonth() + 1,
				"d": date.getDate(),
				"H": date.getHours(),
				"m": date.getMinutes(),
				"s": date.getSeconds(),
				"l": date.getMilliseconds(),
				"MM": ("" + (date.getMonth() + 101)).substr(1),
				"dd": ("" + (date.getDate() + 100)).substr(1),
				"HH": ("" + (date.getHours() + 100)).substr(1),
				"mm": ("" + (date.getMinutes() + 100)).substr(1),
				"ss": ("" + (date.getSeconds() + 100)).substr(1),
				"ll": ("" + (date.getMilliseconds() + 1000)).substr(1),
			};
			return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?|ll?)/g, function () {
				return dict[arguments[0]];
			});
		}
		catch (e) {
			alert(true, '需要正确的时间格式,当前时间格式为' + paseStr, '解析时间失败');
		}
	},

	/**
	 * 倒计时 根据毫秒算出倒计时
	 * @param {Number/String} 毫秒数
	 * @returns {String} 返回剩余时间
	 */
	remainingTime: function(num){
		num = num || 0;
		num = Math.round(num / 1000);
		var h,
			m,
			s,
			count;
		h = parseInt(num / (60 * 60));
		m = parseInt(num / 60) - (h * 60);
		s = parseInt(num) - (h * 60 * 60) - (m * 60);
		return (h.toString().length == 1 ? '0' + h : h) + ':' + (m.toString().length == 1 ? '0' + m : m) + ':' + (s.toString().length == 1 ? '0' + s : s);
	}

}


$(document).ready(function(){

	var InitHeader = function(){

		// 服务器时间
		this.$onlineTime = $('#onlineTime');
		// 最新公告
		this.$newNotice = $('#newNotice');
		// 菜单列表
		this.$gameMenu = $('#gameMenu');
		// 游戏列表
		this.$navGameList = $('#navGameList');
		// 显示隐藏菜单列表按钮
		this.$gameDorpDown = $('#gameDorpDown');
		// 游戏二级菜单
		this.$subGameMenu = $('#subGameMenu');
		// 登出
		this.$logout = $('#logout');
	
		// ajax请求数据
		this.data = {
			// 最新公告
			notice: '这是一条最新公告',
			// 服务器时间
			macau_time: utils.paseDate(null, 'yyyy-MM-dd HH:mm:ss'),
			// 游戏集合
			game: [
				{name: '吉林快3', key: 'jlk3', url: '/'},
				{name: '重庆时时彩', key: 'ccssc', url: '/'}
			],
			// 游戏详情
			subGame: [
				{name: '(三軍、和值、其它)', url: '/'},
				{name: '(三同号单选、二同号复选、二同号单选、三不同号、二不同号)', key: 'ccssc', url: '/'}
			],
		};
		this.init();
	}
	
	var _proto = InitHeader.prototype;
	
	/**
	 * header初始化
	 */
	_proto.init = function(){
		this.timeInit();
		this.noticeInit();
		this.gameInit();
		this.subGameInit();
		this.logoutInit();
	}
	
	/**
	 * 初始化服务器时间
	 */
	_proto.timeInit = function(){
		var time = this.data.macau_time;
		var _this = this;
		this.$onlineTime.text(time);
		window.setInterval(function(){
			time = new Date(time) * 1 + 1000;
			_this.$onlineTime.text(utils.paseDate(time, 'yyyy-MM-dd HH:mm:ss'));
		}, 1000);
	}
	
	/**
	 * 初始化最新公告
	 */
	_proto.noticeInit = function(){
		this.$newNotice.text(this.data.notice);
	}
	
	/**
	 * 游戏列表
	 */
	_proto.gameInit = function(){
		var _this = this;
	
		// 绑定游戏列表展开收起
		this.$gameDorpDown.hover(function(){
			_this.$gameMenu.fadeIn('fast');
		}, function(){
			_this.$gameMenu.fadeOut('fast');
		})
	
		// 渲染游戏列表
		if(this.data.game && $.isArray(this.data.game) && this.data.game.length){
			for(var i = 0; i < this.data.game.length; i++){
				var cur = this.data.game[i];
				var $html = $('<li>&nbsp;&nbsp;●&nbsp;&nbsp;<a href="javascript:void(0);">'+ cur.name +'</a></li>');
				$html.click(function(){
					utils.setCookie('game_key', cur.key);
					window.location = cur.url;
				});
				this.$navGameList.append($html);
			}
		}
		
	}
	
	/**
	 * 游戏二级列表
	 */
	_proto.subGameInit = function(){
		if(this.data.subGame && $.isArray(this.data.subGame) && this.data.subGame.length){
			for(var i = 0; i < this.data.subGame.length; i++) {
				var cur = this.data.subGame[i];
				this.$subGameMenu.append('<a href="'+ cur.url +'">'+ cur.name +'</a>');
			}
		}
	}
	
	/**
	 * 登出
	 */
	_proto.logoutInit = function(){
		this.$logout.bind('click', function(){
			utils.delCookie('userInfo');
			window.location = '/index/login';
		});
	}
	
	
	


	window.InfoAll = {
		InitHeader: new InitHeader(),
	}

})
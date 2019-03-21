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
	},


	/**
	 * 获取URL参数
	 * @param {String} search URL地址
	 * @param {any} name 参数名
	 * @return {String} 查询到的值
	 */
	getURL: function (search, name) {
		var reg = new RegExp("[?&]" + name + "=([^&]*)(&|$)", "i");
		var r = search.match(reg);
		if (r != null) return unescape(r[1]);
		return null;
	},

};


(function(){

	/**
	 * 获取总共多少页
	 * @param {Number} total 总共多少条
	 * @param {Number} page_total 每页显示多少条
	 */
	var getPage = function(total, page_total){
		var p = Math.ceil(total / page_total);
		if(!p){
			p = 1;
		}
		return p
	}

	/**
	 * 分页
	 * @param {jQuery} wrapper 外层元素
	 * @param {Function} callback 页数变更回调用函数
	 * @param {Object} opt 初始化参数
	 */
	var Page = function(wrapper, callback, opt){

		this.$wrapper = $(wrapper);
		this.callback = callback;
		if(!$wrapper.length){
			throw Error('Pagination must have outermost support……');
		}
		// 总共多少条
		this.$total = this.$wrapper.find('.page-total');
		// 当前第几页(input/select)
		this.$index = this.$wrapper.find('.page-index');
		// 总共多少页
		this.$page = this.$wrapper.find('.page-page');
		// 首页
		this.$first = this.$wrapper.find('.page-first');
		// 末页
		this.$last = this.$wrapper.find('.page-last');
		// 下一页
		this.$next = this.$warpper.find('.page-next');
		// 上一页
		this.$prev = this.$wrapper.find('.page-prev');

		this.data = {
			index: 1, // 当前第几页
			total: 0, // 总共多少条
			//page: 1, // 一共多少页
			page_total: 10, // 每页显示多少条
		}

		this.data = $.extend({}, this.data, opt);

		this.bind();
		this.init();
	}

	var _proto = Page.prototype;

	/**
	 * 分页初始化
	 * @param {Object} opt 初始化参数
	 */
	_proto.init = function(opt){
		if(opt){
			this.data = $.extend({}, this.data, opt);
		}
		this.data.page = getPage(this.data.total, this.data.page_total);

		this.render();
	}

	/**
	 * 绑定分页事件
	 */
	_proto.bind = function(){
		var _this = this;

		// 跳页
		if(this.$index.length){
			if(this.$index[0].tagName === 'SELECT'){
				this.$index.bind('change', function(){
					_this.data.index = Number(this.value);
					_this.emit();
				});
			}
			else if(this.$index[0].tagName === 'INPUT') {
				this.$index.bind('blur', function(){
					if(isNaN(this.value)){
						this.value = _this.data.page;
						return;
					}
					_this.data.index = Number(this.value);
					_this.emit();
				});
			}
		}

		// 首页
		if(this.$first.length){
			this.$first.bind('click', function(){
				if(_this.data.index == 1){
					return;
				}
				_this.data.index = 1;
				_this.emit();
			});
		}
		
		// 末页
		if(this.$first.length){
			this.$last.bind('click', function(){
				if(_this.data.index == _this.data.page){
					return;
				}
				_this.data.index = _this.data.page;
				_this.emit();
			});
		}
		
		// 下一页
		if(this.$next.length){
			this.$next.bind('click', function(){
				_this.data.index++;
				if(_this.data.index > _this.data.page){
					_this.data.index = _this.data.page;
				}
				_this.emit();
			});
		}

		// 上一页
		if(this.$prev.length){
			this.$prev.bind('click', function(){
				_this.data.index--;
				if(_this.data.index < 1){
					_this.data.index = 1;
				}
				_this.emit();
			});
		}
	}
	
	/**
	 * 渲染分页
	 */
	_proto.render = function(){
		this.$total.html(this.data.total);
		this.$page.html(this.data.page);

		// select
		if(this.$index[0].tagName === 'SELECT'){
			var html = '';
			for(var i = 1; i <= this.data.page; i++){
				html += '<option value="'+ i +'">'+ i +'</option>';
			}
			this.$index.empty().append(html).val(this.data.index);
		}
		else {
			this.$index.val(this.data.index);
		}
		
	}

	/**
	 * 触发分页回调
	 */
	_proto.emit = function(){
		typeof this.callback == 'function' ? this.callback.call(this, this.data.index) : null; 
	} 

	window.Page = Page;

})()


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
	
	/**
	 * header初始化
	 */
	InitHeader.prototype.init = function(){
		this.timeInit();
		this.noticeInit();
		this.gameInit();
		this.subGameInit();
		this.logoutInit();
	}
	
	/**
	 * 初始化服务器时间
	 */
	InitHeader.prototype.timeInit = function(){
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
	InitHeader.prototype.noticeInit = function(){
		this.$newNotice.text(this.data.notice);
	}
	
	/**
	 * 游戏列表
	 */
	InitHeader.prototype.gameInit = function(){
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
	InitHeader.prototype.subGameInit = function(){
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
	InitHeader.prototype.logoutInit = function(){
		this.$logout.bind('click', function(){
			utils.delCookie('userInfo');
			window.location = '/index/login';
		});
	}
	
	
	/**
	 * 左侧个人信息初始化
	 */
	var InitSlidebar = function(){

		// 当前人物所在的游戏 key
		this.gameKey = utils.getCookie('game_key');

		// 页面内容 用来控制显示隐藏slidebar userInfo -> 有
		this.$main = $('#main');
		// 左侧个人信息
		this.$slidebar = $('#slidebar');
		// 游戏logo
		this.$slidebarGameLogo = $('#slidebarGameLogo');
		// 游戏名称
		this.$slidebarGameName = $('#slidebarGameName');
		// 账号
		this.$slidebarUsername = $('#slidebarUsername');
		// 余额
		this.$slidebarBalance = $('#slidebarBalance');
		// 最新投注表格
		this.$slidebarBetTable = $('#slidebarBetTable');
		// 开奖号码表格
		this.$slidebarNumTable = $('#slidebarNumTable');

		if(!this.gameKey){
			return;
		}
		else {
			this.$main.addClass('userInfo');
		}

		this.data = {
			game_logo: '/',
			game_name: '吉林快三',
			username: 'han123',
			balance: '100',
			bet: {
				total: 2,
				data: [
					{time: '2015-11-11 11:11:11', content: '123', odds: '1.5', money: '100'},
					{time: '2015-11-11 11:11:12', content: '537', odds: '1.3', money: '110'}
				]
			},
			num: {
				total: 10,
				data: [
					{date: '20151111-11', content: '383'},
					{date: '20151111-11', content: '716'},
					{date: '20151111-11', content: '558'},
				]
			}
		}

		var _this = this;
		// 最新投注分页
		this.betPage = new Page(
			'#slidebarBetPage',
			 function(index){
				// ajax
				_this.data.bet = {
					total: index * 8,
					data: [
						{time: '2015-11-11 11:11:11', content: '123', odds: index + '.5', money: '100'},
						{time: '2015-11-11 11:11:12', content: '537', odds: index + '.3', money: '110'}
					]
				}

				_this.betTableInit();
				this.init({total: _this.data.bet.total});
			},
			{total: this.data.bet.total}
		);

		this.init();
	}

	InitSlidebar.prototype.init = function(){

		// ajax 用分页面请求 this.betPage.data.index
		this.baseInit();
		this.betTableInit();
		this.numTableInit();
	}

	InitSlidebar.prototype.baseInit = function(){
		// logo暂定
		// this.$slidebarGameLogo
		this.$slidebarGameName.html(this.data.game_name);
		this.$slidebarUsername.html(this.data.username);
		this.$slidebarBalance.html(this.data.balance);
	}

	InitSlidebar.prototype.betTableInit = function(){
		var html = '';
		for(var i = 0; i < this.data.bet.data.length; i++) {
			var cur = this.data.bet.data[i];
			var content;
			for(var s = 0; s < cur.content.length; s++) {
				content += '<span class="m-r-2 color'+ cur.content[s] +'">'+ cur.content[s] +'</span>';
			}
			html += '<tr><td>'+ cur.time +'</td><td>'+ content +'</td><td>'+ cur.odds +'</td><td>'+ cur.money +'</td></tr>'
		}
		this.$slidebarBetTable.append(html);
	}

	InitSlidebar.prototype.numTableInit = function(){
		var html = '';
		for(var i = 0; i < this.data.num.data.length; i++) {
			var cur = this.data.num.data[i];
			var content;
			for(var s = 0; s < cur.content.length; s++) {
				content += '<span class="m-r-2 color'+ cur.content[s] +'">'+ cur.content[s] +'</span>';
			}
			html += '<tr><td>'+ cur.date +'</td><td>'+ content +'</td></tr>'
		}
		this.$slidebarNumTable.append(html);
	}

	window.InfoAll = {
		InitHeader: new InitHeader(),
		InitSlidebar: new InitSlidebar(),
	}

})
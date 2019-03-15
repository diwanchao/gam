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
		var cval=getCookie(name); 
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

		// ajax请求数据
		this.data = {
			// 最新公告
			notice: '这是一条最新公告',
			// 服务器时间
			macau_time: utils.paseDate(null, 'yyyy-MM-dd HH:mm:ss'),
			// 游戏集合
			game: {
				k3: [],
				ssc: [],
			},
			// 游戏详情
			gameInfo: [],
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





	window.InfoAll = {
		InitHeader: new InitHeader(),
	}

})
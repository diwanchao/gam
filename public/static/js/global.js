
//slidebar
!function (window, undefined) {

	/**
	 slidebar 
	 **/
	var SlidebarInfo = function (opt) {
		this.selectedEle = null;
		this.pathname = location.pathname;
		this.ele = opt.ele ? $(opt.ele) : $('#slidebar');
		this.list = opt.list || [];
		this.opt = opt;
		this.slidebarList = {};
		this.init();
	}
	/*
	 * 初始化
	 */
	SlidebarInfo.prototype.init = function () {
		this.ele.empty().append(this.each(this.list));
		// 当前被选中li展开
		if (this.selectedEle) {
			this.selectedEle.addClass('active');
			var p = this.selectedEle.parent();
			var pp = p.parent(); 
			while (p.hasClass('slidebar-main') && pp.hasClass('menu-list')) {
				pp.addClass('show');
				p.show();

				p = pp.parent();
				pp = p.parent();
			}
		}
		typeof this.opt.callBack === 'function' ? this.opt.callBack() : null;
	}
	/*
	 * 判断children是否是数组
	 */
	SlidebarInfo.prototype.hasChildren = function (children) {
		if (children && children instanceof Array && children.length)
			return true;
		else
			return false;
	};
	/*
	 * 循环创建list
	 */
	SlidebarInfo.prototype.each = function (list, index) {
		index = index || 0;
		var $slidebarMain = $('<ul class="slidebar-main"></ul>');
		for (var i = 0; i < list.length; i++) {
			var opt = list[i];
			var children = opt.childMenu;
			var $e = this.createSlidebar(opt, index, [list[i]]);

			if (this.hasChildren(children)) {
				$e.append(this.each(children, index + 1));
			}

			$slidebarMain.append($e);
		}
		return $slidebarMain;
	}
	/*
	 * 创建slidebar li标签
	 */
	SlidebarInfo.prototype.createSlidebar = function (opt, index, list) {
		var flag = this.hasChildren(opt.childMenu);
		/**
		<li class="slidebar-list">
			<a href="javascript: void(0);" class="list-content">
				<i class="fa fa-arrow-circle-down"></i>
				<span class="slidebar-text">首页</span>
				<i class="fa icon"></i>
			</a>
		</li>
		**/
		// 如果是slide存入list中
		!flag ? this.slidebarList[opt.menuURL] = { name: opt.menuName, id: opt.id } : null;

		var $ele = $('<li class="slidebar-list ' + (flag ? "menu-list" : "") + '"><a style="padding-left: ' + (15 + index * 20) + 'px" href="' + (!flag ? opt.menuURL + '?MenuId=' + opt.id : "javascript: void(0);") + '" class="list-content"><i class="' + opt.menuIcon + '"></i><span class="slidebar-text">' + opt.menuName + '</span><i class="fa icon"></i></a></li>');
		(!this.selectedEle && !flag && (opt.menuURL.indexOf(this.pathname) !== -1)) ? this.selectedEle = $ele : null;
		this.binding($ele, list, opt);
		return $ele;
	}
	/*
	 * 为li绑定展开收起事件
	 */
	SlidebarInfo.prototype.binding = function ($ele, list, opt) {
		var _this = this;
		typeof this.opt.bindFun === 'function' ? this.opt.bindFun(this, $ele, list, opt) :
			$ele.bind('click', function (e) {
				if ($(this).hasClass('show')) {
					_this.slideup($(this));
				}
				else {
					_this.slidedown($(this));
				}
				$(document).trigger('droupdown.click');
				e.stopPropagation();
			});
	}
	/*
	 * 展开
	 */
	SlidebarInfo.prototype.slidedown = function ($ele, callback) {
		$ele.addClass('show');
		$ele.children('.slidebar-main').slideDown('fast', callback);
	}
	/*
	 * 收起
	 */
	SlidebarInfo.prototype.slideup = function ($ele, callback) {
		$ele.removeClass('show');
		$ele.children('.slidebar-main').slideUp('fast', callback);
	}

	/**
	 * 获取slidebar列表中url相匹配的slidebar 
	 */
	SlidebarInfo.prototype.getUrlInfo = function (url) {
		return this.slidebarList[url] || false;
	}

	window.SlidebarInfo = SlidebarInfo;

}(window, undefined);
!function (window, undefined) {

	var hasChildren = SlidebarInfo.prototype.hasChildren;

	/**
	  从list中获取当前所在位置的层级
   **/
	var getDeepNavList = function (list, rule) {
		var ary = [];
		// 对比规则
		var comparisonRule = function (item) {

			if (item.menuURL === rule) {
				return true;
			}
			if (hasChildren(item.childMenu)) {
				return whileList(item.childMenu);
			}

			return false;
		}
		// 循环列表
		var whileList = function (list) {
			var len = 0;
			while (len < list.length) {
				var t = comparisonRule(list[len]);
				if (t) {
					return ary.push(list[len]); // 返回ary的长度 一定大于1 等式成立
				}
				len++;
			}
			return false;
		}
		whileList(list);
		/**
		 **/
		ary.reverse().unshift({ menuURL: '/Home/Index', menuName: '首页', menuDescription: 'fa fa-arrow-circle-down' });
		return ary
	}

	var init = function (hierarchy, $ele) {
		var documentFragment = document.createDocumentFragment();
		var len = hierarchy.length;
		var iconFlag = false;
		var i = 0;
		for (; i < len; i++) {
			if (i !== len - 1) {
				iconFlag = true;
			}
			else {
				iconFlag = false;
			}
			documentFragment.appendChild(render(hierarchy[i], iconFlag)[0]);
		}
		$ele.empty().append(documentFragment);
	}

	var render = function (item, iconFlag) {
		var flag = hasChildren(item.childMenu);
		//<span class="navbar-list"><a href="javascript:void(0)">首页</a><i class="fa fa-tasks"></i></span>
		return $('<span class="navbar-list ' + (flag ? "menu" : "") + '"><a href="' + (flag ? "javascript:void(0);" : item.menuURL) + '">' + item.menuName + '</a>' + (iconFlag ? "<i class='fa fa-angle-right'></i>" : '') + '</span>');
	}

	window.Navbar = function (list, rule, $ele) {
		init(getDeepNavList(list, rule), $ele || $('#navbar'));
	}

}(window, undefined);
/*****************************************************************************************/
(function (window, undefined) {

    var H_page = function (option) {
        this.opt = $.extend({}, {
            ele: '#page',
            count: 10,  // 每页显示多少条
            page: 1,    // 当前第几页 默认第一页为1
            total: 0,   // 总共多少条
            prePage: 2, // 左右间隔
            // 页面切换触发方法
            handler: function (page, page_rows) {
                console.log(page, page_rows);
            }
        }, option);

        this.init();
    }

    var _proto = H_page.prototype;

    /**
     * 初始化拼装分页 
     */
    _proto.init = function () {
        this.$wrapper = $('<div class="st-pagination-box"></div>');
        this.$total = $('<p class="mr-10 total">共条</p >');
        this.$pages = $('<ul class="st-pagination"></ul>');
        this.$pageFooter = $(
                '<div class="st-page">' +
                    '<p>显示 </p>' +
            '<select name="page_rows" class="st-bdradius-4">' +
            '<option value="10">10</option>' +
            '<option value="50">50</option>' +
            '<option value="100">100</option>' +
            '<option value="200">200</option>' +
            '</select>' +
            '<p> 条 跳至 </p>' +
            '<input type="text"' +
            'name="currentpage"' +
            'class="st-bdradius-4" />' +
            '<p> / <span class="h-page-total-page"></span> 页' +
            '</p>' +
            '</div>'
            );
        this.$totalPage = this.$pageFooter.find('.h-page-total-page');
        this.$pageRows = this.$pageFooter.find('select[name=page_rows]'); // 每页多少条
        this.$pageCurrent = this.$pageFooter.find('input[name=currentpage]'); // 当前第几页

        this.$wrapper.append(this.$total)
            .append(this.$pages)
            .append(this.$pageFooter);

        $(this.opt.ele).empty().append(this.$wrapper);

        this.binding();
        this.refresh();
    }

    _proto.refresh = function (data) {
        // 总共多少页
        this.opt = $.extend({}, this.opt, data);
        this.opt.total_page = Math.ceil(this.opt.total / this.opt.count);
        this.createPageList();
        this.render();
    }

    _proto.render = function () {
        this.$total.html('共&nbsp;' + this.opt.total + '&nbsp;条');
        this.$totalPage.html(this.opt.total_page);
        this.$pageRows.val(this.opt.count);
        this.$pageCurrent.val(this.opt.page);
    }

    _proto.binding = function () {
        var _this = this;

        this.$pageRows.bind('change', function () {
            var val = Number($(this).val());
            if (_this.isNumber(val)) {
                if (Number(val) === Number(_this.opt.count)) return;
                _this.opt.count = val;
                _this.emit();
                _this.refresh();
            } else {
                alert('请输入数字');
                _this.$pageRows.val(_this.opt.count);
                return;
            }
        });

        this.$pageCurrent.bind('blur', function () {
            var val = Number($(this).val());
            if (_this.isNumber(val)) {
                if (val === _this.opt.page) {
                    return;
                }
                else if (val > _this.opt.total_page) {
                    _this.opt.page = _this.opt.total_page
                }
                else if (val < 1 ) {
                    _this.opt.page = 1;
                }
                else {
                    _this.opt.page = val;
                }
                _this.emit();
                _this.refresh();
            } else {
                alert('请输入数字');
                _this.$pageCurrent.val(_this.opt.page);
                return;
            }
        });
    }

    _proto.emit = function () {
        typeof this.opt.handler === 'function' ? this.opt.handler(this.opt.page, this.opt.count) : null;
    };

    _proto.isNumber = function (k) {
        return !isNaN(k);
    }

    _proto.pageListTitle = function () {
        if (!(this.opt.page - this.opt.prePage <= 1)) {
            return true;
        }
        return false;
    };

    _proto.pageListBottom = function () {
        if (!(this.opt.page + this.opt.prePage >= this.opt.total_page)) {
            if (this.opt.prePage * 2 + 1 < this.opt.total_page) {
                return true;
            }
        }
        return false;
    };
    _proto.pageListContent = function () {
        var p = this.opt.page - this.opt.prePage;
        return this.opt.prePage * 2 + 1;
    };
    _proto.set = function (p, index) {
        return (p + index) <= 0 ? '1' : (p + index);
    };
    _proto.p = function () {
        var p = this.opt.page - this.opt.prePage;
        if ((p + this.opt.prePage * 2) >= this.opt.total_page) {
            p = this.opt.total_page - this.opt.prePage * 2
        }
        if (p <= 0) {
            p = 1
        }
        return p;
    };


    _proto.createPageList = function () {
        this.$pages.empty();
        var _this = this,

            i,
            len = this.pageListContent(),
            p = this.p();

        if (this.pageListTitle()) {
            var $oLi = $('<li><a class="' + (Number(this.opt.page) === 1 ? 'active' : '') + '" href="javascript:void(0);">1</a></li >');
            $oLi.click(function () {
                _this.opt.page = 1;
                _this.emit();
                _this.refresh();
            });

            this.$pages.append($oLi);
            if (2 != p) {
                this.$pages.append('<li><a>...</a></li>');
            }
        }

        for (i = 0; i < len; i++) {
            if ((p + i) <= this.opt.total_page) {
                var page = this.set(p, i);
                $oLi = $('<li><a class="' + (Number(this.opt.page) === Number(page) ? 'active' : '') + '" href="javascript:void(0);">' + page + '</a></li >');
                (function (page, $oLi) {
                    $oLi.click(function () {
                        _this.opt.page = page;
                        _this.emit();
                        _this.refresh();
                    });
                })(page, $oLi)
                this.$pages.append($oLi);
            }
        }

        if (this.pageListBottom()) {
            $oLi = $('<li><a class="' + (Number(this.opt.page) === Number(this.opt.total_page) ? 'active' : '') + '" href="javascript:void(0);">' + this.opt.total_page + '</a></li >');
            $oLi.click(function () {
				_this.opt.page = _this.opt.total_page;
                _this.emit();
                _this.refresh();
            });
            if (_this.opt.count - 1 !== (p + this.opt.prePage * 2)) {
                this.$pages.append('<li><a>...</a></li>')
            }
            this.$pages.append($oLi);
        }
    }

    window.H_page = function (option) {
        return new H_page(option);
    }

})(window, undefined);
(function (window, undefined) {

	/**
	 * H_table	渲染表格
	 * 
	 * {Function} refresh	刷新表格
	 *		@param{Object} data 用来修改表格默认参数并重新渲染(opt.data)
	 * 
	 * {Function} refreshSelect 渲染被选中的tr
	 *		@param{Array} data 用来刷新被选中的列
	 *  
	 * {Function} empty 清空表格
	 * 
	 * {Object}	hasSelect 是否有选择按钮
	 *		true -> 有选择按钮
	 *		or
	 *		{Object}
	 *			{Function}	selectCallback 点击按钮后的回调 @param{Boolean} flag 选中还是取消选中
	 *														@param{Object} data 当前这条的数据
	 *														@param{jqDOM} $tr 当前这条外层tr
	 *														
	 *			{Function}	selectRule 设置选中按钮的条件 需要返回一个布尔类型值
	 *														@param{Array} ary 返回当前被选中的所有列表ID
	 *														@param{Object} data 返回当前列的数据
	 *			
	 *			{Function}	selectAllCallback 点击全选按钮后的回调
	 *														@param{Boolean} flag 全选还是取消全选
	 *														@param{Array} ary 当前被选中的列表数组
	 *			
	 *			{Boolean}	delSelectAll 是否删除全选按钮
	 *			
	 *	
	 */



    var H_table = function (option) {
		this.ele = $(option.ele || '#table');
		this.opt = $.extend({}, { hasSelect: false, hasSort: false, hasDoing: false, jurisdiction: false }, option);
        this.selectAry = [];
		this.sort = {};
        this.init();
    }

    var _proto = H_table.prototype;

    /**
     *  初始化 
     */
    _proto.init = function () {
        this.$table = $(
            '<table class="h-table" style="' + (this.opt.width ? /(px)|(em)|(rem)|(%)|(vw)|(vh)$/.test(this.opt.width.toString()) ? "width:" + this.opt.width : "width:" + this.opt.width + "px" : "") + '">'+
            '<thead class="h-table-thead"></thead>' +
            '<tbody class="h-table-tbody"></tbody>' +
            '</table>'
        );
        this.ele.empty().append(this.$table);
        this.concatThead();
        this.concatTbody();
    }

    /**
     * 根据传入的数据刷新表格
     * @param {Object} data 覆盖对象
	 * @param {Boolean} noRefreshSelect 是否不需要重置selectAry
     */
	_proto.refresh = function (data, noRefreshSelect) {
		this.opt = $.extend({}, this.opt, data);
		this.$table.css('width', (this.opt.width ? /(px)|(em)|(rem)|(%)|(vw)|(vh)$/.test(this.opt.width.toString()) ? "width:" + this.opt.width : "width:" + this.opt.width + "px" : ""))
		if (!noRefreshSelect) {
			this.selectAry = [];
		}
		this.concatTbody();
	};

	_proto.refreshSelect = function (ary) {
		this.selectAry = ary;
		this.concatTbody();
	};

    /**
     * 清空表格
     * */
    _proto.empty = function () {
        this.opt.tbody = [];
        this.selectAry = [];
        this.concatTbody();
    }

    /**
     * 向表格末尾添加一条
     * @param {Object} data 添加数据
     */
    _proto.append = function (data) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            var $tbody = this.$table.find('tbody');
            if (!this.opt.tbody.length) {
                $tbody.empty();
            }
            this.opt.tbody.push(data);
            $tbody.append(this.createTbodyList(data));
        }
    }

    /**
     * 向表格前面添加一条
     * @param {Object} data 添加数据
     */
    _proto.prepend = function (data) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            var $tbody = this.$table.find('tbody');
            if (!this.opt.tbody.length) {
                $tbody.empty();
            }
            this.opt.tbody.unshift(data);
            $tbody.prepend(this.createTbodyList(data));
        }
    }

    /**
     * 创建thead
     */
    _proto.concatThead = function () {
        var option = this.opt;
        // 创建文档碎片
        var fragment = document.createDocumentFragment();
        var tr = document.createElement('tr');
        // 是否有选中
        if (this.opt.hasSelect) {
            tr = this.selectAll(tr);
        }
        fragment.appendChild(tr);
        for (var k in option.thead) {
            if (option.thead.hasOwnProperty(k)) {
                var cur = option.thead[k];
                var th = document.createElement('th');
                var i = document.createElement('i');
                
                // 添加th内容
                typeof cur.name === 'function' ? th.appendChild(cur.name(k)) : th.innerHTML = cur.name;
                //如果有设置宽度
                if (cur.width) {
                    var w = /(px)|(em)|(rem)|(%)|(vw)|(vh)$/.test(cur.width.toString()) ? cur.width : cur.width + 'px';
                    th.style.width = w;
                }

                if (this.opt.hasSort && false !== cur.sort) {
                    i.className = 'pull-right text-info';
                    th.style.overflow = 'hidden';
                    th.appendChild(i);
                    // 写入sort中
                    this.sort[k] = {
                        val: 0,
                        i: i,
                    };
                    this.bindSort(th, i, cur, k);
                }
                tr.appendChild(th);
            }
        }
        // 是否有操作
        if (typeof this.opt.hasDoing === 'function') {
            tr = this.theadDoing(tr);
        }
        this.$table.find('thead').empty().append(fragment);

        fragment = null;
        option = null;
        k = null;
        tr = null;
        th = null;
        cur = null;
    };

    
	_proto.bindSort = function (th, i, cur, k) {
		var _this = this;
		var _sort = this.sort;
		var _opt = this.opt;
		$(th).bind('click', function () {
			_this.changeSort(k);
		});
	};

    _proto.changeSort = function (k) {
        // 先获取排序key值
        var key = this.sort[k].val;
        // 重置所有key
        for (var k2 in this.sort) {
            if (this.sort.hasOwnProperty(k2)) {
                this.sort[k2].val = 0;
                this.sort[k2].i.className = 'pull-right text-info';
            }
        }
        if (arguments.length) {
            var val;
            switch (key) {
                case 0: {
                    val = 1;
                    this.sort[k].val = 1;
                    this.sort[k].i.className = 'pull-right text-info fa fa-caret-down';
                    break;
                }
                case 1: {
                    val = -1;
                    this.sort[k].val = -1;
                    this.sort[k].i.className = 'pull-right text-info fa fa-caret-up';
                    break;
                }
                case -1: {
                    val = 0;
                    this.sort[k].val = 0;
                    this.sort[k].i.className = 'pull-right text-info';
                    break;
                }
            }

            // 差emit
            this.emitSort(k, val);
        }
    }


    _proto.emitSort = function (k, val) {
        this.opt.hasSort(k, val);
    }

    /**
     * 创建table一行
     * @param {Object} trData 每一行的数据
     * @return {Element} 返回创建好的tr
     */
	_proto.createTbodyList = function (trData) {
		var tr = document.createElement('tr');
		

		// 是否有选中
		if (this.opt.hasSelect) {
			tr = this.selectList(tr, trData);
		}
		// 根据thead创建td
		for (var k in this.opt.thead) {
			var td = document.createElement('td');
			if (typeof this.opt.thead[k]['append'] === 'function') {
				var r = this.opt.thead[k]['append'].call(this, trData, trData[k], tr);
				if (r) {
					td.appendChild(r);
				}
				else {
					td.innerHTML = (trData[k] === '' || trData[k] === null || trData[k] === undefined) ? '-' : trData[k];
				}
			}
			else {
				td.innerHTML = (trData[k] === '' || trData[k] === null || trData[k] === undefined) ? '-' : trData[k];
			}
			tr.appendChild(td);
		}
		// 是否有操作
		if (typeof this.opt.hasDoing === 'function') {
			tr = this.tbodyDoing(tr, trData);
		}
		// 绑定hover bindHover
		this.bindHover(tr);
		return tr;
	};

    /**
     * 创建tbody
     * */
    _proto.concatTbody = function () {
        var option = this.opt;
        var fragment = document.createDocumentFragment();

        // 创建tr
        for (var i = 0; i < option.tbody.length; i++) {
            var trData = option.tbody[i];
            fragment.appendChild(this.createTbodyList(trData));
        }

        if (!option.tbody.length) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.style.textAlign = 'center';
            td.setAttribute('colspan', 100);
            td.innerHTML = '暂无数据';
            tr.appendChild(td);
            fragment.appendChild(tr);
        }

        this.$table.find('tbody').empty().append(fragment);
        fragment = null;
        option = null;
        i = null;
        k = null;
        tr = null;
        td = null;
        trData = null;
    };

	_proto.bindHover = function (tr) {
		$(tr).hover(function () {
			$(this).hasClass('h-table-tr-active') ? null : $(this).addClass('h-table-tr-hover');
		}, function () {
			$(this).removeClass('h-table-tr-hover');
		});
	};

    /**
     * 添加全选的checkbox
     * @param {DocumentElement} tr 元素
     * @param {Object} data 数据
     * @returns {DocumentElement} tr元素
     */
	_proto.selectAll = function (tr, data) {
		var th = document.createElement('th');
		var checkbox = document.createElement('input');
		var selectAllCallback = this.opt.hasSelect && this.opt.hasSelect.selectAllCallback; // 是否有全部选中回调
		var delSelectAll = this.opt.hasSelect && this.opt.hasSelect.delSelectAll; // 删除全选按钮
		var _this = this;
		th.style.width = "30px";
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('name', 'table-select-all');
		checkbox.checked = false;
		tr.appendChild(th);
		// 如果不需要删除全选按钮
		if (!delSelectAll) {
			th.appendChild(checkbox);
			// 绑定全选方法
			checkbox.addEventListener('click', function (e) {
				var flag = this.checked;
				_this.$table.find('tbody').find('tr').each(function (item, ele) {
					var checkbox = $(ele).find('td:first-child').find('input[name=table-select]');
					if (checkbox.is(':checked') !== flag) {

						// 如果有全部取消操作
						if (selectAllCallback && typeof selectAllCallback === 'function') {
							_this.checkboxClick(flag, $(ele), _this.opt.tbody[item]);
						}
						else {
							$(ele).click();
						}

					}
				});

				// 如果有全部取消操作
				if (selectAllCallback && typeof selectAllCallback === 'function') {
					selectAllCallback(flag, _this.selectAry);
				}
				
			});
		}
		return tr;
	};

    /**
     * 添加选中元素
     * @param {DocumentElement} tr 元素
     * @param {Object} data 数据
     * @returns {DocumentElement} tr元素
     */
	_proto.selectList = function (tr, data) {
		var td = document.createElement('td');
		var checkbox = document.createElement('input');
		td.style.width = "30px";
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('name', 'table-select');
		checkbox.checked = false;
		tr.appendChild(td);
		td.appendChild(checkbox);

		this.checked(tr, data);
		return tr;
	};

    /**
     * 选中按钮事件
     * @param {Element} tr 当前一行
     * @param {Object} data 当前一行的数据
     */
	_proto.checked = function (tr, data) {
		var _this = this;
		var $tr = $(tr);

		var selectCallback = this.opt.hasSelect && this.opt.hasSelect.selectCallback; // 是否有选中回调
		var selectRule = this.opt.hasSelect && this.opt.hasSelect.selectRule; // 初始渲染时 是否被选中规则

		// CHECKBOX;
		var checkBox = $tr.find('td:first-child').find('input[name=table-select]');

		if (selectRule && typeof selectRule === 'function' && selectRule(this.selectAry, data)) {
			checkBox.prop('checked', true);
			$tr.addClass('h-table-tr-active');
		}

		$tr.bind('click', function () {
			var flag = checkBox.is(':checked');
			_this.checkboxClick(!flag, $tr, data);
			selectCallback && typeof selectCallback === 'function' ? selectCallback(!flag, data, tr) : null;
		});

		checkBox.bind('click', function (e) {
			var flag = checkBox.is(':checked');
			_this.checkboxClick(flag, $tr, data);
			selectCallback && typeof selectCallback === 'function' ? selectCallback(flag, data, tr) : null;
			e.stopPropagation();
		});
	};

	_proto.checkboxClick = function (flag, $tr, data) {

		var checkBox = $tr.find('td:first-child').find('input[name=table-select]');
		checkBox.prop('checked', flag);
		if (flag) {
			$tr.addClass('h-table-tr-active');
			this.selectAry.push(data.id);
		}
		else {
			$tr.removeClass('h-table-tr-active');
			this.selectAry.splice(this.selectAry.indexOf(data.id), 1);
		}
	};

    /**
     * 添加thead的操作列
     * @param {Element} tr 当前一行
     * @return {Element} 添加好的一行
     */
	_proto.theadDoing = function (tr) {
		var th = document.createElement('th');
		th.innerHTML = '操作';
		tr.appendChild(th);
		return tr;
	};

    /**
     * 绑定tbody的操作
     * @param {Element} tr 当前一行
     * @param {Object} data 当前一行的数据
     * @return {Element} 添加好的一行
     */
	_proto.tbodyDoing = function (tr, data) {
		var td = document.createElement('td');
		td.appendChild(this.opt.hasDoing(data, tr));
		td.addEventListener('click', function (e) { e.stopPropagation(); })
		tr.appendChild(td);
		return tr;
	};


	window.H_table = function (option) {
		return new H_table(option);
	};
})(window, undefined);
(function (window, undefined) {
    var H_confirmInput = function (_this, option) {
        this.ele = $(_this);
        this.opt = $.extend({}, {
            handler: null,
            defaultVal: '',
            width: 'auto'
        }, option);
        this.blur = false; // 是否正在编辑中
        this.value = '';
        this.init();
        this.setVal(this.opt.defaultVal);
    }

    var _proto = H_confirmInput.prototype;

    _proto.init = function () {
        this.$confirmInput = $(
                '<div class="h-confirm-input-wrapper" style="width: ' + this.opt.width + '">' +
            '<div class="h-confirm-inpuit-edit">' +
            '<input type="text" class="h-input" name="h-confirm-editor" value="" />' +
            '<div class="btns">' +
            '<a class="btn btn-minier btn-primary confirm" href="javascript: void(0)">确定</a>' +
            '<a class="btn btn-minier btn-default cancal" href="javascript: void(0)">取消</a>' +
            '</div>' +
            '</div>' +
            '<div class="h-confirm-inpuit-status show">' +
            '<i class="icon ace-icon glyphicon glyphicon-edit" style="margin-right: 3px"></i>' +
            '<span class="h-confirm-text"></span>' +

            '</div>' +
            '</div>'
            );
        this.$confirmEdit = this.$confirmInput.find('.h-confirm-inpuit-edit'); // 
        this.$confirmStatus = this.$confirmInput.find('.h-confirm-inpuit-status');
        this.$confirmEditor = this.$confirmEdit.find('[name=h-confirm-editor]');
        this.$confirmBtn = this.$confirmEdit.find('.confirm');
        this.$cancalBtn = this.$confirmEdit.find('.cancal');
        this.$confirmText = this.$confirmStatus.find('.h-confirm-text');
        this.ele.empty().append(this.$confirmInput);
        this.binding();
    };

    _proto.binding = function () {
        var _this = this;

        // 取消
        this.$cancalBtn.bind('click', function () {
            _this.setBlur(false);
        });
        // 确定
        this.$confirmBtn.bind('click', function () {
            var val = _this.$confirmEditor.val();
            _this.setBlur(false);
            _this.setVal(val);
            _this.emit();
        });
        // 编辑
        this.$confirmStatus.bind('click', function () {
            _this.setBlur(true);
        });

        this.$confirmEditor.bind('focus', function () {
            $(this).addClass('focus');
        });
        this.$confirmEditor.bind('blur', function () {
            $(this).removeClass('focus');
        });
    }

    _proto.setVal = function (val) {
        this.value = val;
        this.refresh();
    }

    _proto.refresh = function () {
        this.$confirmEditor.val(this.value);
        this.$confirmText.html(this.value.toString() || '点击编辑');
    }

    _proto.setBlur = function (flag) {
        this.blur = flag;
        if (flag) {
            this.$confirmEdit.addClass('show');
            this.$confirmStatus.removeClass('show');
            this.$confirmEditor.val(this.value);
        }
        else {
            this.$confirmEdit.removeClass('show');
            this.$confirmStatus.addClass('show');
            this.$confirmText.html(this.value.toString() || '点击编辑');

        }
    }

    _proto.emit = function () {
        typeof this.opt.handler === 'function' ? this.opt.handler.call(this, this.value) : null;
	}

	_proto.getElement = function () {
		return this.ele;
	}



    $.fn.H_confirmInput = function (option) {
        return new H_confirmInput(this, option)
    }
})(window, undefined);
(function (window, undefined) {

	var element = $('<div class="hover-tip"></div>');
	$(function () {
		$('body').append(element);
	})
	var HoverTip = function (_this, opt) {
		this.ele = $(_this);
		// class => primary、success、warning、danger、''
		this.opt = $.extend({}, { class: "", position: 'top', html: '' }, opt);
		this.bind();
	};

	var _proto = HoverTip.prototype;

	_proto.getElePosition = function () {
		var offset = this.ele.offset();
		var eleW = this.ele.width();
		var eleH = this.ele.height();
		var winW = $('body').width();
		var winH = $('body').height();
		return {
			left: offset.left,
			right: winW - (offset.left + eleW),
			top: offset.top,
			bottom: winH - (offset.top + eleH),
			width: eleW,
			height: eleH
		};
	};
	_proto.setPosition = function () {
		var left,
			top,
			eleOffet = this.getElePosition(),
			elementW = element.width() + 32, //加padding
			elementH = element.height() + 8, //加padding
			winW = $('body').width(),
			winH = $('body').height();
		// 设置left
		element.css({ 'left': eleOffet.left - (elementW / 2 - eleOffet.width / 2) + 'px', 'right': 'auto' });
		
		// 设置top
		var equal = (eleOffet.height / 2 + elementH / 2) + 5;
		element.css('top', eleOffet.top - (elementH / 2 - eleOffet.height / 2) + equal + 'px');
		
	};

	_proto.setClass = function () {
		if (!this.opt.class) return;
		element.addClass(this.opt.class);
	};

	_proto.bind = function () {
		var _this = this;
		this.ele.hover(function () {
			_this.show();
		},
			function () {
				_this.hide();
			});
	};

	_proto.show = function () {
		element.html(this.opt.html);
		this.setPosition();
		element.show();
	};

	_proto.hide = function () {
		element.hide();
	};

	_proto.set = function (opt) {
		this.opt = $.extend({}, this.opt, opt);
	};

	_proto.getElement = function () {
		return this.ele;
	}

	$.fn.HoverTip = function (opt) {
		return new HoverTip(this, opt);
	};
})(window, undefined);

// 供应商零件号之间关联 通用
(function (window, undefined) {

	var vb = function (obj, name, val, ele) {
		Object.defineProperty(obj, name, {
			enumerable: true,
			configurable: true,
			get: function getter() {
				return val;
			},
			set: function setter(newVal) {
				if (val === newVal) {
					return;
				}
				val = newVal;
				// 更新
				ele.val(val);
			}
		});

		ele.bind('input', function () {
			obj[name] = $(this).val();
		});
	};

	/**
	 * 零件号，供应商之间操作
	 * @param {any} $this 上下文context
	 * @param {any} opt 。。。
	 */
	var MaterialSupplier = function ($this, opt) {
		this.ele = $this;
		this.opt = $.extend({
			supplierUrl: '/', // 供应商api地址
			materialUrl: '/', // 零件号api地址
			materialBack: null, // 零件号请求回调
			supplierBack: null, // 供应商请求回调
			clearMaterialBack: null, // 清除零件号请求回调
			clearSupplierBack: null, // 清除供应商请求回调
			materialMiddlewareBack: null, // 零件号请求中间件
			supplierMiddlewareBack: null  // 供应商请求中间件
		}, opt, {
				// 固定接口地址
                supplierUrl: '/BaseInfo/GetSupplierName', // 供应商api地址
				materialUrl: '/BaseInfo/GetMaterialName', // 零件号api地址
		});
		this.result = {
			SupplierCode: '',
			SupplierName: '',
			SupplierId: '',
			MaterialNo: '',
			MaterialName: '',
			MaterialId: ''
		};

		this.$supplierCode = this.ele.find('[name=SupplierCode]');
		this.$supplierName = this.ele.find('[name=SupplierName]');
		//this.$supplierId = this.ele.find('[name=SupplierId]');
		this.$materialNo = this.ele.find('[name=MaterialNo]');
		this.$materialName = this.ele.find('[name=MaterialName]');
		//this.$materialId = this.ele.find('[name=MaterialId]');

		this.init();
	};

	/**
	 * 初始化 绑定每个字段与输入框
	 * */
	MaterialSupplier.prototype.init = function () {
		var _this = this;

		for (var k in this.result) {
			vb(this.result, k, this.result[k], this.ele.find('[name=' + k + ']'));
		}

		/**
		 * 供应商 
		 */
		this.$supplierCode.bind('blur', function () {
			$(this).next('.rule-error').remove();

			// 验证
			if (_this.supplierMiddleware($(this))) {
				_this.getSupplierName();
			}

		});

		/**
		 * 零件号 
		 */
		this.$materialNo.bind('blur', function () {
			$(this).next('.rule-error').remove();

			// 验证
			if ( _this.materialMiddleware($(this)) ) {
				_this.getMaterialName();
			}

		});

	};

	/**
	 * 零件号验证
	 * @returns {Boolean} 验证是否成功
	 */
	MaterialSupplier.prototype.materialMiddleware = function () {
		if (this.result.SupplierCode === '' || this.result.SupplierId === '') {
			this.materialTip('请先填写供应商编码！');
			this.clearMaterial();
			return false;
		}
		else if (this.result.MaterialNo === '') {
			this.materialTip('请填写零件编码！');
			this.clearMaterial();
			return false;
		}

		if (this.opt.materialMiddlewareBack === 'function') {
			return this.opt.materialMiddlewareBack(this.result.MaterialNo);
		}

		return true;
	};

	/**
	 * 供应商验证
	 * @param {any} _this 表单元素
	 * @returns {any} 验证是否成功
	 */
	MaterialSupplier.prototype.supplierMiddleware = function () {
		if (this.result.SupplierCode === '') {
			this.supplierTip('请填写供应商编码！');
			this.clearAll();
			return false;
		}

		if (this.opt.supplierMiddlewareBack === 'function') {
			return this.opt.supplierMiddlewareBack(this.result.SupplierCode);
		}
		return true;
	};


	MaterialSupplier.prototype.supplierTip = function (msg) {
		this.$supplierCode.after('<span class="rule-error red">' + msg + '</span>');
	};

	MaterialSupplier.prototype.materialTip = function (msg) {
		this.$materialNo.after('<span class="rule-error red">' + msg + '</span>');
	};

	/**
	 * 获取供应商名称
	 * */
	MaterialSupplier.prototype.getSupplierName = function () {
		var _this = this;
		getAjax({
            url: this.opt.supplierUrl,            
            data: { SupplierCode: this.result.SupplierCode },
			isOperator: false,
			callback: function (result) {
				if (result.data) {
					_this.result.SupplierId = result.data.id;
					_this.result.SupplierName = result.data.supplierName;
					typeof _this.opt.supplierBack === 'function' ? _this.opt.supplierBack(result) : null;
				}
				else {
					_this.clearAll();
					_this.supplierTip('查询失败，请输入正确的供应商编码！');
				}
			},
			errorback: function (err) {
				_this.clearAll();
				_this.supplierTip('后台错误！请重试……');
			}
		});
	};

	/**
	 * 获取零件名称
	 * */
	MaterialSupplier.prototype.getMaterialName = function () {
		var _this = this;
		getAjax({
			url: this.opt.materialUrl,
			data: { SupplierId: this.result.SupplierId, MaterialNo: this.result.MaterialNo },
			callback: function (result) {
				if (result.data) {
					_this.result.MaterialName = result.data.materialName;
					_this.result.MaterialId = result.data.id;
					typeof _this.opt.materialBack === 'function' ? _this.opt.materialBack(result) : null;
				}
				else {
					_this.clearMaterial();
					_this.materialTip('查询失败，请输入正确的零件编码！');
				}
			},
			errorback: function (err) {
				_this.clearMaterial();
				_this.materialTip('后台错误！请重试……');
			}
		});
	};

	/**
	 * 清除零件信息
	 * */
	MaterialSupplier.prototype.clearMaterial = function () {
		this.result.MaterialNo = '';
		this.result.MaterialName = '';
		this.result.MaterialId = '';
		typeof this.opt.clearMaterialBack === 'function' ? this.opt.clearMaterialBack() : null;
	};

	/**
	 * 清除供应商信息
	 * */
	MaterialSupplier.prototype.clearSupplier = function () {
		this.result.SupplierCode = '';
		this.result.SupplierName = '';
		this.result.SupplierId = '';
		typeof this.opt.clearSupplierBack === 'function' ? this.opt.clearSupplierBack() : null;
	};

	MaterialSupplier.prototype.clearAll = function () {
		this.result.MaterialNo = '';
		this.result.MaterialName = '';
		this.result.MaterialId = '';
		this.result.SupplierCode = '';
		this.result.SupplierName = '';
		this.result.SupplierId = '';
		typeof this.opt.clearMaterialBack === 'function' ? this.opt.clearMaterialBack() : null;
		typeof this.opt.clearSupplierBack === 'function' ? this.opt.clearSupplierBack() : null;
	};
	
	$.fn.MaterialSupplier = function (opt) {
		return new MaterialSupplier(this, opt);
	};

})(window, undefined);

function opacityShow() {
	$('.opacity').fadeIn('fast');
}
function opacityHide() {
	$('.opacity').fadeOut('fast');
}
function _alert(state, msg, title, isWarning) {
    $.gritter.add({
        title: title || '操作' + (state ? '成功' : '失败'),
        text: msg,
        class_name: 'gritter-' + (state ? 'success' : isWarning ? 'warning' : 'error') +' gritter-center',
        time: 1300
    });
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1) c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
};

/**
 * 获取表单提交数据
 * @param {any} form 表单
 * @param {any} type 查询表单方式 true->原生 false->jQ序列化
 * @returns {Object} 查找到的表单数据
 */
function getFormData(form, type) {
    var returnObj = {};
    var i;
    var dataAry;
    if (!type) {
        dataAry = $(form).serializeArray();
    }
    else {
        dataAry = $(form)[0];
    }
	for (i = 0; i < dataAry.length; i++) {
		if (dataAry[i].type === 'radio') {
			dataAry[i].checked ? returnObj[dataAry[i].name] = $.trim(dataAry[i].value) : null;
		}
		else {
			returnObj[dataAry[i].name] = $.trim(dataAry[i].value);
		}
    }
    i = null;
    dataAry = null;
    return returnObj;
}

/**
 * 表单重置
 * @param {any} form jq对象 / 元素id
 */
function formReset(form) {
	$(form).find('[type=hidden]').val('');
	$(form).find('.rule-error').remove();
    $(form)[0].reset();
}

/**
 * 设置表单
 * @param {any} form form元素（原生）
 * @param {any} data 表单数据
 */
function setForm(form, data) {
    var obj = {};
    for (var k in data) {
        if (data.hasOwnProperty(k)) {
            obj[k.toLowerCase()] = data[k];
        }
    }
    data = obj;
    for (var i = 0; i < form.length; i++) {
        var cur = form[i];
        var type = cur.type;
        var key = cur.name.toLowerCase();
        var val = cur.value;

        switch (type) {
            case 'file': {
                break;
            }
            case 'checkbox': {
                //data[k] 数组
                cur.checked = (data[key].indexOf(val) === -1) ? false : true;
                break;
            }
            case 'radio': {
                cur.checked = (data[key] == val) ? true : false;
                break;
            }
            default: {
                cur.value = (data[key] === undefined || data[key] === null ? '' : data[key]);
                break;
            }
        }
        
    }
}

/**
 * 表单提交规则,验证表单是否为空
 * @param {String/Object} form form元素（form id 或者 jq form）
 * @param {Object} rule 规则
 * @param {String} events 单独的某个元素（如不传取所有表单元素）
 * @return {Boolean} 验证后的结果
 */

function modalSubmitRule(form, rule, events) {
    var flag = true;
	$(form).find(events || 'select, input, textarea').each(function (item, ele) {
		//if (!$.trim($(ele).val())) {
		//	if (rule && (typeof rule[ele.name] === 'function')) {
		//		if (rule[ele.name]($(ele).val(), $(ele))) {
		//			return;
		//		}
		//	}
		//	else if (rule && rule[ele.name]) {
		//		return;
		//	}
		//	flag = false;
		//}
		//else {
		if (rule && (typeof rule[ele.name] === 'function')) {
			if (rule[ele.name]($(ele).val(), $(ele))) {
				return;
			}
			else {
				flag = false;
			}
		}
		else if (rule && rule[ele.name]) {
			return;
		}
		else if (!$.trim($(ele).val())) {
			flag = false;
		}
		//}
	});
    return flag;
}

/**
 * ajax请求
 * @param {Object} data 传递的参数
 * @param {String} type 类型
 * @param {String} url 地址
 * @param {Function} callback 回调
 * @param {Boolean} alert 是否弹出提示  false强制不弹出（错误、失败也不弹出）
 * @param {Boolean} upload 是否上传
 * @param {Function} errorback 失败回调
 */
//function getAjax(data, type, url, callback, alert, upload, errorback) {
function getAjax(opt) {
	var newOperator = getCookie('loginId');
	var operator = USERINFO.loginId;

	// 查看本地的登录人ID是否和cookie中的登录人ID一致 不一致就刷新页面（为保证登录人一致）
	if (newOperator !== operator) {
		_alert(false, '登录人变更，1秒后自动刷新页面……');
		window.setTimeout(function () {
			window.location.reload(true);
		}, 2000);
		return;
	}

	var data = opt.data || {};
	var type = opt.type || 'POST';
	var url = opt.url || '/';
	var callback = opt.callback || null;
	var errorback = opt.errorback || null;
	var complete = opt.complete || null;
	var alert = opt.alert === undefined ? undefined : opt.alert;
	var isOperator = opt.isOperator === undefined ? true : opt.isOperator;
	var isJSON = opt.isJSON === undefined ? true : opt.isJSON;
	var upload = opt.upload || false;
	var loading = opt.loading === undefined ? true : opt.loading;
	if (loading) {
		opacityShow();
	}
    var obj = {
        url: url,
        type: type,
        dataType: 'JSON',
        success: function (result) {
			if (result.success && result.result.success) {
                typeof callback === 'function' ? callback(result.result) : null;
                if (alert)
                    _alert(true, result.result.msg);
            }
            else {
                alert === false ? null : _alert(false, result.result.msg);
				typeof errorback === 'function' ? errorback(result.result) : null;
            }
        },
		error: function (err) {
			console.log(opt);
            var title = '服务器错误！';
            var text = err.responseText;
            var reg = /<title>(.*)<\/title>/i;
            if (reg.test(text)) {
                title = reg.exec(text)[1];
            }
            if (title === '登录') {
				var $el = $("<div><p class='red' style='margin-bottom:20px'>*登录超时，请输入密码重新登录！</p><label>密 码：&nbsp;</label><input type='password' name='password' class='form-control' style='display: inline-block; width: 200px;'></div>");
                bConfirm($el, function () {
                    var password = $el.find('[name=password]').val();
					var loginName = getCookie("userName");
                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: "../../Login/LoginValidate",
                        data: {
                            LoginName: loginName,
                            PassWord: password
                        },
                        cache: false,
                        async: false,
                        success: function (data) {
                            if (data.result.success) {
								getCookie("userName", loginName, 1);// 账号
								getCookie("loginName", data.result.data.userName, 1);//用户名
								getCookie("loginId", data.result.data.id, 1);//登录ID
                            } else {
                                $.gritter.add({
                                    title: '登录失败',
                                    text: data.result.msg,
                                    class_name: 'gritter-error gritter-center'
                                });
                            }
                        },
                        error: function (err) {
                            var title = '服务器错误！';
                            var text = err.responseText;
                            var reg = /<title>(.*)<\/title>/i;
                            if (reg.test(text)) {
                                title = reg.exec(text)[1];
                            }
                            $.gritter.add({
                                title: '登录失败',
                                text: title,
                                class_name: 'gritter-error gritter-center'
                            });
                        }
                    });
                })
            }

            else {
                alert === false ? null : _alert(false, title);
                typeof errorback === 'function' ? errorback({}) : null;
            }	
		},
		complete: function () {
			if (loading) {
				opacityHide();
			}
			typeof complete === 'function' ? complete() : null;
		}
    }

	if (upload) {
        data.append('CreatedUserId', operator);
        data.append('ModifiedUserId', operator);
        data.append('OperatorId', operator);
        obj.contentType = false;
        obj.cache = false;
        obj.processData = false;
        obj.data = data;
    }
	else {
		if (isJSON) {
			obj.data = JSON.stringify(isOperator ? $.extend({}, { CreatedUserId: operator, OperatorId: operator, ModifiedUserId: operator }, data) : data);
		}
		else {
			obj.data = isOperator ? $.extend({}, { CreatedUserId: operator, OperatorId: operator, ModifiedUserId: operator }, data) : data;
		}
    }

    $.ajax(obj);
};

/**
 * 深度拷贝对象
 * @param  {Object} obj 需要拷贝的对象
 * @return {Object} 拷贝后的对象
 */
function deepCopy(obj) {
    var returnObj = {};
    try {
        returnObj = JSON.parse(JSON.stringify(obj));
    } catch (e) {
        returnObj = {};
        for (var k in obj) {
            returnObj[k] = obj[k];
        }
    }
    return returnObj;
}

/**
 * 解析时间
 * @param {Date/String} paseStr 需要解析的时间串
 * @param {String} format 返回格式
 * @return {String} 返回解析后的时间格式
 */
function paseDate(paseStr, format) {

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
        _alert(true, '需要正确的时间格式,当前时间格式为' + paseStr, '解析时间失败');
    }
}

/**
 * 是否确认提示框
 * @param {String} message 提示信息
 * @param {Function} callback 点击确定后回调
 * @param {Function} errorBack 点击取消后回调
 */
function bConfirm(message, callback, errorBack) {
    bootbox.confirm({
        title: '系统提示',
        message: message,
        buttons: {
            confirm: {
                label: "确认",
                className: 'btn-info btn'
            },
            cancel: {
                label: "取消",
            }
        }, 
        callback: function (flag) {
            if (flag) {
                typeof callback === 'function' ? callback() : null;
            }
            else {
                typeof errorBack === 'function' ? errorBack() : null;
            }
        }
    })
}

function bAlert(message, title) {
	bootbox.alert({
		title: title || '系统提示',
		message: message,
		buttons: {
			ok: {
				label: "确认",
				className: 'btn-info btn'
			},
		},
	})
}


/**
 * 获取文件的路径
 * @param {Element} obj file元素
 * @return {String} 文件所在路径
 */
function getPath(obj) {
    if (obj) {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select(); return document.selection.createRange().text;
        }
        else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            if (obj.files) {
                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
    }
    return '';
}

/**
 * 文件下载
 * @param {String} url 下载地址
 * @param {String} filename 下载文件名称
 * @param {Function} callback 下载成功后回调
 */
var downloadResource = function (url, filename, callback) {
	opacityShow();
	if (!filename) filename = url.split('\\').pop().split('/').pop();
	if (window.fetch) {
		fetch(url)
			.then(function (response) {
				return response.blob();
			})
			.then(function (blob) {
				var blobUrl = window.URL.createObjectURL(blob);
				var a = document.createElement('a');
				a.href = blobUrl;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				a = null;
				opacityHide();
				typeof callback === 'function' ? callback() : null;
			})
			.catch(function (e) {
				console.log(e);
				opacityHide();
			});
	}
	else if ('msSaveOrOpenBlob' in navigator || (window.URL && window.URL.createObjectURL)) {
		var oReq = new XMLHttpRequest();
		oReq.open("GET", url, true);
		oReq.responseType = "blob";
		oReq.onreadystatechange = function () {
			if (oReq.readyState === oReq.DONE) {
				var blob = oReq.response;
				if ('msSaveOrOpenBlob' in navigator) {
					window.navigator.msSaveOrOpenBlob(blob, filename);
				} else {
					var a = document.createElement('a');
					a.href = window.URL.createObjectURL(blob);
					a.download = filename;
					a.click();
					a = null;
				}
				typeof callback === 'function' ? callback() : null;
				opacityHide();
			}
		}
		oReq.send();
	} else {
		window.location.href = url;
		window.setTimeout(function () {
			typeof callback === 'function' ? callback() : null;
		}, 8000);
		opacityHide();
	}

};

/**
 * 获取URL参数
 * @param {String} search URL地址
 * @param {any} name 参数名
 * @return {String} 查询到的值
 */
var getURL = function (search, name) {
    var reg = new RegExp("[?&]" + name + "=([^&]*)(&|$)", "i");
    var r = search.match(reg);
	if (r != null) return unescape(r[1]);
    return null;
};

/**
 * 绑定时间插件
 * @param {String} ele 需要绑定插件元素 （字符串）
 * @param {Object} option 传递给插件的参数
 * @return {Object} jeDate对象
 */
function dataTimeBind(ele, option) {

	var flag = (option && option.format && option.format.indexOf('YYYY-MM-DD hh') !== -1) ? true : false;

    return jeDate(ele, $.extend({}, {
        format: "YYYY-MM-DD", //YYYY-MM-DD hh:mm:ss
		onClose: flag,
        theme: { bgcolor: "#3396fb", color: "#ffffff", pnColor: "#3396fb" }
	}, option || {}));
}

/**
 * 格式化时间格式
 * @param {any} s 需要格式化的时间
 * @return {String} 格式化后的值
 */
function formatDate(s) {
	return s ? s.replace(/\.(\d{2})$/, function () { return '.0' + arguments[1]; }) : '';
}

/**
 * 随机生成时分秒毫秒的数 yyyyMMddHHmmssll
 * @return {String} 生成的随机数
 */
function randomNumbers() {
    //var str = '1234567890';
    //var ary = str.split('');
    //var t = paseDate('YYYY-').replace(/-/g, '');
    //var md = '';
    //for (var i = 0; i < 5; i++) {
    //    md += ary[Math.round(Math.random() * (ary.length - 1 - 0) + 0)];
    //}
    //return (t + md);
    return paseDate(null, 'yyyyMMddHHmmssll');
}

/**
 * 获取元素所在位置
 * @param {Object} element 元素
 * @return {Number} 元素所在索引
 */
function getElementIndex(element) {
    var ary = [];
    while (element.previousSibling) {
        element = element.previousSibling;
        ary.push(element);
    }
    return ary.length;
    
};

/**
* 权限判断 可传递多个按钮名 
* @return {Boolean} 匹配结果
*/
function isPass() {

	if (!OPENJURISDICTION) {
		return true;
	}

	// 如果没有权限限制
	if (!jurisdiction || !Object.keys(jurisdiction).length) {
		return false;
	}

	if (arguments.length === 1) {
		return !!jurisdiction[arguments[0]];
	}
	else {
		var flag = false;
		for (var i = 0; i < arguments.length; i++) {
			if (jurisdiction[arguments[i]]) {
				flag = true;
				break;
			}
		}
		return flag;
	}
}

function isJurisdiction(context) {
	context = context ? context : $('body');
	$('.btn-jurisdiction').each(function (index, item) {
		var t = $(item).attr('data-btn');
		// 如果没有权限 删除掉
		if (!isPass(t)) {
			$(item).remove();
		}
	});
}



/**
 * 如果内容为空 表单提示
 * @param {any} val 表单值
 * @param {Object} $el 当前元素
 * @param {String} tip 提示语句
 * @param {Boolen} rule 验证条件
 * @returns {Boolean} 是否为空
 */
function emptyFormTip(val, $el, tip, rule) {
	$el.next('.rule-error').remove();
	var flag = rule === undefined ? !$.trim(val) : rule;
	if (flag) {
		tip ? $el.after('<span class="rule-error red">' + tip + '</span>') : null;
		return false;
	}
	else {
		return true;
	}
}

/**
 * 设置分页page取值
 * @param {Array/Object} objList 需要设置的对象
 */
function setPage(objList) {

	function set(obj) {
		page = 1;
		Object.defineProperty(obj, 'page', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				page = val;
			},
			get: function () {
				return ((page - 1) * this.count);
			}
		});
	}

	if (Object.prototype.toString.call(objList) === '[object Array]') {
		for (var i = 0; i < objList.length; i++) {
			if (Object.prototype.toString.call(objList[i]) === '[object Object]') {
				set(objList[i]);
			}
		}
	}
	else if (Object.prototype.toString.call(objList) === '[object Object]') {
		set(objList);
	}
}
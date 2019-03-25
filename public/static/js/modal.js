/**
 *  var m = new H_modal('#id');
 *  
 * // 点击提交按钮 触发bs-beforeSubmit 监听此事件
 *  m.on('bs-beforeSubmit', function(){
 *      console.log(1)
 *  });
 * 
 * // 关闭modal 触发bs-beforeClose
 *  m.on('bs-beforeClose', function(){
 *      console.log('close');
 *  })
 * 
 */

(function(){

    var CustomTarget = function(){
        this.handler = {};
    }

    CustomTarget.prototype.addEvent = function(type, fn){
        if(utils.isTypeOf(fn, 'function')) {

            if(!this.handler[type] || !$.isArray(this.handler[type])){
                this.handler[type] = [];
            }

            this.handler[type].push(fn);

        }
    }

    CustomTarget.prototype.trigger = function(type){
        if(this.handler[type] && $.isArray(this.handler[type]) && this.handler[type].length){
            var eventList = this.handler[type];
            for(var i = 0; i < eventList.length; i++) {
                utils.isTypeOf(eventList[i], 'function') ? eventList[i].call(this) : null;
            }
        }
    }



    CustomTarget.prototype.removeEvent = function(type, fn){
        if(utils.isTypeOf(fn, 'function') && this.handler[type] &&  $.isArray(this.handler[type]) && this.handler[type].length) {
            
            var eventList = this.handler[type];
            for(var i = 0; i < eventList.length; i++) {

                if(eventList[i] === fn) {
                    eventList.splice(i, 1);
                    break;
                }
                
            }

        }
    }


    var inhert = function(child, parent){
        var F = function(){};
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
    }


    var BaseModal = function(){

        if(!this.onStart || !this.onEnd) {
            throw '请添加开始结束字段名';
            return;
        }

        CustomTarget.prototype.constructor.call(this);

        this.baseInit();
    }

    inhert(BaseModal, CustomTarget);

    BaseModal.prototype.baseInit = function(){

        var _this = this;
        this.onStart = this.onStart || 'base-on-start-' + new Date().getTime();
        this.onEnd = this.onEnd || 'base-on-end-' + new Date().getTime();
        this.opacity = $('<div class="h-modal-opacity"></div>')
        .bind('click', function(){
            _this.hide();
        });

        this.addEvent(this.onEnd, this.baseHide);

    }

    BaseModal.prototype.baseShow = function(){

        var dtd = $.Deferred();
        var _this = this;

        var setClass = function(dtd){
            window.setTimeout(function(){
                _this.opacity.addClass('show');
                dtd.resolve();
            }, 0)
            return dtd;
        };

        var onTrigger = function(dtd){
            window.setTimeout(function(){
                _this.trigger(_this.onStart);
                dtd.resolve();
            }, 200);
            return dtd;
        }

        $('body').append(this.opacity);

        $.when(setClass(dtd))
        .done(function () { onTrigger(dtd) });

    }
    BaseModal.prototype.baseHide = function(){
        var _this = this;
        this.opacity.removeClass('show');

        window.setTimeout(function(){
            _this.opacity.remove();
        }, 200)
    }

    /**
     * 
     * @param {*} id 
     * @param {*} opt 
     */
    var H_modal = function(id, opt){

        var isString = utils.isTypeOf(id, 'string');
        this.onStart = 'bs-on-start-' + (isString ? id : id.attr('id'));
        this.onEnd = 'bs-on-end-' + (isString ? id : id.attr('id'));
        this.ele = this.ele || isString ? $(id) : id;
        this.width = (opt && opt.width) || this.ele.data('width') || 500;
        
        BaseModal.prototype.constructor.call(this);
        this.addEvent
        this.modalInit();
    }

    inhert(H_modal, BaseModal);

    H_modal.prototype.modalInit = function(){

        var _this = this;

        this.ele.width(this.width);
        this.ele.resize(this.getPosition);

        this.ele.find('[data-methods=close]').bind('click', function(){
            _this.hide();
        }); 
        this.ele.find('[data-methods=submit]').bind('click', function(){
            _this.ele.trigger('bs-beforeSubmit');
        });
        this.addEvent(this.onStart, this.modalShow);

    }

    H_modal.prototype.getPosition = function(){
        this.eleH = this.ele.height();
        this.eleW = this.ele.width();
        this.ele.css({
            'marginTop': -1 * this.eleH / 2 + 'px',
            'marginLeft': -1 * this.eleW / 2 + 'px',
        });
    }
    H_modal.prototype.modalShow = function(){
        this.ele.addClass('show');
    }
    H_modal.prototype.show = function(){
        this.getPosition();
        this.baseShow();
        $('body').append(this.ele);
    }
    H_modal.prototype.hide = function(isTrigger){
        var _this = this;
        if(isTrigger === undefined || isTrigger) {
            this.ele.trigger('bs-beforeClose');
        }
        this.ele.removeClass('show');
        window.setTimeout(function(){
            _this.trigger(_this.onEnd);
        }, 300);
    }
    H_modal.prototype.on = function(type, fn){
        this.ele.on(type, fn);
    }



    // var H_confirm = function(msg, callback, cancel){
    //     var id = '#h-confirm-'+ new Date().getTime();
    //     this.ele = $('<div class="h-modal" id="'+ id.replace('#', '') +'" data-width="550"><div class="h-modal-title"><h5>系统提示</h5><span class="h-modal-close" data-methods="close"><i class="fa fa-times"></i></span></div><div class="h-modal-body">是否确认当前操作？</div><div class="h-modal-footer"><span class="h-modal-button submit" data-methods="submit"><i class="fa fa-save"></i> 确认</span><span class="h-modal-button cancel" data-methods="close"><i class="fa fa-times"></i> 取消</span></div></div>');
    //     $('body').append(this.ele);
    //     this.callback = callback;
    //     this.cancel = cancel;
    //     msg ? this.ele.find('.h-modal-body').html(msg) : null;
    //     H_modal.prototype.constructor.call(this, id);
    //     this.confirmInit();
    // }

    // inhert(H_confirm, H_modal);

    // H_confirm.prototype.confirmInit = function(){
    //     var _this = this;
    //     this.show();
    //     this.ele.on('bs-beforeClose', function(){
    //         utils.isTypeOf(_this.cancel, 'function') ? _this.cancel() : null;
    //         window.setTimeout(function(){
    //             _this.ele.remove();
    //             _this.ele = null;
    //         }, 500);
    //     });
    //     this.ele.on('bs-beforeSubmit', function(){
    //         utils.isTypeOf(_this.callback, 'function') ? _this.callback() : null;
    //         _this.hide(false);
    //     });
    // }

    
    // var H_alert = function(msg){
    //     var id = '#h-confirm-'+ new Date().getTime();
    //     this.ele = $('<div class="h-modal" id="'+ id.replace('#', '') +'" data-width="550"><div class="h-modal-title"><h5>系统提示</h5><span class="h-modal-close" data-methods="close"><i class="fa fa-times"></i></span></div><div class="h-modal-body">是否确认当前操作？</div><div class="h-modal-footer"><span class="h-modal-button submit" data-methods="close"><i class="fa fa-save"></i> 确认</span></div></div>');
    //     $('body').append(this.ele);
    //     msg ? this.ele.find('.h-modal-body').html(msg) : null;
    //     H_modal.prototype.constructor.call(this, id);
    //     this.initAlert();
    // }

    // inhert(H_alert, H_modal);

    // H_alert.prototype.initAlert = function(){
    //     this.show();
    // }

    


    window.H_modal = H_modal;
    // window.H_confirm = function(msg, callback, cancel){
    //     return new H_confirm(msg, callback, cancel);
    // }
    // window.H_alert = function(msg){
    //     return new H_alert(msg);
    // }
})();
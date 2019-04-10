 // 被选中的游戏 无规则的key
 var selectedAry = [];

 // 确认投注的信息
 var tableData = [];
 
 // 快速输入 值
 var quickValue = '';
 
 // 分盘
 var levelValue = 'A';
 if(utils.getCookie('game_key') != 'ssc') {
     utils.setCookie('game_key', 'ssc');
     utils.setCookie('part', levelValue)
 }
 else if(utils.getCookie('part')){
     levelValue = utils.getCookie('part');
 }
 
 // 确认投注弹出框
 var confirmModal = new H_modal('#confirmModal');

/**
 * 获取
 */
function getLastPeriods(){
    utils.getAjax({
        url: utils.concatGameKey('/api/game/lastNum'),
        type: 'GET',
        success: function(json){
            app._data.periods = json.periods;
            app._data.periods_number = json.number;
            
        }
    })
}

/**
 * 初始化 获取基础信息
 */
var init = function(){
    utils.getAjax({
        url: utils.concatGameKey('/api/game/gameInit'),
        type: 'GET',
        success: function(json){
            app._data.level = json.dish;
            app._data.nowPeriods = json.issue;
            app._data.close_time = json.close_time;
            app._data.tabContent = json.status;
            timeInterval(json.count_down);
        } 
    })
}

// 设置基础信息的 为乐方便
var app = new Vue({
    el: '#layoutBody',
    data: {
        periods: '', //最新期数
        periods_number: '', // 最新开奖结果
        tab: 0, // 0->游戏 1->规则
        tabContent: 1, // 0->停盘 1->开盘
        quickImport: '', // 快速输入
        level: [],
        levelValue: levelValue,
        // levelName: 'A盘',
        nowPeriods: '',
        close_time: '',
        count_down: '',
        // confirmTable: [], // 啥用没有/
        odds: '', // 赔率，
        selectInput: [], // 选中的号码
        selectInputData: '',
        game_item: 'zxl',
        game_type: '后三位',

    },
    methods: {
        levelChange: function(){
            levelValue = this.levelValue;
            utils.setCookie('part', this.levelValue);
        },

        setInput: function(_this,index){
            if(!$(_this.target).is(':checked')){
                this.selectInput.splice($.inArray(index, this.selectInput), 1);
            }
            else {
                this.selectInput.push(index);
            }
            var __this = this;

            if(this.selectInput.length >= 4){
                // 获取赔率
                utils.getAjax({
                    url: utils.concatGameKey('/api/game/getOdds'),
                    data: {
                        item: this.selectInput.toString(),
                        game_item: this.game_item,
                        part: this.levelValue,
                    },
                    type: 'GET',
                    success: function(result){
                        __this.selectInputData = __this.selectInput.toString();
                        __this.odds = result;
                    }
                })
                // __this.selectInputData = __this.selectInput.toString();
                // __this.odds = 1.23;
            }
            else {
                this.selectInputData = '';
                this.odds = '';
            }
        },


    }
});

/**
 * 确认投注modal基础信息初始化
 */
function confirmInit() {
    var ele = $('#confirmModal');
    var level = ele.find('.level');
    var periods = ele.find('.periods');
    var game_type = ele.find('.game_type');
    var odds = ele.find('.odds');
    var selectInputData = ele.find('.selectInputData');

    level.text(app.levelValue);
    periods.text(app.nowPeriods);
    game_type.text(app.game_type);
    odds.text(app.odds);
    selectInputData.text(app.selectInputData);
}

/**
 * 设置倒计时
 * @param {Number} time 倒计时(秒)
 */
function timeInterval(time) {
    var interval = window.setInterval(function(){
        time -= 1;
        app._data.count_down = utils.remainingTime(time);
        if(time <= 0){
            console.log('timeout: 0')
            window.clearInterval(interval);
            refresh_data = [];
            init();
        }
    }, 1000);
}

$(function(){

     /* ************* 限制投注输入框 ************** */

    $('#drop_money').bind('blur', function(){
        if(isNaN(this.value)){
            alert('请输入纯数字');
            this.value = '';
        }
    });

    $('#drop_money').bind('click', function(e){
        e.stopPropagation();
    });

    $('#drop_money').bind('input', function(){
        getMoneyTotal();
    })


    /* ************* 点击下注弹出确认下注 ************** */
    $('.submit').bind('click', function(){
        // if(!tableData.length){
        //     return alert('请下注！');
        // }
        if(app.selectInput.length < 4) {
            return alert('请选择4位号码下注~');
        }
        if(!app.odds || !app.selectInputData){
            return alert('下注失败，请重选号码~');
        }

        confirmInit();
        confirmModal.show();
    });

    /* ************* 确认下注提交 ************** */
    confirmModal.on('bs-beforeSubmit', function(){
        
        var val = $('#drop_money').val();
        if(!val){
            return alert('请投注！')
        }
        utils.getAjax({
            url: utils.concatGameKey('/api/game/addBet'),
            type: 'POST',
            data: {
                nowPeriods: app._data.nowPeriods,
                game_type: app.game_type,
                game_item: app.game_item,
                money: val,
                level: app.levelValue,
                number: app.selectInput,
                odds: app.odds,
            },
            alert: true,
            success: function(){
                history.go(0);
            }
        })
    });

    /* ************* 哈 ************** */
    init();
    getLastPeriods();
    window.setInterval(function(){
        getLastPeriods();
    }, 10000);
   
})
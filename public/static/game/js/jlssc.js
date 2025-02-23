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
 * 添加被选中的游戏
 * @param {String} key 别选中的游戏 无规则的key
 */
function setNumber(key){
    var elementList = $('[data-item='+ key +']');
    if($.inArray(key, selectedAry) == -1){ // 不存在
        elementList.addClass('active');
        selectedAry.push(key);
        if(quickValue){
            elementList.find('input').val(quickValue).trigger('input');
        }
    }
    else{ // 存在
        elementList.removeClass('active');
        selectedAry.splice($.inArray(key, selectedAry), 1);
    }
}

/**
 * 快速输入设置被选中的游戏值
 */
function setSelectAry(){
    for(var i = 0; i < selectedAry.length; i++) {
        var ele = $('[data-item='+ selectedAry[i] +']');
        ele.find('input').val(quickValue);
    }
}

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
 * 获取总投注金额 .moneyTotal
 */
function getMoneyTotal() {
    var total = 0;
    $('.portlet-body .h-table').find('input[type=text]').each(function(){
        if(this.value){
            total += parseInt(this.value);
        }
    });
    $('.moneyTotal').text(total);
}

/**
 * 初始化 获取基础信息
 */
var init = function(){
    utils.getAjax({
        url: utils.concatGameKey('/api/game/gameInit'),
        loading: true,
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
    },
    methods: {
        levelChange: function(){
            levelValue = this.levelValue;
            utils.setCookie('part', this.levelValue);
        },

        // input blur验证
        verifyInput: function(event){
            if(isNaN(event.target.value)){
                alert('请输入纯数字');
                event.target.value = '';
                this.getMoneyTotal();
            }
        },

        // 获取金额
        getMoneyTotal: getMoneyTotal,


        // 确认下注
        submit: function(){
            tableData = getData();
            if(!tableData.length){
                return alert('请下注！');
            }

            confirmInit();
            confirmModal.show();
        }
        


    }
});

/**
 * 确认投注modal基础信息初始化
 */
function confirmInit() {
    var ele = $('#confirmModal');
    var tbody = ele.find('.confirmTbody').empty();
    var level = ele.find('.level');
    var tableLength = ele.find('.table-length');
    var html = ''

    for(var i = 0 ; i < tableData.length; i++) {
        html += '<tr><td>'+ app.nowPeriods +'</td><td><span style="color: rgb(0, 0, 255)">龙虎'+ tableData[i].name +'</span><span style="color: rgb(255, 0, 0)">('+ tableData[i].sub_name +'&nbsp;[五字])</span></td><td><b class="f-s-16 f-c-red">'+ tableData[i].odds +'</b></td><td>'+ tableData[i].value +'</td><td><span class="f-c-red">稍等</span></td></tr>';
    }
    
    tbody.append(html);
    level.text(levelValue);
    tableLength.text(tableData.length);
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

/**
 * 获取被选中游戏的信息
 */
function getData() {
    var ary = [];
    $('[data-name=begin-table] input[type=text]').each(function(){
        var data;
        if(this.value){
            data = new Function("return " + $(this).attr('data-item'))();
            data.value = this.value;
            ary.push(data);
        }
    });

    return ary;
}



$(function(){
    /* ************* 限制投注输入框 ************** */
    // $('.portlet-body .h-table').find('input[type=text]').bind('blur', function(){
    //     if(isNaN(this.value)){
    //         alert('请输入纯数字');
    //         this.value = '';
    //     }
    // });

    // $('.portlet-body .h-table').find('input[type=text]').bind('click', function(e){
    //     e.stopPropagation();
    // });

    // $('.portlet-body .h-table').find('input[type=text]').bind('input', function(){
    //     getMoneyTotal();
    // })

    /* ************* 限制快速投注输入框 ************** */

    // $('.quickImport').bind('blur', function(){
    //     if(isNaN(this.value)){
    //         alert('请输入纯数字');
    //         this.value = '';
    //     }
    // });

    // $('.quickImport').bind('click', function(e){
    //     e.stopPropagation();
    // });

    // $('.quickImport').bind('input', function(){
    //     $('.quickImport').val(this.value);
    //     quickValue = this.value;
    //     setSelectAry();
    //     getMoneyTotal();
    // });


    /* ************* 点击下注弹出确认下注 ************** */
    // $('.submit').bind('click', function(){
    //     tableData = getData();
    //     if(!tableData.length){
    //         return alert('请下注！');
    //     }

    //     confirmInit();
    //     confirmModal.show();
    // });

    /* ************* 确认下注提交 ************** */
    confirmModal.on('bs-beforeSubmit', function(){
        var data = tableData;
        
        utils.getAjax({
            url: utils.concatGameKey('/api/game/addBet'),
            loading: true,
            type: 'POST',
            data: {
                nowPeriods: app._data.nowPeriods,
                level: levelValue,
                data: tableData,
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
   
    $('body').fadeIn('fast');
})
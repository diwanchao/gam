 // 被选中的游戏 无规则的key
var selectedAry = [];

// 确认投注的信息
var tableData = [];

// 快速输入 值
var quickValue = '';

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
 * 获取被选中游戏的信息
 */
function getData() {
    var ary = [];
    $('[data-name=begin-table] input[type=text]').each(function(){
        var data;
        if(this.value){
            data = new Function("return" + $(this).data('item'))();
            data.value = this.value;
            ary.push(data);
        }
    });

    // 四码黑单独获取
    if($('#simahei').find('input[type=text]').val()){
        var key = '';
        $('#simahei').find('input[type=checkbox]:checked').each(function(){
            key += this.name;
        });

        data = new Function("return" + $('#simahei').find('input[type=text]').data('item'))();
        data.value = $('#simahei').find('input[type=text]').val();
        data['sub_key'] = key;
        data['sub_name'] = key;
        ary.push(data);
    }

    // 四码红单独获取
    if($('#simahong').find('input[type=text]').val()){
        var key = '';
        $('#simahong').find('input[type=checkbox]:checked').each(function(){
            key += this.name;
        });

        data = new Function("return" + $('#simahong').find('input[type=text]').data('item'))();
        data.value = $('#simahong').find('input[type=text]').val();
        data['sub_key'] = key;
        data['sub_name'] = key;
        ary.push(data);
    }

    // 五码黑单独获取
    if($('#wumahei').find('input[type=text]').val()){
        var key = '';
        $('#wumahei').find('input[type=checkbox]:checked').each(function(){
            key += this.name;
        });

        data = new Function("return" + $('#wumahei').find('input[type=text]').data('item'))();
        data.value = $('#wumahei').find('input[type=text]').val();
        data['sub_key'] = key;
        data['sub_name'] = key;
        ary.push(data);
    }
    return ary;
}

/**
 * 初始化 获取基础信息
 */
var a = 0;
var init = function(){
    a = (a == 0 ? 1 : 0);
    utils.getAjax({
        url: utils.concatGameKey('/api/game/gameInit'),
        type: 'GET',
        data:{
            a: a,
        },
        success: function(json){
            app._data.level = json.dish;
            app._data.nowPeriods = json.issue;
            app._data.close_time = json.close_time;
            app._data.tabContent = json.status;
            timeInterval(json.count_down);
        } 
    })
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
 * 确认投注modal基础信息初始化
 */
function confirmInit() {
    var ele = $('#confirmModal');
    var tbody = ele.find('.confirmTbody').empty();
    var tableLength = ele.find('.table-length');
    var html = ''

    for(var i = 0 ; i < tableData.length; i++) {
        html += '<tr><td>'+ tableData[i].name +'</td><td>'+ tableData[i].sub_name +'</td><td><b class="f-s-16 f-c-red">'+ tableData[i].odds +'</b></td><td>'+ tableData[i].value +'</td><td><span class="f-c-red">稍等</span></td></tr>';
    }
    tbody.append(html);
    tableLength.text(tableData.length);
}

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

// 设置基础信息的 为乐方便
var app = new Vue({
    el: '#main',
    data: {
        periods: '', //最新期数
        periods_number: '', // 最新开奖结果
        tab: 0, // 0->游戏 1->规则
        tabContent: 1, // 0->停盘 1->开盘
        quickImport: '', // 快速输入
        level: [],
        levelValue: '/index/game/jlk3-A',
        // levelName: 'A盘',
        nowPeriods: '',
        close_time: '',
        count_down: '',
        // confirmTable: [], // 啥用没有/
    },
    methods: {
        levelChange: function(){
            window.location = this.levelValue;
        }
    }
});

$(function(){
    /* ************* 限制投注输入框 ************** */
    $('.portlet-body .h-table').find('input[type=text]').bind('keydown', function(e){
        if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 38 && e.keyCode != 40) {
            e.preventDefault();
        }
    });

    $('.portlet-body .h-table').find('input[type=text]').bind('blur', function(){
        if(isNaN(this.value)){
            alert('请输入纯数字');
            this.value = '';
        }
    });

    $('.portlet-body .h-table').find('input[type=text]').bind('click', function(e){
        e.stopPropagation();
    });

    $('.portlet-body .h-table').find('input[type=text]').bind('input', function(){
        getMoneyTotal();
    })

    /* ************* 限制快速投注输入框 ************** */
    $('.quickImport').bind('keydown', function(e){
        if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 38 && e.keyCode != 40) {
            e.preventDefault();
        }
    });

    $('.quickImport').bind('blur', function(){
        if(isNaN(this.value)){
            alert('请输入纯数字');
            this.value = '';
        }
    });

    $('.quickImport').bind('click', function(e){
        e.stopPropagation();
    });

    $('.quickImport').bind('input', function(){
        $('.quickImport').val(this.value);
        quickValue = this.value;
        setSelectAry();
        getMoneyTotal();
    });

    /* ************* 限制红黑码只能选择4种 ************** */
    $('[data-key=hongheima]').find('input[type=checkbox]').each(function() {
        $(this).bind('click', function(e){
            if($(this).closest('tr').find('input[type=checkbox]:checked').length >= 5){
                e.preventDefault();
                alert('不能超过4项');
            }
        })
    })

    /* ************* 点击下注弹出确认下注 ************** */
    $('.submit').bind('click', function(){
        tableData = getData();
        confirmInit();
        confirmModal.show();
    });

    /* ************* 确认下注提交 ************** */
    confirmModal.on('bs-beforeSubmit', function(){
        console.log(tableData);
        utils.getAjax({
            url: utils.concatGameKey('/api/game/addBet'),
            type: 'POST',
            data: tableData,
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






// [
    // {
    //     key: 'samjun',
    //     name: '三军',
    //     sub_key: '5mahong',
    //     sub_name: '5码红',
    //     odds: '1.95',
    //     value: 100,
    // }
// ]
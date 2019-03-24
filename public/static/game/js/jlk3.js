
var selectedAry = [];

var quickValue = '';

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

function setSelectAry(){
    for(var i = 0; i < selectedAry.length; i++) {
        var ele = $('[data-item='+ selectedAry[i] +']');
        ele.find('input').val(quickValue);
    }
}

function getMoneyTotal() {
    var total = 0;
    $('.portlet-body .h-table').find('input[type=text]').each(function(){
        if(this.value){
            total += parseInt(this.value);
        }
    });
    $('.moneyTotal').text(total);
}

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

var init = function(){
    utils.getAjax({
        url: utils.concatGameKey('/api/game/gameInit'),
        type: 'GET',
        success: function(json){
            app._data.game_name = json.game_name;
            app._data.periods = json.last_issue;
            app._data.periods_number = json.last_num;
            app._data.level = json.dish;
            app._data.nowPeriods = json.issue;
            app._data.close_time = json.close_time;
            timeInterval(json.count_down);
        }
    })
}


function timeInterval(time) {
    var interval = window.setInterval(function(){
            time -= 1;
            app._data.count_down = utils.remainingTime(time);
            if(time <= 0){
                console.log('timeout: 0')
                window.clearInterval(interval);
                // refresh_data = [];
                // init();
                // break;
            }
    }, 1000);
}

var app = new Vue({
    el: '#layoutBody',
    data: {
        game_name: '',
        periods: '', //最新期数
        periods_number: '', // 最新开奖结果
        tab: 0, // 0->游戏 1->规则
        quickImport: '', // 快速输入
        level: [],
        nowPeriods: '',
        close_time: '',
        count_down: ''
    },
})

$(function(){
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

    $('[data-key=hongheima]').find('input[type=checkbox]').each(function() {
        $(this).bind('click', function(e){
            if($(this).closest('tr').find('input[type=checkbox]:checked').length >= 5){
                e.preventDefault();
                alert('不能超过4项');
            }
        })
    })

    $('.submit').bind('click', function(){

        console.log(getData());

    });

    init();
    
})






// [
    // {
    //     key: 'samjun',
    //     name: '三军',
    //     data: [
    //         {
    //             key: '5mahong',
    //             name: '5码红',
    //             odds: '1.95',
    //             value: 100,
    //         }
    //     ]
    // }
    // {
    //     key: 'samjun',
    //     name: '三军',
    //     sub_key: '5mahong',
    //     sub_name: '5码红',
    //     odds: '1.95',
    //     value: 100,
    // }
// ]
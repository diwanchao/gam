
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
            data = JSON.parse($(this).data('item'));
            data.value = this.value;
            ary.push(data);
        }
    })
    // $('[data-name=begin-table]').each(function(){
    //     var innerObj = {}
        
    //     $(this).find('input[type=text]').each(function(){
    //         if(this.value){
    //             innerObj[this.name] = this.value;
    //         }
    //     });
    //     obj[$(this).data('key')] = innerObj;
    // });

    
    // obj['4mahei'] = (function(){
    //     var innerObj = {};
    //     if($('#simahei').find('input[type=text]').val()){
    //         var key = '';
    //         $('#simahei').find('input[type=checkbox]:checked').each(function(){
    //             key += this.name;
    //         });
    //         innerObj[key] = $('#simahei').find('input[type=text]').val();
    //     }
    //     return innerObj;
    // })();

    // obj['4mahong'] = (function(){
    //     var innerObj = {};
    //     if($('#simahong').find('input[type=text]').val()){
    //         var key = '';
    //         $('#simahong').find('input[type=checkbox]:checked').each(function(){
    //             key += this.name;
    //         });
    //         innerObj[key] = $('#simahong').find('input[type=text]').val();
    //     }
    //     return innerObj;
    // })();

    // obj['45ahei'] = (function(){
    //     var innerObj = {};
    //     if($('#wumahei').find('input[type=text]').val()){
    //         var key = '';
    //         $('#wumahei').find('input[type=checkbox]:checked').each(function(){
    //             key += this.name;
    //         });
    //         innerObj[key] = $('#wumahei').find('input[type=text]').val();
    //     }
    //     return innerObj;
    // })();

    return ary;
}

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

    })
})


var app = new Vue({
    el: '#layoutBody',
    data: {
        periods: '20190324-11', //最新期数
        periods_number: '123', // 最新开奖结果
        tab: 0, // 0->游戏 1->规则
        level: 'A', // 盘
        quickImport: '', // 快速输入

    }
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
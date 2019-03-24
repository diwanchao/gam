
var selectedAry = [];

var quickValue = '';

function setNumber(key){
    var elementList = $('[data-item='+ key +']');
    if($.inArray(key, selectedAry) == -1){ // 不存在
        elementList.addClass('active');
        if(quickImport){
            elementList.find('input').val(quickValue);
        }
    }
    else{ // 存在
        elementList.removeClass('active');
    }
}

function setSelectAry(){
    for(var i = 0; i < selectedAry.length; i++) {
        var ele = $('[data-item='+ selectedAry[i] +']');
        ele.find('input').val(quickValue);
    }
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



    $('#quickImport').bind('keydown', function(e){
        if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 38 && e.keyCode != 40) {
            e.preventDefault();
        }
    });

    $('#quickImport').bind('blur', function(){
        if(isNaN(this.value)){
            alert('请输入纯数字');
            this.value = '';
        }
    });

    $('#quickImport').bind('click', function(e){
        e.stopPropagation();
    });

    $('#quickImport').bind('input', function(){
        quickValue = _this.value;
        setSelectAry()
    })
})


$(function(){
    $('.portlet-body .h-table').find('input').bind('keydown', function(e){
        if(e.keyCode < 48 && e.keyCode > 57 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 38 && e.keyCode != 40) {
            if(e.preventDefault){
                e.preventDefault();
            }
            if(window.event) {
                window.event.returnValue = false;
            }
        }
    });

    $('.portlet-body .h-table').find('input').bind('blue', function(){
        if(isNaN(parseInt(this.value))){
            alert('请输入纯数字');
            this.value = '';
        }
    });

    $('.portlet-body .h-table').find('input').bind('click', function(e){
        e.stopPropagationt();
    });
})
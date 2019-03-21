var $oldPwd = $('#oldPwd');
var $newPwd = $('#newPwd');
var $confirmPwd = $('#confirmPwd');
var $submit = $('#submit');

$(function(){

    $submit.bind('click', function(){
        var o = $oldPwd.val();
        var n = $newPwd.val();
        var c = $confirmPwd.val();

        if(n != c){
            alert('两次输入密码不一致 请重新输入！');
            return;
        }
        // ajax
    });

})
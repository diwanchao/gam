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
        utils.getAjax({
            url: '/api/user/changePassword',
            loading: true,
            type: 'POST',
            data: {
                old_pwd: o,
                new_pwd: n,
                repeat_pwd: c,
            },
            alert: true,
            success: function(){
                window.location.href = '/index/login';
            }
        })
    });

    $('body').fadeIn('fast');
})
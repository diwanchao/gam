var $username = $('[name=username]');
var $password = $('[name=password]');
var $ensure = $('[name=ensure]');
var $login = $('#login');

var requireURL = {
    login: '/api/login',
}

function setCookie(name,value) 
{ 
    var Days = 1; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + 'path=/'; 
}

$(function(){

    $login.bind('click', function(){
        var data = {
            user_name: $username.val(),
            user_pwd: $password.val(),
            code: $ensure.val(),
        }

        //ajax
        $.ajax({
            type: 'POST',
            url: requireURL.login,
            dataType: 'json',
            success: function(data){
                if(data.code != 200){
                    alert(data.msg);
                }
                else {
                    setCookie('userInfo', JSON.stringify(data.data.user))
                    window.location = '/index/agree';
                }
                console.log(data);
            },
            error: function(err){
                alert('Server error……');
            }
        })
    });
})
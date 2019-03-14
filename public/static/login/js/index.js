var $username = $('[name=username]');
var $password = $('[name=password]');
var $ensure = $('[name=ensure]');
var $login = $('#login');

var requireURL = {
    login: '',
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
                    // window.location = '/index/home';
                }
                console.log(data);
            },
            error: function(err){
                alert(data.msg);
            }
        })
    });
})
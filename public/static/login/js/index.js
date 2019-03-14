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
        console.log(data);

        //ajax
        $.ajax({
            type: 'POST',
            url: requireURL.login,
            dataType: 'json',
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err)
            }
        })
    });
})
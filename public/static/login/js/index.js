var $username = $('[name=username]');
var $password = $('[name=passowrd]');
var $ensure = $('[name=ensure]');
var $ensureImg = $('#ensureImg');
var $login = $('#login');

var requireURL = {
    login: '',
    getEnsure: '',
}

$(function(){

    $login.bind('click', function(){
        var data = {
            username: $useranme.val(),
            passowrd: $password.val(),
            ensure: $ensure.val(),
        }

        //ajax
    });
})
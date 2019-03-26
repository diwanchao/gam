var $username = $('[name=username]');
var $password = $('[name=password]');
var $ensure = $('[name=ensure]');
var $code = $('#code');
var $login = $('#login');

var requireURL = {
    login: '/api/login',
}
delCookie('userInfo');
delCookie('game_key');

function setCookie(name,value) 
{ 
    var Days = 1; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + 'path=/'; 
}
/**
 * 获取cookie
 * @param {String} cookie名
 * @returns {String/null} 返回取到的cooke
 */
function getCookie (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

/**
 * 删除cookie
 * @param {String} cookie名
 */
function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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
            data: data,
            success: function(data){
                if(data.code != 200){
                    alert(data.msg);
                    $code.trigger('click');
                }
                else {
                    setCookie('userInfo', JSON.stringify(data.data.user))
                    window.location = '/index/agree';
                }
            },
            error: function(err){
                alert('Server error……');
            }
        })
    });
})
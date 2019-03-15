var $username = $('[name=username]');
var $password = $('[name=password]');
var $ensure = $('[name=ensure]');
var $login = $('#login');

var requireURL = {
    login: '',
}

function setCookie(name,value) 
{ 
    var Days = 1; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + 'path=/'; 
} 

// function getCookie(name) 
// { 
//     var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
//     if(arr=document.cookie.match(reg))
 
//         return unescape(arr[2]); 
//     else 
//         return null; 
// } 

// function delCookie(name) 
// { 
//     var exp = new Date(); 
//     exp.setTime(exp.getTime() - 1); 
//     var cval=getCookie(name); 
//     if(cval!=null) 
//         document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
// } 

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
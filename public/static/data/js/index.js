// var game_key = utils.getCookie('game_key');
var userInfo = JSON.parse(utils.getCookie('userInfo'));

var init = function(){
    if(!ENV.game_key){
        alert('没有可玩的游戏');
        return;
    }
    // 用url + ?game_key=游戏key ajax请求 获取列表
    utils.getAjax({
        url: utils.concatGameKey('/api/user/'),
        loading: true,
        type: 'GET',
        success: function(data){
            render(data.data);
        }
    })
}

var render = function(data){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += '<tr><td>'+ data[i].methods +'</td><td>'+ data[i].A +'</td><td>'+ data[i].B +'</td><td>'+ data[i].C +'</td><td>'+ data[i].D +'</td><td>'+ data[i].limit +'</td><td>'+ data[i].max +'</td><td>'+ data[i].min +'</td></tr>'
    }
    $('#tableBody').empty().append(html);
}

$(function(){

    $('.username').html(userInfo.user_name);

    utils.getAjax({
        url: '/api/game/userGameList',
        type: 'GET',
        success : function(gameList){
            $('#changeGame').append(function(){
                var html = '';
                if($.isArray(gameList) && gameList.length){
                    if(!ENV.game_key){
                        ENV.game_key = gameList[0].game_key;
                    }
        
                    for(var i = 0; i < gameList.length; i++){
                        html += '<option value="'+ gameList[i].game_key +'">'+ gameList[i].name +'</option>'
                    }
                }
                return html;
            }).val(ENV.game_key);
            init();
        }
    });

    $('#changeGame').bind('change', function(){
        ENV.game_key = this.value;
        init();
    });
    
    $('body').fadeIn('fast');
});

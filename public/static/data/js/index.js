var game_key = utils.getCookie('game_key');
var userInfo = JSON.parse(utils.getCookie('userInfo'));

var init = function(){
    if(!game_key){
        alert('没有可玩的游戏');
        return;
    }
    // 用url + ?game_key=游戏key ajax请求 获取列表
    var data = [
        // 玩法 / 退水A / 退水B / 退水C / 退水D / 退水E / 单项限额	/ 单注最高限额	/ 单注最低限额
        {methods: '一字组合', A: '10', B: '14', C: '15', D: '16', E: '11', limit: '20000', max: '30000', min: '10'},
        {methods: '二字组合', A: '10', B: '14', C: '15', D: '16', E: '11', limit: '20000', max: '30000', min: '10'},
        {methods: '三字组合', A: '10', B: '14', C: '15', D: '16', E: '11', limit: '20000', max: '30000', min: '10'}
    ]
    render(data);
}

var render = function(data){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += '<tr><td>'+ data[i].methods +'</td><td>'+ data[i].A +'</td><td>'+ data[i].B +'</td><td>'+ data[i].C +'</td><td>'+ data[i].D +'</td><td>'+ data[i].E +'</td><td>'+ data[i].limit +'</td><td>'+ data[i].max +'</td><td>'+ data[i].min +'</td></tr>'
    }
    $('#tableBody').empty().append(html);
}

$(function(){

    var gameList = InfoAll.InitHeader.data.game;

    $('.username').html(userInfo.user_name);
    $('#changeGame').append(function(){
        var html = '';
        if($.isArray(gameList) && gameList.length){
            if(!game_key){
                game_key = gameList[0].key;
            }

            for(var i = 0; i < gameList.length; i++){
                html += '<option value="'+ gameList[i].key +'">'+ gameList[i].name +'</option>'
            }
        }
    }).val(game_key);

    $('#changeGame').bind('change', function(){
        game_key = this.value;
        init();
    });
    
    init();
});

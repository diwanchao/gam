var game_key = utils.getCookie('game_key');
var gameList = InfoAll.InitHeader.data.game;
var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    if(!game_key){
        alert('没有可玩的游戏');
        return;
    }

    var p = tablePage.data.index;
    // 用当前第几页 index / game_key ajax请求 获取列表
    var json = {
        total: 345,
        data: [
            // No	下注时间	注单单号	分盘	投注内容	金额	退水	输赢
            {no: '1',
             time: '2019-11-11 11:11:11',
              number: '102373933',
               part: '龙虎盘',
                content: '168', money: '101', break: '20', get: '30000'},
            {no: '2', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'},
            {no: '3', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'},
            {no: '4', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'}
        ]
    }
    tablePage.init({total: json.total});
    render(json.data);
}

var render = function(data){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        var content;
        for(var s = 0; s < data[i].content.length; s++) {
            content += '<span class="m-r-2 color'+ data[i].content[s] +'">'+ data[i].content[s] +'</span>';
        }
        html += '<tr><td>'+ data[i].no +'</td><td>'+ data[i].time +'</td><td>'+ data[i].number +'</td><td>'+ data[i].part +'</td><td>'+ data[i].content +'</td><td>'+ data[i].money +'</td><td>'+ data[i].break +'</td><td>'+ data[i].get +'</td></tr>';
    }
    $('#tableBody').empty().append(html);
}

$(function(){

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
        // tablePage.init({index: 1})
        tablePage.data.index = 1;
        init();
    });
    
    init();
});

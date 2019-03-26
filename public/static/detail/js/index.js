// var game_key = utils.getCookie('game_key');

var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    if(!ENV.game_key){
        alert('没有可玩的游戏');
        return;
    }

    var p = tablePage.data.index;
    // 用当前第几页 index / game_key ajax请求 获取列表
    utils.getAjax({
        url: utils.concatGameKey('/api/user/getList'),
        type: 'POST',
        data: {
            index: p
        },
        success: function(json){
            tablePage.init({total: json.total});
            render(json.data);
        }
    })
    // var json = {
    //     total: 345,
    //     data: [
    //         // No	下注时间	注单单号	分盘	投注内容	金额	退水	输赢
    //         {no: '1',
    //          time: '2019-11-11 11:11:11',
    //           number: '102373933',
    //            part: '龙虎盘',
    //             content: '168', money: '101', break: '20', get: '30000'},
    //         {no: '2', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'},
    //         {no: '3', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'},
    //         {no: '4', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '168', money: '101', break: '20', get: '30000'}
    //     ]
    // }
    
}

var render = function(data){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += '<tr><td>'+ (i+1) +'</td><td>'+ data[i].time +'</td><td>'+ data[i].number +'</td><td>'+ data[i].part +'</td><td>第<span>'+ data[i].periods +'</span>&nbsp;期&nbsp;-&nbsp;<span class="f-c-blue">'+ data[i].content +'</span><span class="f-c-red">('+ data[i].value +')</span>&nbsp;@&nbsp;<span class="f-c-red">'+ data[i].reate +'</span></td><td>'+ data[i].money +'</td><td>'+ data[i].break +'</td><td><span class="f-c-red">尚未开奖</span></td></tr>';
    }
    $('#tableBody').empty().append(html);
}

$(function(){

    utils.getAjax({
        url: '/api/game/userGameList',
        type: 'GET',
        success : function(gameList){
            $('#changeGame').append(function(){
                var html = '';
                if($.isArray(gameList) && gameList.length){
                    if(!ENV.game_key){
                        ENV.game_key = gameList[0].key;
                    }
        
                    for(var i = 0; i < gameList.length; i++){
                        html += '<option value="'+ gameList[i].game_key +'">'+ gameList[i].name +'</option>'
                    }
                }
                return html;
            }).val(ENV.game_key);
        }
    });

    $('#changeGame').bind('change', function(){
        ENV.game_key = this.value;
        // tablePage.init({index: 1})
        tablePage.data.index = 1;
        init();
    });
    
    init();
});

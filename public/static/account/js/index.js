// var game_key = utils.getCookie('game_key');/\

var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    if(!ENV.game_key){
        alert('没有可玩的游戏');
        return;
    }

    var p = tablePage.data.index;
    // 用当前第几页 index / game_key ajax请求 获取列表
    utils.getAjax({
        url: utils.concatGameKey('/api/user/settlementList'),
        type: 'POST',
        data: {index: p},
        success: function(json){
            tablePage.init({total: json.total});
            render(json.data,json.single, json.money, json.school, json.break, json.get);
        }
    })
    // var json = {
    //     total: 192, //总共多少条数
    //     single: 123, // 单量
    //     money: 32, // 金额 
    //     school: 43, // 派彩 
    //     break: 838, // 退水 
    //     get: 23, // 输赢 
    //     data: [
    //         // 日期	 单量	金额	派彩	退水	输赢
    //         {date: '2019-03-10 星期日',
    //          single: '0', money: '1.00', school: '0.00', break: '0.00', get: '0.00'},
    //         {date: '2019-03-10 星期日', single: '0', money: '1.00', school: '0.00', break: '0.00', get: '0.00'},
    //         {date: '2019-03-10 星期日', single: '0', money: '1.00', school: '0.00', break: '0.00', get: '0.00'},
    //         {date: '2019-03-10 星期日', single: '0', money: '1.00', school: '0.00', break: '0.00', get: '0.00'},
    //     ]
    // }
    
}

var render = function(data, single, money, school, b_reak, get){
    var html = '';

    for(var i = 0; i < data.length; i++) {
        html += '<tr><td class="bg-eee"><a href="/index/account/detail?date='+ (/\d{4}-\d{2}-\d{2}/.exec(data[i].date)[0]) +'">'+ data[i].date +'</a></td><td>'+ data[i].single +'</td><td>'+ data[i].money +'</td><td>'+ data[i].school +'</td><td>'+ data[i].break +'</td><td>'+ data[i].get +'</td></tr>';
    }

    html += '<tr><td>总计</td><td>'+ single +'</td><td>'+ money +'</td><td>'+ school +'</td><td>'+ b_reak +'</td><td><b>'+ get +'</b></td></tr>';

    $('#tableBody').empty().append(html);
}

$(function(){

    utils.getAjax({
        url: '/api/game/userGameList',
        type: 'GET',
        success : function(){
            $('#changeGame').append(function(gameList){
                var html = '';
                if($.isArray(gameList) && gameList.length){
                    if(!ENV.game_key){
                        ENV.game_key = gameList[0].key;
                    }
        
                    for(var i = 0; i < gameList.length; i++){
                        html += '<option value="'+ gameList[i].key +'">'+ gameList[i].name +'</option>'
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
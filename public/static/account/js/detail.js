// var game_key = utils.getCookie('game_key');
var tablePage = new Page('#pageInfo', function(index){init();});
var date = utils.getURL(location.search, 'date');
var game_key = utils.getURL(location.search, 'game_key');

var init = function(){
    // date / game_key
    var p = tablePage.data.index;

    utils.getAjax({
        url: '/api/user/settlementDetail',
        loading: true,
        data: {
            date: date,
            index: p,
            game_key: game_key
        },
        type: 'POST',
        success: function(json){
            tablePage.init({total: json.total});
            render(json.data, json.money, json.school, json.break, json.get);
        }
    })
    // ajax 会用时间->date(POST) 游戏key->game_key(GET) 第几页->index(POST) 请求
    // var json = {
    //     total: 23,//总共多少条数
    //     money: 23423,// 单量
    //     school: 32,// 金额 
    //     break: 723,// 退水 
    //     get: 4,// 输赢 
    //     data: [
    //         // No	下注时间	注单单号	分盘	内容	开奖结果	金额	派彩	退水	输赢
    //         {no: '1',
    //          time: '2019-11-11 11:11:11',
    //           number: '102373933',
    //            part: '龙虎盘',
    //             content: '和值大小',
    //              name: '吉林快3',
    //               periods: '20190309-029',
    //                value: '小',
    //                 reate: '1.98',
    //                  result: '3,2,4',
    //                   money: '101',
    //                    school: '0',
    //                     break: '20',
    //                      get: '30000'},
    //         {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
    //         {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
    //         {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
    //     ]
    // }

}

var render = function(data, money, school, b_break, get){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += 
            '<tr>'+
                '<td>'+ data[i].no +'</td>'+
                '<td><span>'+ data[i].time +'</span></td>'+
                '<td>'+ data[i].number +'</td>'+
                '<td>'+ data[i].part +'</td>'+
                '<td><p>['+ data[i].name +' '+ data[i].periods +'期]</p><span class="f-c-blue">'+ data[i].content +'</span>&nbsp;<span class="f-c-red">('+ data[i].value +')</span>&nbsp;@&nbsp;<span class="f-c-red">'+ data[i].reate +'</span></td>'+
                '<td>'+ data[i].result +'</td>'+
                '<td>'+ data[i].money +'</td>'+
                '<td>'+ data[i].school +'</td>'+
                '<td>'+ data[i].break +'</td>'+
                '<td><span class="f-c-red">'+ data[i].get +'</span></td>'+
            '</tr>';
    }
    html += '<tr><td>总计</td><td></td><td></td><td></td><td></td><td></td><td><b>'+ money +'</b></td><td><b>'+ school +'</b></td><td><b>'+ b_break +'</b></td><td><b>'+ get +'</b></td></tr>';

    $('#tableBody').empty().append(html);
}

$(function(){

    init();
    $('body').fadeIn('fast');

});
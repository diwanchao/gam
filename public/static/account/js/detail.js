var game_key = utils.getCookie('game_key');
var tablePage = new Page('#pageInfo', function(index){init();});
var date = utils.getURL(location.search, 'date');

var init = function(){
    // date / game_key
    var p = tablePage.data.index;

    // ajax
    var json = {
        total: 23,
        money: 23423,
        school: 32,
        break: 723,
        get: 4,
        data: [
            {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
            {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
            {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
            {no: '1', time: '2019-11-11 11:11:11', number: '102373933', part: '龙虎盘', content: '和值大小', name: '吉林快3', periods: '20190309-029', value: '小', reate: '1.98', result: '3,2,4', money: '101', school: '0', break: '20', get: '30000'},
        ]
    }
    tablePage.init({total: json.total});
    render(json.data, json.money, json.school, json.b_reak, json.get);
}

var render = function(data, money, school, b_reak, get){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += 
            '<tr>'+
                '<td>'+ data[i].no +'</td>'+
                '<td><span>'+ data[i].time +'</span></td>'+
                '<td>'+ data[i].number +'</td>'+
                '<td>'+ data[i].part +'</td>'
                '<td><p>['+ data[i].name +' '+ data[i].periods +'期]</p><span class="f-c-blue">'+ data[i].content +'</span>&ngsp;<span class="f-c-red">('+ data[i].value +')</span>&nbsp;@&nbsp;<span class="f-c-red">'+ data[i].reate +'</span></td>'+
                '<td>'+ data[i].result +'</td>'+
                '<td>'+ data[i].money +'</td>'+
                '<td>'+ data[i].school +'</td>'+
                '<td>'+ data[i].break +'</td>'+
                '<td><span class="f-c-red">'+ data[i].get +'</span></td>'+
            '</tr>';
    }
    html += '<tr><td>总计</td><td></td><td></td><td></td><td></td><td></td><td><b>'+ money +'</b></td><td><b>'+ school +'</b></td><td><b>'+ b_reak +'</b></td><td><b>'+ get +'</b></td></tr>';

    $('#tableBody').empty().append(html);
}

$(function(){

    init();

});
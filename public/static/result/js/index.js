
var tablePage = new Page('#pageInfo', function(index){init();});

var setHeader = function(game){
    switch (game) {
        case 'jlk3': {
            return $('#tableContent').empty().append('<tr>'+
            '<th>期数</th>'+
            '<th>星期</th>'+
            '<th>时间</th>'+
            '<th colspan="3">开奖号</th>'+
            '<th>和值</th>'+
            '<th>和值单双</th>'+
            '<th>和值大小</th>'+
            '</tr>');
        }
        case 'ssc': {
            return $('#tableContent').empty().append('<tr class="t20" height="22">' + 
            '<th rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;期数&nbsp;</th>' + 
            '<th rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;星期&nbsp;</th>' + 
            '<th rowspan="2" nowrap="" align="center" class="tb_title">&nbsp;时间&nbsp;</th>' + 
            '<th height="20" colspan="5" align="center" class="tb_title">&nbsp;彩球号码&nbsp;</th>' + 
            
            '<th colspan="3" rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;万&nbsp;</th>' + 
            '<th colspan="3" rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;千&nbsp;</th>' + 
                
            '<th colspan="3" rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;百&nbsp;</th>' + 
            '<th colspan="3" rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;拾</th>' + 
            '<th colspan="3" rowspan="2" align="center" nowrap="" class="tb_title">&nbsp;个</th>' + 
            '</tr>' + 
            '<tr class="t11">' + 
            '<th width="26" height="20" class="t13"><div align="center">万</div></th>' + 
            '<th width="26" class="t13"><div align="center">千</div></th>' + 
            '<th width="26" height="20" class="t13"><div align="center">百</div></th>' + 
            '<th width="26" class="t13"><div align="center">拾</div></th>' + 
            '<th width="26" class="t13"><div align="center">个</div></th>' + 
            '</tr>');
        }
    }
}

var init = function(){
    if(!ENV.game_key){
        alert('没有可玩的游戏');
        return;
    }

    var p = tablePage.data.index;
    // 用p / game_key ajax请求 获取列表
    var json = {
        total: 345,
        // data: [
        //     {no: '1', week: '日', time: '2019-11-11', content: '12347', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
        //     {no: '2', week: '日', time: '2019-11-11', content: '12349', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
        //     {no: '3', week: '日', time: '2019-11-11', content: '12340', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
        //     {no: '4', week: '日', time: '2019-11-11', content: '12344, tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
        // ],
        data: [
            {no: 1, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '单', bigSmall: '小'},
            {no: 2, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '双', bigSmall: '大'},
            {no: 3, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '单', bigSmall: '小'},
            {no: 4, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '双', bigSmall: '大'},
        ]
    }
    tablePage.init({total: json.total});
    setHeader(ENV.game_key);
    render(json.data);
}

var render = function(data){
    var html = '<tbody>';

    for(var i = 0; i < data.length; i++) {
        var content = '';
        if(ENV.game_key == 'ssc'){
            for(var s = 0; s < data[i].content.length; s++) {
                content += '<td><span class="ssc-color">'+ data[i].content[s] +'</span></td>';
            }
            html += '<tr><td>'+ data[i].no +'</td><td>'+ data[i].week +'</td><td>'+ data[i].time +'</td>'+ content +'<td><span class="'+ (data[i].tenThousand == '小' ? "f-c-deep-green" : "f-c-blue") +'">'+ data[i].tenThousand +'</span></td><td><span class="'+ (data[i].thousand == '小' ? "f-c-deep-green" : "f-c-blue") +'">'+ data[i].thousand +'</span></td><td><span class="'+ (data[i].hundred == '小' ? "f-c-deep-green" : "f-c-blue") +'">'+ data[i].hundred +'</span></td><td><span class="'+ (data[i].ten == '小' ? "f-c-deep-green" : "f-c-blue") +'">'+ data[i].ten +'</span></td><td><span class="'+ (data[i].one == '小' ? "f-c-deep-green" : "f-c-blue") +'">'+ data[i].one +'</span></td></tr>';
        }
        else if(ENV.game_key == 'jlk3'){
            for(var s = 0; s < data[i].content.length; s++) {
                content += '<td>'+ data[i].content[s] +'</td>';
            }
            html += '<tr><td>'+ data[i].no +'</td><td>'+ data[i].week +'</td><td>'+ data[i].time +'</td>'+ content +'<td>'+ data[i].sum +'</td><td><span class="'+ (data[i].oddEven == '单' ? "f-c-orange" : "f-c-blue") +'">'+ data[i].oddEven +'</span></td><td><span class="'+ (data[i].bigSmall == '大' ? "f-c-green" : "f-c-pink") +'">'+ data[i].bigSmall +'</span></td></tr>';
        }
        
    }
    html += '</body>';
    $('#tableContent').append(html);
}

$(function(){

    var gameList = InfoAll.InitHeader.data.game;

    $('#changeGame').append(function(){
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

    $('#changeGame').bind('change', function(){
        ENV.game_key = this.value;
        // tablePage.init({index: 1})
        tablePage.data.index = 1;
        init();
    });
    
    init();
});

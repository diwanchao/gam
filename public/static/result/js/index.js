
// var tablePage = new Page('#pageInfo', function(index){init();});

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

    // var p = tablePage.data.index;
    // 用index / game_key ajax请求 获取列表

    utils.getAjax({
        url: utils.concatGameKey('/api/game/resultList'),
        type: 'GET',
        // data: {
        //     index: p,
        // },
        success: function(json){
            // tablePage.init({total: json.total});
            setHeader(ENV.game_key);
            render(json.data);
        }
    })

    // var json = {
    //     total: 345,
    //     data: [
    //     // game_key = ssc
    //     //期数 星期 时间 彩球号码 万 千 百 拾 个
    //         {no: '1', week: '日', time: '2019-11-11', content: '12347',
    //          tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
    //         {no: '2', week: '日', time: '2019-11-11', content: '12349', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
    //         {no: '3', week: '日', time: '2019-11-11', content: '12340', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
    //         {no: '4', week: '日', time: '2019-11-11', content: '12344', tenThousand: '小', thousand: '小', hundred: '大', ten: '小', one: '大'},
    //     ],
    //     // game_key = jlk3
    //     // 期数	星期	时间	开奖号	和值	和值单双	和值大小
    //     // data: [
    //     //     {no: 1, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '单', bigSmall: '小'},
    //     //     {no: 2, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '双', bigSmall: '大'},
    //     //     {no: 3, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '单', bigSmall: '小'},
    //     //     {no: 4, week: '日', time: '2019-11-11', content: '123', sum: '11', oddEven: '双', bigSmall: '大'},
    //     // ]
    // }
    // tablePage.init({total: json.total});
    // setHeader(ENV.game_key);
    // render(json.data);

}

var render = function(data){
    var html = '<tbody>';

    for(var i = 0; i < data.length; i++) {
        var content = '';
        if(ENV.game_key == 'ssc'){
            var wContent = '';
            var qContent = '';
            var bContent = '';
            var sContent = '';
            var gContent = '';
            
            var w = data[i].tenThousand;
            var q = data[i].thousand;
            var b = data[i].hundred;
            var s = data[i].ten;
            var g = data[i].one;
            for(var l = 0; l < data[i].content.length; l++) {
                content += '<td><span class="ssc-color">'+ data[i].content[l] +'</span></td>';
            }
            for(var l = 0; l < w.length; l++) {
                wContent += '<td><span class="'+ ((w[l] == '小' || w[l] == '双' || w[l] == '合') ? "f-c-deep-green" : "f-c-blue") +'">'+ w[l] +'</span></td>';
            }
            for(var l = 0; l < q.length; l++) {
                qContent += '<td><span class="'+ ((q[l] == '小' || q[l] == '双' || q[l] == '合') ? "f-c-deep-green" : "f-c-blue") +'">'+ q[l] +'</span></td>';
            }
            for(var l = 0; l < b.length; l++) {
                bContent += '<td><span class="'+ ((b[l] == '小' || b[l] == '双' || b[l] == '合') ? "f-c-deep-green" : "f-c-blue") +'">'+ b[l] +'</span></td>';
            }
            for(var l = 0; l < s.length; l++) {
                sContent += '<td><span class="'+ ((s[l] == '小' || s[l] == '双' || s[l] == '合') ? "f-c-deep-green" : "f-c-blue") +'">'+ s[l] +'</span></td>';
            }
            for(var l = 0; l < g.length; l++) {
                gContent += '<td><span class="'+ ((g[l] == '小' || g[l] == '双' || g[l] == '合') ? "f-c-deep-green" : "f-c-blue") +'">'+ g[l] +'</span></td>';
            }
            
            html += '<tr><td>'+ data[i].no +'</td><td>'+ data[i].week +'</td><td>'+ data[i].time +'</td>'+ content + wContent + qContent + bContent + sContent + gContent +'</tr>';
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
        // tablePage.data.index = 1;
        init();
    });
    
    init();
});

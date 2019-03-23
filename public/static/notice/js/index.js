var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    var p = tablePage.data.index;
    //ajax
    utils.getAjax({
        url: '/api/notice/',
        type: 'GET',
        data: {p: p},
        success: function(json){
            tablePage.init({total: json.total});
            render(json.data);
        }
    });
    // var json = {
    //     total: 120,
    //     data: [
    //         {time: '2018-12-06 21:27:30', content: '尊敬的会员，重庆时时彩第20181206-020至20181206-024期因官方未开出奖号，故投注取消，当期下注额度返还至账户余额。'},
    //         {time: '2018-12-06 21:27:30', content: '尊敬的会员，重庆时时彩第20181206-020至20181206-024期因官方未开出奖号，故投注取消，当期下注额度返还至账户余额。'},
    //         {time: '2018-12-06 21:27:30', content: '尊敬的会员，重庆时时彩第20181206-020至20181206-024期因官方未开出奖号，故投注取消，当期下注额度返还至账户余额。'},
    //         {time: '2018-12-06 21:27:30', content: '尊敬的会员，重庆时时彩第20181206-020至20181206-024期因官方未开出奖号，故投注取消，当期下注额度返还至账户余额。'}
    //     ]
    // }
}

var render = function(data){
    var html = '';
    for(var i = 0; i < data.length; i++){
        html += '<tr><td align="center">'+ data[i].time +'</td><td>'+ data[i].content +'</td></tr>'
    }
    $('#tableBody').empty().append(html);
}

$(function(){

    init();
    
})


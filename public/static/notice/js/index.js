var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    var p = tablePage.data.index;
    //ajax
    utils.getAjax({
        url: '/api/notice/',
        type: 'GET',
        data: {index: p},
        success: function(json){
            tablePage.init({total: json.total});
            render(json.data);
        }
    });
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


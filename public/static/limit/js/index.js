var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    var p = tablePage.data.index;

    //ajax  
    utils.getAjax({
        url: '/api/integral/',
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
        html += '<tr><td>'+ data[i].type +'</td><td>'+ data[i].num +'</td><td>'+ data[i].time +'</td></tr>'
    }
    $('#tableBody').empty().append(html);
}

$(function(){

    init();
    
})
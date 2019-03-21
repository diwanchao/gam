var tablePage = new Page('#pageInfo', function(index){init();});

var init = function(){
    var p = tablePage.data.index;

    //ajax  
    var json = {
        total: 32,
        data: [
            // 存入金额(提取项目) / 变动数值 ／ 时间
            {type: '存入金额', num: '100', time: '2019-02-24 12:54:27'},
            {type: '提取项目', num: '100', time: '2019-02-24 12:54:27'},
            {type: '存入金额', num: '100', time: '2019-02-24 12:54:27'}
        ]
    }

    tablePage.init({total: json.total});
    render(json.data);
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
var json = {
    ssc: [
        // 游戏名  链接  游戏key  倒计时(毫秒)  状态 0-》停盘 1-》开启
        {name: '重庆时时彩', url: '/', key: 'jlk3', time: 10000, status: 0},
        {name: '新疆时时彩', url: '/', key: 'jlk2', time: 900000, status: 1},
    ],
    k3: [
        {name: '吉林快3', url: '/', key: 'jlk3', time: 10000, status: 0},
        {name: '吉林快32', url: '/', key: 'jlk2', time: 900000, status: 1},
    ]
}

var refresh_data = [
    // {
    //     element: '', //元素
    //     timeout: 10000, //倒计时事件
    //     status: 0, //0->停盘 1->开盘
    // },
];

var render = function(data){

    var $html = $(
        '<div class="gameList">'+
            '<div class="pull-left">'+ data.name +'</div>'+
            '<div class="pull-right countDown">'+
                '<div class="timeIcon '+ (data.status == 0 ? "over" : "ready") +'"></div>'+
                '<span class="remainingTime">'+ utils.remainingTime(data.time).replace(/:/g, '&nbsp;:&nbsp;') +'</span>'+
            '</div>'+
        '</div>'
    );

    $html.find('.countDown').bind('click', function(){
        // utils.setCookie('game_key', data.key);
        window.location = data.url;
    });

    refresh_data.push({
        element: $html,
        status: data.status,
        timeout: data.time,
    });

    return $html;

}

function timeInterval() {
    var interval = window.setInterval(function(){
        for(var i = 0 ; i < refresh_data.length; i++) {
            var data = refresh_data[i];
            data.timeout -= 1;
            data.element.find('.remainingTime').html(utils.remainingTime(data.timeout).replace(/:/g, '&nbsp;:&nbsp;'));
            if(data.timeout <= 0){
                window.clearInterval(interval);
                refresh_data = [];
                init();
                break;
            }
        }
    }, 1000);
}


function renderGame(key){

    if(json[key]){

        var name;

        switch(key){
            case 'ssc': {
                name = '时时彩';
                break;
            }
            case 'k3': {
                name = 'K3';
                break;
            }
        }

        var $html = $(
            '<div class="gameLogo"><img src="/static/image/icon'+ key +'.png" alt=""></div>'+
            '<div class="gameName"><span class="game">'+ name +'</span></div>'+
            '<div class="gameContent">'+
            '<ul>'+
            '</ul>'+
            '</div>'
        )
        $('#' + key).empty().append($html);
        return $('#' + key);
    }
}

var init = function(callback){
    // ajax
    utils.getAjax({
        url: '/api/home/gameInfo',
        type: 'GET',
        success: function(json){
            for(var k in json){
                if(json.hasOwnProperty(k)){
                    var ele = renderGame(k);
                    var data = json[k];
                    for(var i = 0; i < 10; i++){
                        var oli = $('<li></li>');
                        if(data[i]){
                            oli.append(render(data[i]));
                        }
                        ele.find('ul').append(oli);
                    }
                }
            }
            timeInterval();
            // typeof callback === 'function' ? callback(json) : null;
        }

    })
    
}

$(function(){

    init();

    TouchSlide({
        slideCell:'#banner',
        mainCell:"#banner .inner",
        effect:"leftLoop",
        // prevCell:".banner-prevCell",
        // nextCell:".banner-nextCell",
        titCell : '.banner-item-outer span',
        autoPlay:true,
        interTime:4000
    });

})
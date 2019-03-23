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
        console.log(data.key)
        utils.setCookie('game_key', data.key);
        // window.location = data.url;
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
            data[i].timeout -= 1000;
            if(data[i].timeout <= 0){
                window.clearInterval(interval);
                // ajax
                // data.time = 10000;
                // data.status = !data.status;
                init();
                
            }
            data[i].element.find('.remainingTime').html(utils.remainingTime(data[i].timeout).replace(/:/g, '&nbsp;:&nbsp;'));
        }
    }, 1000);
}

// var requireURL = {
//     query: '/',
//     refresh: '/',
// }

// var render = function(data){ // type-> ssc / k3

//     var time = data.time;
//     var status = data.status;

//     var $html = $(
//         '<div class="gameList">'+
//             '<div class="pull-left">'+ data.name +'</div>'+
//             '<div class="pull-right countDown">'+
//                 '<div class="timeIcon '+ (data.status == 0 ? "over" : "ready") +'"></div>'+
//                 '<span class="remainingTime">'+ utils.remainingTime(time).replace(/:/g, '&nbsp;:&nbsp;') +'</span>'+
//             '</div>'+
//         '</div>'
//     );

//     $html.find('.countDown').bind('click', function(){
//         console.log(data.key)
//         utils.setCookie('game_key', data.key);
//         // window.location = data.url;
//     });

//     var $timeIcon = $html.find('.timeIcon');
//     var $remainingTime = $html.find('.remainingTime');

//     // 观察倒计时计算
//     Object.defineProperty(data, 'time', {
//         configurable: true,
//         enumerable: true,
//         set: function(val){
//             time = val;
//             $remainingTime.html(utils.remainingTime(time).replace(/:/g, '&nbsp;:&nbsp;'));
//         },
//         get: function(){
//             return time;
//         }
//     });

//     // 状态观察
//     Object.defineProperty(data, 'status', {
//         configurable: true,
//         enumerable: true,
//         set: function(val){
//             status = val;
//             if(val == 0){ // over
//                 $timeIcon.hasClass('ready') ? $timeIcon.removeClass('ready') : null;
//                 $timeIcon.hasClass('over') ? null : $timeIcon.addClass('over');
//             }
//             else { // ready
//                 $timeIcon.hasClass('over') ? $timeIcon.removeClass('over') : null;
//                 $timeIcon.hasClass('ready') ? null : $timeIcon.addClass('ready');
//             }

//             $remainingTime.html(utils.remainingTime(time).replace(/:/g, '&nbsp;:&nbsp;'));
//         },
//         get: function(){
//             return time;
//         }
//     });

//     var intervalFun = function(){
//         data.time -= 1000;
//         if(data.time <= 0){
//             window.clearInterval(interval);
//             // ajax
//             data.time = 10000;
//             data.status = !data.status;
//             interval = window.setInterval(intervalFun, 1000);
//         }
//     }
//     var interval = window.setInterval(intervalFun, 1000);
    
//     return $html;
// }

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
        $('#' + key).append($html);
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
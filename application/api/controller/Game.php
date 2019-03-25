<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;

class Game extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/game/resultList",
     *   tags={"Game"},
     *   summary="开奖结果",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function resultList()
    {
        $result_data= [];
        $weekarray  = array("日","一","二","三","四","五","六");

        $game_key   = Request::instance()->param('game_key'); 
        $page       = Request::instance()->param('index',1); 
        $page_row   = 10;
        $count  = Db::name('game_result')->where('game_key=?',[$game_key])->select();
        $data   = Db::name('game_result')->order('time desc')->where('game_key=?',[$game_key])->limit($page*$page_row-$page_row,$page*$page_row)->select();

        if ($data) 
        {
            if ($game_key=='jlk3') 
            {
                # code...
                foreach ($data as $key => $value) 
                {
                    $sum                            = 0;
                    $result_data[$key]['no']        = $key+1;
                    $result_data[$key]['week']      = $weekarray[date("w",strtotime($value['time']))];
                    $result_data[$key]['time']      = date('Y-m-d',strtotime($value['time']));
                    $result_data[$key]['content']   = $value['game_result'];
                    $one = str_split($value['game_result']);
                    foreach ($one as $val) {
                        $sum +=$val;
                    }
                    $result_data[$key]['sum']       = $sum;
                    $result_data[$key]['oddEven']   = ($sum%2)==0 ? '双' : '单';
                    $result_data[$key]['bigSmall']  = $sum>9 ? '大' : '小';


                }
            }
        }

        $return=[
            'total' => $count ? count($count) : 0,
            'data'  => $result_data,

        ];

/*
        var_dump($data);die();


        if ('ssc' == $game_key) {
            $data = [
                'total'=>10,
                'data'=>[
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'12345','tenThousand'=>'小双合','thousand'=>'小单质','hundred'=>'大单合','ten'=>'小双合','one'=>'大双合'],
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'12345','tenThousand'=>'小双合','thousand'=>'小双合','hundred'=>'大双合','ten'=>'小双合','one'=>'大双合'],
                ]
            ];
        }else{
            $data = [
                'total'=>10,
                'data'=>[
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'123','sum'=>11,'oddEven'=>'单','bigSmall'=>'小'],
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'123','sum'=>11,'oddEven'=>'单','bigSmall'=>'大'],
                ]
            ];
        }*/
        return json(['msg' => 'succeed','code' => 200, 'data' => $return]);

    }
    /**
     * @SWG\Get(
     *   path="/api/game/userGameList",
     *   tags={"Game"},
     *   summary="当前用户可玩游戏列表",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */

    public function userGameList()
    {
        $data = [
            ['game_key'=>'jlk3','name'=>'吉林快3'],
            //['game_key'=>'ssc','name'=>'重庆时时彩'],
        ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Get(
     *   path="/api/game/gameInit",
     *   tags={"Game"},
     *   summary="游戏初始化",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function gameInit()
    {

        $data = [
            'issue'      => '20190324-12',
            'count_down' => '600',
            'close_time' => '22:40:00',
            'status'     => 0,
            'dish'       => [
                ['name'=>'A','url'=>'/index/game/jlk3-A'],
                ['name'=>'B','url'=>'/index/game/jlk3-B'],
            ]

        ];


        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Post(
     *   path="/api/game/addBet",
     *   tags={"Game"},
     *   summary="投注",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="data",
     *     in="formData",
     *     description="不用管的参数",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function addBet()
    {
        return json(['msg' => '投注成功','code' => 200, 'data' => []]);
    }


}

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
        $game_key   = Request::instance()->param('game_key'); 
        if ('ssc' == $game_key) {
            $data = [
                'total'=>10,
                'data'=>[
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'123','tenThousand'=>'小','thousand'=>'小','hundred'=>'大','ten'=>'小','one'=>'大'],
                    ['no'=>1,'week'=>'日','time'=>'2019-11-11','content'=>'123','tenThousand'=>'小','thousand'=>'小','hundred'=>'大','ten'=>'小','one'=>'大'],
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
        }
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);

    }

}

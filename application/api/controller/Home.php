<?php
namespace app\api\controller;

use \think\Request;

class Home extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/home/info",
     *   tags={"Home"},
     *   summary="主界面接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function info()
    {
        $data = [
            'notice'    =>'第一条公告',
            'game'      => [
                'k3'=>[
                    ['name'=>'吉林快3','time'=>date('Y-m-d H:i:s',time()),'status'=>1],
                    ['name'=>'辽宁快3','time'=>date('Y-m-d H:i:s',time()),'status'=>0],
                ],
                'ssc'=>[
                    ['name'=>'吉林时时彩','time'=>date('Y-m-d H:i:s',time()),'status'=>1],
                    ['name'=>'辽宁时时彩','time'=>date('Y-m-d H:i:s',time()),'status'=>0],
                ],
            ],
            'macau_time' => date('Y-m-d H:i:s',time())

        ];

        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Post(
     *   path="/api/home/headInfo",
     *   tags={"Home"},
     *   summary="头部信息接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="game_name",
     *     in="formData",
     *     description="游戏名",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */

    public function headInfo()
    {
        $game_name = $_POST['game_name'] ?? '';

        $data = [
            'notice'     => '我是公告',
            'macau_time' => time(),
            'game'       => [
                ['name' => '吉林快3', 'key' => 'jlk3', 'url'=>'/'],
                ['name' => '时时彩', 'key' => 'ssc', 'url'=>'/'],
            ],
        ];
        if ($game_name) 
        {
            $data['subGame'] = [
                ['name'=>'三军', 'key'=>'ssc','url'=>'/'],
                ['name'=>'和值', 'key'=>'ssc','url'=>'/'],
            ];
        }
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);


    }

}

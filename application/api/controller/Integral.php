<?php
namespace app\api\controller;

use \think\Request;

class Integral extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/integral/",
     *   tags={"Integral"},
     *   summary="积分变动接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function index()
    {
        $data = [
            'total' => '3',
            'data'  => [
                ['type'=> '存入金额', 'num'=>'100', 'time'=>date('Y-m-d H:i:s',time())],
                ['type'=> '提取项目', 'num'=>'100', 'time'=>date('Y-m-d H:i:s',time())],
                ['type'=> '存入金额', 'num'=>'100', 'time'=>date('Y-m-d H:i:s',time())],
            ]
        ];
            return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}

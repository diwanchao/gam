<?php
namespace app\api\controller;

use \think\Request;

class User extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/user/",
     *   tags={"User"},
     *   summary="会员列表",
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
        //game_key

        $data = [
            'data'  => [
                ['methods'=> '一字组合', 'A'=>'1','B'=>'1','C'=>'1','D'=>'1','E'=>'1','limit'=>'100000','max'=>'50000','min'=>'2'],
                ['methods'=> '二字组合', 'A'=>'1','B'=>'1','C'=>'1','D'=>'1','E'=>'1','limit'=>'100000','max'=>'50000','min'=>'2'],
                ['methods'=> '三字组合', 'A'=>'1','B'=>'1','C'=>'1','D'=>'1','E'=>'1','limit'=>'100000','max'=>'50000','min'=>'2'],
                ['methods'=> '四字组合', 'A'=>'1','B'=>'1','C'=>'1','D'=>'1','E'=>'1','limit'=>'100000','max'=>'50000','min'=>'2'],
            ]
        ];
            return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}

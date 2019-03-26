<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;

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
        $data = Db::name('integral')->where('user_id=?',[$this->USER_ID])->order('time desc')->paginate(10,false,['var_page'=>'index']);
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}

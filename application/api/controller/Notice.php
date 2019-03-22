<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;

class Notice extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/notice/",
     *   tags={"Notice"},
     *   summary="公告信息接口",
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
        $data = Db::name('notice')->field('content,create_time as time')->order('create_time desc')->paginate(10,false,['var_page'=>'index']);
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}

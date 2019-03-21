<?php
namespace app\api\controller;

use \think\Request;

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
        $data = [
            'total' => '10',
            'data'  => [
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
                ['time'=>date('Y-m-d H:i:s',time()),'content'=>'我是公告内容'],
            ]
        ];
            return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}
